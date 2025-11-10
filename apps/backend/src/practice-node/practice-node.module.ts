import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeNode } from '../database/entities/practice-node.entity';
import { Category } from '../database/entities/category.entity';
import { Tag } from '../database/entities/tag.entity';
import { PracticeNodeService } from './practice-node.service';
import { PracticeNodeResolver } from './practice-node.resolver';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PracticeNode, Category, Tag]),
    TagModule
  ],
  providers: [PracticeNodeService, PracticeNodeResolver],
  exports: [PracticeNodeService],
})
export class PracticeNodeModule {}