import { Resolver, Query, Mutation, Args, ID, Int, Float, ObjectType, Field } from '@nestjs/graphql';
// 移除了文件上传相关的装饰器，现在使用REST API
import { AssetService } from './asset.service';
import { Asset, AssetType } from '../database/entities/asset.entity';
import { CreateAssetInput } from './dto/create-asset.input';
import { UpdateAssetInput } from './dto/update-asset.input';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

@Resolver(() => Asset)
export class AssetResolver {
  constructor(private readonly assetService: AssetService) {}

  // GraphQL文件上传已移除，现在使用REST API
  // 上传功能请使用: POST /api/assets/upload

  @Query(() => [Asset], { name: 'assets' })
  findAll(
    @Args('type', { type: () => AssetType, nullable: true }) type?: AssetType,
    @Args('search', { nullable: true }) search?: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit?: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  ): Promise<Asset[]> {
    return this.assetService.findAll(type, search, limit, offset);
  }

  @Query(() => Asset, { name: 'asset' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Asset> {
    return this.assetService.findOne(id);
  }

  @Mutation(() => Asset)
  updateAsset(@Args('input') updateAssetInput: UpdateAssetInput): Promise<Asset> {
    return this.assetService.update(updateAssetInput);
  }

  @Mutation(() => Boolean)
  removeAsset(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.assetService.remove(id);
  }

  @Query(() => AssetStatsType)
  async assetStats() {
    return this.assetService.getStats();
  }
}

// 为统计数据创建GraphQL类型
// GraphQL types for stats are defined below

@ObjectType()
class AssetTypeStats {
  @Field(() => Int)
  [AssetType.IMAGE]: number;

  @Field(() => Int)
  [AssetType.VIDEO]: number;

  @Field(() => Int)
  [AssetType.AUDIO]: number;

  @Field(() => Int)
  [AssetType.DOCUMENT]: number;

  @Field(() => Int)
  [AssetType.OTHER]: number;
}

@ObjectType()
class AssetStatsType {
  @Field(() => Int)
  total: number;

  @Field(() => AssetTypeStats)
  byType: AssetTypeStats;

  @Field()
  totalSize: number;
}