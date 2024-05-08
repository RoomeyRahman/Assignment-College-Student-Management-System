import {
  HttpStatus,
  Controller,
  Body,
  Delete,
  Get,
  HttpException,
  MethodNotAllowedException,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { TrimPipe, ValidationPipe } from '../../common/pipes';
import { IUser } from '../../users/interfaces';
import { StudentsService } from '../services';
import { IStudent, IStudents } from '../interfaces';
import { CreateStudentDto, SearchStudentDto, UpdateStudentDto } from '../dto';

@ApiTags('Student')
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('students')
export class StudentsController {
  /**
   * Constructor
   * @param {StudentsService} service
   */
  constructor(private readonly service: StudentsService) {}

  /**
   * create
   * @Body {CreateStudentDto} data
   * @user {IUser} user
   * @returns {Promise<IStudent>}
   */
  @ApiOperation({ summary: 'Student creation' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return student.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() data: CreateStudentDto,
    @User() user: IUser,
  ): Promise<IStudent> {
    try {
      return this.service.create(data, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * find all students
   * @returns {Promise<IStudents>}
   */
  @ApiOperation({ summary: 'Get all students' })
  @UsePipes(new ValidationPipe(true))
  @Get()
  public findAll(@Query() query: SearchStudentDto): Promise<IStudents> {
    try {
      return this.service.findAll(query);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * count students
   * @returns {Promise<number>}
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Count students' })
  @UsePipes(new ValidationPipe(true))
  @UseGuards(JwtAuthGuard)
  @Get('count')
  public count(@Query() query: SearchStudentDto): Promise<number> {
    try {
      return this.service.count(query);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * @Param {string} id
   * @returns {Promise<IStudent>}
   */
  @ApiOperation({ summary: 'Get student details from id' })
  @ApiResponse({ status: 200, description: 'Return student details.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found.',
  })
  @Get(':id')
  public async getOne(@Param('id') id: string): Promise<IStudent> {
    try {
      return await this.service.findOne(id);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Student update
   * @Body {UpdateStudentDto} data
   * @User {IUser} user
   * @returns {Promise<IStudent>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Student update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return updated student.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() data: UpdateStudentDto,
  ): Promise<IStudent> {
    try {
      return this.service.update(id, data, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@User() user: IUser, @Param('id') id: string) {
    try {
      return this.service.delete(id, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
}
