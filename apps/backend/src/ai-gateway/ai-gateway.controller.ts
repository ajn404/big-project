import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AIGatewayService, AIRequest } from './ai-gateway.service';

@Controller('api/ai-gateway')
export class AIGatewayController {
  constructor(private readonly aiGatewayService: AIGatewayService) {}

  @Post('process')
  @HttpCode(HttpStatus.OK)
  async processRequest(@Body() request: AIRequest) {
    return this.aiGatewayService.processRequest(request);
  }

  @Post('assist-writing')
  @HttpCode(HttpStatus.OK)
  async assistWriting(@Body() body: { content: string; instruction: string }) {
    return this.aiGatewayService.assistWriting(body.content, body.instruction);
  }

  @Post('summarize')
  @HttpCode(HttpStatus.OK)
  async summarizeContent(
    @Body() body: { content: string; length?: 'short' | 'medium' | 'long' }
  ) {
    return this.aiGatewayService.summarizeContent(body.content, body.length);
  }

  @Get('health')
  async healthCheck() {
    return this.aiGatewayService.healthCheck();
  }
}