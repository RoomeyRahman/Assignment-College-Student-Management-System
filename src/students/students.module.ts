import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { QUEUES, SCHEMA } from '../common/mock';
import { StudentsService } from './services';
import { StudentsController } from './controllers/students.controller';
import { StudentSchema } from './schemas';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SCHEMA.STUDENT, schema: StudentSchema },
    ]),
    BullModule.registerQueue({
      name: QUEUES.REDIES_STUEDENT_QUEUE,
    }),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
