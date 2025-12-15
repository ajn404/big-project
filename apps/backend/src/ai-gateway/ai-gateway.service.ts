import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// AI 模型提供商枚举
export enum AIProvider {
  DEEPSEEK = 'deepseek',
  OPENAI = 'openai',
  CLAUDE = 'claude',
}

// AI 任务类型
export enum AITaskType {
  WRITING_ASSIST = 'writing_assist',
  SUMMARIZE = 'summarize',
  TRANSLATE = 'translate',
  CODE_REVIEW = 'code_review',
  QA = 'qa',
}

// AI 请求接口
export interface AIRequest {
  prompt: string;
  context?: string;
  taskType: AITaskType;
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

// AI 响应接口
export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: Record<string, any>;
}

// DeepSeek API 配置
interface DeepSeekConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

// 多模型策略配置
interface ModelStrategy {
  provider: AIProvider;
  model: string;
  priority: number;
  conditions?: {
    taskType?: AITaskType[];
    maxTokens?: number;
  };
}

@Injectable()
export class AIGatewayService {
  private readonly logger = new Logger(AIGatewayService.name);
  private readonly deepSeekConfig: DeepSeekConfig;
  private readonly modelStrategies: ModelStrategy[];

  constructor(private configService: ConfigService) {
    // 初始化 DeepSeek 配置
    this.deepSeekConfig = {
      apiKey: this.configService.get('DEEPSEEK_API_KEY', ''),
      baseUrl: this.configService.get('DEEPSEEK_BASE_URL', 'https://api.deepseek.com/v1'),
      model: this.configService.get('DEEPSEEK_MODEL', 'deepseek-chat'),
    };

    // 初始化模型策略配置
    this.modelStrategies = [
      {
        provider: AIProvider.DEEPSEEK,
        model: 'deepseek-chat',
        priority: 1,
        conditions: {
          taskType: [AITaskType.WRITING_ASSIST, AITaskType.SUMMARIZE, AITaskType.CODE_REVIEW],
        },
      },
      // 可以在这里添加更多模型策略
    ];

    this.validateConfiguration();
  }

  /**
   * 验证配置
   */
  private validateConfiguration() {
    if (!this.deepSeekConfig.apiKey) {
      this.logger.warn('DeepSeek API key not configured. Some AI features may not work.');
    }
  }

  /**
   * 主要的 AI 请求处理方法
   */
  async processRequest(request: AIRequest): Promise<AIResponse> {
    try {
      this.logger.log(`Processing AI request: ${request.taskType}`);

      // 选择最合适的模型
      const strategy = this.selectModelStrategy(request);
      
      // 根据提供商路由请求
      switch (strategy.provider) {
        case AIProvider.DEEPSEEK:
          return await this.callDeepSeek(request, strategy);
        default:
          throw new BadRequestException(`Unsupported AI provider: ${strategy.provider}`);
      }
    } catch (error) {
      this.logger.error(`AI request failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('AI service temporarily unavailable');
    }
  }

  /**
   * 写作辅助功能
   */
  async assistWriting(content: string, instruction: string): Promise<AIResponse> {
    const systemPrompt = `你是一个专业的写作助手。你的任务是根据用户的指令帮助改进文档内容。
请保持内容的原意，但要：
1. 改善语言表达和流畅度
2. 优化结构和逻辑
3. 确保语法正确
4. 保持专业性和准确性

用户指令: ${instruction}`;

    const request: AIRequest = {
      prompt: content,
      taskType: AITaskType.WRITING_ASSIST,
      systemPrompt,
      temperature: 0.7,
      maxTokens: 2000,
    };

    return this.processRequest(request);
  }

  /**
   * 内容总结功能
   */
  async summarizeContent(content: string, length: 'short' | 'medium' | 'long' = 'medium'): Promise<AIResponse> {
    const lengthInstructions = {
      short: '用1-2句话概括',
      medium: '用100-200字总结',
      long: '用300-500字详细总结',
    };

    const systemPrompt = `你是一个专业的内容总结助手。请${lengthInstructions[length]}以下内容的核心要点：
1. 提取主要观点和关键信息
2. 保持逻辑清晰
3. 使用简洁明了的语言
4. 确保准确性，不添加原文没有的信息`;

    const request: AIRequest = {
      prompt: content,
      taskType: AITaskType.SUMMARIZE,
      systemPrompt,
      temperature: 0.3,
      maxTokens: length === 'short' ? 100 : length === 'medium' ? 300 : 600,
    };

    return this.processRequest(request);
  }

  /**
   * 选择模型策略
   */
  private selectModelStrategy(request: AIRequest): ModelStrategy {
    // 如果指定了提供商，优先使用指定的
    if (request.provider) {
      const strategy = this.modelStrategies.find(s => s.provider === request.provider);
      if (strategy) return strategy;
    }

    // 根据任务类型和条件选择最合适的策略
    const suitableStrategies = this.modelStrategies
      .filter(strategy => {
        if (strategy.conditions?.taskType) {
          return strategy.conditions.taskType.includes(request.taskType);
        }
        return true;
      })
      .sort((a, b) => a.priority - b.priority);

    if (suitableStrategies.length === 0) {
      // 返回默认策略
      return this.modelStrategies[0] || {
        provider: AIProvider.DEEPSEEK,
        model: 'deepseek-chat',
        priority: 1,
      };
    }

    return suitableStrategies[0];
  }

  /**
   * 调用 DeepSeek API
   */
  private async callDeepSeek(request: AIRequest, strategy: ModelStrategy): Promise<AIResponse> {
    if (!this.deepSeekConfig.apiKey) {
      throw new BadRequestException('DeepSeek API key not configured');
    }

    const messages = [];
    
    if (request.systemPrompt) {
      messages.push({
        role: 'system',
        content: request.systemPrompt,
      });
    }

    if (request.context) {
      messages.push({
        role: 'user',
        content: `上下文信息：\n${request.context}\n\n任务：\n${request.prompt}`,
      });
    } else {
      messages.push({
        role: 'user',
        content: request.prompt,
      });
    }

    const payload = {
      model: strategy.model,
      messages,
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 1000,
      stream: false,
    };

    try {
      const response = await fetch(`${this.deepSeekConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepSeekConfig.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      return {
        content: data.choices[0]?.message?.content || '',
        provider: AIProvider.DEEPSEEK,
        model: strategy.model,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        } : undefined,
        metadata: {
          finishReason: data.choices[0]?.finish_reason,
          requestId: data.id,
        },
      };
    } catch (error) {
      this.logger.error(`DeepSeek API call failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<{ status: string; providers: Record<string, boolean> }> {
    const providers: Record<string, boolean> = {};

    // 检查 DeepSeek
    try {
      providers.deepseek = Boolean(this.deepSeekConfig.apiKey);
    } catch {
      providers.deepseek = false;
    }

    const allHealthy = Object.values(providers).every(status => status);

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      providers,
    };
  }
}