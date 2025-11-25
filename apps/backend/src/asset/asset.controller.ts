import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AssetService } from './asset.service';
import { CreateAssetInput } from './dto/create-asset.input';
import { UpdateAssetInput } from './dto/update-asset.input';
import { AssetType } from '../database/entities/asset.entity';
import { createContentDispositionHeader } from '../utils/filename-encoding';
import * as path from 'path';
import * as fs from 'fs/promises';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAssetInput: CreateAssetInput,
  ) {
    return this.assetService.create(file, createAssetInput);
  }

  @Get()
  async getAssets(
    @Query('type') type?: AssetType,
    @Query('search') search?: string,
    @Query('folderId') folderId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.assetService.findAll(
      type,
      search,
      folderId,
      limit ? parseInt(limit) : undefined,
      offset ? parseInt(offset) : undefined,
    );
  }

  @Get('stats')
  async getStats() {
    return this.assetService.getStats();
  }

  @Get(':id')
  async getAsset(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }

  @Put(':id')
  async updateAsset(
    @Param('id') id: string,
    @Body() updateAssetInput: Omit<UpdateAssetInput, 'id'>,
  ) {
    return this.assetService.update({ ...updateAssetInput, id });
  }

  @Delete(':id')
  async deleteAsset(@Param('id') id: string) {
    return this.assetService.remove(id);
  }

  @Get('download/:id')
  async downloadAsset(@Param('id') id: string, @Res() res: Response) {
    const asset = await this.assetService.findOne(id);
    const filePath = path.join(process.cwd(), asset.url.substring(1));

    try {
      await fs.access(filePath);
      res.setHeader('Content-Type', asset.mimeType);
      
      // 使用工具函数生成正确的 Content-Disposition 头
      const contentDisposition = createContentDispositionHeader(asset.originalName, false);
      res.setHeader('Content-Disposition', contentDisposition);
      
      res.sendFile(path.resolve(filePath));
    } catch {
      throw new NotFoundException('File not found');
    }
  }
}