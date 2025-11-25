import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { FolderResolver } from './folder.resolver';
import { Folder } from '../database/entities/folder.entity';
import { Asset } from '../database/entities/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, Asset])],
  controllers: [FolderController],
  providers: [FolderService, FolderResolver],
  exports: [FolderService],
})
export class FolderModule {}