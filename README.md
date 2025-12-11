# 🚀 全栈学习实践平台 | Full-Stack Learning Platform

<div align="center">

![](./screenshot/output.gif)

**English** | [中文](#中文文档)

A modern full-stack learning platform built with **pnpm monorepo** architecture, providing comprehensive content management, MDX editing, asset management, and interactive learning experience.

![技术栈](https://img.shields.io/badge/NestJS-GraphQL-red) ![前端框架](https://img.shields.io/badge/React-TypeScript-blue) ![UI组件](https://img.shields.io/badge/ShadCN-TailwindCSS-green) ![3D渲染](https://img.shields.io/badge/Three.js-WebGL-orange) ![资源管理](https://img.shields.io/badge/Asset-Management-purple)

</div>

## ✨ Core Features | 核心特性

### 🎯 **Smart Content Management | 智能内容管理系统**
- **🖋️ Enhanced MDX Editor** - Real-time preview, syntax highlighting, component insertion | 增强型MDX编辑器，支持实时预览、语法高亮、组件插入
- **📝 Practice Management** - Complete CRUD operations with categories, tags, difficulty levels | 完整的实践节点管理，支持分类、标签、难度等元数据
- **🔍 Intelligent Search** - Full-text search, category filtering, tag filtering | 智能搜索，支持全文搜索、分类筛选、标签过滤
- **📊 Content Organization** - Timeline display, grid layout, detail pages | 时间轴展示、网格布局、详情页面

### 🗄️ **Complete Asset Management | 完整的资源管理系统**
- **📤 File Upload** - Drag & drop, batch upload, progress display | 拖拽上传、批量上传、进度显示
- **🖼️ Image Editor** - Rotate, flip, brightness adjustment | 图片编辑器，支持旋转、翻转、亮度调整
- **📁 Folder System** - Organize assets with folder structure | 文件夹系统，支持资源分类组织
- **🔗 MDX Integration** - Direct asset selection in editor | MDX编辑器直接选择资源

### 🎨 **Rich Component Ecosystem | 丰富的组件生态**
- **🔄 Auto-Registration** - Smart component auto-registration system | 智能组件自动注册系统
- **📝 VSCode Snippets** - 4 types of component templates | 4种组件模板snippets
- **🎭 Interactive Components** - Charts, 3D scenes, creative visualizations | 交互组件、图表、3D场景、创意可视化
- **🔧 Custom Syntax** - `:::component:::` syntax, perfect Markdown compatibility | 自定义语法，完美兼容Markdown

### 🌈 **Modern User Experience | 现代化用户体验**
- **🌓 Theme Toggle** - Complete light/dark theme support | 完整的亮色/暗色主题支持
- **📱 Responsive Design** - Perfect for desktop and mobile | 完美适配桌面和移动设备
- **🎪 3D Visual Effects** - Three.js powered immersive experience | Three.js驱动的沉浸式体验
- **⚡ Performance Optimized** - Code splitting, lazy loading, caching | 代码分割、懒加载、缓存策略

## 🛠️ Tech Stack | 技术栈

### 🔥 **Backend Architecture | 后端架构**
```
NestJS + GraphQL + TypeORM + PostgreSQL + REST API
```
- **🚀 NestJS** - Enterprise-grade Node.js framework | 企业级Node.js框架
- **📊 GraphQL** - Modern API query language | 现代化API查询语言
- **🗄️ PostgreSQL** - Reliable relational database | 可靠的关系型数据库
- **🔗 TypeORM** - Powerful object-relational mapping | 强大的对象关系映射
- **📡 REST API** - File upload and asset management | 文件上传和资源管理API
- **⚙️ Code First** - Auto-generated GraphQL schema | 自动生成GraphQL Schema

### 🎨 **Frontend Technology | 前端技术**
```
React 18 + TypeScript + ShadCN + Tailwind CSS + Apollo Client
```
- **⚛️ React 18** - Modern frontend framework | 现代化前端框架
- **📘 TypeScript** - Type-safe JavaScript | 类型安全的JavaScript
- **🎭 ShadCN UI** - High-quality component library | 高质量组件库
- **🎨 Tailwind CSS** - Utility-first CSS framework | 实用优先的CSS框架
- **🌐 Three.js** - Powerful 3D rendering engine | 强大的3D渲染引擎
- **🔗 Apollo Client** - GraphQL client with caching | GraphQL客户端与缓存

### 📦 **Development Tools | 开发工具**
- **📦 pnpm** - Fast, disk space efficient package manager | 快速、节省空间的包管理器
- **🔍 ESLint + Prettier** - Code quality assurance | 代码质量保证
- **🔄 Hot Reload** - Real-time updates during development | 开发时实时更新
- **🔗 Shared Types** - Frontend-backend type sharing | 前后端类型共享
- **📝 VSCode Snippets** - Component development templates | 组件开发模板

## 📁 Project Architecture | 项目架构

```
📁 fullstack-learning-practice/
├── 📁 packages/              # Shared packages | 共享包
│   ├── 📁 shared-types/      # 🔗 Shared type definitions | 前后端共享类型定义
│   └── 📁 ui-components/     # 🎨 Reusable UI component library | 可复用UI组件库
│       ├── 📁 src/components/
│       │   ├── 📁 ui/        # Basic UI components | 基础UI组件
│       │   ├── 📁 charts/    # Chart components | 图表组件
│       │   ├── 📁 creative/  # Creative components | 创意组件
│       │   ├── 📁 interactive/ # Interactive demos | 交互演示
│       │   └── 📁 three/     # 3D components | 3D组件
│       └── 📁 auto-register.ts # Auto-registration system | 自动注册系统
├── 📁 apps/                  # Core applications | 核心应用
│   ├── 📁 backend/           # 🔥 NestJS GraphQL backend | NestJS GraphQL后端
│   │   ├── 📁 src/asset/     # 🗄️ Asset management | 资源管理模块
│   │   ├── 📁 src/folder/    # 📁 Folder system | 文件夹系统
│   │   ├── 📁 src/category/  # 📂 Category management | 分类管理模块
│   │   ├── 📁 src/tag/       # 🏷️ Tag management | 标签管理模块
│   │   ├── 📁 src/practice-node/ # 📝 Practice node module | 实践节点模块
│   │   ├── 📁 src/ui-component/ # 🧩 Component management | 组件管理
│   │   └── 📁 src/database/  # 🗄️ Database configuration | 数据库配置
│   └── 📁 frontend/          # ⚛️ React frontend application | React前端应用
│       ├── 📁 src/components/ # 🧩 Reusable components | 可复用组件
│       ├── 📁 src/pages/     # 📄 Page components | 页面组件
│       │   ├── home.tsx      # 🏠 Homepage with timeline | 主页时间轴
│       │   ├── practice-manage.tsx # 📝 Practice management | 实践管理
│       │   ├── asset-manage.tsx # 🗄️ Asset management | 资源管理
│       │   └── component-manage.tsx # 🧩 Component management | 组件管理
│       ├── 📁 src/hooks/     # 🪝 Custom hooks | 自定义Hook
│       └── 📁 src/lib/       # 🔧 Utilities and configs | 工具库和配置
├── 📁 docs/                  # 📚 Project documentation | 项目文档
└── 📁 scripts/              # 🔨 Build and deployment scripts | 构建和部署脚本
```

## 🚀 Quick Start | 快速开始

### 📋 **Requirements | 环境要求**
- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0  
- **PostgreSQL** >= 14.0

### ⚡ **One-Click Setup | 一键启动**
```bash
# 1. Clone repository | 克隆项目
git clone <repository-url>
cd fullstack-learning-practice

# 2. Install dependencies | 安装依赖
pnpm install

# 3. Configure environment | 配置环境变量
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 4. Start development servers | 启动开发服务器
pnpm dev
```

### 🔧 **Configuration | 详细配置**
```bash
# Backend configuration | 后端配置 (apps/backend/.env)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=learning_platform

# Frontend configuration | 前端配置 (apps/frontend/.env)
VITE_GRAPHQL_ENDPOINT=http://localhost:3001/graphql
```

### 🏃‍♂️ **Development Commands | 开发命令**
```bash
# Start both frontend and backend | 同时启动前后端
pnpm dev

# Start backend only (port: 3001) | 单独启动后端
pnpm --filter backend dev

# Start frontend only (port: 3001) | 单独启动前端  
pnpm --filter frontend dev

# Build for production | 构建生产版本
pnpm build

# Code linting and formatting | 代码检查和格式化
pnpm lint
```

### 🌐 **Access URLs | 访问地址**
- **Frontend | 前端**: http://localhost:3001
- **Backend GraphQL | 后端GraphQL**: http://localhost:3001/graphql
- **Asset Management | 资源管理**: http://localhost:3001/asset-manage
- **Component Management | 组件管理**: http://localhost:3001/component-manage


如果这个项目对你有帮助，请考虑给一个 ⭐ Star！

---

# 中文文档

## 🎯 核心功能特性

### 📝 **MDX编辑器功能**
我们的MDX编辑器是平台的核心特性之一，支持丰富的组件语法：

```markdown
# 支持的组件类型

## 按钮组件
:::button
立即开始学习
:::

## 提示组件  
:::alert{type="info"}
这是一个信息提示
:::

:::alert{type="warning"}
这是一个警告提示  
:::

## 高亮文本
支持==重要内容高亮==显示
```

### 🗄️ **完整的资源管理系统**
- **📤 文件上传**: 支持拖拽上传、批量上传、进度显示
- **🖼️ 图片编辑**: 内置图片编辑器，支持旋转、翻转、亮度调整
- **📁 文件夹管理**: 完整的文件夹系统，支持资源分类组织
- **🔗 MDX集成**: 在MDX编辑器中直接选择和插入资源

### 🎨 **智能组件系统**
- **🔄 自动注册**: 组件自动发现和注册系统
- **📝 开发模板**: 4种VSCode Snippets模板
- **🎭 丰富组件**: 包含UI、图表、3D、创意等多种类型组件

---

# English Documentation

## ✨ Key Features

### 📝 **Enhanced MDX Editor**
Our MDX editor is one of the core features of the platform, supporting rich component syntax:

```markdown
# Supported Component Types

## Button Component
:::button
Start Learning Now
:::

## Alert Components  
:::alert{type="info"}
This is an info alert
:::

:::alert{type="warning"}
This is a warning alert
:::

## Highlighted Text
Supports ==important content highlighting==
```

### 🗄️ **Complete Asset Management System**
- **📤 File Upload**: Drag & drop, batch upload, progress display
- **🖼️ Image Editor**: Built-in image editor with rotate, flip, brightness adjustment
- **📁 Folder Management**: Complete folder system for asset organization
- **🔗 MDX Integration**: Direct asset selection and insertion in MDX editor

### 🎨 **Smart Component System**
- **🔄 Auto-Registration**: Automatic component discovery and registration
- **📝 Development Templates**: 4 types of VSCode Snippets templates
- **🎭 Rich Components**: Including UI, charts, 3D, creative components

## 🔧 Development Guide

### 📝 **Adding New Practice Nodes**
1. **Backend Development**
   ```typescript
   // 1. Define data model in entity
   // 2. Create GraphQL resolver
   // 3. Implement service business logic
   // 4. Add necessary validation and error handling
   ```

2. **Frontend Development**  
   ```typescript
   // 1. Create corresponding page components
   // 2. Implement GraphQL queries/mutations
   // 3. Add to routing configuration
   // 4. Update navigation menu
   ```

### 🧩 **Adding New MDX Components**
1. **Create Component**
   ```typescript
   // packages/ui-components/src/components/ui/NewComponent.tsx
   import { createAutoRegisterComponent } from '../../auto-register'

   interface NewComponentProps {
     children: React.ReactNode
   }

   function NewComponent({ children }: NewComponentProps) {
     return <div className="new-component">{children}</div>
   }

   export default createAutoRegisterComponent(NewComponent, {
     id: 'new-component',
     name: 'New Component',
     category: 'ui',
     description: 'A new custom component'
   })
   ```

2. **Use VSCode Snippets**
   - Type `arc-ui` in VSCode
   - Fill in component name and details
   - Component will be automatically registered

### 🔗 **Shared Type Management**
```typescript
// packages/shared-types/src/index.ts
export interface PracticeNode {
  id: string
  title: string
  description: string
  content: string
  contentType: 'MDX' | 'COMPONENT'
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  estimatedTime: number
  // ... other fields
}
```

## 🚀 Deployment Guide

### 🐳 **Docker Deployment (Recommended)**
```dockerfile
# Docker deployment will be supported soon
# Complete environment including frontend, backend, and database
```

### 🌐 **Traditional Deployment**
```bash
# 1. Build project
pnpm build

# 2. Deploy backend (PM2 recommended)
cd apps/backend
npm install -g pm2
pm2 start dist/main.js --name "learning-backend"

# 3. Deploy frontend (static file serving)
cd apps/frontend  
# Deploy dist directory to Nginx/Apache web server
```

## 🤝 Contributing Guide

We welcome all forms of contributions!

### 📋 **Contribution Types**
- 🐛 **Bug Fixes** - Find and fix issues
- ✨ **New Features** - Add useful new functionality  
- 📚 **Documentation** - Improve project documentation
- 🎨 **UI/UX Improvements** - Enhance user experience
- ⚡ **Performance Optimization** - Improve system performance

### 🔄 **Contribution Process**
1. **Fork** the project and create a feature branch
2. **Write code** and ensure tests pass
3. **Commit changes** with clear commit messages
4. **Create Pull Request** with detailed description of changes

## 📊 Project Status

### ✅ **Completed Features**
- [x] 🏗️ Complete monorepo architecture
- [x] 🔥 NestJS + GraphQL backend API
- [x] ⚛️ React + TypeScript frontend
- [x] 🗄️ PostgreSQL database integration
- [x] 📝 Enhanced MDX editor
- [x] 🎨 Rich component system
- [x] 🗄️ Complete asset management
- [x] 📁 Folder system
- [x] 🔄 Component auto-registration
- [x] 🔍 Search and filtering
- [x] 🌓 Theme toggle
- [x] 📱 Responsive design
- [x] 🎭 Three.js 3D effects

### 🚧 **In Development**
- [ ] 👤 User authentication system
- [ ] 📊 Learning progress tracking
- [ ] 💬 Comments and interaction features
- [ ] 📈 Data visualization
- [ ] 🐳 Docker deployment solution

### 💡 **Future Plans**
- [ ] 🤖 AI-powered content recommendations
- [ ] 📱 Mobile PWA application
- [ ] 🎮 Gamified learning experience
- [ ] 🌍 Multi-language internationalization
- [ ] ☁️ Cloud synchronization features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Thanks to all contributors and the open source community!

### 🔗 **Related Resources**
- [NestJS Documentation](https://nestjs.com/)
- [React Documentation](https://react.dev/)
- [GraphQL Learning Guide](https://graphql.org/learn/)
- [ShadCN UI Component Library](https://ui.shadcn.com/)
- [Three.js Documentation](https://threejs.org/docs/)

---

**🎯 Make learning more efficient and knowledge more interesting!**

If this project helps you, please consider giving it a ⭐ Star!