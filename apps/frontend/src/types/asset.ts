export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  AUDIO = 'AUDIO',
  OTHER = 'OTHER',
}

export interface Asset {
  id: string;
  name: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  type: AssetType;
  description?: string;
  alt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AssetStats {
  total: number;
  totalSize: number;
  byType: Record<AssetType, number>;
}

export interface CreateAssetInput {
  description?: string;
  alt?: string;
}

export interface UpdateAssetInput {
  id: string;
  name?: string;
  description?: string;
  alt?: string;
}