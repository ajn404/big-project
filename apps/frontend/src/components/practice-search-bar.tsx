import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui-components'
import { Input } from '@workspace/ui-components'
import { Search } from 'lucide-react'

interface PracticeSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export const PracticeSearchBar = React.memo(function PracticeSearchBar({
  searchQuery,
  onSearchChange
}: PracticeSearchBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>搜索实践项目</CardTitle>
        <CardDescription>
          根据标题、描述或标签搜索你感兴趣的实践项目
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索实践项目..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
})