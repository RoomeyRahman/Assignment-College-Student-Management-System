import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  UsePipes,
  HttpStatus,
  HttpException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { UsersService } from '../services';
import {
  CreateUserDto,
} from '../dto';
import { IUser } from '../interfaces';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import {
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { NullValidationPipe } from '../../common/pipes/null-validator.pipe';

/**
 * User Controller
 */
@ApiTags('User')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('users')
export class UsersController {
  /**
   * Constructor
   * @param {UsersService} service
   */
  constructor(private readonly service: UsersService) { }

  /**
   * Create a user
   * @Body {CreateUserDto} data
   * @returns {Promise<IUser>} created user data
   */
  @ApiOperation({ summary: 'User registration: create new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new user.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @Post()
  public async create(@Body() data: CreateUserDto): Promise<IUser> {
    try {
      return await this.service.register(data);
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.BAD_REQUEST,
        {
          cause: new Error(err)
        }
      );
    }
  }

  @ApiExcludeEndpoint()
  @Put()
  public createPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch()
  public createPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete()
  public createDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
