import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength, IsUUID } from 'class-validator';

@InputType()
export class UpdateAssetInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

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
}