import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TagService } from './tag.service';

@Injectable()
export class TagCleanupService {
  private readonly logger = new Logger(TagCleanupService.name);

  constructor(private readonly tagService: TagService) {}

  // 每天凌晨2点执行标签清理
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleTagCleanup() {
    this.logger.log('Starting scheduled tag cleanup...');
    
    try {
      await this.tagService.cleanupUnusedTags();
      this.logger.log('Tag cleanup completed successfully');
    } catch (error) {
      this.logger.error('Tag cleanup failed:', error);
    }
  }

  // 手动触发标签清理的方法
  async manualCleanup() {
    this.logger.log('Starting manual tag cleanup...');
    
    try {
      await this.tagService.cleanupUnusedTags();
      this.logger.log('Manual tag cleanup completed successfully');
      return { success: true, message: 'Tag cleanup completed' };
    } catch (error) {
      this.logger.error('Manual tag cleanup failed:', error);
      return { success: false, message: 'Tag cleanup failed', error: error.message };
    }
  }
}