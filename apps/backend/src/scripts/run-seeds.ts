#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SeedRunnerService } from '../database/seeds/seed-runner.service';

const logger = new Logger('SeedScript');

async function bootstrap() {
  logger.log('开始运行种子数据脚本...');
  
  try {
    // 创建应用实例
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['log', 'error', 'warn'],
    });

    // 获取种子数据运行器服务
    const seedRunner = app.get(SeedRunnerService);

    // 运行种子数据
    await seedRunner.runSeedsManually();

    logger.log('种子数据脚本执行完成！');
    
    // 关闭应用
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('种子数据脚本执行失败:', error);
    process.exit(1);
  }
}

bootstrap();