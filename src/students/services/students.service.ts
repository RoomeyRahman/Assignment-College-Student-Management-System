import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../users/interfaces';
import { SCHEMA } from '../../common/mock';
import { createSearchQuery } from '../../common/utils/helper';
import { IStudent, IStudents } from '../interfaces';
import {
  CreateStudentDto,
  StudentDto,
  SearchStudentDto,
  UpdateStudentDto,
} from '../dto';

@Injectable()
export class StudentsService {
  /**
   * Constructor
   * @param {Model<IStudent>} model
   */
  constructor(
    @InjectModel(SCHEMA.STUDENT)
    private readonly model: Model<IStudent>,
  ) {}

  create(createStudentDto: CreateStudentDto) {
    return 'This action adds a new student';
  }

  findAll() {
    return `This action returns all students`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
