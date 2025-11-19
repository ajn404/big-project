import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui-components'
import { Badge } from '@workspace/ui-components'
import { Button } from '@workspace/ui-components'
import { formatDate, getDifficultyColor, getDifficultyLabel } from '@/lib/utils'
import { Clock, Calendar } from 'lucide-react'

interface PracticeItem {
  id: string
  title: string
  description: string
  date: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  estimatedTime: number
  contentType: 'MDX' | 'COMPONENT'
  category: {
    id: string
    name: string
    color: string
  }
  tags: Array<{
    id: string
    name: string
    color: string
  }>
}

interface PracticeGridProps {
  items: PracticeItem[]
}

export const PracticeGrid = React.memo(function PracticeGrid({ items }: PracticeGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold mb-2">未找到匹配的项目</h3>
        <p className="text-muted-foreground">
          尝试调整搜索条件或浏览所有项目
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary"
                  style={{ backgroundColor: item.category.color + '20', color: item.category.color }}
                >
                  {item.category.name}
                </Badge>
                <Badge 
                  variant="outline"
                  className={getDifficultyColor(item.difficulty)}
                >
                  {getDifficultyLabel(item.difficulty)}
                </Badge>
              </div>
              <Badge variant="outline" className="text-xs">
                {item.contentType === 'MDX' ? 'MDX' : '组件'}
              </Badge>
            </div>
            
            <CardTitle className="line-clamp-2 hover:text-primary transition-colors leading-8 dark:text-teal-100">
              <Link to={`/practice/${item.id}`}>
                {item.title}
              </Link>
            </CardTitle>
            
            <CardDescription className="line-clamp-3">
              {item.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Meta info */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(item.date)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {item.estimatedTime}分钟
                </div>
              </div>

              {/* Action button */}
              <Button asChild className="w-full" variant="outline">
                <Link to={`/practice/${item.id}`}>
                  开始学习
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})