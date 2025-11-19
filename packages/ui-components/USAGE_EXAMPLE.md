# 自动注册系统使用示例

## 快速开始

### 1. 创建新组件（自动注册方式）

```tsx
// packages/ui-components/src/components/ui/MyAwesomeComponent.tsx
import React from 'react'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'

interface MyAwesomeComponentProps {
  title?: string
  color?: 'blue' | 'green' | 'red'
  children?: React.ReactNode
}

// 使用装饰器自动注册
const MyAwesomeComponent = createAutoRegisterComponent({
  id: 'my-awesome-component',
  name: 'MyAwesomeComponent',  
  description: '一个很棒的演示组件',
  category: CATEGORIES.UI,
  template: `:::react{component="MyAwesomeComponent" title="测试标题" color="blue"}
这是组件内容
:::`,
  tags: ['演示', 'UI', '自定义'],
  version: '1.0.0',
  author: 'Your Name'
})(function MyAwesomeComponent({ 
  title = '默认标题', 
  color = 'blue', 
  children 
}: MyAwesomeComponentProps) {
  const colorClasses = {
    blue: 'bg-blue-100 border-blue-300 text-blue-800',
    green: 'bg-green-100 border-green-300 text-green-800', 
    red: 'bg-red-100 border-red-300 text-red-800'
  }

  return (
    <div className={`p-4 border-2 rounded-lg ${colorClasses[color]}`}>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {children}
      <div className="mt-2 text-sm">
        🎨 颜色主题: {color}
      </div>
    </div>
  )
})

export { MyAwesomeComponent }
```

### 2. 在 index.ts 中导出

```tsx
// packages/ui-components/src/components/ui/index.ts
export { ExampleCard } from './ExampleCard'
export { InfiniteGradientCarousel } from './InfiniteGradientCarousel'
export { AutoRegisterExample } from './AutoRegisterExample'
export { SimpleButton } from './SimpleButton'
export { MyAwesomeComponent } from './MyAwesomeComponent'  // ← 添加这行
```

### 3. 就是这样！

组件现在会：
- ✅ 自动注册到组件注册表
- ✅ 在 `apps/frontend` 中可用
- ✅ 可以在 MDX 中使用
- ✅ 在组件管理页面显示

## 在前端使用

### 在 MDX 文件中使用

```markdown
# 我的文档

这是一个自动注册的组件：

:::react{component="MyAwesomeComponent" title="自定义标题" color="green"}
这是传递给组件的内容
:::

这是另一个按钮组件：

:::react{component="SimpleButton" variant="success" size="lg"}
点击我
:::
```

### 在 React 组件中使用

```tsx
import { ComponentRenderer } from '@/components/updated-component-renderer'

function MyPage() {
  return (
    <div>
      <ComponentRenderer 
        componentName="MyAwesomeComponent"
        props={{
          title: "动态标题",
          color: "red"
        }}
      />
    </div>
  )
}
```

## 对比：旧方式 vs 新方式

### 旧方式（手动注册）

```tsx
// 1. 创建组件
export function OldComponent() { ... }

// 2. 在 initialize.ts 中手动添加
const components: ComponentInfo[] = [
  {
    id: 'old-component',
    name: 'OldComponent',
    description: '...',
    category: 'UI组件',
    component: OldComponent,
    template: '...'
  }
]

// 3. 确保导入和导出正确
```

### 新方式（自动注册）

```tsx
// 1. 创建组件并使用装饰器
const NewComponent = createAutoRegisterComponent({
  id: 'new-component',
  name: 'NewComponent', 
  description: '...',
  category: CATEGORIES.UI,
  template: '...'
})(function NewComponent() { ... })

// 2. 在 index.ts 中导出
export { NewComponent } from './NewComponent'

// 3. 完成！自动注册
```

## 调试和验证

```tsx
import { 
  getComponentStats, 
  validateComponentRegistration,
  getAllRegisteredComponents 
} from '@workspace/ui-components'

// 检查组件统计
console.log(getComponentStats())

// 验证特定组件
console.log(validateComponentRegistration('MyAwesomeComponent'))

// 列出所有组件
console.log(getAllRegisteredComponents().map(c => c.name))
```

## 最佳实践

1. **组件文件命名**：使用 PascalCase，如 `MyAwesomeComponent.tsx`
2. **ID 命名**：使用 kebab-case，如 `my-awesome-component`
3. **分类选择**：选择最合适的 `CATEGORIES` 
4. **描述详细**：提供清晰的组件描述
5. **模板实用**：提供真实可用的 MDX 模板示例
6. **导出一致**：始终在对应的 `index.ts` 中导出组件

现在你可以专注于创建组件，而不用担心注册的细节！🚀