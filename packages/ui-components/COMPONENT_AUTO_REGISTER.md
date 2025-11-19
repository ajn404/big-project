# 组件自动注册系统

## 概述

这个自动注册系统允许你在 `packages/ui-components/src/components` 中添加组件后，无需手动在 `initialize.ts` 中注册，即可在 `apps/frontend/src/components/updated-component-renderer.tsx` 中实现预览。

## 使用方法

### 1. 创建自动注册组件

使用 `createAutoRegisterComponent` 装饰器来创建自动注册的组件：

```tsx
import React from 'react'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'

interface MyComponentProps {
  title?: string
  children?: React.ReactNode
}

const MyComponent = createAutoRegisterComponent({
  id: 'my-component',                    // 唯一标识符
  name: 'MyComponent',                   // 组件名称
  description: '我的自定义组件',          // 组件描述
  category: CATEGORIES.UI,               // 组件分类
  template: `:::react{component="MyComponent" title="示例标题"}
内容
:::`,                                   // MDX 模板
  tags: ['自定义', 'UI'],                // 标签
  version: '1.0.0',                     // 版本
  author: 'Developer',                  // 作者
  props: {                              // 属性定义（可选）
    title: {
      type: 'string',
      default: '默认标题'
    }
  }
})(function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  )
})

export { MyComponent }
```

### 2. 在目录的 index.ts 中导出

确保在对应目录的 `index.ts` 文件中导出你的组件：

```tsx
// packages/ui-components/src/components/ui/index.ts
export { MyComponent } from './MyComponent'
```

### 3. 自动注册

当组件被导入时，它会自动添加到注册队列中。当 `initializeComponents()` 被调用时，所有排队的组件都会被注册。

## 可用的组件分类

```tsx
import { CATEGORIES } from '@workspace/ui-components'

CATEGORIES.UI          // 'UI组件'
CATEGORIES.INTERACTIVE // '交互组件'  
CATEGORIES.THREE_D     // '3D组件'
CATEGORIES.CHARTS      // '图表组件'
CATEGORIES.FORMS       // '表单组件'
CATEGORIES.LAYOUT      // '布局组件'
CATEGORIES.MEDIA       // '媒体组件'
CATEGORIES.ALERT       // '提示组件'
CATEGORIES.OTHER       // '其他'
```

## 组件属性定义

可以在元数据中定义组件的属性规范：

```tsx
props: {
  variant: {
    type: 'string',
    default: 'primary',
    options: ['primary', 'secondary', 'success']
  },
  size: {
    type: 'string',
    default: 'md',
    options: ['sm', 'md', 'lg']
  },
  disabled: {
    type: 'boolean',
    default: false
  }
}
```

## 最佳实践

1. **唯一 ID**: 确保每个组件的 `id` 是唯一的
2. **清晰的命名**: 使用清晰、描述性的组件名称
3. **详细描述**: 提供有意义的组件描述
4. **合适的分类**: 选择最合适的组件分类
5. **有用的标签**: 添加有助于搜索的标签
6. **模板示例**: 提供实用的 MDX 模板示例

## 调试

你可以使用以下函数来调试自动注册系统：

```tsx
import { 
  getQueuedComponentsCount,
  getAllRegisteredComponents 
} from '@workspace/ui-components'

// 检查排队等待注册的组件数量
console.log('排队组件数量:', getQueuedComponentsCount())

// 检查所有已注册的组件
console.log('已注册组件:', getAllRegisteredComponents())
```

## 示例

查看以下示例组件：
- `AutoRegisterExample.tsx` - 基本自动注册示例
- `SimpleButton.tsx` - 带属性定义的按钮组件

这些示例展示了如何正确使用自动注册系统。