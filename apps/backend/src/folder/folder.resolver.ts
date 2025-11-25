import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { FolderService } from './folder.service';
import { Folder } from '../database/entities/folder.entity';
import { Asset } from '../database/entities/asset.entity';
import { CreateFolderInput } from './dto/create-folder.input';
import { UpdateFolderInput } from './dto/update-folder.input';
import { MoveAssetToFolderInput, MoveMassiveInput } from './dto/move-asset-to-folder.input';

@Resolver(() => Folder)
export class FolderResolver {
  constructor(private readonly folderService: FolderService) {}

  @Mutation(() => Folder)
  createFolder(@Args('input') createFolderInput: CreateFolderInput): Promise<Folder> {
    return this.folderService.create(createFolderInput);
  }

  @Query(() => [Folder], { name: 'folders' })
  findFolders(
    @Args('parentId', { type: () => ID, nullable: true }) parentId?: string,
  ): Promise<Folder[]> {
    return this.folderService.findAll(parentId);
  }

  @Query(() => Folder, { name: 'folder' })
  findFolder(@Args('id', { type: () => ID }) id: string): Promise<Folder> {
    return this.folderService.findOne(id);
  }

  @Mutation(() => Folder)
  updateFolder(@Args('input') updateFolderInput: UpdateFolderInput): Promise<Folder> {
    return this.folderService.update(updateFolderInput);
  }

  @Mutation(() => Boolean)
  removeFolder(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.folderService.remove(id);
  }

  @Mutation(() => Asset)
  moveAssetToFolder(@Args('input') input: MoveAssetToFolderInput): Promise<Asset> {
    return this.folderService.moveAssetToFolder(input);
  }

  @Mutation(() => [Asset])
  async moveAssetsToFolder(@Args('input') input: MoveMassiveInput): Promise<Asset[]> {
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

  @Query(() => [Folder])
  getFolderPath(@Args('folderId', { type: () => ID }) folderId: string): Promise<Folder[]> {
    return this.folderService.getFolderPath(folderId);
  }
}