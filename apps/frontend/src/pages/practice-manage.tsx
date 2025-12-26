import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Link } from 'react-router-dom'
import { GET_PRACTICE_NODES, GET_CATEGORIES, GET_TAGS } from '@/lib/graphql/queries'
import { DELETE_PRACTICE_NODE } from '@/lib/graphql/mutations'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-components'
import { Button } from '@workspace/ui-components'
import { Badge } from '@workspace/ui-components'
import { Input } from '@workspace/ui-components'
import { useConfirm } from '@workspace/ui-components'
import { formatDate, getDifficultyColor, getDifficultyLabel } from '@/lib/utils'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  FileText, 
  Upload,
  Eye,
  FolderOpen,
  Tag,
  Clock,
  Sparkles
} from 'lucide-react'
import { PracticeNodeForm } from '@/components/practice-node-form'
import { MarkdownImportDialog } from '@/components/markdown-import-dialog'

export function PracticeManagePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [editingNode, setEditingNode] = useState<any>(null)
  const { confirm, ConfirmDialog } = useConfirm()

  const { data: practiceData, loading: practiceLoading, refetch } = useQuery(GET_PRACTICE_NODES)
  const { data: categoriesData } = useQuery(GET_CATEGORIES)
  const { data: tagsData } = useQuery(GET_TAGS)

  const [deletePracticeNode] = useMutation(DELETE_PRACTICE_NODE, {
    onCompleted: () => {
      refetch()
    }
  })

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: '删除文章',
      description: '确定要删除这篇文章吗？此操作不可恢复。',
      confirmText: '删除',
      cancelText: '取消',
      variant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deletePracticeNode({ variables: { id } })
      } catch (error) {
        console.error('删除失败:', error)
      }
    }
  }

  const handleEdit = (node: any) => {
    setEditingNode(node)
    setShowCreateForm(true)
  }

  const handleFormClose = () => {
    setShowCreateForm(false)
    setEditingNode(null)
    refetch()
  }

  const handleImportComplete = () => {
    setShowImportDialog(false)
    refetch()
  }

  if (practiceLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">加载中...</p>
      </div>
    </div>
  )

  const practiceNodes = practiceData?.practiceNodes || []
  const filteredNodes = practiceNodes.filter((node: any) =>
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='flex flex-col gap-6 relative'>
      {/* Header with gradient background */}
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-8 border border-blue-100 dark:border-blue-900/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                内容管理
              </h1>
            </div>
            <p className="text-muted-foreground ml-1">
              管理实践文章的新增、编辑和删除
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowImportDialog(true)} 
              variant="outline"
              className="bg-white/50 hover:bg-white/80 dark:bg-slate-800/50 dark:hover:bg-slate-800/80"
            >
              <Upload className="h-4 w-4 mr-2" />
              导入 Markdown
            </Button>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              新建文章
            </Button>
          </div>
        </div>
      </div>

      {/* Search with enhanced design */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            <Input
              type="search"
              placeholder="搜索文章标题或描述..."
              className="pl-10 pr-4 py-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">总文章数</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{practiceNodes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">所有类型文章</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">MDX 文章</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {practiceNodes.filter((n: any) => n.contentType === 'MDX').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Markdown 交互</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">组件文章</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FolderOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {practiceNodes.filter((n: any) => n.contentType === 'COMPONENT').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">React 组件</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">分类数</CardTitle>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Tag className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{categoriesData?.categories?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">内容分类</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Articles List */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">文章列表</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">共 {filteredNodes.length} 篇文章</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredNodes.map((node: any) => (
              <div 
                key={node.id} 
                className="group border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title and Badges */}
                    <div className="flex items-start gap-2 mb-3 flex-wrap">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {node.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="ml-1"
                        style={{ 
                          backgroundColor: node.category.color + '20', 
                          color: node.category.color,
                          border: `1px solid ${node.category.color}30`
                        }}
                      >
                        {node.category.name}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${getDifficultyColor(node.difficulty)} border-slate-300 dark:border-slate-700`}
                      >
                        {getDifficultyLabel(node.difficulty)}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`border-slate-300 dark:border-slate-700 ${
                          node.contentType === 'MDX' 
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800' 
                            : 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                        }`}
                      >
                        {node.contentType === 'MDX' ? '✨ MDX' : '⚡ 组件'}
                      </Badge>
                    </div>
                    
                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{node.description}</p>
                    
                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{node.estimatedTime} 分钟</span>
                      </div>
                      <span>创建于 {formatDate(node.createdAt)}</span>
                      <span>更新于 {formatDate(node.updatedAt)}</span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {node.tags.map((tag: any) => (
                        <Badge 
                          key={tag.id} 
                          variant="outline" 
                          className="text-xs border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-700"
                    >
                      <Link to={`/practice/${node.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      onClick={() => handleEdit(node)}
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(node.id)}
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredNodes.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-slate-100 dark:bg-slate-900/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">暂无文章</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ? '尝试调整搜索关键词' : '点击上方按钮创建第一篇文章'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    创建文章
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <PracticeNodeForm
        open={showCreateForm}
        node={editingNode}
        categories={categoriesData?.categories || []}
        tags={tagsData?.tags || []}
        onClose={handleFormClose}
      />

      {/* Import Dialog */}
      <MarkdownImportDialog
        open={showImportDialog}
        categories={categoriesData?.categories || []}
        tags={tagsData?.tags || []}
        onClose={() => setShowImportDialog(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  )
}