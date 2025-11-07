import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_PRACTICE_NODE } from '@/lib/graphql/queries'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, getDifficultyColor, getDifficultyLabel } from '@/lib/utils'
import { ArrowLeft, Calendar, Clock, Target, BookOpen } from 'lucide-react'
import { MDXRenderer } from '@/components/mdx-renderer'
import { ComponentRenderer } from '@/components/component-renderer'

export function PracticeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, loading, error } = useQuery(GET_PRACTICE_NODE, {
    variables: { id },
    skip: !id,
  })

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>
  if (!data?.practiceNode) return <div>未找到该实践项目</div>

  const node = data.practiceNode

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button asChild variant="outline">
        <Link to="/practice">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回实践列表
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge 
            variant="secondary"
            style={{ backgroundColor: node.category.color + '20', color: node.category.color }}
          >
            {node.category.name}
          </Badge>
          <Badge 
            variant="outline"
            className={getDifficultyColor(node.difficulty)}
          >
            {getDifficultyLabel(node.difficulty)}
          </Badge>
          <Badge variant="outline">
            {node.contentType === 'MDX' ? 'MDX 文章' : 'React 组件'}
          </Badge>
        </div>

        <h1 className="text-4xl font-bold">{node.title}</h1>
        <p className="text-xl text-muted-foreground">{node.description}</p>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(node.date)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            预估 {node.estimatedTime} 分钟
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            {node.contentType === 'MDX' ? '文章学习' : '组件实践'}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {node.tags.map((tag: any) => (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      {node.prerequisites && node.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              前置要求
            </CardTitle>
            <CardDescription>
              开始此实践前，你需要了解以下内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {node.prerequisites.map((req: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>实践内容</CardTitle>
        </CardHeader>
        <CardContent>
          {node.contentType === 'MDX' ? (
            <MDXRenderer content={node.content || ''} />
          ) : (
            <ComponentRenderer 
              componentName={node.componentName || ''} 
              props={{}}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button asChild variant="outline">
          <Link to="/practice">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Link>
        </Button>
        <Button asChild>
          <Link to="/practice">
            查看更多实践
          </Link>
        </Button>
      </div>
    </div>
  )
}