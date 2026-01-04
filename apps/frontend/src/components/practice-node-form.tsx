import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_PRACTICE_NODE, UPDATE_PRACTICE_NODE } from '@/lib/graphql/mutations'
import { Button } from '@workspace/ui-components'
import { Input } from '@workspace/ui-components'
import { Badge } from '@workspace/ui-components'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui-components'
import { Save, X } from 'lucide-react'
import { EnhancedMDXEditor } from './enhanced-mdx-editor'
import { Textarea } from '@workspace/ui-components'
import { DialogDescription } from '@radix-ui/react-dialog'

interface Category {
  id: string
  name: string
  color?: string
}

interface Tag {
  id: string
  name: string
}

interface PracticeNode {
  id: string
  title: string
  description: string
  content: string
  contentType: 'MDX' | 'COMPONENT'
  componentName?: string
  category: Category
  tags: Tag[]
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  estimatedTime: number
  prerequisites: string[]
}

interface PracticeNodeFormProps {
  node?: PracticeNode
  categories: Category[]
  tags: Tag[]
  open: boolean
  onClose: () => void
}

const DIFFICULTY_OPTIONS = [
  { value: 'BEGINNER', label: '初级', color: 'bg-green-100 text-green-800' },
  { value: 'INTERMEDIATE', label: '中级', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ADVANCED', label: '高级', color: 'bg-red-100 text-red-800' },
]

const CONTENT_TYPE_OPTIONS = [
  { value: 'MDX', label: 'MDX 文章' },
  { value: 'COMPONENT', label: 'React 组件' },
]

export function PracticeNodeForm({ node, categories, tags, open, onClose }: PracticeNodeFormProps) {
  const isEditing = !!node

  // Form state
  const [formData, setFormData] = useState({
    title: node?.title || '',
    description: node?.description || '',
    content: node?.content || '',
    contentType: node?.contentType || 'MDX',
    componentName: node?.componentName || '',
    categoryName: node?.category?.name || '',
    tagNames: node?.tags?.map((t: any) => t.name) || [],
    difficulty: node?.difficulty || 'BEGINNER',
    estimatedTime: node?.estimatedTime || 30,
    prerequisites: node?.prerequisites || [],
  })

  const [newPrerequisite, setNewPrerequisite] = useState('')
  const [availableTags] = useState(tags.map(tag => tag.name))
  const [tagInput, setTagInput] = useState('')

  // 当node变化时更新表单数据（用于编辑模式）
  useEffect(() => {
    if (node) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        content: node.content || '',
        contentType: node.contentType || 'MDX',
        componentName: node.componentName || '',
        categoryName: node.category?.name || '',
        tagNames: node.tags?.map((t: any) => t.name) || [],
        difficulty: node.difficulty || 'BEGINNER',
        estimatedTime: node.estimatedTime || 30,
        prerequisites: node.prerequisites || [],
      })
    } else {
      // 重置为新建模式的默认值
      setFormData({
        title: '',
        description: '',
        content: '',
        contentType: 'MDX',
        componentName: '',
        categoryName: '',
        tagNames: [],
        difficulty: 'BEGINNER',
        estimatedTime: 30,
        prerequisites: [],
      })
    }
    // 重置其他状态
    setNewPrerequisite('')
    setTagInput('')
  }, [node])

  // 当弹窗关闭时重置状态
  useEffect(() => {
    if (!open) {
      // 延迟重置，避免关闭动画时看到状态变化
      const timer = setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          content: '',
          contentType: 'MDX',
          componentName: '',
          categoryName: '',
          tagNames: [],
          difficulty: 'BEGINNER',
          estimatedTime: 30,
          prerequisites: [],
        })
        setNewPrerequisite('')
        setTagInput('')
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [open])

  const [createPracticeNode, { loading: createLoading }] = useMutation(CREATE_PRACTICE_NODE, {
    onError: (error) => console.error('创建失败:', error)
  })

  const [updatePracticeNode, { loading: updateLoading }] = useMutation(UPDATE_PRACTICE_NODE, {
    onError: (error) => console.error('更新失败:', error)
  })

  const loading = createLoading || updateLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.categoryName) {
      alert('请填写必填字段')
      return
    }
    try {
      if (isEditing) {
        await updatePracticeNode({
          variables: {
            input: {
              id: node.id,
              ...formData,
              estimatedTime: parseInt(formData.estimatedTime.toString()),
            }
          }
        })
      } else {
        await createPracticeNode({
          variables: {
            input: {
              ...formData,
              estimatedTime: parseInt(formData.estimatedTime.toString()),
            }
          }
        })
      }
      onClose()  // 在这里手动关闭
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }))
      setNewPrerequisite('')
    }
  }

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_: string, i: number) => i !== index)
    }))
  }

  const addTag = (tagName: string) => {
    if (tagName && !formData.tagNames.includes(tagName)) {
      setFormData(prev => ({
        ...prev,
        tagNames: [...prev.tagNames, tagName]
      }))
    }
    setTagInput('')
  }

  const removeTag = (tagName: string) => {
    setFormData(prev => ({
      ...prev,
      tagNames: prev.tagNames.filter((name: string) => name !== tagName)
    }))
  }

  const handleEscapeKeyDown = (e: KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent
        className="w-full max-w-full max-h-full overflow-auto p-0"
        onEscapeKeyDown={handleEscapeKeyDown}
        onInteractOutside={(e) => { e.preventDefault() }}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{isEditing ? '编辑文章' : '创建新文章'}</DialogTitle>
          <DialogDescription>美好的一天开始了🙂</DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-0">
          <form onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.tagName === 'BUTTON' && !(target as HTMLButtonElement).type) {
              e.preventDefault()
            }
          }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium mb-2">标题 *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="输入文章标题"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">描述 *</label>
                  <Textarea
                    className="w-full p-3 border border-input rounded-md resize-none"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="输入文章描述"
                    required
                  />
                </div>

                {/* Content Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">内容类型</label>
                  <div className="flex gap-2">
                    {CONTENT_TYPE_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={formData.contentType === option.value ? 'default' : 'outline'}
                        onClick={() => handleInputChange('contentType', option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Component Name (only for COMPONENT type) */}
                {formData.contentType === 'COMPONENT' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">组件名称</label>
                    <Input
                      value={formData.componentName}
                      onChange={(e) => handleInputChange('componentName', e.target.value)}
                      placeholder="输入组件名称，如: MyButton"
                    />
                  </div>
                )}

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">分类 *</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={formData.categoryName}
                      onChange={(e) => handleInputChange('categoryName', e.target.value)}
                      placeholder="输入分类名称或选择已有分类"
                      list="categories-list"
                      required
                    />
                    <datalist id="categories-list">
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </datalist>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    可选分类: {categories.map(cat => cat.name).slice(0, 5).join(', ')}
                    {categories.length > 5 && '...'}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium mb-2">难度</label>
                  <div className="flex gap-2">
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={formData.difficulty === option.value ? 'default' : 'outline'}
                        onClick={() => handleInputChange('difficulty', option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Estimated Time */}
                <div>
                  <label className="block text-sm font-medium mb-2">预估时长 (分钟)</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.estimatedTime}
                    onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value) || 30)}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">标签</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="输入标签名称"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag(tagInput)
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addTag(tagInput)}>
                      添加
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.tagNames.map((tagName) => (
                      <Badge key={tagName} variant="secondary" className="cursor-pointer">
                        {tagName}
                        <button
                          type="button"
                          onClick={() => removeTag(tagName)}
                          className="ml-1 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    可选标签: {availableTags.filter(tag => !formData.tagNames.includes(tag)).slice(0, 10).join(', ')}
                  </div>
                </div>

                {/* Prerequisites */}
                <div>
                  <label className="block text-sm font-medium mb-2">前置要求</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newPrerequisite}
                      onChange={(e) => setNewPrerequisite(e.target.value)}
                      placeholder="输入前置要求"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addPrerequisite()
                        }
                      }}
                    />
                    <Button type="button" onClick={addPrerequisite}>
                      添加
                    </Button>
                  </div>
                  {formData.prerequisites.length > 0 && (
                    <ul className="space-y-1">
                      {formData.prerequisites.map((req, index) => (
                        <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span>{req}</span>
                          <button
                            type="button"
                            onClick={() => removePrerequisite(index)}
                            className="text-destructive hover:bg-destructive/10 rounded p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Right Column - Content Editor/Preview */}
              <div className="space-y-4">
                {formData.contentType === 'MDX' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">MDX 内容</label>
                    <EnhancedMDXEditor
                      value={formData.content}
                      onChange={(value) => handleInputChange('content', value)}
                      placeholder="输入 MDX 内容，支持 Markdown 语法和实时预览..."
                      height="600px"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button type="submit" disabled={loading} onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? '保存中...' : (isEditing ? '更新' : '创建')}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}