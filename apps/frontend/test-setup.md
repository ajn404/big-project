# 文章管理功能测试指南

## 功能概述

本次更新为前端添加了完整的文章管理功能，包括：

### 1. 文章管理页面 (`/admin/practice`)
- ✅ 文章列表展示
- ✅ 搜索和筛选
- ✅ 创建新文章
- ✅ 编辑现有文章
- ✅ 删除文章
- ✅ 文章统计信息

### 2. Markdown 导入功能
- ✅ 文件上传导入 (.md, .markdown)
- ✅ URL 远程导入
- ✅ 直接文本粘贴
- ✅ YAML 前言解析
- ✅ 元数据自动提取

### 3. 增强的 MDX 编辑器
- ✅ 可视化工具栏
- ✅ 快捷键支持 (Ctrl+B, Ctrl+I, Ctrl+K 等)
- ✅ 实时预览模式
- ✅ 语法高亮
- ✅ 行号显示
- ✅ 字符统计和阅读时间预估

### 4. 优化的 MDX 渲染器
- ✅ 代码块语言标识和复制功能
- ✅ 标题锚点导航
- ✅ 任务列表支持
- ✅ 表格样式优化
- ✅ 外链图标提示
- ✅ 响应式设计

## 快速测试步骤

### 1. 启动应用
\`\`\`bash
# 启动后端 (在 apps/backend 目录)
npm run start:dev

# 启动前端 (在 apps/frontend 目录)  
npm run dev
\`\`\`

### 2. 访问测试页面
- 功能测试页面: `http://localhost:5173/test`
- 文章管理页面: `http://localhost:5173/admin/practice`
- 实践文章页面: `http://localhost:5173/practice`

### 3. 测试文章管理功能
1. 访问 `/admin/practice`
2. 点击"新建文章"测试创建功能
3. 使用"导入 Markdown"测试导入功能
4. 在文章列表中测试编辑和删除功能

### 4. 测试 Markdown 导入
1. 点击"导入 Markdown"按钮
2. 测试三种导入方式：
   - **文件上传**: 选择本地 .md 文件
   - **URL 导入**: 输入 GitHub raw 文件链接
   - **文本粘贴**: 直接粘贴 Markdown 内容
3. 验证 YAML 前言解析是否正确

### 5. 测试增强编辑器
1. 在创建/编辑文章时使用 MDX 编辑器
2. 测试工具栏功能 (标题、粗体、斜体、链接等)
3. 使用快捷键 (Ctrl+B 粗体, Ctrl+I 斜体等)
4. 切换预览模式查看渲染效果

### 6. 测试渲染器优化
1. 创建包含各种 Markdown 语法的文章
2. 查看代码块的复制功能
3. 测试标题锚点链接
4. 验证任务列表渲染
5. 检查表格和链接样式

## 示例 Markdown 内容

创建文章时可以使用以下示例内容测试：

\`\`\`markdown
---
title: "React Hooks 入门"
description: "学习 React Hooks 的基本概念和用法"
category: "React"
tags: ["React", "Hooks", "JavaScript"]
difficulty: "BEGINNER"
estimatedTime: 30
prerequisites: ["JavaScript 基础", "React 基础"]
---

# React Hooks 入门

React Hooks 让你在函数组件中使用状态和其他 React 特性。

## useState 示例

\`\`\`jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
\`\`\`

## 任务列表

- [x] 学习 useState
- [ ] 学习 useEffect
- [ ] 构建实际项目

## 特性对比

| Hook | 用途 | 难度 |
|------|------|------|
| useState | 状态管理 | 简单 |
| useEffect | 副作用 | 中等 |
| useContext | 上下文 | 中等 |

## 重要提示

> 始终在组件的顶层调用 Hooks，不要在循环、条件或嵌套函数中调用。

了解更多请访问 [React 官方文档](https://react.dev)。
\`\`\`

## 故障排除

### 常见问题

1. **编辑器不显示预览**
   - 确保 content 不为空
   - 检查 MDXRenderer 组件是否正确导入

2. **导入功能不工作**
   - 检查 GraphQL mutations 是否正确
   - 确保后端服务正在运行

3. **样式显示异常**
   - 确认 Tailwind CSS 正常加载
   - 检查自定义样式是否冲突

### 调试提示

- 打开浏览器开发者工具查看控制台错误
- 检查网络请求是否成功
- 使用 Apollo Client DevTools 调试 GraphQL 操作

## 技术实现说明

### 文件结构
\`\`\`
apps/frontend/src/
├── components/
│   ├── enhanced-mdx-editor.tsx     # 增强编辑器
│   ├── markdown-import-dialog.tsx  # 导入对话框
│   ├── mdx-renderer.tsx           # 优化渲染器
│   ├── practice-node-form.tsx     # 文章表单
│   └── quick-test.tsx             # 测试组件
├── pages/
│   └── practice-manage.tsx        # 管理页面
└── lib/
    └── sample-markdown.ts         # 示例内容
\`\`\`

### 核心改进

1. **MDX 渲染器优化**
   - 支持更多 Markdown 语法
   - 添加交互功能 (代码复制、锚点导航)
   - 改进样式和响应式支持

2. **编辑器增强**
   - 工具栏快速操作
   - 键盘快捷键
   - 实时预览切换
   - 状态栏信息显示

3. **导入功能**
   - 多种导入方式支持
   - YAML 前言解析
   - 智能内容提取

希望这些功能能提升文章管理的效率！如有问题请参考代码实现或创建 issue。