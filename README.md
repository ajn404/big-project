# 全栈学习实践项目

基于 pnpm monorepo 的全栈学习平台，使用 NestJS + GraphQL 后端和 React + Three.js 前端。

## 技术栈

### 后端
- **NestJS**: Node.js 框架
- **GraphQL**: API 查询语言
- **PostgreSQL 18**: 数据库
- **TypeORM**: ORM 映射
- **Code First**: GraphQL Schema 自动生成

### 前端
- **React 18**: 前端框架
- **ShadCN UI**: 组件库
- **Three.js**: 3D 渲染
- **MDX**: Markdown + JSX
- **Tailwind CSS**: 样式框架

### 开发工具
- **TypeScript**: 类型安全
- **pnpm**: 包管理器
- **ESLint**: 代码检查
- **Prettier**: 代码格式化

## 项目结构

```
├── packages/           # 共享包
│   ├── shared-types/   # 共享类型定义
│   └── ui-components/  # 共享UI组件
├── apps/              # 应用程序
│   ├── backend/       # NestJS 后端
│   └── frontend/      # React 前端
└── docs/              # 文档
```

## 快速开始

### 前置要求
- Node.js 18+
- pnpm 8+
- PostgreSQL 18

### 安装依赖
```bash
pnpm install
```

### 开发环境
```bash
# 同时启动前后端开发服务器
pnpm dev

# 单独启动后端
pnpm --filter backend dev

# 单独启动前端
pnpm --filter frontend dev
```

### 构建
```bash
pnpm build
```

## 功能特性

### 后端功能
- ✅ GraphQL API
- ✅ PostgreSQL 数据库连接
- ✅ 自动生成 GraphQL Schema
- ✅ CRUD 操作
- ✅ 实践节点管理

### 前端功能
- ✅ 时间轴首页
- ✅ 实践节点展示
- ✅ MDX 文章渲染
- ✅ Three.js 3D 效果
- ✅ 亮暗色主题
- ✅ 搜索功能
- ✅ 响应式设计

## 开发指南

### 添加新的实践节点
1. 在后端创建数据模型
2. 添加 GraphQL 解析器
3. 在前端创建对应页面
4. 更新导航菜单

### 共享类型
所有前后端共享的类型定义都在 `packages/shared-types` 中，确保类型安全。

## 部署

TODO: 添加部署说明

## 贡献

欢迎提交 Issue 和 Pull Request！