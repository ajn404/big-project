import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum, IsArray, IsString } from 'class-validator';
import { ComponentCategory, ComponentStatus } from '../../database/entities/ui-component.entity';

@InputType()
export class CreateUIComponentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => ComponentCategory, { defaultValue: ComponentCategory.UI_COMPONENT })
  @IsEnum(ComponentCategory)
  category: ComponentCategory;

  @Field()
  @IsNotEmpty()
  @IsString()
  template: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  preview?: string;

  @Field({ defaultValue: '1.0.0' })
  @IsString()
  version: string;

  @Field({ defaultValue: 'System' })
  @IsString()
  author: string;

  @Field(() => ComponentStatus, { defaultValue: ComponentStatus.ACTIVE })
  @IsEnum(ComponentStatus)
  status: ComponentStatus;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @IsString({ each: true })
  props: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  propsSchema?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  documentation?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  examples?: string;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @IsString({ each: true })
  tagNames: string[];
}