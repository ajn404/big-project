import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, getDifficultyColor, getDifficultyLabel } from '@/lib/utils'
import { Calendar, Clock } from 'lucide-react'

interface TimelineItem {
  id: string
  title: string
  description: string
  date: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  estimatedTime: number
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

interface TimelineProps {
  items: TimelineItem[]
}

export function Timeline({ items }: TimelineProps) {
  // 按日期分组
  const groupedItems = items.reduce((groups: { [key: string]: TimelineItem[] }, item) => {
    const date = new Date(item.date).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
    return groups
  }, {})

  const sortedDates = Object.keys(groupedItems).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-8"></div>
      
      <div className="space-y-8">
        {sortedDates.map((date) => (
          <div key={date} className="relative">
            {/* Date marker */}
            <div className="flex items-center mb-4">
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary md:ml-4">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{formatDate(date)}</h3>
                <p className="text-sm text-muted-foreground">
                  {groupedItems[date].length} 个实践项目
                </p>
              </div>
            </div>

            {/* Items for this date */}
            <div className="ml-12 space-y-4 md:ml-16">
              {groupedItems[date].map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-2">
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
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.estimatedTime}分钟
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">
                      <Link 
                        to={`/practice/${item.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {item.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">暂无实践项目</h3>
          <p className="text-muted-foreground">
            还没有添加任何实践项目，快去创建第一个吧！
          </p>
        </div>
      )}
    </div>
  )
}