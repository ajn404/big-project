export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  parent?: Folder;
  children: Folder[];
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderInput {
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
}

export interface UpdateFolderInput {
  id: string;
  name?: string;
  description?: string;
  color?: string;
}

export interface MoveAssetToFolderInput {
  assetId: string;
  folderId?: string;
}

export interface MoveMassiveInput {
  assetIds: string[];
  folderId?: string;
}

import { Asset } from './asset';