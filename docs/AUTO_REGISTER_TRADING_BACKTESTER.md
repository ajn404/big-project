# 自动注册量化交易回测组件 (Auto-Registered TradingBacktester)

基于原始 `TradingBacktester` 组件的自动注册版本，遵循 `ui-components` 包的自动注册组件模式。

## 🚀 特性

### 自动注册功能
- ✅ 使用 `createAutoRegisterComponent` 装饰器自动注册
- ✅ 支持组件发现和动态加载
- ✅ 完整的组件元数据和标签系统
- ✅ 统一的组件管理和版本控制

### 交易功能 
- ✅ 四种量化策略：网格、打板、MACD、量价分析
- ✅ 三个ETF标的：SPY、QQQ、VTI
- ✅ 专业回测指标和可视化
- ✅ 响应式设计和主题支持

## 📦 组件元数据

```typescript
{
  id: 'TradingBacktesterTradingBacktester',
  name: 'TradingBacktester',
  description: '量化交易策略回测系统 - 支持网格交易、打板交易、MACD指标、量价分析等多种策略的历史回测和可视化',
  category: CATEGORIES.CHARTS,
  template: `:::react{component="TradingBacktester" symbol="SPY" strategy="grid"}
  量化交易策略回测演示
  :::`,
  tags: ['trading', 'charts', 'quantitative', 'backtest', 'finance', 'technical-analysis'],
  version: '1.0.0'
}
```

## 🎯 使用方法

### 1. 基础导入和使用

```tsx
import { TradingBacktester } from '@/components/charts';

function TradingPage() {
  return (
    <div className="container mx-auto p-6">
      <TradingBacktester symbol="SPY" strategy="grid" />
    </div>
  );
}
```

### 2. 自定义颜色主题

```tsx
<TradingBacktester 
  symbol="QQQ" 
  strategy="macd"
  colors={{
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    upColor: '#00ff88',
    downColor: '#ff4444',
    borderUpColor: '#00ff88',
    borderDownColor: '#ff4444'
  }}
/>
```

### 3. 不同策略示例

```tsx
// 网格交易策略
<TradingBacktester symbol="SPY" strategy="grid" />

// 打板交易策略  
<TradingBacktester symbol="QQQ" strategy="momentum" />

// MACD指标策略
<TradingBacktester symbol="VTI" strategy="macd" />

// 量价分析策略
<TradingBacktester symbol="SPY" strategy="volumePrice" />
```

### 4. MDX 中使用

```mdx
:::react{component="TradingBacktester" symbol="SPY" strategy="grid"}
这里展示 SPY 的网格交易策略回测结果
:::

:::react{component="TradingBacktester" symbol="QQQ" strategy="macd"}
QQQ 的 MACD 策略回测分析
:::
```

## ⚙️ Props 接口

### TradingBacktesterProps

```typescript
interface TradingBacktesterProps {
  symbol?: 'SPY' | 'QQQ' | 'VTI';           // ETF标的，默认 'SPY'
  strategy?: 'grid' | 'momentum' | 'macd' | 'volumePrice'; // 策略，默认 'grid'
  children?: React.ReactNode;                // 子组件
  colors?: {                                // 自定义颜色
    backgroundColor?: string;               // 背景色，默认 'white'
    textColor?: string;                    // 文字颜色，默认 '#333'
    upColor?: string;                      // 上涨K线颜色，默认 '#4bffb5'
    downColor?: string;                    // 下跌K线颜色，默认 '#ff4976'
    borderUpColor?: string;                // 上涨边框颜色，默认 '#4bffb5'
    borderDownColor?: string;              // 下跌边框颜色，默认 '#ff4976'
  };
}
```

### 策略说明

| 策略 | 中文名称 | 说明 | 适用场景 |
|------|---------|------|----------|
| `grid` | 网格交易策略 | 2%网格间距，自动买低卖高 | 震荡市场 |
| `momentum` | 打板交易策略 | 突破MA20+成交量放大买入 | 趋势市场 |
| `macd` | MACD指标策略 | 金叉买入，死叉卖出 | 中长期趋势 |
| `volumePrice` | 量价分析策略 | 量价齐升买入，量价背离卖出 | 短期交易 |

### ETF标的说明

| 标的 | 全称 | 说明 | 基础价格 |
|------|------|------|---------|
| `SPY` | SPDR S&P 500 ETF | 标普500指数基金 | ~$450 |
| `QQQ` | Invesco QQQ Trust | 纳斯达克100指数基金 | ~$380 |
| `VTI` | Vanguard Total Stock Market ETF | 全市场指数基金 | ~$200 |

## 🔧 技术实现

### 组件结构

```typescript
// 核心组件实现
export const TradingBacktesterComponent: React.FC<TradingBacktesterComponentProps>

// 包装组件
function TradingBacktester(props: TradingBacktesterProps)

// 自动注册装饰器
const RegisteredTradingBacktester = createAutoRegisterComponent(metadata)(TradingBacktester)

// 导出注册版本
export { RegisteredTradingBacktester as TradingBacktester }
```

### 与原版本的差异

| 特性 | 原版本 (`TradingBacktester.tsx`) | 自动注册版本 (`trading-backtester.tsx`) |
|------|--------------------------------|----------------------------------------|
| 导出方式 | `export default` | `export { TradingBacktester }` |
| 注册方式 | 手动导入使用 | 自动注册到组件系统 |
| 组件发现 | ❌ | ✅ |
| 元数据支持 | ❌ | ✅ |
| MDX 集成 | ❌ | ✅ |
| 标签系统 | ❌ | ✅ |
| 版本管理 | ❌ | ✅ |

### 依赖关系

```typescript
// 核心依赖
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register';
import { createChart, ColorType } from 'lightweight-charts';
import { format, subYears } from 'date-fns';

// 内部依赖
import { ComponentCategory } from '../../types';
```

## 📊 回测指标

组件提供以下专业量化指标：

### 收益指标
- **总收益率**: 策略期间的累计收益表现
- **年化收益率**: 按年计算的收益率（隐式计算）

### 风险指标  
- **最大回撤**: 策略的最大亏损幅度
- **夏普比率**: 风险调整后的收益率指标

### 交易指标
- **胜率**: 盈利交易占总交易的比例
- **交易次数**: 策略产生的总信号数量

### 计算公式

```typescript
// 总收益率
totalReturn = (finalCapital - initialCapital) / initialCapital

// 最大回撤
maxDrawdown = max((peakCapital - currentCapital) / peakCapital)

// 夏普比率 (简化版)
sharpeRatio = (avgReturn / stdDeviation) * sqrt(252)

// 胜率
winRate = winningTrades / totalTrades
```

## 🎨 样式和主题

### 默认样式
- 响应式设计，适配移动端和桌面端
- 支持明暗主题切换
- 使用 Tailwind CSS 类名
- 专业的金融图表视觉效果

### 自定义颜色
所有图表颜色都可以通过 `colors` prop 自定义：

```tsx
const customColors = {
  backgroundColor: '#0f172a',     // 深色背景
  textColor: '#e2e8f0',         // 浅色文字
  upColor: '#10b981',           // 绿色上涨
  downColor: '#ef4444',         // 红色下跌
  borderUpColor: '#10b981',     // 绿色边框
  borderDownColor: '#ef4444'    // 红色边框
};

<TradingBacktester colors={customColors} />
```

## 🚀 部署和集成

### 1. 确保依赖已安装

```bash
cd packages/ui-components
pnpm add lightweight-charts axios date-fns
```

### 2. 导入到项目中

```typescript
// 在需要使用的地方导入
import { TradingBacktester } from '@/components/charts';

// 或者从主入口导入
import { TradingBacktester } from '@/components';
```

### 3. 初始化自动注册系统

```typescript
// 在应用启动时调用
import { initializeComponents } from '@/components/ui-components';

initializeComponents();
```

## 🔄 与组件系统的集成

### 自动注册流程

1. **组件定义**: 使用 `createAutoRegisterComponent` 装饰器
2. **元数据配置**: 提供完整的组件描述信息
3. **队列添加**: 组件被导入时自动加入注册队列
4. **批量注册**: 调用 `initializeComponents()` 时统一注册
5. **动态使用**: 组件可通过名称动态加载和使用

### 组件发现

注册后的组件可以通过以下方式被发现和使用：

```typescript
// 通过组件注册表查找
const component = getRegisteredComponent('TradingBacktester');

// 通过标签过滤
const tradingComponents = getComponentsByTags(['trading', 'charts']);

// 通过类别查找
const chartComponents = getComponentsByCategory(CATEGORIES.CHARTS);
```

## 📚 相关文档

- [原始 TradingBacktester 文档](./TRADING_BACKTESTER.md)
- [自动注册系统说明](./COMPONENT_AUTO_REGISTER.md)
- [组件开发指南](./ADD_NEW_COMPONENT.md)
- [UI 组件库概览](./SHADCN_SHARED_COMPLETE.md)

## 🤝 贡献和扩展

### 添加新策略

1. 在 `TradingBacktesterComponent` 中实现新的策略函数
2. 更新 `strategy` 类型定义
3. 在 `runBacktest` 函数中添加新策略分支
4. 更新组件元数据的标签和描述

### 添加新标的

1. 更新 `symbol` 类型定义
2. 在 `generateMockData` 中添加新标的的基础价格
3. 更新选择器的选项列表

### 自定义样式

1. 扩展 `colors` 接口添加新的颜色选项
2. 在图表初始化时应用新颜色
3. 更新文档说明新的样式选项

---

## 📄 许可证

MIT License - 与主项目许可证保持一致

## 🆘 支持

如有问题或建议，请通过以下方式反馈：
- GitHub Issues
- 组件文档更新
- 社区讨论区