import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { StudentsService } from '../services';
import { QUEUES, SCHEMA } from '../../common/mock';
import {
  CreateStudentDto,
  SearchStudentDto,
  StudentDto,
  UpdateStudentDto,
} from '../dto';
import { IStudent, IStudents } from '../interfaces';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import * as Redis from 'redis';
import {
  mockUser,
  mockStudent,
  mockQuery,
  mockStudents,
  mockCreateStudentDto,
} from '../../common/mock/test.mock';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('StudentsService', () => {
  let service: StudentsService;
  let model: Record<string, jest.Mock>;
  let queue: Queue;
  let redisClient: Redis.RedisClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getModelToken(SCHEMA.STUDENT),
          useValue: {
            new: jest.fn().mockResolvedValue(new StudentDto()),
            findOne: jest.fn(),
            find: jest.fn(),
            countDocuments: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getQueueToken(QUEUES.REDIES_STUEDENT_QUEUE),
          useValue: {
            add: jest.fn(),
          },
        },
        {
          provide: Redis.RedisClient,
          useValue: {
            incr: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    model = module.get<Record<string, jest.Mock>>(
      getModelToken(SCHEMA.STUDENT),
    );
    queue = module.get<Queue>(getQueueToken(QUEUES.REDIES_STUEDENT_QUEUE));
    redisClient = module.get<Redis.RedisClient>(Redis.RedisClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new student', async () => {
      jest.spyOn(model, 'create').mockResolvedValueOnce(mockStudent);
      const result = await service.create(mockCreateStudentDto, mockUser);
      expect(result).toEqual(
        expect.objectContaining({
          name: mockStudent.name,
          studentId: mockStudent.studentId,
          course: mockStudent.course,
        }),
      );
      expect(model.create).toHaveBeenCalledTimes(1);
    });

    it('should not create a new student with same studentId', async () => {
      try {
        (service['model'].findOne as jest.Mock).mockResolvedValueOnce({});
        await service.create(mockCreateStudentDto, mockUser);
      } catch (error) {
        expect(model.create).toHaveBeenCalledTimes(0);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
        expect(error.getResponse()).toEqual({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Student already exist',
          error: 'Bad Request',
        });
        expect(model.create).not.toHaveBeenCalled();
        expect(redisClient.incr).not.toHaveBeenCalled();
      }
    });
  });

  describe('findAll', () => {
    it('should find all students', async () => {
      const mockResult = {
        data: mockStudents,
      };

      (model.find as jest.Mock).mockReturnValueOnce({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockResult.data),
      });

      (model.countDocuments as jest.Mock).mockResolvedValueOnce(
        mockResult.data.length,
      );

      const result: IStudents = await service.findAll(
        mockQuery as SearchStudentDto,
      );

      expect(result.data).toEqual(mockResult.data);
      expect(result.pagination).toEqual({
        total: mockResult.data.length,
        limit: mockResult.data.length,
        skip: 0,
      });
      expect(model.find).toHaveBeenCalled();
      expect(model.countDocuments).toHaveBeenCalled();
    });

    it('should find all students without pagination', async () => {
      const mockResult = {
        data: mockStudents,
      };

      (model.find as jest.Mock).mockReturnValueOnce({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockResult.data),
      });

      (model.countDocuments as jest.Mock).mockResolvedValueOnce(
        mockResult.data.length,
      );

      mockQuery.pagination = false;
      const result: IStudents = await service.findAll(
        mockQuery as SearchStudentDto,
      );

      expect(result.data).toEqual(mockResult.data);
      expect(result.pagination).toEqual(undefined);
      expect(model.find).toHaveBeenCalled();
      expect(model.countDocuments).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a student by ID', async () => {
      (model.findOne as jest.Mock).mockResolvedValueOnce(mockStudent);
      const result = await service.findOne(mockStudent._id);

      expect(result).toEqual(mockStudent);
      expect(model.findOne).toHaveBeenCalledWith({ _id: mockStudent._id });
    });

    it('should throw NotFoundException when student is not found', async () => {
      const mockStudentId = '123';
      (model.findOne as jest.Mock).mockResolvedValueOnce(null);

      try {
        await service.findOne(mockStudentId);
      } catch (error) {
        expect(model.findOne).toHaveBeenCalledWith({ _id: mockStudentId });
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        expect(error.getResponse()).toEqual({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Could not find record.',
          error: 'Not Found',
        });
      }
    });
  });

  describe('count', () => {
    it('should return the count of students', async () => {
      const expectedCount = 2;
      (model.countDocuments as jest.Mock).mockResolvedValueOnce(expectedCount);
      const result = await service.count({} as SearchStudentDto);
      expect(result).toEqual(expectedCount);
      expect(model.countDocuments).toHaveBeenCalledWith({
        isActive: true,
        isDeleted: false,
      });
    });
  });

  describe('deleted', () => {
    it('should delete a student and decrement total students count', async () => {
      const mockStudentId = 'mock-student-id';
      const mockStudentRecord = {
        ...mockStudent,
        set: jest.fn().mockReturnThis(),
        save: jest.fn().mockResolvedValueOnce({}),
      };
      (model.findOne as jest.Mock).mockResolvedValueOnce(mockStudentRecord);

      const result = await service.delete(mockStudentId, mockUser);
      expect(result).toBe('successfully deleted');

      expect(model.findOne).toHaveBeenCalledWith({
        _id: mockStudentId,
        isDeleted: false,
      });

      expect(mockStudentRecord.set).toHaveBeenCalledWith(
        expect.objectContaining({
          isDeleted: true,
          uBy: mockUser._id,
        }),
      );
      expect(mockStudentRecord.save).toHaveBeenCalled();
    });

    it('should throw an error if the student to delete is not found', async () => {
      (model.findOne as jest.Mock).mockResolvedValueOnce(null);
      try {
        await service.delete('non-existent-id', { _id: 'mock-user-id' });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        expect(error.getResponse()).toEqual({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Could not find record.',
          error: 'Not Found',
        });
        expect(model.create).not.toHaveBeenCalled();
        expect(redisClient.incr).not.toHaveBeenCalled();
      }
    });
  });

  describe('update', () => {
    it('should update a student and add to the queue', async () => {
      const data = new UpdateStudentDto({
        name: 'Md Ataur Rahman',
      });
      const record = {
        ...mockStudent,
        set: jest.fn().mockReturnThis(),
        save: jest.fn().mockResolvedValueOnce({
          ...data,
          uBy: mockUser._id,
        }),
      };
      const expectedUpdatedRecord = {
        ...data,
        uBy: mockUser._id,
      };

      (model.findOne as jest.Mock).mockResolvedValueOnce(record);

      const result = await service.update(mockStudent._id, data, mockUser);

      expect(result).toEqual(expectedUpdatedRecord);
      expect(model.findOne).toHaveBeenCalledWith({
        _id: mockStudent._id,
        isDeleted: false,
      });
      expect(record.save).toHaveBeenCalled();
      expect(queue.add).toHaveBeenCalledWith('assign-hobby', {
        student: expectedUpdatedRecord,
      });
    });

    it('should throw NotFoundException if record not found', async () => {
      const id = '123';
      const data = new UpdateStudentDto({
        name: 'Md Ataur Rahman',
      });

      (model.findOne as jest.Mock).mockResolvedValueOnce(null);

      try {
        await service.update(id, data, mockUser);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        expect(error.getResponse()).toEqual({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Could not find record.',
          error: 'Not Found',
        });
        expect(model.findOne).toHaveBeenCalledWith({
          _id: id,
          isDeleted: false,
        });
        expect(queue.add).not.toHaveBeenCalled();
      }
    });
  });
});
