import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AIGatewayService } from './ai-gateway.service';
import { AIRequestInput, WritingAssistInput, SummarizeInput } from './dto/ai-request.input';
import { AIResponse, AIHealthCheck } from './dto/ai-response.type';

@Resolver()
export class AIGatewayResolver {
  constructor(private readonly aiGatewayService: AIGatewayService) {}

  @Mutation(() => AIResponse)
  async processAIRequest(@Args('input') input: AIRequestInput): Promise<AIResponse> {
    const response = await this.aiGatewayService.processRequest(input);
    
    return {
      ...response,
      metadata: response.metadata ? JSON.stringify(response.metadata) : undefined,
    };
  }

  @Mutation(() => AIResponse)
  async assistWriting(@Args('input') input: WritingAssistInput): Promise<AIResponse> {
    const response = await this.aiGatewayService.assistWriting(
      input.content,
      input.instruction
    );
    
    return {
      ...response,
      metadata: response.metadata ? JSON.stringify(response.metadata) : undefined,
    };
  }

  @Mutation(() => AIResponse)
  async summarizeContent(@Args('input') input: SummarizeInput): Promise<AIResponse> {
    const response = await this.aiGatewayService.summarizeContent(
      input.content,
      input.length as 'short' | 'medium' | 'long'
    );
    
    return {
      ...response,
      metadata: response.metadata ? JSON.stringify(response.metadata) : undefined,
    };
  }

  @Query(() => AIHealthCheck)
  async aiHealthCheck(): Promise<AIHealthCheck> {
    const health = await this.aiGatewayService.healthCheck();
    
    return {
      status: health.status,
      providers: JSON.stringify(health.providers),
    };
  }
}