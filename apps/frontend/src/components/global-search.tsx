import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog, DialogContent
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Search, FileText, Clock, Tag, Folder, ArrowRight, Loader2, X
} from 'lucide-react'
import { formatDate, getDifficultyColor, getDifficultyLabel } from '@/lib/utils'

// 高亮文本工具函数
function highlightText(text: string, query: string): JSX.Element[] {
  if (!query.trim()) return [<span key={0}>{text}</span>]
  
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 text-foreground font-medium px-0.5 rounded">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    )
  )
}

// 清理Markdown语法的函数
function cleanMarkdownContent(content: string): string {
  return content
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
    .replace(/`(.*?)`/g, '$1') // 移除行内代码标记
    .replace(/```[\s\S]*?```/g, '[代码块]') // 替换代码块
    .replace(/:::.*?:::/gs, '[组件]') // 替换自定义组件
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/>\s*/g, '') // 移除引用标记
    .replace(/-\s*/g, '') // 移除列表标记
    .replace(/\d+\.\s*/g, '') // 移除有序列表标记
    .replace(/\n+/g, ' ') // 替换换行为空格
    .replace(/\s+/g, ' ') // 合并多个空格
    .trim()
}

// 内容截取和高亮函数
function getHighlightedContent(content: string, query: string, maxLength: number = 150): JSX.Element[] {
  if (!query.trim()) return [<span key={0}>{content.slice(0, maxLength)}...</span>]
  
  // 清理Markdown内容，获得纯文本
  const cleanContent = cleanMarkdownContent(content)
  const lowerQuery = query.toLowerCase()
  const lowerContent = cleanContent.toLowerCase()
  const matchIndex = lowerContent.indexOf(lowerQuery)
  
  if (matchIndex === -1) {
    // 没有匹配，显示开头部分
    return [<span key={0}>{cleanContent.slice(0, maxLength)}...</span>]
  }
  
  // 计算截取范围，确保匹配内容在中间
  const start = Math.max(0, matchIndex - Math.floor(maxLength / 3))
  const end = Math.min(cleanContent.length, start + maxLength)
  const excerpt = cleanContent.slice(start, end)
  
  const prefix = start > 0 ? '...' : ''
  const suffix = end < cleanContent.length ? '...' : ''
  
  return [
    <span key={0}>{prefix}</span>,
    ...highlightText(excerpt, query),
    <span key={2}>{suffix}</span>
  ]
}
import { useFilter } from '@/contexts/filter-context'
import { useSearchPracticeNodes } from '@/hooks/useSearchPracticeNodes'

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { onFilterSelect } = useFilter()

  const { results: practiceNodes, loading } = useSearchPracticeNodes(query, {
    debounceMs: 500,
    skip: !query || query.length < 2,
  })

  // ✅ 固定回调函数引用，防止 map 中闭包反复创建
  const handleNavigateToArticle = useCallback(
    (id: string) => {
      navigate(`/practice/${id}`)
      onClose()
    },
    [navigate, onClose]
  )

  const handleNavigateToFilter = useCallback(
    (type: 'category' | 'tag', value: string) => {
      onClose()
      if (window.location.pathname === '/practice') {
        onFilterSelect?.(type, value)
      } else {
        navigate('/practice')
        setTimeout(() => onFilterSelect?.(type, value), 100)
      }
    },
    [navigate, onClose, onFilterSelect]
  )

  const clearSearch = useCallback(() => setQuery(''), [])

  // 🎹 Escape键关闭逻辑
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // ✅ useMemo: 避免重新渲染时重复构建结果区
  const renderResults = useMemo(() => {
    if (loading) {
      return (
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">搜索中...</p>
        </div>
      )
    }

    if (query.length < 2) {
      return (
        <div className="p-8 text-center text-muted-foreground">
          <Search className="h-8 w-8 mx-auto mb-4 opacity-50" />
          <p>请输入至少 2 个字符开始搜索</p>
        </div>
      )
    }

    if (!loading && practiceNodes.length === 0 && query.length >= 2) {
      return (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">未找到结果</h3>
          <p className="text-sm text-muted-foreground">尝试使用不同的关键词搜索</p>
        </div>
      )
    }

    return (
      <div className="p-4 space-y-4">
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
                  {highlightText(node.title, query)}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {highlightText(node.description, query)}
                </p>
                {/* 显示内容片段（如果内容中包含搜索词） */}
                {node.content && node.content.toLowerCase().includes(query.toLowerCase()) && (
                  <div className="text-sm text-muted-foreground mt-2 p-2 bg-muted/30 rounded border-l-2 border-primary/30">
                    <div className="text-xs text-muted-foreground mb-1 font-medium">内容片段：</div>
                    <div className="italic">
                      {getHighlightedContent(node.content, query, 120)}
                    </div>
                  </div>
                )}
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
                  {highlightText(node.category.name, query)}
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
                    {highlightText(tag.name, query)}
                  </button>
                ))}
              </div>
            )}

            <div className="text-xs text-muted-foreground mt-2">
              更新于 {formatDate(node.updatedAt)}
            </div>
          </div>
        ))}
      </div>
    )
  }, [loading, query, practiceNodes, handleNavigateToArticle, handleNavigateToFilter])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[60vw] h-[50vh] p-10 gap-0 overflow-auto">

        {/* 顶部输入区 */}
        <div className="sticky top-0 px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文章、标签、分类... (Ctrl+K)"
              className="pl-10 pr-10 border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-6 w-6 p-0 -translate-y-1/2 hover:bg-muted"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* ✅ useMemo 缓存后的结果区 */}
        <div className="max-h-[50vh] overflow-y-auto">{renderResults}</div>
      </DialogContent>
    </Dialog>
  )
}
