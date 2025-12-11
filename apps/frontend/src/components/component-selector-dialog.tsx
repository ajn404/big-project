import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Button, Badge } from '@workspace/ui-components'
import { Search, Component, Code, Palette, Grid, Zap } from 'lucide-react'

interface ComponentTemplate {
  name: string
  description: string
  category: string
  template: string
}

interface ComponentSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (template: string) => void
  componentTemplates: ComponentTemplate[]
}

export function ComponentSelectorDialog({
  open,
  onOpenChange,
  onSelect,
  componentTemplates
}: ComponentSelectorDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')

  // 获取所有分类
  const categories = useMemo(() => {
    const cats = ['全部', ...Array.from(new Set(componentTemplates.map(t => t.category)))]
    return cats
  }, [componentTemplates])

  // 过滤组件
  const filteredComponents = useMemo(() => {
    return componentTemplates.filter(component => {
      const matchesSearch = searchQuery === '' || 
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === '全部' || component.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [componentTemplates, searchQuery, selectedCategory])

  // 按分类分组
  const groupedComponents = useMemo(() => {
    const groups: Record<string, ComponentTemplate[]> = {}
    filteredComponents.forEach(component => {
      if (!groups[component.category]) {
        groups[component.category] = []
      }
      groups[component.category].push(component)
    })
    return groups
  }, [filteredComponents])

  const handleSelect = (template: string) => {
    onSelect(template)
    onOpenChange(false)
    // 清除搜索状态
    setSearchQuery('')
    setSelectedCategory('全部')
  }

  // 分类图标映射
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'UI组件': return <Grid className="h-4 w-4" />
      case '提示组件': return <Zap className="h-4 w-4" />
      case '代码块': return <Code className="h-4 w-4" />
      case '文本格式': return <Palette className="h-4 w-4" />
      default: return <Component className="h-4 w-4" />
    }
  }

  // 分类颜色映射
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'UI组件': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case '提示组件': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case '代码块': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case '文本格式': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Component className="h-5 w-5" />
            组件选择器
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 搜索栏 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索组件名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="h-8"
              >
                {category !== '全部' && getCategoryIcon(category)}
                <span className={category !== '全部' ? 'ml-1' : ''}>{category}</span>
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 px-1.5 text-xs"
                >
                  {category === '全部' 
                    ? componentTemplates.length 
                    : componentTemplates.filter(t => t.category === category).length
                  }
                </Badge>
              </Button>
            ))}
          </div>

          {/* 组件列表 */}
          <div className="border rounded-lg max-h-96 overflow-y-auto">
            {Object.keys(groupedComponents).length > 0 ? (
              <div className="space-y-1">
                {Object.entries(groupedComponents).map(([category, components]) => (
                  <div key={category}>
                    {/* 分类标题 - 仅在非搜索状态显示 */}
                    {searchQuery === '' && selectedCategory === '全部' && (
                      <div className="sticky top-0 bg-muted/50 px-4 py-2 border-b">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          <span className="font-medium text-sm">{category}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {components.length}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {/* 组件列表 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                      {components.map((component, index) => (
                        <Button
                          key={`${category}-${index}`}
                          variant="ghost"
                          className="h-auto p-4 flex flex-col items-start text-left hover:bg-accent justify-start"
                          onClick={() => handleSelect(component.template)}
                        >
                          {/* 组件头部 */}
                          <div className="flex items-center justify-between w-full mb-2">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-sm">
                                {component.name}
                              </div>
                              <Badge 
                                className={`text-xs ${getCategoryColor(component.category)}`}
                                variant="secondary"
                              >
                                {component.category}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* 组件描述 */}
                          <div className="text-xs text-muted-foreground text-left line-clamp-2 w-full">
                            {component.description}
                          </div>

                          {/* 模板预览 */}
                          <div className="mt-2 w-full">
                            <div className="text-xs font-mono bg-muted/50 p-2 rounded text-left overflow-hidden">
                              <div className="truncate">
                                {component.template.split('\\n')[0] || component.template}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* 空状态 */
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mb-4 opacity-50" />
                <div className="text-center">
                  <div className="font-medium mb-2">未找到匹配的组件</div>
                  <div className="text-sm">
                    {searchQuery ? '尝试修改搜索关键词' : '选择其他分类'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 统计信息 */}
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
            <div>
              显示 {filteredComponents.length} / {componentTemplates.length} 个组件
            </div>
            <div className="flex items-center gap-4">
              <span>💡 提示：点击组件卡片即可插入</span>
              <kbd className="px-2 py-1 text-xs bg-muted rounded">ESC</kbd>
              <span>关闭</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}