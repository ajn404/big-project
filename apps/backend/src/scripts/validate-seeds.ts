#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { UIComponentService } from '../ui-component/ui-component.service';
import { ComponentCategory, ComponentStatus } from '../database/entities/ui-component.entity';

const logger = new Logger('ValidateSeeds');

async function validate() {
  logger.log('开始验证种子数据...');
  
  try {
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['log', 'error', 'warn'],
    });

    const uiComponentService = app.get(UIComponentService);

    // 检查组件数量
    const components = await uiComponentService.findAll();
    logger.log(`找到 ${components.length} 个UI组件`);

    if (components.length === 0) {
      logger.warn('没有找到任何组件，可能需要运行种子数据');
      await app.close();
      return;
    }

    // 验证每个组件的基本信息
    for (const component of components) {
      logger.log(`验证组件: ${component.name}`);
      
      // 检查必要字段
      if (!component.name || !component.description || !component.template) {
        logger.error(`组件 ${component.name} 缺少必要字段`);
        continue;
      }

      // 检查分类
      if (!Object.values(ComponentCategory).includes(component.category)) {
        logger.error(`组件 ${component.name} 分类无效: ${component.category}`);
        continue;
      }

      // 检查状态
      if (!Object.values(ComponentStatus).includes(component.status)) {
        logger.error(`组件 ${component.name} 状态无效: ${component.status}`);
        continue;
      }

      // 检查props schema格式
      if (component.propsSchema) {
        try {
          JSON.parse(component.propsSchema);
        } catch (e) {
          logger.error(`组件 ${component.name} props schema不是有效的JSON`);
          continue;
        }
      }

      // 检查examples格式
      if (component.examples) {
        try {
          JSON.parse(component.examples);
        } catch (e) {
          logger.error(`组件 ${component.name} examples不是有效的JSON`);
          continue;
        }
      }

      logger.log(`✅ 组件 ${component.name} 验证通过`);
    }

    // 获取统计信息
    const stats = await uiComponentService.getComponentStats();
    logger.log('组件统计信息:');
    logger.log(`- 总计: ${stats.total}`);
    logger.log(`- 活跃: ${stats.active}`);
    logger.log(`- 非活跃: ${stats.inactive}`);
    logger.log(`- 已废弃: ${stats.deprecated}`);

    logger.log('按分类统计:');
    for (const categoryStats of stats.byCategory) {
      logger.log(`- ${categoryStats.category}: ${categoryStats.count}`);
    }

    logger.log('✅ 种子数据验证完成！');
    
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('验证失败:', error);
    process.exit(1);
  }
}

validate();