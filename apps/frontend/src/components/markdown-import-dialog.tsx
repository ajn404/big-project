import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui-components'
import { useMutation } from '@apollo/client'
import { CREATE_PRACTICE_NODE } from '@/lib/graphql/mutations'
import { Button } from '@workspace/ui-components'
import { Input } from '@workspace/ui-components'
import { Badge } from '@workspace/ui-components'
import { Textarea } from '@workspace/ui-components'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui-components'
import { Upload, FileText, Download } from 'lucide-react'

interface Category {
  id: string
  name: string
  color?: string
}

interface Tag {
  id: string
  name: string
}

interface MarkdownImportDialogProps {
  categories: Category[]
  tags: Tag[]
  open: boolean
  onClose: () => void
  onImportComplete: () => void
}

type DifficultyType = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

const DIFFICULTY_OPTIONS = [
  { value: 'BEGINNER' as const, label: '初级' },
  { value: 'INTERMEDIATE' as const, label: '中级' },
  { value: 'ADVANCED' as const, label: '高级' },
]

interface FrontmatterData {
  [key: string]: string | string[] | number | undefined
  title?: string
  description?: string
  excerpt?: string
  category?: string
  tags?: string[]
  keywords?: string[]
  difficulty?: string
  estimatedTime?: string
  readingTime?: string
  prerequisites?: string[]
  requires?: string[]
}

export function MarkdownImportDialog({ categories, open, onClose, onImportComplete }: MarkdownImportDialogProps) {
  const [importMethod, setImportMethod] = useState<'file' | 'url' | 'text'>('file')
  const [markdownContent, setMarkdownContent] = useState('')
  const [url, setUrl] = useState('')
  const [parsing, setParsing] = useState(false)
  const [parsedData, setParsedData] = useState<any>(null)

  // Form data for the parsed article
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryName: '',
    tagNames: [] as string[],
    difficulty: 'BEGINNER' as DifficultyType,
    estimatedTime: 30,
    prerequisites: [] as string[],
  })

  const [createPracticeNode, { loading }] = useMutation(CREATE_PRACTICE_NODE, {
    onCompleted: () => {
      onImportComplete()
    },
    onError: (error) => {
      console.error('导入失败:', error)
      alert('导入失败，请检查数据格式')
    }
  })

  const parseMarkdown = (content: string) => {
    setParsing(true)
    
    try {
      // Extract frontmatter if present
      const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
      let frontmatter: FrontmatterData = {}
      let mainContent = content

      if (frontmatterMatch) {
        // Parse YAML frontmatter (simplified)
        const yamlContent = frontmatterMatch[1]
        const lines = yamlContent.split('\n')
        for (const line of lines) {
          const [key, ...valueParts] = line.split(':')
          if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim()
            const cleanKey = key.trim()
            if (value.startsWith('[') && value.endsWith(']')) {
              // Parse array
              frontmatter[cleanKey] = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''))
            } else {
              frontmatter[cleanKey] = value.replace(/['"]/g, '')
            }
          }
        }
        mainContent = frontmatterMatch[2]
      }

      // Extract title from first h1 if not in frontmatter
      let title = frontmatter['title'] || ''
      if (!title) {
        const h1Match = mainContent.match(/^#\s+(.+)$/m)
        if (h1Match) {
          title = h1Match[1].trim()
          // Remove the h1 from content since it will be the title
          mainContent = mainContent.replace(/^#\s+.+$/m, '').trim()
        }
      }

      // Extract description from frontmatter or first paragraph
      let description = frontmatter['description'] || frontmatter['excerpt'] || ''
      if (!description) {
        const paragraphMatch = mainContent.match(/^(.+?)(?:\n\n|\n#|\n>|$)/s)
        if (paragraphMatch) {
          description = paragraphMatch[1].replace(/\n/g, ' ').trim()
          if (description.length > 200) {
            description = description.substring(0, 200) + '...'
          }
        }
      }

      // Parse other metadata
      const tags = (frontmatter.tags || frontmatter.keywords || []) as string[]
      const category = (frontmatter.category || '') as string
      const difficulty = (frontmatter.difficulty || 'BEGINNER') as DifficultyType
      const estimatedTime = parseInt(String(frontmatter.estimatedTime || frontmatter.readingTime || '30'))
      const prerequisites = (frontmatter.prerequisites || frontmatter.requires || []) as string[]

      const parsed = {
        title: title || 'Untitled',
        description: description || '从 Markdown 导入的文章',
        content: mainContent,
        categoryName: category,
        tagNames: Array.isArray(tags) ? tags : [],
        difficulty: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(difficulty) ? difficulty : 'BEGINNER',
        estimatedTime: isNaN(estimatedTime) ? 30 : estimatedTime,
        prerequisites: Array.isArray(prerequisites) ? prerequisites : [],
      }

      setParsedData(parsed)
      setFormData(parsed)
    } catch (error) {
      console.error('解析 Markdown 失败:', error)
      alert('解析 Markdown 失败，请检查格式')
    } finally {
      setParsing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type === 'text/markdown' || file.name.endsWith('.md') || file.name.endsWith('.markdown'))) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setMarkdownContent(content)
        parseMarkdown(content)
      }
      reader.readAsText(file)
    } else {
      alert('请选择 .md 或 .markdown 文件')
    }
  }

  const handleUrlImport = async () => {
    if (!url.trim()) return

    try {
      setParsing(true)
      const response = await fetch(url)
      const content = await response.text()
      setMarkdownContent(content)
      parseMarkdown(content)
    } catch (error) {
      console.error('从 URL 导入失败:', error)
      alert('从 URL 导入失败，请检查 URL 是否正确')
    } finally {
      setParsing(false)
    }
  }

  const handleTextImport = () => {
    if (!markdownContent.trim()) return
    parseMarkdown(markdownContent)
  }

  const handleInputChange = (field: string, value: string | string[] | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImport = async () => {
    if (!formData.title || !formData.description) {
      alert('请填写标题和描述')
      return
    }

    try {
      await createPracticeNode({
        variables: {
          input: {
            ...formData,
            content: markdownContent,
            contentType: 'MDX',
          }
        }
      })
    } catch (error) {
      console.error('导入失败:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>导入 Markdown 文章</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0 space-y-6">
          {/* Import Method Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">导入方式</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={importMethod === 'file' ? 'default' : 'outline'}
                onClick={() => setImportMethod('file')}
              >
                <Upload className="h-4 w-4 mr-2" />
                文件上传
              </Button>
              <Button
                type="button"
                variant={importMethod === 'url' ? 'default' : 'outline'}
                onClick={() => setImportMethod('url')}
              >
                <Download className="h-4 w-4 mr-2" />
                URL 导入
              </Button>
              <Button
                type="button"
                variant={importMethod === 'text' ? 'default' : 'outline'}
                onClick={() => setImportMethod('text')}
              >
                <FileText className="h-4 w-4 mr-2" />
                文本粘贴
              </Button>
            </div>
          </div>

          {/* Import Methods */}
          {importMethod === 'file' && (
            <div>
              <label className="block text-sm font-medium mb-2">选择 Markdown 文件</label>
              <input
                type="file"
                accept=".md,.markdown"
                onChange={handleFileUpload}
                className="w-full p-2 border border-input rounded-md"
              />
              <p className="text-xs text-muted-foreground mt-1">
                支持带有 YAML 前言的 Markdown 文件
              </p>
            </div>
          )}

          {importMethod === 'url' && (
            <div>
              <label className="block text-sm font-medium mb-2">Markdown 文件 URL</label>
              <div className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="输入 Markdown 文件的 URL"
                />
                <Button onClick={handleUrlImport} disabled={parsing}>
                  {parsing ? '导入中...' : '导入'}
                </Button>
              </div>
            </div>
          )}

          {importMethod === 'text' && (
            <div>
              <label className="block text-sm font-medium mb-2">Markdown 内容</label>
              <Textarea
                className="w-full p-3 border border-input rounded-md font-mono text-sm"
                rows={10}
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                placeholder="粘贴 Markdown 内容..."
              />
              <div className="mt-2">
                <Button onClick={handleTextImport} disabled={parsing}>
                  {parsing ? '解析中...' : '解析内容'}
                </Button>
              </div>
            </div>
          )}

          {/* Frontmatter Example */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">支持的 YAML 前言格式:</h4>
            <pre className="text-xs overflow-x-auto">
{`---
title: "文章标题"
description: "文章描述"
category: "分类名称"
tags: ["标签1", "标签2"]
difficulty: "BEGINNER"  # BEGINNER, INTERMEDIATE, ADVANCED
estimatedTime: 30
prerequisites: ["前置要求1", "前置要求2"]
---

# 文章内容开始

这里是文章的正文内容...`}
            </pre>
          </div>

          {/* Parsed Data Preview */}
          {parsedData && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">解析结果预览</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">标题 *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">分类 *</label>
                  <Select
                    value={formData.categoryName}
                    onValueChange={(value) => handleInputChange('categoryName', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">选择分类</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">描述 *</label>
                  <Textarea
                    className="w-full p-3 border border-input rounded-md resize-none"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">难度</label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleInputChange('difficulty', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择难度" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">预估时长 (分钟)</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.estimatedTime}
                    onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value) || 30)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">标签</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.tagNames.map((tagName) => (
                      <Badge key={tagName} variant="secondary">
                        {tagName}
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="添加标签，用逗号分隔"
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      handleInputChange('tagNames', tags)
                    }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">前置要求</label>
                  <ul className="space-y-1">
                    {formData.prerequisites.map((req, index) => (
                      <li key={index} className="bg-muted p-2 rounded">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            {parsedData && (
              <Button onClick={handleImport} disabled={loading}>
                {loading ? '导入中...' : '导入文章'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}