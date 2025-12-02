# 量化交易策略回测系统 (Trading Strategy Backtester)

一个功能完整的量化交易策略回测平台，支持多种交易策略的历史回测和可视化分析。

## 功能特性

### 🔧 支持的交易策略

1. **网格交易策略 (Grid Trading)**
   - 基于价格波动的网格交易
   - 自动在价格下跌时买入，上涨时卖出
   - 适合震荡市场环境

2. **打板交易策略 (Momentum Trading)**
   - 基于技术分析的动量突破策略
   - 结合20日移动平均线和成交量分析
   - 适合趋势性市场

3. **MACD指标策略**
   - 基于MACD金叉死叉的经典技术指标策略
   - 使用12日EMA、26日EMA和9日信号线
   - 适合中长期趋势识别

4. **量价分析策略 (Volume-Price Analysis)**
   - 结合成交量和价格变化的综合分析
   - 识别量价齐升和量价背离信号
   - 适合短期交易机会捕捉

### 📊 支持的ETF产品

- **SPY**: SPDR S&P 500 ETF
- **QQQ**: Invesco QQQ Trust (纳斯达克100)
- **VTI**: Vanguard Total Stock Market ETF

### 📈 回测指标

- **总收益率**: 策略期间的总体收益表现
- **最大回撤**: 策略的最大亏损幅度
- **夏普比率**: 风险调整后的收益率指标
- **胜率**: 盈利交易占总交易的比例
- **交易次数**: 策略产生的总交易次数

## 技术实现

### 核心依赖

```json
{
  "lightweight-charts": "^4.x",
  "axios": "^1.x",
  "date-fns": "^4.x",
  "react": "^18.x",
  "typescript": "^5.x"
}
```

### 组件接口

```typescript
interface TradingBacktesterProps {
  symbol?: 'SPY' | 'QQQ' | 'VTI';
  strategy?: 'grid' | 'momentum' | 'macd' | 'volumePrice';
}
```

## 使用方法

### 基础使用

```tsx
import { TradingBacktester } from '@/components/charts';

function TradingPage() {
  return (
    <div className="w-full h-screen">
      <TradingBacktester 
        symbol="SPY" 
        strategy="grid" 
      />
    </div>
  );
}
```

### 自定义配置

```tsx
import { TradingBacktester } from '@/components/charts';

function CustomTradingPage() {
  return (
    <div className="container mx-auto p-6">
      <TradingBacktester 
        symbol="QQQ" 
        strategy="macd" 
      />
    </div>
  );
}
```

## 数据源

### 主要数据源
- **Alpha Vantage API**: 免费的金融数据API
- **降级处理**: 当API不可用时，自动切换到模拟数据

### 数据获取逻辑

```typescript
const fetchMarketData = async (symbol: string) => {
  try {
    // 尝试从Alpha Vantage获取实时数据
    const response = await axios.get(`https://www.alphavantage.co/query?...`);
    return parseApiData(response.data);
  } catch (error) {
    // 降级到模拟数据
    return generateMockData(symbol);
  }
};
```

## 策略算法详解

### 1. 网格交易策略

```typescript
const gridTradingStrategy = (data: MarketData[]): TradingSignal[] => {
  const gridSize = 0.02; // 2%网格
  let position = 0;
  let lastBuyPrice = 0;
  
  for (let i = 1; i < data.length; i++) {
    const current = data[i];
    const prev = data[i - 1];
    
    // 买入信号：价格下跌达到网格大小
    if (position <= 0 && current.close < prev.close * (1 - gridSize)) {
      // 生成买入信号
    }
    
    // 卖出信号：价格上涨达到网格大小
    if (position > 0 && current.close > lastBuyPrice * (1 + gridSize)) {
      // 生成卖出信号
    }
  }
};
```

### 2. 打板交易策略

```typescript
const momentumStrategy = (data: MarketData[]): TradingSignal[] => {
  for (let i = 20; i < data.length; i++) {
    const current = data[i];
    const ma20 = calculateMA20(data, i);
    const volumeRatio = calculateVolumeRatio(data, i);
    
    // 突破买入：价格突破MA20且成交量放大
    if (current.close > ma20 * 1.02 && volumeRatio > 1.5) {
      // 生成买入信号
    }
    
    // 止损卖出：跌破MA20 5%
    if (current.close < ma20 * 0.95) {
      // 生成卖出信号
    }
  }
};
```

### 3. MACD策略

```typescript
const macdStrategy = (data: MarketData[]): TradingSignal[] => {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12.map((val, i) => val - ema26[i]);
  const signalLine = calculateEMA(macdLine, 9);
  
  for (let i = 30; i < data.length; i++) {
    const macd = macdLine[i];
    const signal = signalLine[i];
    const prevMacd = macdLine[i - 1];
    const prevSignal = signalLine[i - 1];
    
    // MACD金叉买入
    if (macd > signal && prevMacd <= prevSignal) {
      // 生成买入信号
    }
    
    // MACD死叉卖出
    if (macd < signal && prevMacd >= prevSignal) {
      // 生成卖出信号
    }
  }
};
```

## 性能优化

### 1. 数据处理优化
- 使用增量计算技术指标
- 缓存重复计算结果
- 优化大数据集的处理性能

### 2. 图表渲染优化
- 使用lightweight-charts的高性能渲染
- 实现响应式图表尺寸调整
- 优化标记点的渲染性能

### 3. 内存管理
- 适当的useEffect依赖管理
- 图表实例的正确清理
- 避免内存泄漏

## 自定义扩展

### 添加新交易策略

1. 在策略枚举中添加新类型
2. 实现策略算法函数
3. 在策略选择器中更新UI
4. 添加相应的回测逻辑

```typescript
// 1. 添加类型
type Strategy = 'grid' | 'momentum' | 'macd' | 'volumePrice' | 'newStrategy';

// 2. 实现算法
const newStrategy = (data: MarketData[]): TradingSignal[] => {
  // 策略逻辑
};

// 3. 集成到主流程
switch (currentStrategy) {
  case 'newStrategy':
    signals = newStrategy(data);
    break;
  // ...
}
```

### 添加新的技术指标

```typescript
// RSI指标示例
const calculateRSI = (prices: number[], period: number = 14) => {
  // RSI计算逻辑
  const rsi = [];
  // ... 实现
  return rsi;
};
```

## 部署和生产

### 环境配置

```bash
# 安装依赖
pnpm install

# 构建组件
pnpm build

# 类型检查
pnpm type-check
```

### API密钥配置

```typescript
// 生产环境中使用环境变量
const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY || 'demo';
```

## 演示和测试

查看完整功能演示：
```bash
# 打开演示页面
open tmp_rovodev_trading_demo.html
```

## 许可证

MIT License - 详见LICENSE文件

## 贡献指南

1. Fork项目仓库
2. 创建功能分支
3. 提交代码更改
4. 发起Pull Request

## 支持和反馈

如有问题或建议，请通过以下方式联系：
- GitHub Issues
- 技术文档
- 社区讨论