# 资源库文件夹功能实现总结

## 功能概述

本次实现为资源库添加了完整的文件夹功能，支持：
- 创建、编辑、删除文件夹
- 文件夹层级结构（支持嵌套）
- 资源文件上传到指定文件夹
- 拖拽移动资源到文件夹
- 面包屑导航

## 后端实现

### 数据库变更

1. **新增文件夹表** (`folders`)
   - `id`: UUID 主键
   - `name`: 文件夹名称
   - `description`: 文件夹描述（可选）
   - `parentId`: 父文件夹ID（支持嵌套）
   - `color`: 文件夹颜色标识
   - `createdAt`, `updatedAt`: 时间戳

2. **修改资源表** (`assets`)
   - 新增 `folderId` 字段关联文件夹

### 新增实体和服务

- `Folder` 实体 (`apps/backend/src/database/entities/folder.entity.ts`)
- `FolderService` 服务 (`apps/backend/src/folder/folder.service.ts`)
- `FolderController` REST API (`apps/backend/src/folder/folder.controller.ts`)
- `FolderResolver` GraphQL API (`apps/backend/src/folder/folder.resolver.ts`)

### API 端点

#### REST API
- `POST /folders` - 创建文件夹
- `GET /folders?parentId=xxx` - 获取文件夹列表
- `GET /folders/:id` - 获取单个文件夹
- `PUT /folders/:id` - 更新文件夹
- `DELETE /folders/:id` - 删除文件夹
- `POST /folders/move-asset` - 移动单个资源
- `POST /folders/move-assets` - 批量移动资源

#### GraphQL API
- `createFolder(input: CreateFolderInput!)` - 创建文件夹
- `folders(parentId: ID)` - 查询文件夹
- `updateFolder(input: UpdateFolderInput!)` - 更新文件夹
- `removeFolder(id: ID!)` - 删除文件夹
- `moveAssetToFolder(input: MoveAssetToFolderInput!)` - 移动资源

### 更新的服务

- `AssetService`: 增加 `folderId` 过滤参数
- `AssetController`: 支持按文件夹过滤
- `AssetResolver`: GraphQL 查询支持文件夹参数

## 前端实现

### 新增组件

1. **FolderManager** (`apps/frontend/src/components/folder-manager.tsx`)
   - 文件夹树形视图
   - 创建/编辑/删除文件夹
   - 拖拽接收功能

2. **更新 AssetManager** (`apps/frontend/src/components/asset-manager.tsx`)
   - 集成文件夹侧边栏
   - 支持文件夹过滤
   - 资源拖拽功能

3. **更新 AssetUpload** (`apps/frontend/src/components/asset-upload.tsx`)
   - 支持上传到指定文件夹

### 新增类型定义

- `Folder` 接口 (`apps/frontend/src/types/folder.ts`)
- GraphQL 查询 (`apps/frontend/src/lib/graphql/folder-queries.ts`)

### 页面更新

- **资产管理页面** (`apps/frontend/src/pages/asset-manage.tsx`)
  - 面包屑导航
  - 文件夹状态管理

## 主要功能特性

### 1. 文件夹管理
- ✅ 创建文件夹（支持颜色选择）
- ✅ 编辑文件夹名称、描述、颜色
- ✅ 删除文件夹（需要为空）
- ✅ 嵌套文件夹结构

### 2. 资源管理
- ✅ 上传文件到指定文件夹
- ✅ 按文件夹过滤资源
- ✅ 拖拽移动资源到文件夹
- ✅ 批量移动资源

### 3. 用户界面
- ✅ 文件夹树形视图
- ✅ 面包屑导航
- ✅ 拖拽交互
- ✅ 响应式布局

## 使用方法

### 创建文件夹
1. 在资产管理页面左侧点击"新建文件夹"
2. 输入文件夹名称、描述
3. 选择文件夹颜色
4. 点击"创建文件夹"

### 上传文件到文件夹
1. 选择目标文件夹（左侧文件夹列表）
2. 点击"上传资源"
3. 选择文件上传（自动关联到当前文件夹）

### 移动文件到文件夹
1. 拖拽资源卡片到左侧文件夹
2. 或使用批量移动功能

### 浏览文件夹
1. 点击左侧文件夹进入
2. 使用面包屑导航返回上级

## 技术要点

### 循环依赖解决
- 使用字符串引用避免 TypeORM 实体循环依赖
- 采用 `type` 导入减少编译时依赖

### 拖拽实现
- HTML5 拖拽 API
- 视觉反馈（拖拽状态、目标高亮）
- 拖拽数据传递资源ID

### 状态管理
- React useState 管理当前文件夹
- Apollo Client 缓存同步
- 乐观更新提升用户体验

## 下一步优化

1. **权限控制**: 文件夹访问权限
2. **搜索功能**: 跨文件夹搜索
3. **批量操作**: 文件夹批量管理
4. **快捷操作**: 右键菜单、快捷键
5. **性能优化**: 虚拟滚动、懒加载

## 文件清单

### 后端文件
- `apps/backend/src/database/entities/folder.entity.ts`
- `apps/backend/src/folder/folder.service.ts`
- `apps/backend/src/folder/folder.controller.ts`
- `apps/backend/src/folder/folder.resolver.ts`
- `apps/backend/src/folder/folder.module.ts`
- `apps/backend/src/folder/dto/create-folder.input.ts`
- `apps/backend/src/folder/dto/update-folder.input.ts`
- `apps/backend/src/folder/dto/move-asset-to-folder.input.ts`

### 前端文件
- `apps/frontend/src/components/folder-manager.tsx`
- `apps/frontend/src/types/folder.ts`
- `apps/frontend/src/lib/graphql/folder-queries.ts`

### 修改的文件
- `apps/backend/src/database/entities/asset.entity.ts`
- `apps/backend/src/asset/asset.service.ts`
- `apps/backend/src/asset/asset.controller.ts`
- `apps/backend/src/asset/asset.resolver.ts`
- `apps/backend/src/asset/dto/create-asset.input.ts`
- `apps/backend/src/asset/dto/update-asset.input.ts`
- `apps/frontend/src/components/asset-manager.tsx`
- `apps/frontend/src/components/asset-upload.tsx`
- `apps/frontend/src/pages/asset-manage.tsx`
- `apps/frontend/src/types/asset.ts`
- `apps/frontend/src/lib/graphql/asset-queries.ts`

这个实现提供了完整的文件夹管理功能，支持现代化的拖拽交互和直观的用户界面。