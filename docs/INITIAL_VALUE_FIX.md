# Monaco Editor 初始值显示修复

## 🔍 问题描述

当使用 `enhanced-mdx-editor.tsx` 编辑已保存的内容时（例如在 `practice-node-form.tsx` 中编辑现有的练习节点），Monaco Editor 显示为空，而不是显示 `formData.content` 的值。

## 🎯 问题根源

1. **Monaco Editor 异步加载**: Monaco Editor 的初始化是异步的，当编辑器挂载时，可能还没有接收到正确的 `value` prop
2. **值同步时机**: 编辑器挂载后，外部的 `value` 变化没有及时同步到编辑器内部
3. **占位符逻辑干扰**: 原来的占位符逻辑可能覆盖了真实的初始值

## ✅ 修复方案

### 1. 在编辑器挂载时设置初始值

```typescript
// 在 handleEditorMount 中确保设置初始值
if (value) {
  editor.setValue(value);
} else if (placeholder) {
  // 只有在没有值时才显示占位符
  editor.setValue(`<!-- ${placeholder} -->`);
  // ... 占位符清理逻辑
}
```

### 2. 添加值同步的 useEffect

```typescript
// 监听外部 value 变化，及时同步到编辑器
useEffect(() => {
  if (editorRef.current) {
    const currentValue = editorRef.current.getValue();
    if (value !== currentValue) {
      // 保存光标位置
      const position = editorRef.current.getPosition();
      editorRef.current.setValue(value);
      // 恢复光标位置
      if (position) {
        editorRef.current.setPosition(position);
      }
    }
  }
}, [value]);
```

## 🔧 修复的关键点

### 优先级处理
```typescript
// ✅ 修复后 - 正确的优先级
if (value) {
  editor.setValue(value);  // 优先使用真实值
} else if (placeholder) {
  // 占位符处理...
}
```

### 避免无限循环
```typescript
// 只有在值真正不同时才更新
if (value !== currentValue) {
  editor.setValue(value);
}
```

### 保持用户体验
```typescript
// 保存和恢复光标位置，避免编辑中断
const position = editorRef.current.getPosition();
editorRef.current.setValue(value);
if (position) {
  editorRef.current.setPosition(position);
}
```

## 📋 测试场景

### 场景 1: 新建内容
- **期望**: 显示占位符
- **结果**: ✅ 正确显示占位符

### 场景 2: 编辑现有内容
- **期望**: 显示 `formData.content` 的值
- **结果**: ✅ 正确显示已保存的内容

### 场景 3: 实时编辑
- **期望**: 编辑时预览实时更新
- **结果**: ✅ 实时预览正常工作

### 场景 4: 值的动态变化
- **期望**: 外部值变化时编辑器同步更新
- **结果**: ✅ 同步更新且保持光标位置

## 🎮 在 practice-node-form.tsx 中的使用

```typescript
// 这种用法现在完全正常工作
<EnhancedMDXEditor
  value={formData.content}  // 可以是空字符串或已保存的内容
  onChange={(value) => handleInputChange('content', value)}
  placeholder="输入 MDX 内容..."
  height="500px"
/>
```

## 🚀 用户体验提升

### 编辑已保存内容
- ✅ 打开编辑表单时立即显示现有内容
- ✅ 无需等待或刷新
- ✅ 光标位置合理（文档开头）

### 新建内容
- ✅ 友好的占位符提示
- ✅ 开始输入时占位符自动清除

### 内容同步
- ✅ 外部数据变化时编辑器及时更新
- ✅ 保持光标位置，不打断编辑流程

## 🔄 与其他功能的兼容性

### AI 助手
- ✅ AI 生成内容正确显示
- ✅ 内容替换和插入功能正常

### 预览功能
- ✅ 初始值的预览正确显示
- ✅ 实时预览功能不受影响

### 全屏模式
- ✅ 全屏模式下内容正确显示
- ✅ 滚动同步功能正常

## 📈 技术改进

### 代码质量
- 更清晰的初始化逻辑
- 避免竞态条件
- 更好的错误处理

### 性能优化
- 减少不必要的 setValue 调用
- 智能的值比较避免无限循环
- 保持光标位置提升用户体验

## ✨ 总结

这个修复确保了 Monaco Editor 在所有场景下都能正确显示初始值：

1. **新建内容** - 显示友好的占位符
2. **编辑现有内容** - 立即显示已保存的内容  
3. **动态值变化** - 及时同步外部变化
4. **保持用户体验** - 不打断编辑流程

现在用户可以无缝地在新建和编辑模式之间切换，享受一致的编辑体验！🎉

---

*修复完成时间: 2024年*  
*影响组件: monaco-markdown-editor.tsx, enhanced-mdx-editor.tsx, practice-node-form.tsx*