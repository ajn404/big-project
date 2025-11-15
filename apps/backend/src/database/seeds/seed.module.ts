import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UIComponent } from '../entities/ui-component.entity';
import { Tag } from '../entities/tag.entity';
import { UIComponentSeedService } from './ui-component.seed';
import { SeedRunnerService } from './seed-runner.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UIComponent, Tag]),
    ConfigModule
  ],
  providers: [UIComponentSeedService, SeedRunnerService],
  exports: [UIComponentSeedService, SeedRunnerService],
})
export class SeedModule {}