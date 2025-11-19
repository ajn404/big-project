# 筛选组件调试指南

## 🐛 问题描述
分类和标签只有第一次点击有效果，后续切换不生效。

## 🔍 调试步骤

### 1. 打开浏览器开发者工具
- 按 F12 或右键检查
- 切换到 Console 标签页

### 2. 访问实践页面
```
http://localhost:5173/practice
```

### 3. 测试筛选功能
- 点击任意分类按钮
- 查看控制台输出
- 再次点击同一分类或其他分类
- 观察状态变化

### 4. 预期的控制台输出
```
PracticePage render - selectedCategory:  selectedTags: []
Category clicked: React Current: 
handleCategoryChange called with: React
PracticePage render - selectedCategory: React selectedTags: []
```

### 5. 检查项目
- [ ] 状态是否正确更新
- [ ] GraphQL 查询是否重新执行
- [ ] UI 是否正确反映状态变化

## 🔧 可能的问题和解决方案

### 问题1: 状态更新不触发重新渲染
**症状**: 控制台显示状态更新但UI不变化
**解决**: 检查组件key或强制重新渲染

### 问题2: GraphQL 缓存问题
**症状**: 状态更新但查询结果不变
**解决**: 已添加 `fetchPolicy: 'cache-and-network'`

### 问题3: 事件冒泡或preventDefault
**症状**: 点击事件不触发或被阻止
**解决**: 检查Badge组件的点击事件处理

### 问题4: 状态闭包问题
**症状**: 状态更新使用旧值
**解决**: 使用函数式更新或useCallback

## 🚀 测试用例

### 测试用例1: 分类筛选
1. 点击 "React" 分类
2. 预期: 只显示React相关项目
3. 再次点击 "React"
4. 预期: 显示所有项目

### 测试用例2: 标签筛选
1. 点击 "TypeScript" 标签
2. 预期: 只显示TypeScript相关项目
3. 再次点击 "TypeScript"
4. 预期: 显示所有项目

### 测试用例3: 组合筛选
1. 点击 "React" 分类
2. 再点击 "TypeScript" 标签
3. 预期: 显示既是React又包含TypeScript的项目

如果问题依然存在，请提供控制台的完整输出。