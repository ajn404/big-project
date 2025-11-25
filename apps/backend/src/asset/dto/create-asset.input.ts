import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength, IsBoolean } from 'class-validator';

@InputType()
export class CreateAssetInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isMosaicDefault?: boolean;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  folderId?: string;
}