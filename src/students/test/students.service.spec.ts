import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { StudentsService } from '../services';
import { QUEUES, SCHEMA } from '../../common/mock';
import { CreateStudentDto, SearchStudentDto, StudentDto } from '../dto';
import { IStudent, IStudents } from '../interfaces';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import * as Redis from 'redis';
import {
  mockUser,
  mockCreateUserDto,
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
});
