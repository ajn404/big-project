import { useQuery } from '@apollo/client'
import { GET_PRACTICE_NODES } from '@/lib/graphql/queries'
import { Timeline } from '@/components/timeline'
import { ThreeScene } from '@/components/three/scene'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, TrendingUp } from 'lucide-react'

export function HomePage() {
  const { data, loading, error } = useQuery(GET_PRACTICE_NODES)

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>

  const practiceNodes = data?.practiceNodes || []
  const recentNodes = practiceNodes.slice(0, 6)
  const totalNodes = practiceNodes.length
  const totalTime = practiceNodes.reduce((sum: number, node: any) => sum + (node.estimatedTime || 0), 0)

  return (
    <div className="space-y-8">
      {/* Hero Section with 3D Scene */}
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="mb-4 text-4xl font-bold lg:text-6xl">
            全栈学习实践平台
          </h1>
          <p className="mb-6 text-xl text-blue-100">
            探索现代Web开发技术，通过实践项目提升技能
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/practice">开始实践</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-black dark:text-white">
              <Link to="/about">了解更多</Link>
            </Button>
          </div>
        </div>
        
        {/* 3D Scene Background */}
        <div className="absolute inset-0 opacity-30">
          <ThreeScene />
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">实践项目</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNodes}</div>
            <p className="text-xs text-muted-foreground">
              涵盖前端、后端、全栈
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">学习时长</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalTime / 60)}h</div>
            <p className="text-xs text-muted-foreground">
              预估总学习时间
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">技能提升</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">
              实战导向的学习
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Timeline Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold">学习时间轴</h2>
          <p className="text-muted-foreground">
            按时间顺序展示所有实践项目和学习节点
          </p>
        </div>
        <Timeline items={practiceNodes} />
      </section>

      {/* Recent Projects */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">最近项目</h2>
            <p className="text-muted-foreground">
              最新添加的实践项目
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/practice">查看全部</Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentNodes.map((node: any) => (
            <Card key={node.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge 
                    variant="secondary"
                    className="mb-2"
                    style={{ backgroundColor: node.category.color + '20', color: node.category.color }}
                  >
                    {node.category.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {node.estimatedTime}分钟
                  </span>
                </div>
                <CardTitle className="line-clamp-2">{node.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {node.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {node.tags.slice(0, 2).map((tag: any) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                    {node.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{node.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/practice/${node.id}`}>查看</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}