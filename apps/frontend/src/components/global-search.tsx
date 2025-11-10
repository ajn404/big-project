import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  FileText, 
  Clock, 
  Tag, 
  Folder,
  ArrowRight,
  Loader2,
  X
} from 'lucide-react'
import { SEARCH_PRACTICE_NODES } from '@/lib/graphql/queries'
import { formatDate, getDifficultyColor, getDifficultyLabel } from '@/lib/utils'

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)
  const navigate = useNavigate()

  // 搜索结果
  const { data, loading } = useQuery(SEARCH_PRACTICE_NODES, {
    variables: {
      query: debouncedQuery || undefined,
    },
    skip: !debouncedQuery || debouncedQuery.length < 2,
    fetchPolicy: 'cache-first',
  })

  // 键盘快捷键处理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl/Cmd + K 打开搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      if (!isOpen) {
        setQuery('')
      }
    }
    
    // ESC 关闭搜索
    if (e.key === 'Escape' && isOpen) {
      onClose()
    }
  }, [isOpen, onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // 导航到文章详情页
  const handleNavigateToArticle = (articleId: string) => {
    navigate(`/practice/${articleId}`)
    onClose()
  }

  // 导航到筛选页面
  const handleNavigateToFilter = (type: 'category' | 'tag', value: string) => {
    navigate(`/practice?${type}=${encodeURIComponent(value)}`)
    onClose()
  }

  // 清空搜索
  const clearSearch = () => {
    setQuery('')
  }

  const practiceNodes = data?.practiceNodes || []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">全局搜索</DialogTitle>
        </DialogHeader>

        {/* 搜索输入框 */}
        <div className="relative px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文章、标签、分类... (Ctrl+K)"
              className="pl-10 pr-10"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-6 w-6 p-0 -translate-y-1/2"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* 搜索结果区域 */}
        <div className="max-h-[400px] overflow-y-auto">
          {/* 空状态 */}
          {!query && (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">搜索内容</h3>
              <p className="text-sm">输入关键词搜索文章、标签和分类</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                <kbd className="px-2 py-1 bg-muted rounded border">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted rounded border">K</kbd>
                <span className="ml-2">打开搜索</span>
              </div>
            </div>
          )}

          {/* 搜索中 */}
          {loading && query.length >= 2 && (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-muted-foreground">搜索中...</p>
            </div>
          )}

          {/* 搜索结果 */}
          {!loading && query.length >= 2 && (
            <div className="p-4 space-y-4">
              {practiceNodes.length > 0 ? (
                <>
                  <div className="text-sm text-muted-foreground mb-3">
                    找到 {practiceNodes.length} 个结果
                  </div>
                  
                  {practiceNodes.map((node: any) => (
                    <div
                      key={node.id}
                      className="group cursor-pointer rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                      onClick={() => handleNavigateToArticle(node.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {node.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {node.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-2 flex-shrink-0" />
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Folder className="h-3 w-3" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleNavigateToFilter('category', node.category.name)
                            }}
                            className="hover:text-primary transition-colors"
                          >
                            {node.category.name}
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{node.estimatedTime} 分钟</span>
                        </div>

                        <Badge
                          variant="outline"
                          className={`text-xs ${getDifficultyColor(node.difficulty)}`}
                        >
                          {getDifficultyLabel(node.difficulty)}
                        </Badge>
                      </div>

                      {node.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {node.tags.map((tag: any) => (
                            <button
                              key={tag.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleNavigateToFilter('tag', tag.name)
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                              <Tag className="h-3 w-3" />
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground mt-2">
                        更新于 {formatDate(node.updatedAt)}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">未找到结果</h3>
                  <p className="text-sm text-muted-foreground">
                    尝试使用不同的关键词搜索
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 搜索提示 */}
          {query.length > 0 && query.length < 2 && (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-4 opacity-50" />
              <p>请输入至少 2 个字符开始搜索</p>
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="border-t border-border p-3 bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border text-xs">↵</kbd>
                <span>打开</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border text-xs">ESC</kbd>
                <span>关闭</span>
              </div>
            </div>
            <div>支持搜索标题、描述、标签和分类</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}