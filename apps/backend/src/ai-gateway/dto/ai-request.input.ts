import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { AIProvider, AITaskType } from '../ai-gateway.service';

// 注册枚举类型到 GraphQL schema
registerEnumType(AIProvider, {
  name: 'AIProvider',
  description: 'AI 模型提供商',
});

registerEnumType(AITaskType, {
  name: 'AITaskType',
  description: 'AI 任务类型',
});

@InputType()
export class AIRequestInput {
  @Field()
  @IsString()
  prompt: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  context?: string;

  @Field(() => AITaskType)
  @IsEnum(AITaskType)
  taskType: AITaskType;

  @Field(() => AIProvider, { nullable: true })
  @IsOptional()
  @IsEnum(AIProvider)
  provider?: AIProvider;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(8000)
  maxTokens?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  systemPrompt?: string;
}

@InputType()
export class WritingAssistInput {
  @Field()
  @IsString()
  content: string;

  @Field()
  @IsString()
  instruction: string;
}

@InputType()
export class SummarizeInput {
  @Field()
  @IsString()
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  length?: 'short' | 'medium' | 'long';
}