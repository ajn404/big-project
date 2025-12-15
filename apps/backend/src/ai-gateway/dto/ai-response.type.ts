import { ObjectType, Field } from '@nestjs/graphql';
import { AIProvider } from '../ai-gateway.service';

@ObjectType()
export class AIUsage {
  @Field()
  promptTokens: number;

  @Field()
  completionTokens: number;

  @Field()
  totalTokens: number;
}

@ObjectType()
export class AIResponse {
  @Field()
  content: string;

  @Field(() => AIProvider)
  provider: AIProvider;

  @Field()
  model: string;

  @Field(() => AIUsage, { nullable: true })
  usage?: AIUsage;

  @Field({ nullable: true })
  metadata?: string; // JSON 字符串形式存储
}

@ObjectType()
export class AIHealthCheck {
  @Field()
  status: string;

  @Field()
  providers: string; // JSON 字符串形式存储
}