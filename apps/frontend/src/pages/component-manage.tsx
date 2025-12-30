import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Textarea, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useConfirm } from '@workspace/ui-components'
import { getAllRegisteredComponents } from '@workspace/ui-components'
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
  const [registeredComponents, setRegisteredComponents] = useState<any[]>([])
  const [availableComponents, setAvailableComponents] = useState<any[]>([])
  const { confirm, ConfirmDialog } = useConfirm()

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

  // 获取已注册组件和可用组件
  useEffect(() => {
    const fetchRegisteredComponents = () => {
      try {
        const allRegistered = getAllRegisteredComponents()
        setRegisteredComponents(allRegistered)

        // 过滤出未保存的组件（不在数据库中的）
        const savedComponentNames = new Set(components.map((comp: UIComponent) => comp.name))
        const available = allRegistered.filter((comp: any) => !savedComponentNames.has(comp.name))
        setAvailableComponents(available)
      } catch (error) {
        console.error('获取已注册组件失败:', error)
        setRegisteredComponents([])
        setAvailableComponents([])
      }
    }

    fetchRegisteredComponents()
  }, [components])


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

  // 当选择组件时自动填充信息
  const handleComponentSelect = (componentName: string) => {
    const selectedComp = registeredComponents.find(comp => comp.name === componentName)
    if (selectedComp) {
      setNewComponent({
        name: selectedComp.name,
        description: selectedComp.description || `${selectedComp.name} 组件`,
        category: mapCategoryFromRegistered(selectedComp.category),
        template: selectedComp.template || `:::react{component="${selectedComp.name}"}\n内容\n:::`,
        version: selectedComp.version || '1.0.0',
        author: selectedComp.author || 'User',
        status: ComponentStatus.ACTIVE,
        props: [],
        tagNames: selectedComp.tags || []
      })
    }
  }

  // 映射已注册组件的分类到数据库分类
  const mapCategoryFromRegistered = (regCategory: string): ComponentCategory => {
    const categoryMap: Record<string, ComponentCategory> = {
      'UI组件': ComponentCategory.UI_COMPONENT,
      '交互组件': ComponentCategory.INTERACTION,
      '3D组件': ComponentCategory.THREE_D,
      '图表组件': ComponentCategory.DATA_DISPLAY, // 图表归为数据显示
      '表单组件': ComponentCategory.FORM,
      '布局组件': ComponentCategory.LAYOUT,
      '媒体组件': ComponentCategory.UI_COMPONENT, // 媒体归为UI组件
      '其他': ComponentCategory.UI_COMPONENT // 其他归为UI组件
    }
    return categoryMap[regCategory] || ComponentCategory.UI_COMPONENT
  }

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
    const confirmed = await confirm({
      title: '删除组件',
      description: '确定要删除这个组件吗？此操作不可恢复。',
      confirmText: '删除',
      cancelText: '取消',
      variant: 'destructive'
    })

    if (confirmed) {
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
    <div className="flex flex-col gap-6 relative">
      {/* Header with gradient background */}
      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-8 border-purple-100 dark:border-purple-900/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Component className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                组件管理
              </h1>
            </div>
            <p className="text-muted-foreground ml-1">
              管理可在文章中插入的 React 组件
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => refetchComponents()}
              className="bg-white/50 hover:bg-white/80 dark:bg-slate-800/50 dark:hover:bg-slate-800/80"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新
            </Button>

            <Button
              variant="outline"
              onClick={handleExportComponents}
              className="bg-white/50 hover:bg-white/80 dark:bg-slate-800/50 dark:hover:bg-slate-800/80"
            >
              <Download className="h-4 w-4 mr-2" />
              导出配置
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
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
                      <label className="text-sm font-medium">选择已注册组件</label>
                      <Select
                        value={newComponent.name}
                        onValueChange={handleComponentSelect}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={availableComponents.length > 0 ? "选择组件" : "暂无可用组件"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableComponents.length === 0 ? (
                            <div className="p-2 text-sm text-gray-500">
                              暂无未保存的已注册组件
                            </div>
                          ) : (
                            availableComponents.map((comp) => (
                              <SelectItem key={comp.name} value={comp.name}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{comp.name}</span>
                                  <span className="text-xs text-gray-500">{comp.category || '未分类'}</span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {availableComponents.length === 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          💡 提示：可用组件来自 packages/ui-components 中已注册但未保存的组件
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">分类</label>
                      <Select
                        value={newComponent.category}
                        onValueChange={(value) => setNewComponent({ ...newComponent, category: value as ComponentCategory })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">描述</label>
                    <div className="space-y-2">
                      <Input
                        value={newComponent.description}
                        onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                        placeholder="组件的功能描述"
                      />
                      {newComponent.name && (
                        <div className="text-xs text-gray-500">
                          🔄 描述已根据选择的组件自动填充，可自定义修改
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">模板代码</label>
                    <div className="space-y-2">
                      <Textarea
                        value={newComponent.template}
                        onChange={(e) => setNewComponent({ ...newComponent, template: e.target.value })}
                        placeholder=":::react{component=&quot;MyComponent&quot;}&#10;组件内容&#10;:::"
                        className="w-full h-32 p-3 text-sm font-mono rounded-md border-input bg-background resize-none"
                      />
                      {newComponent.name && (
                        <div className="text-xs text-gray-500">
                          📝 模板代码已自动生成，可根据需要修改
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">标签 (逗号分隔)</label>
                    <div className="space-y-2">
                      <Input
                        value={newComponent.tagNames?.join(', ') || ''}
                        onChange={(e) => setNewComponent({
                          ...newComponent,
                          tagNames: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        })}
                        placeholder="UI, 按钮, 交互"
                      />
                      {newComponent.name && newComponent.tagNames && newComponent.tagNames.length > 0 && (
                        <div className="text-xs text-gray-500">
                          🏷️ 标签已根据组件信息自动填充，可自定义修改
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      取消
                    </Button>
                    <Button
                      onClick={handleAddComponent}
                      disabled={!newComponent.name || !newComponent.description || !newComponent.template}
                    >
                      添加组件
                    </Button>
                  </div>

                  {/* 组件信息预览 */}
                  {newComponent.name && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">📋 组件信息预览</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><strong>名称:</strong> {newComponent.name}</div>
                        <div><strong>分类:</strong> {newComponent.category}</div>
                        <div><strong>版本:</strong> {newComponent.version}</div>
                        <div><strong>作者:</strong> {newComponent.author}</div>
                      </div>
                      {newComponent.tagNames && newComponent.tagNames.length > 0 && (
                        <div className="mt-2 text-xs">
                          <strong>标签:</strong> {newComponent.tagNames.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Enhanced Search and Filter */}
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索组件..."
                    className="pl-10 pr-4 py-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
                >
                  <SelectTrigger className="w-[180px] border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Card className=" hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">总组件数</CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Component className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats?.total || components.length}</div>
              <p className="text-xs text-muted-foreground mt-1">所有组件</p>
            </CardContent>
          </Card>

          <Card className=" hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">活跃组件</CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Tag className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats?.active || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">已启用组件</p>
            </CardContent>
          </Card>

          <Card className=" hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">搜索结果</CardTitle>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Search className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{filteredComponents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">当前筛选</p>
            </CardContent>
          </Card>

          <Card className=" hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">当前分类</CardTitle>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Code className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">{selectedCategory || '全部'}</div>
              <p className="text-xs text-muted-foreground mt-1">当前分类</p>
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
        <div className="grid grid-cols-2 gap-6 mt-4">
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
                  <Select
                    value={newComponent.category}
                    onValueChange={(value) => setNewComponent({ ...newComponent, category: value as ComponentCategory })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  className="w-full h-32 p-3 text-sm font-mono rounded-md border-input bg-background resize-none"
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
            <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 ">
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
                        className="w-full h-24 p-3 text-sm font-mono rounded-md border-input bg-background resize-none"
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
                  <div className="rounded-lg p-6 bg-gray-50/50">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">
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

        {/* Confirm Dialog */}
        <ConfirmDialog />
      </div>
    </div>
  )
}