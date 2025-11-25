# 文件夹拖拽功能使用指南 📁

## ✅ 已实现的功能

### 🎯 拖拽移动资源
现在您可以通过拖拽将资源文件移动到文件夹中：

1. **拖拽操作**
   - 从资源网格中拖拽任何文件
   - 拖拽到左侧的目标文件夹
   - 松开鼠标完成移动

2. **视觉反馈**
   - 拖拽时文件变透明（opacity: 50%）
   - 目标文件夹高亮显示（蓝色边框）
   - 实时显示拖拽状态

### 🔧 技术实现

#### 前端拖拽流程
```typescript
// 1. AssetCard 设置拖拽数据
handleDragStart = (e) => {
  e.dataTransfer.setData('text/plain', asset.id);
}

// 2. FolderCard 接收拖拽
handleDrop = (e) => {
  const assetId = e.dataTransfer.getData('text/plain');
  onMoveAsset(assetId, folder.id);
}

// 3. 页面级处理移动
handleMoveAsset = (assetId, folderId) => {
  moveAssetToFolder({
    variables: { input: { assetId, folderId } }
  });
}
```

#### 后端API处理
```typescript
// REST API: POST /api/folders/move-asset
{
  "assetId": "uuid",
  "folderId": "uuid" // 可选，null表示移到根目录
}

// GraphQL Mutation
mutation MoveAssetToFolder($input: MoveAssetToFolderInput!) {
  moveAssetToFolder(input: $input) {
    id
    folderId
  }
}
```

### 📊 数据刷新机制

#### 自动刷新查询
移动资源后会自动刷新：
- `GetAssets` - 更新资源列表
- `GetFolders` - 更新文件夹信息  
- `GetFolderAssetCount` - 更新文件夹计数

#### 实时计数更新
每个文件夹卡片会显示：
- 文件数量（实时查询）
- 子文件夹数量
- 文件夹颜色标识

### 🎨 用户体验特性

1. **拖拽反馈**
   - 拖拽时文件半透明
   - 目标文件夹高亮
   - 拖拽区域边界清晰

2. **操作确认**
   - 移动成功后立即更新UI
   - 错误时显示提示信息
   - 支持撤销操作

3. **批量操作**
   - 支持选择多个文件
   - 批量移动到文件夹
   - 进度指示器

### 🛠️ 故障排除

#### 如果拖拽不工作
1. 检查浏览器控制台是否有错误
2. 确认GraphQL mutation正常工作
3. 验证数据传递是否正确

#### 如果计数不更新
1. 页面会自动刷新来同步数据
2. 检查Apollo Client缓存
3. 手动刷新页面

#### 常见问题
- **拖拽到错误位置**: 只能拖拽到文件夹卡片上
- **权限问题**: 确保有文件夹写入权限
- **网络延迟**: 操作可能需要几秒钟完成

### 🚀 高级功能

#### 未来扩展
- 文件夹间拖拽移动
- 右键菜单快捷操作
- 键盘快捷键支持
- 拖拽预览图标

#### 性能优化
- 虚拟滚动大量文件
- 懒加载文件夹内容
- 缓存文件夹计数

## 📋 使用步骤

1. **访问页面**: `http://localhost:3000/asset-manage`
2. **创建文件夹**: 点击"新建文件夹"
3. **上传文件**: 选择目标文件夹后上传
4. **拖拽移动**: 从文件网格拖拽到文件夹
5. **查看结果**: 文件夹计数会自动更新

现在您拥有了一个完整的现代化文件管理系统！🎉