# DOM 嵌套问题修复总结

## 🐛 问题描述

之前的 MDX 渲染器会产生以下警告：
```
Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>
```

这是因为代码块和表格组件被包装在 `<div>` 中，但 React Markdown 可能将它们放在 `<p>` 标签内部，导致了非法的 HTML 嵌套。

## ✅ 修复方案

### 1. 使用语义化标签
- 将代码块的容器从 `<div>` 改为 `<figure>`
- 将表格的容器从 `<div>` 改为 `<figure>`
- 添加 `not-prose` 类排除 prose 样式影响

### 2. 智能段落处理
- 检测段落内是否包含块级元素
- 如果包含，使用 `<div>` 而不是 `<p>`
- 避免块级元素嵌套在段落内

### 3. 预格式化文本处理
- 添加独立的 `pre` 组件处理
- 避免重复包装已处理的代码块

## 🔧 修复代码

### 代码块组件
```tsx
// 使用 figure 而不是 div
return (
  <figure className="relative group my-4 not-prose">
    {/* 代码块内容 */}
  </figure>
)
```

### 表格组件
```tsx
// 使用 figure 避免嵌套问题
return (
  <figure className="overflow-x-auto my-6 border border-border rounded-lg not-prose">
    <table className="w-full border-collapse" {...props}>
      {children}
    </table>
  </figure>
)
```

### 段落智能处理
```tsx
// 检查子元素是否包含块级元素
const hasBlockElement = React.Children.toArray(children).some((child: any) => {
  if (React.isValidElement(child)) {
    const type = child.type
    return typeof type === 'function' && 
           (type.name === 'code' || type.name === 'table' || type.name === 'figure')
  }
  return false
})

// 如果包含块级元素，使用 div 而不是 p
if (hasBlockElement) {
  return <div className="mb-4 leading-7 text-foreground" {...props}>{children}</div>
}
```

## 📊 修复效果

- ✅ 消除了 DOM 嵌套警告
- ✅ 保持了原有的视觉效果
- ✅ 使用了更语义化的 HTML 结构
- ✅ 提升了可访问性

## 🧪 测试验证

可以在以下页面测试修复效果：
- `/test` - 功能测试页面
- `/admin/practice` - 文章管理页面
- 任何包含代码块和表格的文章页面

修复后不再出现控制台警告，HTML 结构更加规范。