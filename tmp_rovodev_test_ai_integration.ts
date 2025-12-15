/**
 * AI 集成测试脚本
 * 用于验证前后端 AI 功能是否正常工作
 */

import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001';

interface AITestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
}

class AIIntegrationTester {
  async testHealthCheck(): Promise<AITestResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai-gateway/health`);
      const data = await response.json();
      
      return {
        test: 'AI Gateway Health Check',
        success: response.ok,
        message: response.ok ? 'AI Gateway is healthy' : 'AI Gateway health check failed',
        data
      };
    } catch (error) {
      return {
        test: 'AI Gateway Health Check',
        success: false,
        message: `Health check failed: ${error.message}`
      };
    }
  }

  async testWritingAssist(): Promise<AITestResult> {
    try {
      const testData = {
        content: '这是一个测试文档。它包含一些基本的内容。',
        instruction: '请帮我改进这段文字，使其更加专业和详细。'
      };

      const response = await fetch(`${API_BASE_URL}/api/ai-gateway/assist-writing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();

      return {
        test: 'Writing Assist API',
        success: response.ok && data.content && data.content.length > 0,
        message: response.ok ? 'Writing assist working correctly' : 'Writing assist failed',
        data
      };
    } catch (error) {
      return {
        test: 'Writing Assist API',
        success: false,
        message: `Writing assist test failed: ${error.message}`
      };
    }
  }

  async testSummarize(): Promise<AITestResult> {
    try {
      const testData = {
        content: '人工智能（AI）是计算机科学的一个分支，它试图理解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。该领域的研究包括机器人、语言识别、图像识别、自然语言处理和专家系统等。人工智能从诞生以来，理论和技术日益成熟，应用领域也不断扩大。可以设想，未来人工智能带来的科技产品，将会是人类智慧的"容器"。',
        length: 'short'
      };

      const response = await fetch(`${API_BASE_URL}/api/ai-gateway/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();

      return {
        test: 'Summarize API',
        success: response.ok && data.content && data.content.length > 0,
        message: response.ok ? 'Summarize working correctly' : 'Summarize failed',
        data
      };
    } catch (error) {
      return {
        test: 'Summarize API',
        success: false,
        message: `Summarize test failed: ${error.message}`
      };
    }
  }

  async runAllTests(): Promise<AITestResult[]> {
    console.log('🚀 Starting AI Integration Tests...\n');

    const tests = [
      this.testHealthCheck(),
      this.testWritingAssist(),
      this.testSummarize()
    ];

    const results = await Promise.all(tests);
    
    console.log('📊 Test Results:');
    console.log('================');
    
    results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.message}`);
      
      if (result.data) {
        console.log(`   Data: ${JSON.stringify(result.data, null, 2)}`);
      }
      console.log('');
    });

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    console.log(`📈 Overall: ${successCount}/${totalCount} tests passed`);
    
    if (successCount === totalCount) {
      console.log('🎉 All tests passed! AI integration is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Check the configuration and try again.');
    }

    return results;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const tester = new AIIntegrationTester();
  tester.runAllTests().then(() => {
    console.log('\nTest completed.');
  }).catch(error => {
    console.error('Test runner failed:', error);
  });
}

export default AIIntegrationTester;