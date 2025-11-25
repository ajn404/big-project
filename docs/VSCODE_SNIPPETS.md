# VSCode Snippets 使用指南

这些 VSCode snippets 帮助你快速创建自动注册的 React 组件。

## 📋 可用的 Snippets

### 1. `arc-ui` - 基础 UI 组件
快速创建一个基础的 UI 组件，使用低侵入的自动注册写法。

```typescript
// 输入: arc-ui
// 生成标准的UI组件模板
```

### 2. `arc-interactive` - 交互式组件  
创建带有状态管理和交互功能的组件。

```typescript
// 输入: arc-interactive
// 生成包含useState和事件处理的组件
```

### 3. `arc-form` - 表单组件
创建表单相关的组件，包含表单处理逻辑。

```typescript
// 输入: arc-form
// 生成包含表单验证和提交的组件
```

### 4. `arc-simple` - 简单组件
创建最简单的自动注册组件（默认导出）。

```typescript
// 输入: arc-simple
// 生成最简化的组件模板
```

## 🎯 使用步骤

1. **创建新文件**
   ```
   packages/ui-components/src/components/ui/MyNewComponent.tsx
   ```

2. **使用 Snippet**
   - 输入触发词（如 `arc-ui`）
   - 按 `Tab` 键触发 snippet
   - 填写组件名称和相关信息

3. **导出组件**
   在对应的 `index.ts` 文件中添加导出：
   ```tsx
   export { MyNewComponent } from './MyNewComponent'
   ```

## 🔧 Snippet 特点

### 低侵入设计
- ✅ 组件函数清晰可见
- ✅ 注册代码分离在底部
- ✅ 易于理解和维护

### 智能填充
- 🎯 自动生成 kebab-case 的组件 ID
- 📝 预设常用的组件分类
- 🏷️ 包含合理的默认标签

### 类型安全
- 💪 完整的 TypeScript 支持
- 🔍 智能的属性推导
- ✨ VS Code 智能提示

## 📖 Snippet 模板示例

### arc-ui 生成的代码结构：
```tsx
import React from 'react'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'

interface ComponentNameProps {
  children?: React.ReactNode
  // Add other props here
}

function ComponentName({ children, ...props }: ComponentNameProps) {
  return (
    <div className="p-4 border rounded">
      // Component content
      {children}
    </div>
  )
}

// Auto-register the component
const RegisteredComponentName = createAutoRegisterComponent({
  id: 'component-name',
  name: 'ComponentName',
  description: 'Component description',
  category: CATEGORIES.UI,
  template: `:::react{component="ComponentName"}
Content here
:::`,
  tags: ['ui', 'component'],
  version: '1.0.0',
})(ComponentName)

export { RegisteredComponentName as ComponentName }
```

## 🚀 快捷键建议

建议在 VSCode 设置中添加以下快捷键：

```json
{
  "key": "ctrl+shift+c u",
  "command": "editor.action.insertSnippet",
  "args": { "name": "Auto Register UI Component" }
}
```

## 💡 最佳实践

1. **命名约定**
   - 文件名：PascalCase (如 `MyButton.tsx`)
   - 组件ID：kebab-case (如 `my-button`)
   - 导出名：与组件名一致

2. **分类选择**
   - UI：基础界面组件
   - INTERACTIVE：交互式组件  
   - THREE_D：3D相关组件
   - FORMS：表单组件
   - LAYOUT：布局组件
   - MEDIA：媒体组件
   - CHARTS：图表组件
   - OTHER：其他类型

3. **模板编写**
   - 提供实际可用的示例
   - 包含常用的属性
   - 使用清晰的占位文本

现在你可以高效地创建自动注册组件了！🎉