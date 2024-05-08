import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from '../controllers/students.controller';
import { StudentsService } from '../services';
import {
  mockStudent,
  mockUser,
  mockCreateStudentDto,
  mockStudents,
  mockQuery,
} from '../../common/mock/test.mock';
import { SearchStudentDto } from '../dto';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new student', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockStudent);
      const result = await controller.create(mockCreateStudentDto, mockUser);
      expect(result).toEqual(mockStudent);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should find all students', async () => {
      const mockResult = {
        data: mockStudents,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(mockResult);
      const result = await controller.findAll(mockQuery as SearchStudentDto);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
