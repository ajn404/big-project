export const advancedSample = `---
title: "高级 Markdown 功能演示"
description: "展示使用开源库后 MDX 渲染器的强大功能"
category: "演示"
tags: ["Markdown", "GFM", "数学公式", "代码高亮", "任务列表"]
difficulty: "INTERMEDIATE"
estimatedTime: 15
prerequisites: ["Markdown 基础"]
---

# 高级 Markdown 功能演示

这个文档展示了使用专业开源库后 MDX 渲染器的强大功能。

## 目录

## GitHub Flavored Markdown 特性

### 删除线文本

~~这是被删除的文本~~ 这是正常文本

### 任务列表

- [x] 实现基础 Markdown 解析
- [x] 添加代码高亮功能
- [x] 支持数学公式渲染
- [ ] 添加图表支持
- [ ] 实现目录自动生成
- [ ] 添加 Mermaid 图表

### 表格增强

| 特性 | 支持状态 | 描述 | 难度 |
|------|:-------:|------|:----:|
| 基础语法 | ✅ | 标题、段落、列表 | 简单 |
| 代码高亮 | ✅ | 语法高亮和复制功能 | 中等 |
| 数学公式 | ✅ | LaTeX 公式渲染 | 高级 |
| 任务列表 | ✅ | 交互式复选框 | 中等 |
| 表格样式 | ✅ | 美观的表格渲染 | 简单 |
| 自动链接 | ✅ | URL 和邮箱自动转换 | 简单 |

## 代码高亮功能

### JavaScript 代码

\`\`\`javascript
// React Hook 示例
import { useState, useEffect } from 'react'

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  
  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(initialValue)
  
  useEffect(() => {
    console.log(\`Count changed to: \${count}\`)
  }, [count])
  
  return { count, increment, decrement, reset }
}

export default useCounter
\`\`\`

### Python 代码

\`\`\`python
# 数据科学示例
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

def train_model(data_path: str) -> LinearRegression:
    """训练线性回归模型"""
    # 读取数据
    df = pd.read_csv(data_path)
    
    # 特征工程
    X = df.drop('target', axis=1)
    y = df['target']
    
    # 分割数据
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # 训练模型
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # 评估性能
    score = model.score(X_test, y_test)
    print(f"模型准确率: {score:.3f}")
    
    return model
\`\`\`

### SQL 代码

\`\`\`sql
-- 复杂查询示例
WITH user_stats AS (
  SELECT 
    user_id,
    COUNT(*) as total_orders,
    SUM(amount) as total_spent,
    AVG(amount) as avg_order_value,
    MAX(created_at) as last_order_date
  FROM orders 
  WHERE created_at >= '2023-01-01'
  GROUP BY user_id
),
user_segments AS (
  SELECT 
    user_id,
    total_orders,
    total_spent,
    CASE 
      WHEN total_spent > 1000 THEN 'VIP'
      WHEN total_spent > 500 THEN 'Premium'
      WHEN total_spent > 100 THEN 'Regular'
      ELSE 'New'
    END as segment
  FROM user_stats
)
SELECT 
  u.name,
  us.segment,
  us.total_orders,
  us.total_spent,
  DATE_DIFF(CURRENT_DATE(), us.last_order_date) as days_since_last_order
FROM users u
JOIN user_segments us ON u.id = us.user_id
WHERE us.total_orders > 0
ORDER BY us.total_spent DESC
LIMIT 100;
\`\`\`

## 数学公式支持

### 内联公式

根据爱因斯坦的质能方程 $E = mc^2$，我们知道质量和能量之间的关系。

圆周率 $\pi \approx 3.14159$ 是一个无理数。

### 块级公式

**二次公式：**

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

**欧拉恒等式：**

$$
e^{i\pi} + 1 = 0
$$

**积分示例：**

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

**矩阵运算：**

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$

**求和公式：**

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

$$
\sum_{k=0}^{n} \binom{n}{k} = 2^n
$$

## 高级文本格式

### 引用和嵌套

> 这是一个标准的引用块。
> 
> > 这是嵌套的引用。
> > 
> > 可以包含**粗体**和*斜体*文本。

### 脚注支持

这是一个带有脚注的文本[^1]。你也可以使用内联脚注^[这是一个内联脚注]。

[^1]: 这是脚注的内容。可以包含多行文本和格式。

### 定义列表

术语 1
:   这是术语 1 的定义。可以包含多行内容。

术语 2
:   这是术语 2 的定义。
:   一个术语可以有多个定义。

### 键盘快捷键

使用 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制文本。

在 Mac 上使用 <kbd>⌘</kbd> + <kbd>V</kbd> 粘贴。

## 链接和图片

### 自动链接

访问我们的网站：https://example.com

发送邮件到：support@example.com

### 带标题的链接

[React 官方文档](https://reactjs.org "React - JavaScript 库")

[Vue.js 指南](https://vuejs.org "渐进式 JavaScript 框架")

### 图片

![React Logo](https://reactjs.org/logo-og.png "React Logo")

## 代码和标记

### 内联代码

使用 \`useState\` 钩子来管理组件状态。

文件路径：\`src/components/MyComponent.tsx\`

### 代码块（无语言指定）

\`\`\`
这是没有语法高亮的代码块
可以用来展示纯文本内容
或者配置文件内容
\`\`\`

### 高亮特定行

\`\`\`javascript{1,3-5}
function example() {
  const message = "Hello World"  // 高亮行
  console.log(message)           // 高亮行
  return message                 // 高亮行
}
\`\`\`

## 表格进阶

### 对齐表格

| 左对齐 | 居中对齐 | 右对齐 | 默认对齐 |
|:-------|:-------:|-------:|----------|
| 文本   | 文本     | 文本   | 文本     |
| 更长的文本 | 更长的文本 | 更长的文本 | 更长的文本 |

### 包含代码的表格

| 方法 | 语法 | 描述 |
|------|------|------|
| GET | \`fetch('/api/data')\` | 获取数据 |
| POST | \`fetch('/api/data', {method: 'POST'})\` | 创建数据 |
| PUT | \`fetch('/api/data/1', {method: 'PUT'})\` | 更新数据 |
| DELETE | \`fetch('/api/data/1', {method: 'DELETE'})\` | 删除数据 |

## 分割线和空格

---

水平分割线可以用来分隔不同的内容区域。

***

这是另一种分割线样式。

## 特殊字符和转义

使用反斜杠转义特殊字符：

- \\* 不是斜体
- \\_ 不是斜体  
- \\# 不是标题
- \\[不是链接\\]

## 总结

这个演示展示了现在 MDX 渲染器支持的所有高级功能：

1. **GitHub Flavored Markdown**：表格、任务列表、删除线
2. **数学公式**：LaTeX 语法支持，内联和块级公式
3. **代码高亮**：多种编程语言的语法高亮
4. **自动链接**：URL 和邮箱地址自动转换
5. **增强表格**：对齐、样式和复杂内容支持
6. **目录生成**：自动生成文档目录

> 💡 **提示**：所有这些功能都是通过集成专业的开源库实现的，提供了更好的性能和可维护性。

现在你可以创建功能丰富、视觉美观的技术文档了！

---

*最后更新：2024年11月*`