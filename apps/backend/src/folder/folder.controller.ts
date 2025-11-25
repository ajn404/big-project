import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderInput } from './dto/create-folder.input';
import { UpdateFolderInput } from './dto/update-folder.input';
import { MoveAssetToFolderInput, MoveMassiveInput } from './dto/move-asset-to-folder.input';

@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  async createFolder(@Body() createFolderInput: CreateFolderInput) {
    return this.folderService.create(createFolderInput);
  }

  @Get()
  async getFolders(@Query('parentId') parentId?: string) {
    return this.folderService.findAll(parentId);
  }

  @Get(':id')
  async getFolder(@Param('id') id: string) {
    return this.folderService.findOne(id);
  }

  @Put(':id')
  async updateFolder(
    @Param('id') id: string,
    @Body() updateFolderInput: Omit<UpdateFolderInput, 'id'>,
  ) {
    return this.folderService.update({ ...updateFolderInput, id });
  }

  @Delete(':id')
  async deleteFolder(@Param('id') id: string) {
    return this.folderService.remove(id);
  }

  @Post('move-asset')
  async moveAssetToFolder(@Body() input: MoveAssetToFolderInput) {
    return this.folderService.moveAssetToFolder(input);
  }

  @Post('move-assets')
  async moveAssetsToFolder(@Body() input: MoveMassiveInput) {
    const results = await Promise.all(
      input.assetIds.map(assetId =>
        this.folderService.moveAssetToFolder({
          assetId,
          folderId: input.folderId,
        })
      )
    );
    return results;
  }

  @Get(':id/path')
  async getFolderPath(@Param('id') id: string) {
    return this.folderService.getFolderPath(id);
  }
}