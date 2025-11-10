import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../database/entities/tag.entity';
import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';
import { TagCleanupService } from './tag.cleanup.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagService, TagResolver, TagCleanupService],
  exports: [TagService, TagCleanupService],
})
export class TagModule {}