import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum, IsArray, IsString, Min } from 'class-validator';
import { ContentType, Difficulty } from '../../database/entities/practice-node.entity';

@InputType()
export class CreatePracticeNodeInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  content?: string;

  @Field(() => ContentType, { defaultValue: ContentType.MDX })
  @IsEnum(ContentType)
  contentType: ContentType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  componentName?: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  tagNames: string[];

  @Field()
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @Field(() => Difficulty, { defaultValue: Difficulty.BEGINNER })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @Field(() => Int, { defaultValue: 30 })
  @Min(1)
  estimatedTime: number;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @IsString({ each: true })
  prerequisites: string[];
}