import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Component,
  Code,
  Tag
} from 'lucide-react'
import { ComponentRenderer } from '@/components/updated-component-renderer'
import { 
  GET_UI_COMPONENTS, 
  CREATE_UI_COMPONENT, 
  UPDATE_UI_COMPONENT, 
  DELETE_UI_COMPONENT,
  GET_COMPONENT_CATEGORIES,
  GET_COMPONENT_STATS
} from '@/lib/graphql/ui-component-queries'
import { 
  UIComponent, 
  ComponentCategory, 
  ComponentStatus, 
  CreateUIComponentInput,
  ComponentStats
} from '@/types/ui-component'

export default function ComponentManage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [selectedStatus] = useState<ComponentStatus | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [previewComponent, setPreviewComponent] = useState<UIComponent | null>(null)
  const [editingComponent, setEditingComponent] = useState<UIComponent | null>(null)
  const [previewProps, setPreviewProps] = useState<Record<string, any>>({})

  // GraphQL查询和变更
  const { data: componentsData, loading: componentsLoading, refetch: refetchComponents } = useQuery(GET_UI_COMPONENTS)
  const { data: categoriesData } = useQuery(GET_COMPONENT_CATEGORIES)
  const { data: statsData } = useQuery(GET_COMPONENT_STATS)
  
  const [createComponent] = useMutation(CREATE_UI_COMPONENT, {
    onCompleted: () => {
      refetchComponents()
      setIsAddDialogOpen(false)
      setNewComponent({
        name: '',
        description: '',
        category: ComponentCategory.UI_COMPONENT,
        template: '',
        version: '1.0.0',
        author: 'User',
        status: ComponentStatus.ACTIVE,
        props: [],
        tagNames: []
      })
    }
  })
  
  const [updateComponent] = useMutation(UPDATE_UI_COMPONENT, {
    onCompleted: () => {
      refetchComponents()
      setEditingComponent(null)
      setIsEditDialogOpen(false)
    }
  })
  
  const [deleteComponent] = useMutation(DELETE_UI_COMPONENT, {
    onCompleted: () => {
      refetchComponents()
    }
  })

  const components = componentsData?.uiComponents || []
  const categories = ['全部', ...(categoriesData?.componentCategories || [])]
  const stats: ComponentStats | undefined = statsData?.componentStats


  const [newComponent, setNewComponent] = useState<Partial<CreateUIComponentInput>>({
    name: '',
    description: '',
    category: ComponentCategory.UI_COMPONENT,
    template: '',
    version: '1.0.0',
    author: 'User',
    status: ComponentStatus.ACTIVE,
    props: [],
    tagNames: []
  })

  // 过滤组件
  const filteredComponents = components.filter((component: UIComponent) => {
    const matchesSearch = !searchQuery || 
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.tags?.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === '全部' || component.category === selectedCategory
    const matchesStatus = !selectedStatus || component.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // 复制模板到剪贴板
  const copyTemplate = (template: string) => {
    navigator.clipboard.writeText(template)
    // 这里可以添加提示消息
  }

  // 添加组件
  const handleAddComponent = async () => {
    if (!newComponent.name || !newComponent.description || !newComponent.template) {
      alert('请填写所有必填字段')
      return
    }

    try {
      await createComponent({
        variables: {
          input: {
            name: newComponent.name,
            description: newComponent.description,
            category: newComponent.category || ComponentCategory.UI_COMPONENT,
            template: newComponent.template,
            version: newComponent.version || '1.0.0',
            author: newComponent.author || 'User',
            status: newComponent.status || ComponentStatus.ACTIVE,
            props: newComponent.props || [],
            propsSchema: newComponent.propsSchema,
            documentation: newComponent.documentation,
            examples: newComponent.examples,
            tagNames: newComponent.tagNames || []
          }
        }
      })
    } catch (error) {
      console.error('Failed to create component:', error)
      alert('创建组件失败，请重试')
    }
  }

  // 编辑组件
  const handleEditComponent = async () => {
    if (!editingComponent || !newComponent.name || !newComponent.description || !newComponent.template) {
      alert('请填写所有必填字段')
      return
    }

    try {
      await updateComponent({
        variables: {
          input: {
            id: editingComponent.id,
            name: newComponent.name,
            description: newComponent.description,
            category: newComponent.category,
            template: newComponent.template,
            version: newComponent.version,
            author: newComponent.author,
            status: newComponent.status,
            props: newComponent.props || [],
            propsSchema: newComponent.propsSchema,
            documentation: newComponent.documentation,
            examples: newComponent.examples,
            tagNames: newComponent.tagNames || []
          }
        }
      })
    } catch (error) {
      console.error('Failed to update component:', error)
      alert('更新组件失败，请重试')
    }
  }

  // 删除组件
  const handleDeleteComponent = async (id: string) => {
    if (confirm('确定要删除这个组件吗？')) {
      try {
        await deleteComponent({
          variables: { id }
        })
      } catch (error) {
        console.error('Failed to delete component:', error)
        alert('删除失败，请重试')
      }
    }
  }

  // 开始编辑组件
  const startEditComponent = (component: UIComponent) => {
    setEditingComponent(component)
    setNewComponent({
      name: component.name,
      description: component.description,
      category: component.category,
      template: component.template,
      version: component.version,
      author: component.author,
      status: component.status,
      props: component.props,
      propsSchema: component.propsSchema,
      documentation: component.documentation,
      examples: component.examples,
      tagNames: component.tags?.map(tag => tag.name) || []
    })
    setIsEditDialogOpen(true)
  }

  // 导出组件配置
  const handleExportComponents = () => {
    const dataStr = JSON.stringify(components, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'components.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">组件管理</h1>
          <p className="text-muted-foreground">
            管理可在文章中插入的 React 组件
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetchComponents()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>

          <Button variant="outline" onClick={handleExportComponents}>
            <Download className="h-4 w-4 mr-2" />
            导出配置
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                添加组件
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>添加新组件</DialogTitle>
                <DialogDescription>
                  创建一个新的可重用组件模板
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">组件名称</label>
                    <Input
                      value={newComponent.name}
                      onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                      placeholder="MyComponent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">分类</label>
                    <select
                      value={newComponent.category}
                      onChange={(e) => setNewComponent({ ...newComponent, category: e.target.value as ComponentCategory })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">描述</label>
                  <Input
                    value={newComponent.description}
                    onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                    placeholder="组件的功能描述"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">模板代码</label>
                  <Textarea
                    value={newComponent.template}
                    onChange={(e) => setNewComponent({ ...newComponent, template: e.target.value })}
                    placeholder=":::react{component=&quot;MyComponent&quot;}&#10;组件内容&#10;:::"
                    className="w-full h-32 p-3 text-sm font-mono rounded-md border border-input bg-background resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">标签 (逗号分隔)</label>
                  <Input
                    value={newComponent.tagNames?.join(', ') || ''}
                    onChange={(e) => setNewComponent({
                      ...newComponent,
                      tagNames: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    })}
                    placeholder="UI, 按钮, 交互"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleAddComponent}>
                  添加组件
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索组件..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Component className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">总组件数</p>
                <p className="text-2xl font-bold">{stats?.total || components.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">活跃组件</p>
                <p className="text-2xl font-bold">{stats?.active || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">搜索结果</p>
                <p className="text-2xl font-bold">{filteredComponents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">当前分类</p>
                <p className="text-lg font-bold">{selectedCategory || '全部'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 加载状态 */}
      {componentsLoading && (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">正在加载组件...</p>
        </div>
      )}

      {/* 组件列表 */}
      <div className="grid grid-cols-2 gap-6">
        {filteredComponents.map((component: UIComponent) => (
          <Card key={component.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{component.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {component.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{component.category}</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {/* 标签 */}
                {component.tags && component.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {component.tags.map((tag: any) => (
                      <Badge key={tag.id} variant="outline" className="text-xs" style={{ backgroundColor: tag.color + '20', borderColor: tag.color }}>
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* 模板预览 */}
                <div className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto">
                  {component.template.length > 100
                    ? `${component.template.substring(0, 100)}...`
                    : component.template}
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyTemplate(component.template)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    复制
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewComponent(component)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    预览
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditComponent(component)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    编辑
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteComponent(component.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {/* 元信息 */}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <div>版本: {component.version} | 作者: {component.author}</div>
                  <div>创建: {new Date(component.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 空状态 */}
      {filteredComponents.length === 0 && (
        <div className="text-center py-12">
          <Component className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">没有找到组件</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? '尝试调整搜索条件' : '开始添加你的第一个组件'}
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            添加组件
          </Button>
        </div>
      )}

      {/* 编辑组件对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑组件</DialogTitle>
            <DialogDescription>
              修改组件的配置信息
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">组件名称</label>
                <Input
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                  placeholder="MyComponent"
                />
              </div>
              <div>
                <label className="text-sm font-medium">分类</label>
                <select
                  value={newComponent.category}
                  onChange={(e) => setNewComponent({ ...newComponent, category: e.target.value as ComponentCategory })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">描述</label>
              <Input
                value={newComponent.description}
                onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                placeholder="组件的功能描述"
              />
            </div>

            <div>
              <label className="text-sm font-medium">模板代码</label>
              <Textarea
                value={newComponent.template}
                onChange={(e) => setNewComponent({ ...newComponent, template: e.target.value })}
                placeholder=":::react{component=&quot;MyComponent&quot;}&#10;组件内容&#10;:::"
                className="w-full h-32 p-3 text-sm font-mono rounded-md border border-input bg-background resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">标签 (逗号分隔)</label>
              <Input
                value={newComponent.tagNames?.join(', ') || ''}
                onChange={(e) => setNewComponent({
                  ...newComponent,
                  tagNames: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="UI, 按钮, 交互"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setEditingComponent(null)
              setNewComponent({
                name: '',
                description: '',
                category: ComponentCategory.UI_COMPONENT,
                template: '',
                version: '1.0.0',
                author: 'User',
                status: ComponentStatus.ACTIVE,
                props: [],
                tagNames: []
              })
            }}>
              取消
            </Button>
            <Button onClick={handleEditComponent}>
              保存修改
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 组件详情预览对话框 */}
      {previewComponent && (
        <Dialog open={!!previewComponent} onOpenChange={() => {
          setPreviewComponent(null)
          setPreviewProps({})
        }}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Component className="h-5 w-5" />
                {previewComponent.name}
              </DialogTitle>
              <DialogDescription>
                {previewComponent.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">基本信息</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>分类:</strong> {previewComponent.category}</div>
                    <div><strong>版本:</strong> {previewComponent.version}</div>
                    <div><strong>作者:</strong> {previewComponent.author}</div>
                    <div><strong>创建时间:</strong> {new Date(previewComponent.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">标签</h4>
                  <div className="flex flex-wrap gap-1">
                    {previewComponent.tags?.map((tag: any) => (
                      <Badge key={tag.id} variant="outline" style={{ backgroundColor: tag.color + '20', borderColor: tag.color }}>
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* 组件预览渲染 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">组件预览</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewProps({})}
                  >
                    重置属性
                  </Button>
                </div>
                
                {/* Props 编辑器 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">组件属性 (JSON格式)</label>
                    <Textarea
                      value={JSON.stringify(previewProps, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value || '{}')
                          setPreviewProps(parsed)
                        } catch {
                          // 如果JSON无效，不更新状态
                        }
                      }}
                      placeholder='{\n  "text": "Hello World",\n  "color": "primary"\n}'
                      className="w-full h-24 p-3 text-sm font-mono rounded-md border border-input bg-background resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      输入有效的JSON格式来设置组件属性
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">常用属性快捷设置</label>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewProps({ ...previewProps, text: 'Hello World' })}
                      >
                        添加 text 属性
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewProps({ ...previewProps, variant: 'primary' })}
                      >
                        添加 variant 属性
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewProps({ ...previewProps, size: 'large' })}
                      >
                        添加 size 属性
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 实际预览区域 */}
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50/50">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded border">
                      实时预览
                    </span>
                  </div>
                  <ComponentRenderer 
                    componentName={previewComponent.name} 
                    props={previewProps} 
                  />
                </div>
              </div>

              {/* 模板代码 */}
              <div>
                <h4 className="font-medium mb-2">模板代码</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {previewComponent.template}
                  </pre>
                </div>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => copyTemplate(previewComponent.template)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  复制模板
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}