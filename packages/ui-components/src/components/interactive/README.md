# CodeSandbox SDK 组件

基于官方 `@codesandbox/sdk` 实现的 CodeSandbox 创建和嵌入组件。

## 功能特性

- 🚀 **快速创建沙箱** - 支持多种前端框架模板
- 📝 **自定义文件** - 完全自定义的文件结构和代码内容
- 🎨 **实时预览** - 即时查看代码运行结果
- 🔗 **一键分享** - 生成可分享的沙箱链接
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🎯 **TypeScript 支持** - 完整的类型定义

## 组件列表

### CodeSandboxSDK

主要的 CodeSandbox 创建组件，提供完整的沙箱创建和管理功能。

```tsx
import { CodeSandboxSDK } from '@workspace/ui-components'

function MyApp() {
  return (
    <CodeSandboxSDK
      template="react-ts"
      title="我的 React 应用"
      description="一个使用 TypeScript 的 React 应用示例"
      onSandboxCreated={(sandbox) => {
        console.log('沙箱创建成功:', sandbox.url)
      }}
    />
  )
}
```

### CodeSandboxExample

展示 CodeSandbox SDK 各种使用方式的完整示例组件。

```tsx
import { CodeSandboxExample } from '@workspace/ui-components'

function Documentation() {
  return (
    <div>
      <h1>CodeSandbox 使用示例</h1>
      <CodeSandboxExample />
    </div>
  )
}
```

## API 参考

### CodeSandboxSDK Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `template` | `TemplateType` | `'react'` | 预定义模板类型 |
| `embedStyle` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 嵌入主题样式 |
| `showToolbar` | `boolean` | `true` | 是否显示工具栏 |
| `showFileExplorer` | `boolean` | `true` | 是否显示文件浏览器 |
| `showConsole` | `boolean` | `true` | 是否显示控制台 |
| `showPreview` | `boolean` | `true` | 是否显示预览窗口 |
| `files` | `CodeSandboxFiles` | - | 自定义文件内容 |
| `title` | `string` | `'新建沙箱'` | 沙箱标题 |
| `description` | `string` | - | 沙箱描述 |
| `isPublic` | `boolean` | `true` | 是否公开沙箱 |
| `height` | `string \| number` | `'600px'` | 容器高度 |
| `width` | `string \| number` | `'100%'` | 容器宽度 |
| `onSandboxCreated` | `(sandbox) => void` | - | 沙箱创建成功回调 |
| `onCodeChange` | `(files) => void` | - | 代码变更回调 |
| `onError` | `(error) => void` | - | 错误回调 |

### 支持的模板类型

- `vanilla` - 原生 JavaScript
- `vanilla-ts` - 原生 TypeScript  
- `react` - React 应用
- `react-ts` - React + TypeScript
- `vue` - Vue 应用
- `vue-ts` - Vue + TypeScript
- `angular` - Angular 应用
- `svelte` - Svelte 应用
- `solid` - SolidJS 应用
- `preact` - Preact 应用

## 使用示例

### 基础用法

```tsx
import { CodeSandboxSDK } from '@workspace/ui-components'

export function BasicExample() {
  return (
    <CodeSandboxSDK
      template="vanilla"
      title="JavaScript 示例"
      description="一个简单的 JavaScript 沙箱"
    />
  )
}
```

### 自定义文件

```tsx
import { CodeSandboxSDK } from '@workspace/ui-components'

const customFiles = {
  'index.html': {
    code: `<!DOCTYPE html>
<html>
<head>
    <title>自定义页面</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello World!</h1>
    <script src="script.js"></script>
</body>
</html>`
  },
  'style.css': {
    code: `body { 
      font-family: Arial, sans-serif; 
      text-align: center; 
      padding: 50px; 
    }`
  },
  'script.js': {
    code: `console.log('Hello from custom sandbox!');`
  }
}

export function CustomFileExample() {
  return (
    <CodeSandboxSDK
      template="vanilla"
      title="自定义文件示例"
      files={customFiles}
      onSandboxCreated={(sandbox) => {
        console.log('沙箱 URL:', sandbox.url)
      }}
    />
  )
}
```

### React 应用示例

```tsx
import { CodeSandboxSDK } from '@workspace/ui-components'

const reactFiles = {
  'package.json': {
    code: JSON.stringify({
      "name": "my-react-app",
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-scripts": "5.0.1"
      }
    }, null, 2)
  },
  'src/App.js': {
    code: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>React 计数器</h1>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        点击增加
      </button>
    </div>
  );
}

export default App;`
  }
}

export function ReactExample() {
  return (
    <CodeSandboxSDK
      template="react"
      title="React 计数器应用"
      files={reactFiles}
      height="500px"
    />
  )
}
```

### 事件处理

```tsx
import { CodeSandboxSDK } from '@workspace/ui-components'
import { useState } from 'react'

export function EventExample() {
  const [sandboxUrl, setSandboxUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSandboxCreated = (sandbox) => {
    setSandboxUrl(sandbox.url)
    setIsLoading(false)
    
    // 自动在新标签页打开
    window.open(sandbox.url, '_blank')
  }

  const handleError = (error) => {
    console.error('创建沙箱失败:', error)
    setIsLoading(false)
  }

  return (
    <div>
      {sandboxUrl && (
        <div style={{ marginBottom: '20px' }}>
          <p>沙箱已创建: <a href={sandboxUrl} target="_blank">{sandboxUrl}</a></p>
        </div>
      )}
      
      <CodeSandboxSDK
        template="react-ts"
        title="事件处理示例"
        onSandboxCreated={handleSandboxCreated}
        onError={handleError}
      />
    </div>
  )
}
```

## 最佳实践

### 1. 选择合适的模板

根据项目需求选择合适的模板：

- 学习基础知识：使用 `vanilla` 或 `vanilla-ts`
- React 开发：使用 `react` 或 `react-ts`
- Vue 开发：使用 `vue` 或 `vue-ts`
- 现代化开发：推荐使用 TypeScript 版本

### 2. 优化文件结构

```tsx
// 推荐的文件结构
const files = {
  // 主入口文件
  'index.html': { code: '...' },
  
  // 样式文件
  'styles/main.css': { code: '...' },
  'styles/components.css': { code: '...' },
  
  // JavaScript 文件
  'js/app.js': { code: '...' },
  'js/utils.js': { code: '...' },
  
  // 组件文件 (React)
  'src/App.jsx': { code: '...' },
  'src/components/Header.jsx': { code: '...' },
}
```

### 3. 错误处理

```tsx
const handleError = (error) => {
  // 记录错误信息
  console.error('CodeSandbox 错误:', error)
  
  // 显示用户友好的错误信息
  alert('创建沙箱时出现问题，请稍后重试')
  
  // 发送错误报告（可选）
  // sendErrorReport(error)
}

<CodeSandboxSDK onError={handleError} />
```

### 4. 性能优化

```tsx
import { memo } from 'react'

// 使用 memo 避免不必要的重渲染
const MemoizedCodeSandbox = memo(CodeSandboxSDK)

// 避免在渲染时创建新的函数
const handleSandboxCreated = useCallback((sandbox) => {
  // 处理逻辑
}, [])
```

## 故障排除

### 常见问题

1. **沙箱创建失败**
   - 检查网络连接
   - 确认 API 密钥配置（如需要）
   - 验证文件内容格式

2. **预览不显示**
   - 检查 iframe 权限
   - 确认浏览器支持嵌入内容
   - 验证 CSP 策略设置

3. **依赖加载错误**
   - 检查 package.json 格式
   - 确认依赖版本兼容性
   - 使用稳定的依赖版本

### 调试技巧

```tsx
// 启用详细日志
<CodeSandboxSDK
  onSandboxCreated={(sandbox) => {
    console.log('Sandbox created:', {
      id: sandbox.id,
      url: sandbox.url,
      title: sandbox.title
    })
  }}
  onCodeChange={(files) => {
    console.log('Files changed:', Object.keys(files))
  }}
  onError={(error) => {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    })
  }}
/>
```

## 更多资源

- [CodeSandbox 官方文档](https://codesandbox.io/docs)
- [CodeSandbox SDK GitHub](https://github.com/codesandbox/codesandbox-sdk)
- [沙箱 API 参考](https://codesandbox.io/docs/api)