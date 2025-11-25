import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset, AssetType } from '../database/entities/asset.entity';
import { CreateAssetInput } from './dto/create-asset.input';
import { UpdateAssetInput } from './dto/update-asset.input';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fixFilenameEncoding, validateFilename } from '../utils/filename-encoding';

@Injectable()
export class AssetService {
  private readonly uploadDir = 'uploads';

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  private getAssetType(mimeType: string): AssetType {
    if (mimeType.startsWith('image/')) return AssetType.IMAGE;
    if (mimeType.startsWith('video/')) return AssetType.VIDEO;
    if (mimeType.startsWith('audio/')) return AssetType.AUDIO;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return AssetType.DOCUMENT;
    return AssetType.OTHER;
  }

  async create(
    file: Express.Multer.File,
    input: CreateAssetInput,
  ): Promise<Asset> {
    // 修复文件名编码问题
    const fixedOriginalName = fixFilenameEncoding(file.originalname);
    
    // 验证文件名安全性
    if (!validateFilename(fixedOriginalName)) {
      throw new Error('文件名包含非法字符');
    }
    
    const fileExtension = path.extname(fixedOriginalName);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);
    
    // 保存文件
    await fs.writeFile(filePath, file.buffer);

    // 调试：记录MIME类型和识别的类型
    const detectedType = this.getAssetType(file.mimetype);
    const port = process.env.PORT || 3001;
    
    console.log('文件上传信息:', {
      original: file.originalname,
      fixed: fixedOriginalName,
      fileName,
      mimeType: file.mimetype,
      size: file.size
    });
    
    // 创建资源记录
    const asset = this.assetRepository.create({
      name: fixedOriginalName,
      originalName: fixedOriginalName,
      url: `http://localhost:${port}/uploads/${fileName}`,
      mimeType: file.mimetype,
      size: file.size,
      type: detectedType,
      description: input.description,
      alt: input.alt,
      folderId: input.folderId,
      metadata: {
        fileName,
        originalName: fixedOriginalName,
        rawOriginalName: file.originalname, // 保存原始文件名用于调试
        uploadDate: new Date().toISOString(),
        detectedMimeType: file.mimetype,
      },
    });

    return this.assetRepository.save(asset);
  }

  async findAll(
    type?: AssetType,
    search?: string,
    folderId?: string,
    limit = 20,
    offset = 0,
  ): Promise<Asset[]> {
    const query = this.assetRepository.createQueryBuilder('asset');

    if (type) {
      query.andWhere('asset.type = :type', { type });
    }

    if (search) {
      query.andWhere(
        '(asset.name ILIKE :search OR asset.description ILIKE :search OR asset.alt ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (folderId !== undefined) {
      if (folderId === null || folderId === '') {
        query.andWhere('asset.folderId IS NULL');
      } else {
        query.andWhere('asset.folderId = :folderId', { folderId });
      }
    }

    query
      .orderBy('asset.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);

    return query.getMany();
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    return asset;
  }

  async update(updateAssetInput: UpdateAssetInput): Promise<Asset> {
    const asset = await this.findOne(updateAssetInput.id);
    
    Object.assign(asset, updateAssetInput);
    
    return this.assetRepository.save(asset);
  }

  async remove(id: string): Promise<boolean> {
    const asset = await this.findOne(id);

    // asset.url 是完整 URL，提取 pathname
    const urlObj = new URL(asset.url);
    const pathname = urlObj.pathname; // => '/uploads/xxx.jpg'

    // 拼真实路径
    const filePath = path.join(process.cwd(), pathname);

    try {
      await fs.unlink(filePath);
      console.log('File deleted:', filePath);
    } catch (e) {
      console.warn('Failed to delete file:', e.message);
    }

    await this.assetRepository.remove(asset);
    return true;
  }


  async getStats(): Promise<{
    total: number;
    byType: Record<AssetType, number>;
    totalSize: number;
  }> {
    const assets = await this.assetRepository.find();
    
    const stats = {
      total: assets.length,
      byType: {
        [AssetType.IMAGE]: 0,
        [AssetType.VIDEO]: 0,
        [AssetType.AUDIO]: 0,
        [AssetType.DOCUMENT]: 0,
        [AssetType.OTHER]: 0,
      },
      totalSize: 0,
    };

    assets.forEach(asset => {
      stats.byType[asset.type]++;
      stats.totalSize += Number(asset.size);
    });

    return stats;
  }
}