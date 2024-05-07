import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './controllers';
import {
  UsersService
} from './services';
import { UserSchema } from './schemas';
import { SCHEMA } from '../common/mock';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SCHEMA.USER, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: 24 * 60 * 60 * 1000, // 1 days,
      },
    }),
  ],
  controllers: [
    UsersController,
  ],
  providers: [
    UsersService,
  ]
})
export class UsersModule { }
