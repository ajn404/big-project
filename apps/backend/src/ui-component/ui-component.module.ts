import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UIComponent } from '../database/entities/ui-component.entity';
import { Tag } from '../database/entities/tag.entity';
import { UIComponentService } from './ui-component.service';
import { UIComponentResolver } from './ui-component.resolver';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UIComponent, Tag]),
    TagModule
  ],
  providers: [UIComponentService, UIComponentResolver],
  exports: [UIComponentService],
})
export class UIComponentModule {}