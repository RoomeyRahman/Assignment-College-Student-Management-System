import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as Redis from 'redis';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { QUEUES } from '../../common/mock';

@WebSocketGateway({ cors: true })
@Processor(QUEUES.REDIES_STUEDENT_QUEUE)
export class HobbyQueueProcessor {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(HobbyQueueProcessor.name);
  private redisClient: Redis.RedisClient;

  constructor() {
    this.redisClient = Redis.createClient();
  }

  @Process('assign-hobby')
  async assignHobby(job: Job<any>) {
    try {
      const student = job.data.student;

      const hobbies = ['Reading', 'Travelling', 'Movies', 'Games'];
      const randomIndex = Math.floor(Math.random() * hobbies.length);
      const randomHobby = hobbies[randomIndex];

      this.logger.log(
        `Assigned hobby ${randomHobby} to student ${student._id}`,
      );

      this.server.to('students').emit('student-updated', student);
    } catch (error) {
      this.logger.error(`Error assigning hobby: ${error.message}`);
    }
  }
}
