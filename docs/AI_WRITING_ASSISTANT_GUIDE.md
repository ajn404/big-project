# AI 写作助手使用指南

## 概述

基于 DeepSeek API 的 AI 写作助手已集成到 MDX 编辑器中，提供智能的写作改进和内容总结功能。

## 功能特性

### 🤖 AI 网关架构
- **统一 AI 服务管理**：通过 AI Gateway 统一管理多个 AI 模型
- **可扩展设计**：支持多种 AI 提供商（DeepSeek、OpenAI、Claude 等）
- **智能路由**：根据任务类型自动选择最合适的模型
- **错误处理**：完善的错误处理和降级策略

### ✨ 写作功能
1. **写作改进**：根据用户指令优化文档内容
2. **内容总结**：自动生成不同长度的内容摘要
3. **实时预览**：即时查看 AI 处理结果
4. **灵活操作**：支持替换原内容或插入到光标位置

## 使用方法

### 1. 环境配置

在后端 `.env` 文件中配置 DeepSeek API：

```bash
# AI Gateway - DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
```

### 2. 在编辑器中使用

1. **打开 AI 助手**
   - 在 MDX 编辑器工具栏点击 🤖 按钮
   - 或使用快捷键（可在后续版本中添加）

2. **写作改进**
   - 选择"写作改进"模式
   - 在指令框中输入改进要求，例如：
     - "使语言更加专业"
     - "简化表达，去除冗余"
     - "增加更多技术细节"
     - "改为正式的学术语调"
   - 点击"开始改进"按钮

3. **内容总结**
   - 选择"内容总结"模式
   - 选择总结长度：
     - **简短**：1-2句话概括
     - **中等**：100-200字总结
     - **详细**：300-500字详细总结
   - 点击"开始总结"按钮

4. **结果处理**
   - 查看 AI 生成的结果
   - 复制到剪贴板
   - 替换原内容
   - 插入到当前光标位置

## 技术架构

### 后端架构

```
AI Gateway Service
├── AIGatewayModule          # 主模块
├── AIGatewayService         # 核心服务
├── AIGatewayResolver        # GraphQL 解析器
├── AIGatewayController      # REST API 控制器
└── DTOs                     # 数据传输对象
    ├── AIRequestInput       # 请求输入类型
    └── AIResponse           # 响应类型
```

### 前端架构

```
Frontend Integration
├── useAI.ts                # AI Hooks
├── ai-queries.ts           # GraphQL 查询
├── ai-assistant-dialog.tsx # AI 助手对话框
└── enhanced-mdx-editor.tsx # 集成到编辑器
```

### 关键设计模式

1. **策略模式**：支持多模型策略选择
2. **工厂模式**：根据提供商创建相应的 AI 客户端
3. **适配器模式**：统一不同 AI 提供商的 API 接口

## API 接口

### GraphQL Mutations

```graphql
# 写作改进
mutation AssistWriting($input: WritingAssistInput!) {
  assistWriting(input: $input) {
    content
    provider
    model
    usage {
      promptTokens
      completionTokens
      totalTokens
    }
  }
}

# 内容总结
mutation SummarizeContent($input: SummarizeInput!) {
  summarizeContent(input: $input) {
    content
    provider
    model
    usage {
      promptTokens
      completionTokens
      totalTokens
    }
  }
}
```

### REST API

```bash
# 健康检查
GET /api/ai-gateway/health

# 写作改进
POST /api/ai-gateway/assist-writing
{
  "content": "原始内容",
  "instruction": "改进指令"
}

# 内容总结
POST /api/ai-gateway/summarize
{
  "content": "要总结的内容",
  "length": "medium"
}
```

## 扩展性设计

### 1. 多模型支持

系统设计支持轻松添加新的 AI 提供商：

```typescript
// 添加新提供商
enum AIProvider {
  DEEPSEEK = 'deepseek',
  OPENAI = 'openai',      // 预留
  CLAUDE = 'claude',      // 预留
  CUSTOM = 'custom'       // 自定义
}
```

### 2. 任务类型扩展

```typescript
enum AITaskType {
  WRITING_ASSIST = 'writing_assist',
  SUMMARIZE = 'summarize',
  TRANSLATE = 'translate',     // 预留：翻译
  CODE_REVIEW = 'code_review', // 预留：代码审查
  QA = 'qa',                   // 预留：问答
  RAG = 'rag'                  // 预留：RAG 检索
}
```

### 3. 未来功能预留

- **RAG 集成**：知识库检索增强生成
- **记忆模块**：对话上下文记忆
- **工具调用**：支持函数调用和外部工具
- **流式响应**：实时流式输出
- **批量处理**：批量文档处理

## 最佳实践

### 1. 写作指令优化

**好的指令示例**：
- ✅ "将这段技术文档改写为面向初学者的教程，使用简单易懂的语言"
- ✅ "优化这段代码注释，使其更加详细和专业"
- ✅ "将非正式的笔记整理为正式的项目文档格式"

**避免的指令**：
- ❌ "改进一下"（过于模糊）
- ❌ "让它更好"（缺乏具体要求）

### 2. 内容准备

- 确保原始内容有足够的信息量
- 对于专业内容，提供必要的背景信息
- 分段处理长文档，避免超出 token 限制

### 3. 结果验证

- 始终检查 AI 生成内容的准确性
- 对技术内容进行额外验证
- 保留原始内容作为备份

## 故障排除

### 常见问题

1. **API Key 错误**
   - 检查 `.env` 文件中的 `DEEPSEEK_API_KEY`
   - 确认 API Key 有效且有足够配额

2. **网络连接问题**
   - 检查网络连接
   - 验证 DeepSeek API 服务状态

3. **内容长度限制**
   - 分段处理长文档
   - 调整 `maxTokens` 参数

### 调试方法

```bash
# 检查后端健康状态
curl http://localhost:3001/api/ai-gateway/health

# 查看后端日志
npm run dev # 在后端目录运行
```

## 性能优化

1. **请求优化**
   - 合理设置 temperature 和 maxTokens
   - 避免频繁的重复请求

2. **缓存策略**
   - 可在后续版本中添加结果缓存
   - 实现请求去重

3. **错误处理**
   - 实现请求重试机制
   - 提供降级处理方案

## 开发规划

### 短期目标
- ✅ 基础写作改进功能
- ✅ 内容总结功能
- ✅ DeepSeek API 集成
- 🔄 用户反馈收集

### 中期目标
- 🔄 多模型支持（OpenAI、Claude）
- 🔄 流式响应实现
- 🔄 批量处理功能
- 🔄 更多任务类型

### 长期目标
- 🔄 RAG 系统集成
- 🔄 个性化记忆模块
- 🔄 高级工具调用
- 🔄 智能写作建议

---

通过这个 AI 写作助手，我们为用户提供了强大而灵活的内容创作工具，同时保持了良好的可扩展性和可维护性。