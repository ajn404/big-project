import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 静态文件服务 - 提供上传的文件
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // API前缀
  app.setGlobalPrefix('api');
  const port = process.env.PORT || 3001;
  await app.listen(port);
}

bootstrap();