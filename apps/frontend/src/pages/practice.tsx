import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { GET_PRACTICE_NODES, SEARCH_PRACTICE_NODES } from '@/lib/graphql/queries'
import { PracticeGrid } from '@/components/practice-grid'
import { PracticeFilters } from '@/components/practice-filters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function PracticePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // 初始化状态，只在组件挂载时使用 searchParams
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(() => 
    searchParams.get('tag') ? [searchParams.get('tag')!] : []
  )

  // 监听 URL 参数变化并同步更新状态
  useEffect(() => {
    const urlCategory = searchParams.get('category') || ''
    const urlTag = searchParams.get('tag')
    const urlQuery = searchParams.get('q') || ''
    
    console.log('URL params changed:', { urlCategory, urlTag, urlQuery })
    
    setSelectedCategory(urlCategory)
    setSelectedTags(urlTag ? [urlTag] : [])
    setSearchQuery(urlQuery)
  }, [searchParams])

  // 添加调试日志
  console.log('PracticePage render - selectedCategory:', selectedCategory, 'selectedTags:', selectedTags)

  // 包装状态更新函数以确保正确触发
  const handleCategoryChange = (category: string) => {
    console.log('handleCategoryChange called with:', category)
    
    // 更新URL参数
    const newParams = new URLSearchParams(searchParams)
    if (category) {
      newParams.set('category', category)
    } else {
      newParams.delete('category')
    }
    setSearchParams(newParams)
  }

  const handleTagsChange = (tags: string[]) => {
    console.log('handleTagsChange called with:', tags)
    
    // 更新URL参数
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('tag') // 先删除所有tag参数
    
    if (tags.length > 0) {
      // 目前只支持单个标签，取第一个
      newParams.set('tag', tags[0])
    }
    setSearchParams(newParams)
  }

  // 根据是否有搜索条件来决定使用哪个查询
  const hasFilters = searchQuery || selectedCategory || selectedTags.length > 0

  const { data, loading, error } = useQuery(
    hasFilters ? SEARCH_PRACTICE_NODES : GET_PRACTICE_NODES,
    {
      variables: hasFilters ? {
        query: searchQuery || undefined,
        categoryName: selectedCategory || undefined,
        tagNames: selectedTags.length > 0 ? selectedTags : undefined,
      } : undefined,
      skip: false,
      // 确保状态变化时重新获取数据
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }
  )

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>

  const practiceNodes = hasFilters 
    ? data?.searchPracticeNodes || []
    : data?.practiceNodes || []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold">实践项目</h1>
        <p className="text-xl text-muted-foreground mt-2">
          通过动手实践掌握现代Web开发技术
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-6">
        {/* Search Bar */}
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <PracticeFilters
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
        />
      </div>

      {/* Results */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            {hasFilters ? '搜索结果' : '所有项目'}
          </h2>
          <p className="text-muted-foreground">
            找到 {practiceNodes.length} 个实践项目
          </p>
        </div>

        <PracticeGrid items={practiceNodes} />
      </div>
    </div>
  )
}