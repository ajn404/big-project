import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIGatewayService } from './ai-gateway.service';
import { AIGatewayResolver } from './ai-gateway.resolver';
import { AIGatewayController } from './ai-gateway.controller';

@Module({
  imports: [ConfigModule],
  providers: [AIGatewayService, AIGatewayResolver],
  controllers: [AIGatewayController],
  exports: [AIGatewayService],
})
export class AIGatewayModule {}