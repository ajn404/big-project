import { useState, useRef, useEffect, useCallback } from 'react'
import { Textarea, Button, Badge } from '@workspace/ui-components'
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
  Minus,
  Component,
  Maximize,
  Minimize,
  Undo,
  Redo
} from 'lucide-react'
import { MDXRenderer } from './mdx-renderer'
import { AssetSelectorDialog } from './asset-selector-dialog'
import { ComponentSelectorDialog } from './component-selector-dialog'
import { AssetType, Asset } from '@/types/asset'
import ComponentManager from '@/utils/component-manager'

interface EnhancedMDXEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
  onFullscreenChange?: (isFullscreen: boolean) => void
}

// 历史记录类型
interface HistoryState {
  content: string
  selection: { start: number; end: number }
}

export function EnhancedMDXEditor({
  value,
  onChange,
  placeholder = "输入 Markdown 内容...",
  height = "400px",
  onFullscreenChange
}: EnhancedMDXEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [showComponentDialog, setShowComponentDialog] = useState(false)
  const [showAssetSelector, setShowAssetSelector] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // 撤销/重做历史记录
  const [history, setHistory] = useState<HistoryState[]>([{ content: value, selection: { start: 0, end: 0 } }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const isUndoRedoRef = useRef(false)


  // 组件模板库 - 动态从组件管理器获取
  const [componentTemplates, setComponentTemplates] = useState<Array<{
    name: string
    description: string
    category: string
    template: string
  }>>([])

  // 保存历史记录
  const saveToHistory = useCallback((content: string, selection: { start: number; end: number }) => {
    if (isUndoRedoRef.current) return

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push({ content, selection })
      
      // 限制历史记录长度
      if (newHistory.length > 100) {
        newHistory.shift()
        setHistoryIndex(prev => prev - 1)
      }
      
      return newHistory
    })
    setHistoryIndex(prev => prev + 1)
  }, [historyIndex])

  // 撤销功能
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      isUndoRedoRef.current = true
      onChange(prevState.content)
      setHistoryIndex(prev => prev - 1)
      
      setTimeout(() => {
        const textarea = textareaRef.current
        if (textarea) {
          textarea.focus()
          textarea.setSelectionRange(prevState.selection.start, prevState.selection.end)
        }
        isUndoRedoRef.current = false
      }, 0)
    }
  }, [historyIndex, history, onChange])

  // 重做功能
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      isUndoRedoRef.current = true
      onChange(nextState.content)
      setHistoryIndex(prev => prev + 1)
      
      setTimeout(() => {
        const textarea = textareaRef.current
        if (textarea) {
          textarea.focus()
          textarea.setSelectionRange(nextState.selection.start, nextState.selection.end)
        }
        isUndoRedoRef.current = false
      }, 0)
    }
  }, [historyIndex, history, onChange])

  const toggleFullscreen = () => {
    const newFullscreenState = !isFullscreen
    setIsFullscreen(newFullscreenState)

    // 通知父组件全屏状态变化
    onFullscreenChange?.(newFullscreenState)

    // 进入全屏时，确保退出预览模式（因为全屏已经是双栏显示）
    if (newFullscreenState && isPreview) {
      setIsPreview(false)
    }
  }

  // 处理全屏模式的键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
      // F11 键切换全屏
      if (e.key === 'F11') {
        e.preventDefault()
        setIsFullscreen(!isFullscreen)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
      // 防止页面滚动
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isFullscreen])


  useEffect(() => {
    // 获取注册的React组件
    const registeredComponents = ComponentManager.generateMDXTemplates()

    // 静态模板
    const staticTemplates = [
      // 基础UI组件
      {
        name: 'Button',
        description: '按钮组件',
        category: 'UI组件',
        template: `:::button\n点击我\n:::`
      },
      {
        name: 'Card',
        description: '卡片布局',
        category: 'UI组件',
        template: `:::card\n## 卡片标题\n\n这是卡片内容，支持**Markdown**格式。\n\n- 列表项1\n- 列表项2\n:::`
      },

      // 提示组件
      {
        name: 'Info Alert',
        description: '信息提示',
        category: '提示组件',
        template: `:::alert{type="info"}\n这是一个信息提示\n:::`
      },
      {
        name: 'Warning Alert',
        description: '警告提示',
        category: '提示组件',
        template: `:::alert{type="warning"}\n这是一个警告提示\n:::`
      },
      {
        name: 'Success Alert',
        description: '成功提示',
        category: '提示组件',
        template: `:::alert{type="success"}\n这是一个成功提示\n:::`
      },
      {
        name: 'Error Alert',
        description: '错误提示',
        category: '提示组件',
        template: `:::alert{type="error"}\n这是一个错误提示\n:::`
      },

      // 代码相关
      {
        name: 'TypeScript',
        description: 'TypeScript代码',
        category: '代码块',
        template: `\`\`\`typescript\ninterface User {\n  id: number\n  name: string\n  email: string\n}\n\nconst user: User = {\n  id: 1,\n  name: 'John Doe',\n  email: 'john@example.com'\n}\n\`\`\``
      },
      {
        name: 'React Component',
        description: 'React组件代码',
        category: '代码块',
        template: `\`\`\`tsx\nimport React from 'react'\n\ninterface Props {\n  title: string\n  children: React.ReactNode\n}\n\nconst MyComponent: React.FC<Props> = ({ title, children }) => {\n  return (\n    <div className="component">\n      <h2>{title}</h2>\n      <div>{children}</div>\n    </div>\n  )\n}\n\nexport default MyComponent\n\`\`\``
      },
      {
        name: 'Code Sandbox',
        description: '代码沙箱',
        category: '代码块',
        template: `:::sandbox
return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );\n:::`
      },

      // 文本格式
      {
        name: 'Highlight',
        description: '高亮文本',
        category: '文本格式',
        template: `这是一段包含 ==高亮文本== 的内容。你可以用这种方式突出显示==重要信息==。`
      }
    ]

    // 合并静态模板和动态注册的组件
    setComponentTemplates([...staticTemplates, ...registeredComponents])
  }, [])


  // 工具栏操作
  const insertText = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const textToInsert = selectedText || defaultText

    // 保存当前状态到历史记录
    saveToHistory(textarea.value, { start, end })

    const newText =
      textarea.value.substring(0, start) +
      before + textToInsert + after +
      textarea.value.substring(end)

    onChange(newText)

    // 重新聚焦并设置光标位置，确保滚动到正确位置
    setTimeout(() => {
      textarea.focus()
      const newStart = start + before.length
      const newEnd = newStart + textToInsert.length
      textarea.setSelectionRange(newStart, newEnd)
      
      // 确保光标可见，滚动到光标位置
      const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight)
      const currentLine = textarea.value.substring(0, newStart).split('\n').length
      const scrollTop = (currentLine - 5) * lineHeight // 保持光标上方有几行可见
      textarea.scrollTop = Math.max(0, scrollTop)
    }, 0)
  }

  const insertAtNewLine = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const beforeCursor = textarea.value.substring(0, start)
    const afterCursor = textarea.value.substring(start)

    // 保存当前状态到历史记录
    saveToHistory(textarea.value, { start, end: start })

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
      
      // 确保光标可见，滚动到光标位置
      const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 20
      const currentLine = newText.substring(0, newPosition).split('\n').length
      const scrollTop = (currentLine - 5) * lineHeight // 保持光标上方有几行可见
      textarea.scrollTop = Math.max(0, scrollTop)
    }, 0)
  }

  // 工具栏按钮类型
  interface ToolbarButton {
    icon: React.ComponentType<{ className?: string }>
    label: string
    action: () => void
    disabled?: boolean
  }

  // 工具栏按钮配置
  const toolbarButtons: { group: string; buttons: ToolbarButton[] }[] = [
    {
      group: '编辑',
      buttons: [
        { 
          icon: Undo, 
          label: '撤销', 
          action: undo,
          disabled: historyIndex <= 0
        },
        { 
          icon: Redo, 
          label: '重做', 
          action: redo,
          disabled: historyIndex >= history.length - 1
        },
      ]
    },
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
          action: () => setShowAssetSelector(true)
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
    },
    {
      group: '组件',
      buttons: [
        {
          icon: Component,
          label: '插入组件',
          action: () => setShowComponentDialog(true)
        },
      ]
    }
  ]

  // 快捷键处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault()
          if (e.shiftKey) {
            redo() // Ctrl+Shift+Z 重做
          } else {
            undo() // Ctrl+Z 撤销
          }
          break
        case 'y':
          e.preventDefault()
          redo() // Ctrl+Y 重做
          break
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

  // 处理输入变化
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const textarea = e.target
    
    // 保存历史记录 (使用防抖避免过于频繁的保存)
    if (!isUndoRedoRef.current && Math.abs(newValue.length - value.length) > 5) {
      saveToHistory(value, { 
        start: textarea.selectionStart, 
        end: textarea.selectionEnd 
      })
    }
    
    onChange(newValue)
  }

  // 同步滚动处理
  const handleEditorScroll = () => {
    if (!isFullscreen || !textareaRef.current || !previewRef.current) return

    const textarea = textareaRef.current
    const preview = previewRef.current

    // 计算编辑器的滚动百分比
    const scrollTop = textarea.scrollTop
    const scrollHeight = textarea.scrollHeight - textarea.clientHeight
    const scrollPercentage = scrollHeight > 0 ? scrollTop / scrollHeight : 0

    // 同步到预览区域
    const previewScrollHeight = preview.scrollHeight - preview.clientHeight
    if (previewScrollHeight > 0) {
      preview.scrollTop = previewScrollHeight * scrollPercentage
    }
  }

  // 实时预览模式切换
  const togglePreview = () => {
    setIsPreview(!isPreview)
  }

  const handleAssetSelect = (asset: Asset) => {
    const markdownText = `![${asset.alt || asset.description || asset.name}](${asset.url})`
    insertAtNewLine(markdownText)
  }

  return (
    <div
      ref={editorRef}
      className={`border border-input rounded-lg overflow-hidden transition-all duration-200 ${isFullscreen
          ? "fixed inset-0 z-50 bg-background rounded-none border-0"
          : ""
        }`}
    >
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
                    variant={button.label === '插入组件' && showComponentDialog ? "default" : "ghost"}
                    size="sm"
                    disabled={button.disabled}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      button.action()
                    }}
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

          <Button
            variant={isFullscreen ? "default" : "ghost"}
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFullscreen()
            }}
            className="h-8 w-8 p-0"
            title={isFullscreen ? "退出全屏 (ESC)" : "全屏 (F11)"}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>

          {/* 预览切换 - 仅在非全屏模式显示 */}
          {!isFullscreen && (
            <Button
              variant={isPreview ? "default" : "ghost"}
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                togglePreview()
              }}
              className="h-8"
            >
              {isPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {isPreview ? '编辑' : '预览'}
            </Button>
          )}

          {/* 全屏模式提示 */}
          {isFullscreen && (
            <div className="text-xs text-muted-foreground px-2">
              双栏编辑模式
            </div>
          )}
        </div>
      </div>


      {/* 编辑器区域 */}
      <div
        className="flex"
        style={{
          height: isFullscreen ? "calc(100vh - 120px)" : height
        }}
      >
        {/* 全屏模式：左右分栏 */}
        {isFullscreen ? (
          <>
            {/* 左侧：编辑器 */}
            <div className="w-1/2 flex flex-col">
              {/* 编辑器标题栏 */}
              <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Markdown 编辑器</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {value.length} 字符
                </div>
              </div>

              {/* 编辑器区域 */}
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={value}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  onScroll={handleEditorScroll}
                  placeholder={placeholder}
                  className="w-full h-full p-4 font-mono text-sm resize-none border-0 outline-none bg-background"
                  style={{ minHeight: height }}
                />
              </div>
            </div>

            {/* 分隔线 */}
            <div className="w-px bg-border" />

            {/* 右侧：实时预览 */}
            <div className="w-1/2 flex flex-col bg-background">
              {/* 预览标题栏 */}
              <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">实时预览</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {value.length > 0 ? `${value.split('\n').length} 行` : '空白文档'}
                </div>
              </div>

              {/* 预览内容 */}
              <div ref={previewRef} className="flex-1 p-4 overflow-auto">
                <div className="max-w-none prose prose-sm dark:prose-invert">
                  {value.trim() ? (
                    <MDXRenderer content={value} />
                  ) : (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📝</div>
                        <div className="text-sm">开始输入内容查看预览</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 非全屏模式：原有逻辑 */}
            {/* 编辑器 */}
            {!isPreview && (
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={value}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full h-full p-4 font-mono text-sm resize-none border-0 outline-none bg-background"
                  style={{ minHeight: height }}
                />
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
          </>
        )}
      </div>

      {/* 状态栏 */}
      <div className="bg-muted px-4 py-2 text-xs text-muted-foreground border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>字符数: {value.length}</span>
          <span>行数: {value.split('\n').length}</span>
          <span>预估阅读时间: {Math.ceil(value.length / 500)} 分钟</span>
          {isFullscreen && (
            <>
              <span className="text-primary">•</span>
              <span>双栏编辑 & 实时预览</span>
              <span>•</span>
              <span>同步滚动</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 快捷键提示 */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Ctrl+Z 撤销</Badge>
            <Badge variant="outline" className="text-xs">Ctrl+Y 重做</Badge>
            <Badge variant="outline" className="text-xs">Ctrl+B 粗体</Badge>
            <Badge variant="outline" className="text-xs">Ctrl+I 斜体</Badge>
            <Badge variant="outline" className="text-xs">Ctrl+K 链接</Badge>
            <Badge variant="outline" className="text-xs">F11 全屏</Badge>
            {isFullscreen && (
              <Badge variant="outline" className="text-xs">ESC 退出全屏</Badge>
            )}
          </div>
        </div>
      </div>

      {/* 组件选择器对话框 */}
      <ComponentSelectorDialog
        open={showComponentDialog}
        onOpenChange={setShowComponentDialog}
        onSelect={(template) => insertAtNewLine(template)}
        componentTemplates={componentTemplates}
      />

      {/* 资源选择器对话框 */}
      <AssetSelectorDialog
        open={showAssetSelector}
        onOpenChange={setShowAssetSelector}
        onSelect={handleAssetSelect}
        allowedTypes={[AssetType.IMAGE]}
        title="选择图片"
      />
    </div>
  )
}