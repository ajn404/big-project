import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AssetService } from './asset.service';
import { AssetResolver } from './asset.resolver';
import { AssetController } from './asset.controller';
import { Asset } from '../database/entities/asset.entity';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset]),
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  ],
  providers: [AssetResolver, AssetService],
  controllers: [AssetController],
  exports: [AssetService],
})
export class AssetModule {}