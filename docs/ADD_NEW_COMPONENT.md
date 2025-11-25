# 🔧 添加新的 Shadcn 组件指南

## 📋 快速添加流程

### 1. 进入 UI 组件包目录
```bash
cd packages/ui-components
```

### 2. 使用 shadcn CLI 添加组件
```bash
# 添加单个组件
npx shadcn@latest add tooltip

# 添加多个组件
npx shadcn@latest add tooltip dropdown-menu popover

# 查看所有可用组件
npx shadcn@latest add
```

### 3. 更新导出文件
在 `src/components/ui/index.ts` 中添加新组件的导出：

```typescript
// 添加新组件的导出
export * from './tooltip'
export * from './dropdown-menu'
export * from './popover'
```

### 4. 构建组件包
```bash
pnpm run build
```

### 5. 在项目中使用
```typescript
// 在任何项目中导入新组件
import { Tooltip, DropdownMenu, Popover } from '@workspace/ui-components'

function MyComponent() {
  return (
    <Tooltip content="这是提示信息">
      <button>悬停查看提示</button>
    </Tooltip>
  )
}
```

## 🎯 常用 Shadcn 组件

### 布局组件
```bash
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
npx shadcn@latest add sheet
```

### 表单组件
```bash
npx shadcn@latest add form
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add switch
npx shadcn@latest add label
```

### 反馈组件
```bash
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add progress
npx shadcn@latest add skeleton
```

### 导航组件
```bash
npx shadcn@latest add navigation-menu
npx shadcn@latest add breadcrumb
npx shadcn@latest add pagination
```

### 数据展示
```bash
npx shadcn@latest add table
npx shadcn@latest add avatar
npx shadcn@latest add calendar
npx shadcn@latest add date-picker
```

## 🔄 批量添加示例

```bash
# 添加完整的表单套件
npx shadcn@latest add form checkbox radio-group switch label

# 添加数据展示套件  
npx shadcn@latest add table avatar calendar date-picker

# 添加反馈套件
npx shadcn@latest add alert toast progress skeleton
```

## 📝 更新导出的完整示例

添加组件后，更新 `src/components/ui/index.ts`：

```typescript
// === Shadcn UI Components ===

// 基础组件
export * from './button'
export * from './input'
export * from './textarea'
export * from './label'

// 布局组件
export * from './card'
export * from './dialog'
export * from './sheet'
export * from './separator'
export * from './scroll-area'

// 表单组件
export * from './form'
export * from './select'
export * from './checkbox'
export * from './radio-group'
export * from './switch'

// 反馈组件
export * from './alert'
export * from './badge'
export * from './toast'
export * from './progress'
export * from './skeleton'

// 导航组件
export * from './navigation-menu'
export * from './breadcrumb'
export * from './pagination'

// 数据展示
export * from './table'
export * from './avatar'
export * from './calendar'
export * from './date-picker'

// 交互组件
export * from './tooltip'
export * from './dropdown-menu'
export * from './popover'
export * from './slider'

// === 自定义组件 ===
export { ExampleCard } from './ExampleCard'
export { InfiniteGradientCarousel } from './InfiniteGradientCarousel'
export { AutoRegisterExample } from './AutoRegisterExample'
export { SimpleButton } from './SimpleButton'
```

## 🚀 自动化脚本 (可选)

创建 `add-component.sh` 脚本来自动化这个过程：

```bash
#!/bin/bash
# add-component.sh - 自动添加 shadcn 组件的脚本

if [ $# -eq 0 ]; then
    echo "用法: ./add-component.sh <component-name>"
    echo "示例: ./add-component.sh tooltip"
    exit 1
fi

COMPONENT=$1

echo "🔧 添加 shadcn 组件: $COMPONENT"

# 添加组件
npx shadcn@latest add $COMPONENT

# 在导出文件中添加导出行
echo "export * from './$COMPONENT'" >> src/components/ui/index.ts

echo "✅ 组件 $COMPONENT 添加完成"
echo "📦 正在构建..."

# 构建包
pnpm run build

echo "🎉 完成！现在可以在项目中使用: import { ComponentName } from '@workspace/ui-components'"
```

## 🎯 最佳实践

1. **批量添加**: 一次性添加相关的组件，减少重复操作
2. **及时导出**: 添加组件后立即更新导出文件
3. **测试验证**: 添加后在项目中测试新组件
4. **文档更新**: 如果是重要组件，更新使用文档

现在你可以快速扩展共享的 shadcn 组件库了！🚀