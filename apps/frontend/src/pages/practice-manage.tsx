import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Link } from 'react-router-dom'
import { GET_PRACTICE_NODES, GET_CATEGORIES, GET_TAGS } from '@/lib/graphql/queries'
import { DELETE_PRACTICE_NODE } from '@/lib/graphql/mutations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatDate, getDifficultyColor, getDifficultyLabel } from '@/lib/utils'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  FileText, 
  Upload,
  Eye
} from 'lucide-react'
import { PracticeNodeForm } from '@/components/practice-node-form'
import { MarkdownImportDialog } from '@/components/markdown-import-dialog'

export function PracticeManagePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [editingNode, setEditingNode] = useState<any>(null)

  const { data: practiceData, loading: practiceLoading, refetch } = useQuery(GET_PRACTICE_NODES)
  const { data: categoriesData } = useQuery(GET_CATEGORIES)
  const { data: tagsData } = useQuery(GET_TAGS)

  const [deletePracticeNode] = useMutation(DELETE_PRACTICE_NODE, {
    onCompleted: () => {
      refetch()
    }
  })

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
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

  if (practiceLoading) return <div>加载中...</div>

  const practiceNodes = practiceData?.practiceNodes || []
  const filteredNodes = practiceNodes.filter((node: any) =>
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">文章管理</h1>
          <p className="text-muted-foreground mt-1">
            管理实践文章的新增、编辑和删除
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowImportDialog(true)} variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            导入 Markdown
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新建文章
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索文章标题或描述..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总文章数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{practiceNodes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MDX 文章</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {practiceNodes.filter((n: any) => n.contentType === 'MDX').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">组件文章</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {practiceNodes.filter((n: any) => n.contentType === 'COMPONENT').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">分类数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesData?.categories?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>文章列表 ({filteredNodes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNodes.map((node: any) => (
              <div key={node.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{node.title}</h3>
                      <Badge
                        variant="secondary"
                        style={{ 
                          backgroundColor: node.category.color + '20', 
                          color: node.category.color 
                        }}
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
                        {node.contentType === 'MDX' ? 'MDX' : '组件'}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-2">{node.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>创建: {formatDate(node.createdAt)}</span>
                      <span>更新: {formatDate(node.updatedAt)}</span>
                      <span>预估时长: {node.estimatedTime} 分钟</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {node.tags.map((tag: any) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                    >
                      <Link to={`/practice/${node.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      onClick={() => handleEdit(node)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(node.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredNodes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>暂无文章</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      {showCreateForm && (
        <PracticeNodeForm
          node={editingNode}
          categories={categoriesData?.categories || []}
          tags={tagsData?.tags || []}
          onClose={handleFormClose}
        />
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <MarkdownImportDialog
          categories={categoriesData?.categories || []}
          tags={tagsData?.tags || []}
          onClose={() => setShowImportDialog(false)}
          onImportComplete={handleImportComplete}
        />
      )}
    </div>
  )
}