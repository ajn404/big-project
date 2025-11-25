import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from '../database/entities/folder.entity';
import { Asset } from '../database/entities/asset.entity';
import { CreateFolderInput } from './dto/create-folder.input';
import { UpdateFolderInput } from './dto/update-folder.input';
import { MoveAssetToFolderInput } from './dto/move-asset-to-folder.input';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async create(input: CreateFolderInput): Promise<Folder> {
    // 检查父文件夹是否存在
    if (input.parentId) {
      const parentFolder = await this.folderRepository.findOne({
        where: { id: input.parentId },
      });
      if (!parentFolder) {
        throw new NotFoundException(`Parent folder with ID ${input.parentId} not found`);
      }
    }

    // 检查同级文件夹名称是否重复
    const existingFolder = await this.folderRepository.findOne({
      where: {
        name: input.name,
        parentId: input.parentId || null,
      },
    });

    if (existingFolder) {
      throw new BadRequestException('Folder name already exists in this location');
    }

    const folder = this.folderRepository.create(input);
    return this.folderRepository.save(folder);
  }

  async findAll(parentId?: string): Promise<Folder[]> {
    return this.folderRepository.find({
      where: { parentId: parentId || null },
      relations: ['children', 'assets'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Folder> {
    const folder = await this.folderRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'assets'],
    });

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${id} not found`);
    }

    return folder;
  }

  async update(updateFolderInput: UpdateFolderInput): Promise<Folder> {
    const folder = await this.findOne(updateFolderInput.id);

    // 检查名称冲突（如果修改了名称）
    if (updateFolderInput.name && updateFolderInput.name !== folder.name) {
      const existingFolder = await this.folderRepository.findOne({
        where: {
          name: updateFolderInput.name,
          parentId: folder.parentId,
        },
      });

      if (existingFolder) {
        throw new BadRequestException('Folder name already exists in this location');
      }
    }

    Object.assign(folder, updateFolderInput);
    return this.folderRepository.save(folder);
  }

  async remove(id: string): Promise<boolean> {
    const folder = await this.findOne(id);

    // 检查文件夹是否为空
    const childrenCount = await this.folderRepository.count({
      where: { parentId: id },
    });
    const assetsCount = await this.assetRepository.count({
      where: { folderId: id },
    });

    if (childrenCount > 0 || assetsCount > 0) {
      throw new BadRequestException('Cannot delete folder that contains files or subfolders');
    }

    await this.folderRepository.remove(folder);
    return true;
  }

  async moveAssetToFolder(input: MoveAssetToFolderInput): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id: input.assetId },
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${input.assetId} not found`);
    }

    // 如果指定了文件夹ID，检查文件夹是否存在
    if (input.folderId) {
      const folder = await this.folderRepository.findOne({
        where: { id: input.folderId },
      });
      if (!folder) {
        throw new NotFoundException(`Folder with ID ${input.folderId} not found`);
      }
    }

    asset.folderId = input.folderId;
    return this.assetRepository.save(asset);
  }

  async getFolderPath(folderId: string): Promise<Folder[]> {
    const path: Folder[] = [];
    let currentFolder = await this.folderRepository.findOne({
      where: { id: folderId },
      relations: ['parent'],
    });

    while (currentFolder) {
      path.unshift(currentFolder);
      if (currentFolder.parent) {
        currentFolder = await this.folderRepository.findOne({
          where: { id: currentFolder.parent.id },
          relations: ['parent'],
        });
      } else {
        currentFolder = null;
      }
    }

    return path;
  }
}