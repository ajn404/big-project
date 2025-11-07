# 🚀 快速开始

欢迎使用全栈学习实践平台！这是一个基于 NestJS + React + Three.js 的现代化学习平台。

## 📋 前置要求

确保你的系统已安装以下软件：

- **Node.js** 18+ ([下载链接](https://nodejs.org/))
- **pnpm** 8+ (`npm install -g pnpm`)
- **PostgreSQL** 18 ([安装指南](https://www.postgresql.org/download/))

## ⚡ 一键设置

运行自动化设置脚本：

```bash
# 克隆项目（如果需要）
git clone <your-repo-url>
cd fullstack-learning-practice

# 运行设置脚本
./scripts/setup.sh
```

## 🔧 手动设置

如果自动化脚本失败，可以手动执行以下步骤：

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置数据库

```bash
# 创建数据库
createdb learning_practice

# 创建用户（可选）
psql -d learning_practice -c "CREATE USER postgres WITH PASSWORD 'password';"
```

### 3. 配置环境变量

```bash
# 后端配置
cp apps/backend/.env.example apps/backend/.env
# 编辑 apps/backend/.env 文件，设置数据库连接信息

# 前端配置
cp apps/frontend/.env.example apps/frontend/.env
```

### 4. 构建共享包

```bash
pnpm --filter @learning-practice/shared-types build
```

## 🎯 启动应用

### 同时启动前后端

```bash
pnpm dev
```

### 分别启动

```bash
# 启动后端 (端口 3001)
pnpm --filter backend dev

# 启动前端 (端口 3000)
pnpm --filter frontend dev
```

## 🌐 访问应用

- **前端应用**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3001/graphql

## 📝 添加示例数据

访问 GraphQL Playground (http://localhost:3001/graphql) 并执行：

```graphql
mutation CreateSampleData {
  createPracticeNode(createPracticeNodeInput: {
    title: "React Hooks 完全指南"
    description: "深入理解 React Hooks 的工作原理和最佳实践"
    content: "# React Hooks 完全指南\n\n## 什么是 Hooks？\n\nHooks 是 React 16.8 引入的新特性，它让你无需编写 class 就能使用 state 和其他 React 特性。\n\n## 基础 Hooks\n\n### useState\n\n```javascript\nconst [count, setCount] = useState(0);\n```\n\n### useEffect\n\n```javascript\nuseEffect(() => {\n  document.title = `点击了 ${count} 次`;\n}, [count]);\n```"
    contentType: MDX
    categoryName: "前端开发"
    tagNames: ["React", "JavaScript", "Hooks", "前端"]
    difficulty: INTERMEDIATE
    estimatedTime: 60
    prerequisites: ["JavaScript ES6+", "React 基础"]
  }) {
    id
    title
    category { name }
    tags { name }
  }
}

mutation CreateComponentExample {
  createPracticeNode(createPracticeNodeInput: {
    title: "Three.js 3D 场景演示"
    description: "学习如何使用 Three.js 创建交互式 3D 场景"
    contentType: COMPONENT
    componentName: "ThreeScene"
    categoryName: "3D 开发"
    tagNames: ["Three.js", "WebGL", "3D", "JavaScript"]
    difficulty: ADVANCED
    estimatedTime: 90
    prerequisites: ["JavaScript", "3D 数学基础"]
  }) {
    id
    title
    componentName
  }
}
```

## 🏗️ 项目结构

```
📁 fullstack-learning-practice/
├── 📁 packages/              # 共享包
│   ├── 📁 shared-types/      # 共享类型定义
│   └── 📁 ui-components/     # 共享UI组件
├── 📁 apps/                  # 应用程序
│   ├── 📁 backend/           # NestJS 后端
│   └── 📁 frontend/          # React 前端
├── 📁 docs/                  # 文档
├── 📁 scripts/               # 脚本
└── 📄 README.md
```

## 🎨 主要功能

### 已实现
- ✅ 实践项目管理 (CRUD)
- ✅ 分类和标签系统
- ✅ 搜索和筛选
- ✅ MDX 文章渲染
- ✅ React 组件展示
- ✅ Three.js 3D 效果
- ✅ 响应式设计
- ✅ 亮暗色主题

### 计划中
- 🔄 用户系统
- 🔄 学习进度跟踪
- 🔄 在线编辑器
- 🔄 评论系统

## 🛠️ 开发命令

```bash
# 开发
pnpm dev                    # 启动开发服务器
pnpm --filter backend dev   # 仅启动后端
pnpm --filter frontend dev  # 仅启动前端

# 构建
pnpm build                  # 构建所有包
pnpm --filter backend build # 仅构建后端
pnpm --filter frontend build # 仅构建前端

# 测试
pnpm test                   # 运行所有测试
pnpm lint                   # 代码检查

# 清理
pnpm clean                  # 清理构建文件
```

## 🆘 故障排除

### 数据库连接问题
```bash
# 检查 PostgreSQL 是否运行
brew services list | grep postgresql

# 重启 PostgreSQL
brew services restart postgresql@18
```

### 端口占用
```bash
# 查看端口占用
lsof -i :3000  # 前端端口
lsof -i :3001  # 后端端口

# 杀死进程
kill -9 <PID>
```

### 依赖问题
```bash
# 清理并重新安装
pnpm clean
rm -rf node_modules
pnpm install
```

## 📚 更多文档

- [详细设置指南](docs/setup.md)
- [功能特性列表](docs/features.md)
- [API 文档](apps/backend/README.md)
- [前端组件文档](apps/frontend/README.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**祝你学习愉快！** 🎉