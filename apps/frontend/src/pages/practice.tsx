import { useState, useCallback, useMemo, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { FilterProvider } from '@/contexts/filter-context'
import { PracticeGrid } from '@/components/practice-grid'
import { PracticeFilters } from '@/components/practice-filters'
import { useSearchPracticeNodes } from '@/hooks/useSearchPracticeNodes'
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-components'
import { Search, Filter, RefreshCw, BookOpen, Tag, TrendingUp } from 'lucide-react'

export function PracticePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 从URL参数读取初始筛选条件
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const tagParam = searchParams.get('tag')
    
    if (categoryParam) {
      setSelectedCategory(categoryParam)
      setSearchQuery('')
      setSelectedTags([])
      // 清除URL参数
      setSearchParams({})
    } else if (tagParam) {
      setSelectedTags([tagParam])
      setSearchQuery('')
      setSelectedCategory('')
      // 清除URL参数
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

  const handleExternalFilter = useCallback((type: 'category' | 'tag', value: string) => {
    flushSync(() => {
      if (type === 'category') {
        setSelectedCategory(value)
        setSearchQuery('')
        setSelectedTags([])
      } else {
        setSelectedTags([value])
        setSearchQuery('')
        setSelectedCategory('')
      }
    })
  }, [])

  const filterContextValue = useMemo(
    () => ({ onFilterSelect: handleExternalFilter }),
    [handleExternalFilter]
  )

  const { results: practiceNodes, loading, error } = useSearchPracticeNodes(searchQuery, {
    category: selectedCategory,
    tags: selectedTags,
    debounceMs: 500,
  })

  return (
    <FilterProvider value={filterContextValue}>
      <div className="flex flex-col gap-6 relative">
        {/* Header with gradient background */}
        <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-8 border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  实践练习
                </h1>
              </div>
              <p className="text-muted-foreground ml-1">
                探索和学习各种编程实践和技能
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="bg-white/50 hover:bg-white/80 dark:bg-slate-800/50 dark:hover:bg-slate-800/80"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </Button>
            </div>
          </div>

          {/* Enhanced Search and Filter */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索实践内容..."
                      className="pl-10 pr-4 py-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                <PracticeFilters
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">总练习数</CardTitle>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{practiceNodes.length}</div>
                <p className="text-xs text-muted-foreground mt-1">所有练习</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">当前筛选</CardTitle>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Filter className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{practiceNodes.length}</div>
                <p className="text-xs text-muted-foreground mt-1">筛选结果</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">当前分类</CardTitle>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">{selectedCategory || '全部'}</div>
                <p className="text-xs text-muted-foreground mt-1">选中分类</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">活跃标签</CardTitle>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{selectedTags.length}</div>
                <p className="text-xs text-muted-foreground mt-1">选中标签</p>
              </CardContent>
            </Card>
          </div>

          {/* 加载状态 */}
          {loading && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">正在加载练习内容...</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">搜索出错：{error.message}</p>
            </div>
          )}

          <div className="mt-4">
            <PracticeGrid items={practiceNodes} />
          </div>
        </div>
      </div>
    </FilterProvider>
  )
}
