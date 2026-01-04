# 🚀 Full-Stack Learning Platform

<div align="center">

![](./screenshot/output.gif)

**[中文](README.md)** | English

A modern full-stack learning platform built with **pnpm monorepo** architecture, providing comprehensive content management, MDX editing, asset management, and interactive learning experience.

![Tech Stack](https://img.shields.io/badge/NestJS-GraphQL-red) ![Frontend](https://img.shields.io/badge/React-TypeScript-blue) ![UI](https://img.shields.io/badge/ShadCN-TailwindCSS-green) ![3D](https://img.shields.io/badge/Three.js-WebGL-orange) ![Asset](https://img.shields.io/badge/Asset-Management-purple)

</div>

## ✨ Core Features

### 🎯 **Smart Content Management**
- **🖋️ Enhanced MDX Editor** - Real-time preview, syntax highlighting, component insertion
- **📝 Practice Management** - Complete CRUD operations with categories, tags, difficulty levels
- **🔍 Intelligent Search** - Full-text search, category filtering, tag filtering
- **📊 Content Organization** - Timeline display, grid layout, detail pages

### 🗄️ **Complete Asset Management**
- **📤 File Upload** - Drag & drop, batch upload, progress display
- **🖼️ Image Editor** - Rotate, flip, brightness adjustment
- **📁 Folder System** - Organize assets with folder structure
- **🔗 MDX Integration** - Direct asset selection in editor

### 🎨 **Rich Component Ecosystem**
- **🔄 Auto-Registration** - Smart component auto-registration system
- **📝 VSCode Snippets** - 4 types of component templates
- **🎭 Interactive Components** - Charts, 3D scenes, creative visualizations
- **🔧 Custom Syntax** - `:::component:::` syntax, perfect Markdown compatibility

### 🌈 **Modern User Experience**
- **🌓 Theme Toggle** - Complete light/dark theme support
- **📱 Responsive Design** - Perfect for desktop and mobile
- **🎪 3D Visual Effects** - Three.js powered immersive experience
- **⚡ Performance Optimized** - Code splitting, lazy loading, caching

## 🛠️ Tech Stack

### 🔥 **Backend Architecture**
```
NestJS + GraphQL + TypeORM + PostgreSQL + REST API
```
- **🚀 NestJS** - Enterprise-grade Node.js framework
- **📊 GraphQL** - Modern API query language
- **🗄️ PostgreSQL** - Reliable relational database
- **🔗 TypeORM** - Powerful object-relational mapping
- **📡 REST API** - File upload and asset management
- **⚙️ Code First** - Auto-generated GraphQL schema

### 🎨 **Frontend Technology**
```
React 18 + TypeScript + ShadCN + Tailwind CSS + Apollo Client
```
- **⚛️ React 18** - Modern frontend framework
- **📘 TypeScript** - Type-safe JavaScript
- **🎭 ShadCN UI** - High-quality component library
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🌐 Three.js** - Powerful 3D rendering engine
- **🔗 Apollo Client** - GraphQL client with caching

### 📦 **Development Tools**
- **📦 pnpm** - Fast, disk space efficient package manager
- **🔍 ESLint + Prettier** - Code quality assurance
- **🔄 Hot Reload** - Real-time updates during development
- **🔗 Shared Types** - Frontend-backend type sharing
- **📝 VSCode Snippets** - Component development templates

## 📁 Project Architecture

```
📁 fullstack-learning-practice/
├── 📁 packages/              # Shared packages
│   ├── 📁 shared-types/      # 🔗 Shared type definitions
│   └── 📁 ui-components/     # 🎨 Reusable UI component library
│       ├── 📁 src/components/
│       │   ├── 📁 ui/        # Basic UI components
│       │   ├── 📁 charts/    # Chart components
│       │   ├── 📁 creative/  # Creative components
│       │   ├── 📁 interactive/ # Interactive demos
│       │   └── 📁 three/     # 3D components
│       └── 📁 auto-register.ts # Auto-registration system
├── 📁 apps/                  # Core applications
│   ├── 📁 backend/           # 🔥 NestJS GraphQL backend
│   │   ├── 📁 src/asset/     # 🗄️ Asset management
│   │   ├── 📁 src/folder/    # 📁 Folder system
│   │   ├── 📁 src/category/  # 📂 Category management
│   │   ├── 📁 src/tag/       # 🏷️ Tag management
│   │   ├── 📁 src/practice-node/ # 📝 Practice node module
│   │   ├── 📁 src/ui-component/ # 🧩 Component management
│   │   └── 📁 src/database/  # 🗄️ Database configuration
│   └── 📁 frontend/          # ⚛️ React frontend application
│       ├── 📁 src/components/ # 🧩 Reusable components
│       ├── 📁 src/pages/     # 📄 Page components
│       │   ├── home.tsx      # 🏠 Homepage with timeline
│       │   ├── practice-manage.tsx # 📝 Practice management
│       │   ├── asset-manage.tsx # 🗄️ Asset management
│       │   └── component-manage.tsx # 🧩 Component management
│       ├── 📁 src/hooks/     # 🪝 Custom hooks
│       └── 📁 src/lib/       # 🔧 Utilities and configs
├── 📁 docs/                  # 📚 Project documentation
└── 📁 scripts/              # 🔨 Build and deployment scripts
```

## 🚀 Quick Start

### 📋 **Requirements**
- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0  
- **PostgreSQL** >= 14.0

### ⚡ **One-Click Setup**
```bash
# 1. Clone repository
git clone <repository-url>
cd fullstack-learning-practice

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 4. Start development servers
pnpm dev
```

### 🔧 **Configuration**
```bash
# Backend configuration (apps/backend/.env)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=learning_platform

# Frontend configuration (apps/frontend/.env)
VITE_GRAPHQL_ENDPOINT=http://localhost:3001/graphql
```

### 🏃‍♂️ **Development Commands**
```bash
# Start both frontend and backend
pnpm dev

# Start backend only (port: 3001)
pnpm --filter backend dev

# Start frontend only (port: 3001)
pnpm --filter frontend dev

# Build for production
pnpm build

# Code linting and formatting
pnpm lint
```

### 🌐 **Access URLs**
- **Frontend**: http://localhost:3001
- **Backend GraphQL**: http://localhost:3001/graphql
- **Asset Management**: http://localhost:3001/asset-manage
- **Component Management**: http://localhost:3001/component-manage

## ✨ Key Features

### 📝 **Enhanced MDX Editor**
Our MDX editor supports rich component syntax:

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

- make something boring but ......











