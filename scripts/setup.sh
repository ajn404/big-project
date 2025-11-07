#!/bin/bash

echo "🚀 设置全栈学习实践项目..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装。请安装 Node.js 18+ 版本。"
    exit 1
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 安装 pnpm..."
    npm install -g pnpm
fi

# 检查 PostgreSQL
if ! command -v psql-18 &> /dev/null; then
    echo "⚠️  PostgreSQL 未安装。请先安装 PostgreSQL 18。"
    echo "   macOS: brew install postgresql@18"
    echo "   Ubuntu: sudo apt-get install postgresql-18"
    exit 1
fi

echo "📦 安装依赖..."
pnpm install

echo "🏗️  构建共享类型包..."
pnpm --filter @learning-practice/shared-types build

echo "📋 设置环境变量..."

# 后端环境变量
if [ ! -f "apps/backend/.env" ]; then
    cp apps/backend/.env.example apps/backend/.env
    echo "✅ 创建后端环境变量文件: apps/backend/.env"
    echo "   请编辑此文件配置数据库连接信息"
fi

# 前端环境变量
if [ ! -f "apps/frontend/.env" ]; then
    cp apps/frontend/.env.example apps/frontend/.env
    echo "✅ 创建前端环境变量文件: apps/frontend/.env"
fi

echo ""
echo "🎉 项目设置完成！"
echo ""
echo "📝 下一步："
echo "   1. 配置数据库连接: 编辑 apps/backend/.env"
echo "   2. 创建数据库: createdb learning_practice"
echo "   3. 启动开发服务器: pnpm dev"
echo ""
echo "🔗 访问地址："
echo "   前端: http://localhost:3000"
echo "   后端 GraphQL: http://localhost:3001/graphql"
echo ""