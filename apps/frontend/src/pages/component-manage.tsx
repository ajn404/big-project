import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import ComponentManager, { ComponentInfo, ComponentCategory } from '@/utils/component-manager'

const categories = ['全部', ...ComponentManager.getCategories()]

export default function ComponentManage() {
  const [components, setComponents] = useState<ComponentInfo[]>([])
  const [, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newComponent, setNewComponent] = useState<Partial<ComponentInfo>>({
    name: '',
    description: '',
    category: 'UI组件',
    template: '',
    tags: []
  })

  // 加载组件数据
  const loadComponents = () => {
    try {
      const registeredComponents = ComponentManager.getAvailableComponents()
      setComponents(registeredComponents)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load components:', error)
      setComponents([])
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComponents()
  }, [])

  // 过滤组件
  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === '全部' || component.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // 复制模板到剪贴板
  const copyTemplate = (template: string) => {
    navigator.clipboard.writeText(template)
    // 这里可以添加提示消息
  }

  // 添加组件
  const handleAddComponent = () => {
    if (!newComponent.name || !newComponent.description || !newComponent.template) {
      alert('请填写所有必填字段')
      return
    }

    const componentId = newComponent.name.replace(/\s+/g, '-').toLowerCase()
    const componentData: Partial<ComponentInfo> = {
      name: newComponent.name,
      description: newComponent.description,
      category: newComponent.category || 'UI组件',
      template: newComponent.template,
      tags: newComponent.tags || [],
      version: '1.0.0',
      author: 'User',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 使用 ComponentManager 注册组件
    ComponentManager.registerComponent(componentId, null, componentData)
    
    // 刷新组件列表
    loadComponents()
    
    // 重置表单
    setNewComponent({
      name: '',
      description: '',
      category: 'UI组件',
      template: '',
      tags: []
    })
    setIsAddDialogOpen(false)
  }

  // 编辑组件
  const handleEditComponent = () => {
    if (!selectedComponent || !newComponent.name || !newComponent.description || !newComponent.template) {
      alert('请填写所有必填字段')
      return
    }

    const updates: Partial<ComponentInfo> = {
      name: newComponent.name,
      description: newComponent.description,
      category: newComponent.category || 'UI组件',
      template: newComponent.template,
      tags: newComponent.tags || [],
      updatedAt: new Date()
    }

    // 使用 ComponentManager 更新组件
    const success = ComponentManager.updateComponent(selectedComponent.id, updates)
    
    if (success) {
      // 刷新组件列表
      loadComponents()
      
      // 关闭编辑对话框
      setIsEditDialogOpen(false)
      setSelectedComponent(null)
      
      // 重置表单
      setNewComponent({
        name: '',
        description: '',
        category: 'UI组件',
        template: '',
        tags: []
      })
    } else {
      alert('编辑失败，请重试')
    }
  }

  // 删除组件
  const handleDeleteComponent = (id: string) => {
    if (confirm('确定要删除这个组件吗？')) {
      const success = ComponentManager.removeComponent(id)
      if (success) {
        loadComponents()
      } else {
        alert('删除失败，请重试')
      }
    }
  }

  // 开始编辑组件
  const startEditComponent = (component: ComponentInfo) => {
    setSelectedComponent(component)
    setNewComponent({
      name: component.name,
      description: component.description,
      category: component.category,
      template: component.template,
      tags: component.tags || []
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
          <Button variant="outline" onClick={loadComponents}>
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
                      onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
                      placeholder="MyComponent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">分类</label>
                    <select
                      value={newComponent.category}
                      onChange={(e) => setNewComponent({...newComponent, category: e.target.value as ComponentCategory})}
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
                    onChange={(e) => setNewComponent({...newComponent, description: e.target.value})}
                    placeholder="组件的功能描述"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">模板代码</label>
                  <textarea
                    value={newComponent.template}
                    onChange={(e) => setNewComponent({...newComponent, template: e.target.value})}
                    placeholder=":::react{component=&quot;MyComponent&quot;}&#10;组件内容&#10;:::"
                    className="w-full h-32 p-3 text-sm font-mono rounded-md border border-input bg-background resize-none"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">标签 (逗号分隔)</label>
                  <Input
                    value={newComponent.tags?.join(', ')}
                    onChange={(e) => setNewComponent({
                      ...newComponent, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
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
                <p className="text-2xl font-bold">{components.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">分类数量</p>
                <p className="text-2xl font-bold">{categories.length - 1}</p>
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
                <p className="text-lg font-bold">{selectedCategory}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 组件列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map((component) => (
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
                    {component.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
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
                    onClick={() => setSelectedComponent(component)}
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
                  <div>创建: {component.createdAt?.toLocaleDateString()}</div>
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
                  onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
                  placeholder="MyComponent"
                />
              </div>
              <div>
                <label className="text-sm font-medium">分类</label>
                <select
                  value={newComponent.category}
                  onChange={(e) => setNewComponent({...newComponent, category: e.target.value as ComponentCategory})}
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
                onChange={(e) => setNewComponent({...newComponent, description: e.target.value})}
                placeholder="组件的功能描述"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">模板代码</label>
              <textarea
                value={newComponent.template}
                onChange={(e) => setNewComponent({...newComponent, template: e.target.value})}
                placeholder=":::react{component=&quot;MyComponent&quot;}&#10;组件内容&#10;:::"
                className="w-full h-32 p-3 text-sm font-mono rounded-md border border-input bg-background resize-none"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">标签 (逗号分隔)</label>
              <Input
                value={Array.isArray(newComponent.tags) ? newComponent.tags.join(', ') : ''}
                onChange={(e) => setNewComponent({
                  ...newComponent, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="UI, 按钮, 交互"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setSelectedComponent(null)
              setNewComponent({
                name: '',
                description: '',
                category: 'UI组件',
                template: '',
                tags: []
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
      {selectedComponent && (
        <Dialog open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Component className="h-5 w-5" />
                {selectedComponent.name}
              </DialogTitle>
              <DialogDescription>
                {selectedComponent.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">基本信息</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>分类:</strong> {selectedComponent.category}</div>
                    <div><strong>版本:</strong> {selectedComponent.version}</div>
                    <div><strong>作者:</strong> {selectedComponent.author}</div>
                    <div><strong>创建时间:</strong> {selectedComponent.createdAt?.toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">标签</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedComponent.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 模板代码 */}
              <div>
                <h4 className="font-medium mb-2">模板代码</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {selectedComponent.template}
                  </pre>
                </div>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => copyTemplate(selectedComponent.template)}
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