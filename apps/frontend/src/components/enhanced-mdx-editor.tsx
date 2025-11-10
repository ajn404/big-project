import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bold, 
  Italic, 
  Code, 
  Link, 
  List, 
  ListOrdered, 
  Quote, 
  Image,
  Eye,
  EyeOff,
  Heading1,
  Heading2,
  Heading3,
  Table,
  Minus
} from 'lucide-react'
import { MDXRenderer } from './mdx-renderer'

interface EnhancedMDXEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
}

export function EnhancedMDXEditor({ 
  value, 
  onChange, 
  placeholder = "输入 Markdown 内容...",
  height = "400px"
}: EnhancedMDXEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 工具栏操作
  const insertText = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const textToInsert = selectedText || defaultText
    
    const newText = 
      textarea.value.substring(0, start) +
      before + textToInsert + after +
      textarea.value.substring(end)
    
    onChange(newText)

    // 重新聚焦并设置光标位置
    setTimeout(() => {
      textarea.focus()
      const newStart = start + before.length
      const newEnd = newStart + textToInsert.length
      textarea.setSelectionRange(newStart, newEnd)
    }, 0)
  }

  const insertAtNewLine = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const beforeCursor = textarea.value.substring(0, start)
    const afterCursor = textarea.value.substring(start)
    
    // 检查是否需要添加换行符
    const needsNewlineBefore = beforeCursor.length > 0 && !beforeCursor.endsWith('\n')
    const needsNewlineAfter = afterCursor.length > 0 && !afterCursor.startsWith('\n')
    
    const prefix = needsNewlineBefore ? '\n' : ''
    const suffix = needsNewlineAfter ? '\n' : ''
    
    const newText = beforeCursor + prefix + text + suffix + afterCursor
    onChange(newText)
    
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + prefix.length + text.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  // 工具栏按钮配置
  const toolbarButtons = [
    {
      group: '标题',
      buttons: [
        { icon: Heading1, label: 'H1', action: () => insertAtNewLine('# 标题') },
        { icon: Heading2, label: 'H2', action: () => insertAtNewLine('## 标题') },
        { icon: Heading3, label: 'H3', action: () => insertAtNewLine('### 标题') },
      ]
    },
    {
      group: '格式',
      buttons: [
        { icon: Bold, label: '粗体', action: () => insertText('**', '**', '粗体文本') },
        { icon: Italic, label: '斜体', action: () => insertText('*', '*', '斜体文本') },
        { icon: Code, label: '代码', action: () => insertText('`', '`', '代码') },
      ]
    },
    {
      group: '列表',
      buttons: [
        { icon: List, label: '无序列表', action: () => insertAtNewLine('- 列表项') },
        { icon: ListOrdered, label: '有序列表', action: () => insertAtNewLine('1. 列表项') },
        { icon: Quote, label: '引用', action: () => insertAtNewLine('> 引用内容') },
      ]
    },
    {
      group: '插入',
      buttons: [
        { 
          icon: Link, 
          label: '链接', 
          action: () => insertText('[', '](url)', '链接文本') 
        },
        { 
          icon: Image, 
          label: '图片', 
          action: () => insertText('![', '](image-url)', '图片描述') 
        },
        { 
          icon: Table, 
          label: '表格', 
          action: () => insertAtNewLine('| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 内容1 | 内容2 | 内容3 |') 
        },
        { 
          icon: Minus, 
          label: '分割线', 
          action: () => insertAtNewLine('---') 
        },
      ]
    }
  ]

  // 快捷键处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          insertText('**', '**', '粗体文本')
          break
        case 'i':
          e.preventDefault()
          insertText('*', '*', '斜体文本')
          break
        case 'k':
          e.preventDefault()
          insertText('[', '](url)', '链接文本')
          break
        case '`':
          e.preventDefault()
          insertText('`', '`', '代码')
          break
      }
    }

    // Tab 键处理
    if (e.key === 'Tab') {
      e.preventDefault()
      insertText('  ', '', '')
    }
  }

  // 自动补全括号
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  // 实时预览模式切换
  const togglePreview = () => {
    setIsPreview(!isPreview)
  }

  return (
    <div className="border border-input rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="bg-muted p-2 border-b border-border">
        <div className="flex flex-wrap items-center gap-1">
          {toolbarButtons.map((group, groupIndex) => (
            <div key={groupIndex} className="flex items-center gap-1">
              {group.buttons.map((button, buttonIndex) => {
                const Icon = button.icon
                return (
                  <Button
                    key={buttonIndex}
                    variant="ghost"
                    size="sm"
                    onClick={button.action}
                    className="h-8 w-8 p-0"
                    title={button.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                )
              })}
              {groupIndex < toolbarButtons.length - 1 && (
                <div className="w-px h-6 bg-border mx-1" />
              )}
            </div>
          ))}
          
          <div className="w-px h-6 bg-border mx-1" />
          
          {/* 预览切换 */}
          <Button
            variant={isPreview ? "default" : "ghost"}
            size="sm"
            onClick={togglePreview}
            className="h-8"
          >
            {isPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {isPreview ? '编辑' : '预览'}
          </Button>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="flex" style={{ height }}>
        {/* 编辑器 */}
        {!isPreview && (
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full h-full p-4 font-mono text-sm resize-none border-0 outline-none bg-background"
              style={{ minHeight: height }}
            />
            
            {/* 行号 (可选) */}
            <div className="absolute left-0 top-0 p-4 text-xs text-muted-foreground bg-muted/50 pointer-events-none">
              {value.split('\n').map((_, index) => (
                <div key={index} className="h-5 leading-5">
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 预览 */}
        {isPreview && (
          <div className="flex-1 p-4 overflow-auto bg-background">
            <MDXRenderer content={value} />
          </div>
        )}

        {/* 分屏模式 */}
        {!isPreview && value && (
          <div className="w-px bg-border" />
        )}
      </div>

      {/* 状态栏 */}
      <div className="bg-muted px-4 py-2 text-xs text-muted-foreground border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>字符数: {value.length}</span>
          <span>行数: {value.split('\n').length}</span>
          <span>预估阅读时间: {Math.ceil(value.length / 500)} 分钟</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* 快捷键提示 */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Ctrl+B 粗体</Badge>
            <Badge variant="outline" className="text-xs">Ctrl+I 斜体</Badge>
            <Badge variant="outline" className="text-xs">Ctrl+K 链接</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}