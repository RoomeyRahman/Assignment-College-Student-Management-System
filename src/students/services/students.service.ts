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

  /**
   * Create student
   * @param {IUser} user
   * @param {CreateStudentDto} data
   * @returns {Promise<IStudent>}
   */
  async create(data: CreateStudentDto, user: IUser): Promise<IStudent> {
    try {
      const body = new StudentDto({
        ...data,
        cBy: user._id,
      });
      const registerDoc = new this.model(body);
      return await registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Update student
   * @param {IUser} user
   * @param {string} id
   * @param {UpdateStudentDto} data
   * @returns {Promise<IStudent>}
   */
  async update(
    id: string,
    data: UpdateStudentDto,
    user: IUser,
  ): Promise<IStudent> {
    try {
      const record = await this.model.findOne({
        _id: id,
        isDeleted: false,
      });
      if (!record) {
        return Promise.reject(new NotFoundException('Could not find record.'));
      }
      const body = new StudentDto({
        ...data,
        uBy: user._id,
      });
      return await record.set(body).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Find All students
   * @param {SearchStudentDto} query
   * @returns {Promise<IStudents>}
   */
  async findAll(query: SearchStudentDto): Promise<IStudents> {
    try {
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;

      const cursor = !query.getAllRecord
        ? this.model.find(searchQuery).limit(limit).skip(skip)
        : this.model.find(searchQuery);
      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }

      const result: IStudents = {
        data: await cursor.exec(),
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.model.countDocuments(searchQuery),
          limit,
          skip,
        };
      }
      return result;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Find one student
   * @param {string} id
   * @returns {Promise<IStudent>}
   */
  async findOne(id: string): Promise<IStudent> {
    try {
      const res = await this.model.findOne({ _id: id });
      if (!res) {
        return Promise.reject(new NotFoundException('Could not find record.'));
      }
      return res;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * count student
   * @returns {Promise<number>}
   */
  async count(query: SearchStudentDto): Promise<number> {
    try {
      const searchQuery = createSearchQuery(query);
      return await this.model.countDocuments(searchQuery);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
}