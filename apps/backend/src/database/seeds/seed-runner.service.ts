import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UIComponentSeedService } from './ui-component.seed';

@Injectable()
export class SeedRunnerService implements OnModuleInit {
  private readonly logger = new Logger(SeedRunnerService.name);

  constructor(
    private readonly uiComponentSeedService: UIComponentSeedService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // 只在开发环境或明确启用种子数据时运行
    const shouldRunSeeds = this.configService.get('RUN_SEEDS', 'false') === 'true' || 
                          this.configService.get('NODE_ENV') === 'development';

    if (shouldRunSeeds) {
      await this.runSeeds();
    }
  }

  async runSeeds() {
    this.logger.log('开始运行种子数据...');
    
    try {
      await this.uiComponentSeedService.seed();
      this.logger.log('所有种子数据运行完成！');
    } catch (error) {
      this.logger.error('种子数据运行失败:', error);
      // 在开发环境中，种子数据失败不应该阻止应用启动
      if (this.configService.get('NODE_ENV') === 'production') {
        throw error;
      }
    }
  }

  // 手动运行种子数据的方法
  async runSeedsManually() {
    this.logger.log('手动运行种子数据...');
    await this.uiComponentSeedService.seed();
  }
}