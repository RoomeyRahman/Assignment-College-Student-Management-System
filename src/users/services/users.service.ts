import {
    Injectable,
    HttpStatus,
    HttpException,
    NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    CreateUserDto,
    UserDto,
} from '../dto';
import { IUser } from '../interfaces';
import { SCHEMA } from '../../common/mock';

/**
 * User Service
 */
@Injectable()
export class UsersService {
    private readonly password = 'oS1H+dKX1+OkXUu3jABIKqThi5/BJJtB0OCo';
    /**
     * Constructor
     * @param {Model<IUser>} model
     */
    constructor(
        @InjectModel(SCHEMA.USER)
        private readonly model: Model<IUser>,
    ) { }

    /**
     * Create a user with RegisterPayload fields
     * @param {CreateUserDto} data user payload
     * @returns {Promise<IUser>} created user data
     */
    async register(data: CreateUserDto): Promise<IUser> {
        try {
            const email = data.email.toLowerCase();
            const isExist = await this.model.findOne({
                email: email,
            });
            if (isExist) {
                return Promise.reject(
                    new NotAcceptableException(
                        `User already exist with the ${email}`,
                    ),
                );
            }
            const record = new UserDto({
                email: data.email.toLowerCase(),
                password: data.password,
                otp: Math.round(1000 + Math.random() * 9000),
                otpExpiresAt: Date.now() + 15 * 60 * 1000,
            });

            const registerModel = new this.model(record);
            const newUser = await registerModel.save();

            return newUser;
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
}
