import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as fs from 'fs';
import 'dotenv/config';

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Logger.log(`Origin customer_host:${process.env.FE_HOST}`, 'OriginHost');

  const options = {
    origin: [/^(.*)/, process.env.FE_HOST],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for,traceparent,request-id,request-context,user-agent',
    exposedHeaders: 'X-ACCESS-KEY,X-ACCESS-KEY-EXPIRES',
  };

  // if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('carhive backend Api')
      .setDescription('This api will help clients to store their data.')
      .setVersion('1.0')
      .addTag('CarHive')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
    SwaggerModule.setup('swagger', app, document);
  // }

  app.use(helmet());
  app.use(cookieParser());
  app.use(
    compression({
      level: 6,
      filter: shouldCompress,
    }),
  );
  app.enableCors(options);
  await app.listen(PORT);
  Logger.log(`Server running on http://localhost:${PORT}`, 'Bootstrap');
}
bootstrap();

function shouldCompress(req, res) {
  if (
    req.headers['x-no-compression'] &&
    req.headers['x-no-compression'] === 'true'
  ) {
    return false;
  }

  return compression.filter(req, res);
}