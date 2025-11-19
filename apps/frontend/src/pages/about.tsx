import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui-components'
import { Badge } from '@workspace/ui-components'
import { Code, Database, Palette, Zap } from 'lucide-react'

export function AboutPage() {
  const technologies = [
    {
      category: '后端技术',
      icon: Database,
      items: ['NestJS', 'GraphQL', 'PostgreSQL', 'TypeORM', 'TypeScript']
    },
    {
      category: '前端技术', 
      icon: Code,
      items: ['React 18', 'TypeScript', 'Vite', 'Apollo Client', 'React Router']
    },
    {
      category: 'UI & 设计',
      icon: Palette,
      items: ['Tailwind CSS', 'ShadCN UI', 'Radix UI', 'Lucide Icons', 'Framer Motion']
    },
    {
      category: '3D & 交互',
      icon: Zap,
      items: ['Three.js', 'React Three Fiber', 'React Three Drei', 'MDX']
    }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">关于项目</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          这是一个基于现代Web技术栈构建的全栈学习实践平台，旨在通过实际项目帮助开发者掌握前沿技术。
        </p>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>项目概览</CardTitle>
          <CardDescription>
            全栈学习实践平台的核心特性和目标
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">🎯 项目目标</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 提供现代Web开发技术的实践平台</li>
                <li>• 通过项目实战提升开发技能</li>
                <li>• 构建可扩展的学习内容管理系统</li>
                <li>• 支持多种内容格式（MDX、React组件）</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✨ 核心特性</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• pnpm monorepo 架构</li>
                <li>• GraphQL API 与自动 Schema 生成</li>
                <li>• 响应式设计与暗色模式</li>
                <li>• Three.js 3D 可视化效果</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">技术栈</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {technologies.map((tech) => {
            const Icon = tech.icon
            return (
              <Card key={tech.category}>
                <CardHeader className="text-center">
                  <Icon className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <CardTitle className="text-lg">{tech.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tech.items.map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Architecture */}
      <Card>
        <CardHeader>
          <CardTitle>项目架构</CardTitle>
          <CardDescription>
            基于 pnpm monorepo 的项目结构设计
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">📁 目录结构</h3>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`├── packages/           # 共享包
│   ├── shared-types/   # 共享类型定义
│   └── ui-components/  # 共享UI组件
├── apps/              # 应用程序
│   ├── backend/       # NestJS 后端
│   └── frontend/      # React 前端
└── docs/              # 文档`}
              </pre>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">后端架构</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• NestJS 模块化架构</li>
                  <li>• GraphQL Code First 模式</li>
                  <li>• TypeORM 数据库映射</li>
                  <li>• PostgreSQL 数据存储</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">前端架构</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• React 18 + TypeScript</li>
                  <li>• Apollo Client 状态管理</li>
                  <li>• React Router 路由管理</li>
                  <li>• ShadCN UI 组件系统</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>快速开始</CardTitle>
          <CardDescription>
            如何在本地环境运行这个项目
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">前置要求</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">Node.js 18+</Badge>
                <Badge variant="outline">pnpm 8+</Badge>
                <Badge variant="outline">PostgreSQL 18</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">安装与运行</h3>
              <pre className="bg-muted p-4 rounded-lg text-sm">
{`# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建项目
pnpm build`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}