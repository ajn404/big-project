# 项目设置指南

## 前置要求

- Node.js 18+
- pnpm 8+
- PostgreSQL 18

## 数据库设置

### macOS 安装 PostgreSQL

```bash
# 使用 Homebrew 安装
brew install postgresql@18

# 启动服务
brew services start postgresql@18

# 创建数据库
createdb learning_practice

# 创建用户（可选）
psql -d learning_practice -c "CREATE USER postgres WITH PASSWORD 'password';"
psql -d learning_practice -c "GRANT ALL PRIVILEGES ON DATABASE learning_practice TO postgres;"
```

### 配置环境变量

```bash
# 后端环境变量
cd apps/backend
cp .env.example .env

# 编辑 .env 文件，配置数据库连接
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=learning_practice
```

```bash
# 前端环境变量
cd apps/frontend
cp .env.example .env

# 配置 GraphQL 端点
VITE_GRAPHQL_URL=http://localhost:3001/graphql
```

## 安装与运行

```bash
# 安装依赖
pnpm install

# 构建共享类型包
pnpm --filter @learning-practice/shared-types build

# 同时启动前后端
pnpm dev

# 或者分别启动
pnpm --filter backend dev    # 后端：http://localhost:3001
pnpm --filter frontend dev   # 前端：http://localhost:3000
```

## 验证安装

1. 后端 GraphQL Playground: http://localhost:3001/graphql
2. 前端应用: http://localhost:3000

## 添加示例数据

在 GraphQL Playground 中执行以下 mutation 来添加示例数据：

```graphql
mutation CreateExampleNode {
  createPracticeNode(createPracticeNodeInput: {
    title: "React Hooks 入门"
    description: "学习 React Hooks 的基本概念和使用方法"
    content: "# React Hooks 入门\n\nReact Hooks 是 React 16.8 引入的新特性..."
    contentType: MDX
    categoryName: "前端开发"
    tagNames: ["React", "JavaScript", "Hooks"]
    difficulty: BEGINNER
    estimatedTime: 45
    prerequisites: ["JavaScript 基础", "React 基础"]
  }) {
    id
    title
    category {
      name
    }
    tags {
      name
    }
  }
}
```

## 构建生产版本

```bash
# 构建所有包
pnpm build

# 启动生产服务器
pnpm start
```

## 故障排除

### 数据库连接问题

1. 确保 PostgreSQL 服务正在运行
2. 检查数据库凭据
3. 确认数据库已创建

### 端口冲突

- 后端默认端口：3001
- 前端默认端口：3000
- 可在环境变量中修改

### 依赖问题

```bash
# 清理并重新安装
pnpm clean
rm -rf node_modules
pnpm install
```