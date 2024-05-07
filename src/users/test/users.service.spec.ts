import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from '../services';
import { UserSchema } from '../schemas';
import { HttpStatus } from '@nestjs/common';
import * as helper from '../../common/utils/helper';
import {
  mockUser,
  mockCreateUserDto,
} from '../../common/mock/test.mock';
import * as bcrypt from 'bcrypt';
import { encodeToken } from '../../common/utils/helper';
import { SCHEMA } from '../../common/mock';


describe('UsersService', () => {
  let service: UsersService;

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(SCHEMA.USER),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
