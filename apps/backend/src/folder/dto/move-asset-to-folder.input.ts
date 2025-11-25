import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class MoveFolderInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  folderId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  newParentId?: string;
}

@InputType()
export class MoveMassiveInput {
  @Field(() => [ID])
  @IsNotEmpty()
  assetIds: string[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  folderId?: string;
}

@InputType()
export class MoveDeferAssetToFolder {
  @Field(() => [ID])
  @IsNotEmpty()
  assetIds: string[];

  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  targetId: string;
}

@InputType()
export class MoveAssetToFolderInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  assetId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  folderId?: string;
}