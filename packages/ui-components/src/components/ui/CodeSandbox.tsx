import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Editor, loader } from '@monaco-editor/react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Alert, AlertDescription } from './alert'
import { Badge } from './badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Code2, 
  Eye, 
  AlertTriangle,
  Copy,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Palette,
  FileCode
} from 'lucide-react'
import { cn } from '../../lib/utils'

// 配置 Monaco Editor 使用本地静态资源
loader.config({
  paths: {
    vs: '/monaco/vs'
  }
})

interface CodeSandboxProps {
  initialCode?: string
  initialCSS?: string
  language?: 'javascript' | 'typescript' | 'jsx' | 'tsx'
  width?: number | string
  height?: number | string
  theme?: 'light' | 'dark' | 'auto'
  showEditor?: boolean
  showPreview?: boolean
  showCSS?: boolean
  allowFullscreen?: boolean
  readOnly?: boolean
  className?: string
  onCodeChange?: (code: string) => void
  onCSSChange?: (css: string) => void
  onError?: (error: Error) => void
  customImports?: Record<string, any>
  enableConsole?: boolean
}

interface ConsoleMessage {
  id: string
  type: 'log' | 'warn' | 'error' | 'info'
  message: string
  timestamp: number
}

// 代码沙箱错误边界组件
class CodeSandboxErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; onError?: (error: Error) => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('CodeSandbox rendering error:', error, errorInfo)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-600 dark:text-red-400">
            <div className="font-medium mb-1">代码执行错误</div>
            <div className="text-sm opacity-90">
              {this.state.error?.message || '组件渲染失败'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-6 px-2 text-red-600"
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              重试
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}

// CSS 注入组件
const CSSInjector: React.FC<{
  css: string
  containerId: string
}> = ({ css, containerId }) => {
  useEffect(() => {
    // 创建或更新样式标签
    let styleElement = document.getElementById(`css-injector-${containerId}`) as HTMLStyleElement
    
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = `css-injector-${containerId}`
      styleElement.type = 'text/css'
      document.head.appendChild(styleElement)
    }
    
    // 添加样式隔离前缀，确保样式只应用到当前预览容器
    const scopedCSS = css.replace(/([^{}]+){/g, (match, selector) => {
      // 为每个选择器添加容器前缀
      const trimmedSelector = selector.trim()
      if (trimmedSelector.includes('@') || trimmedSelector.includes('html') || trimmedSelector.includes('body')) {
        return match // 保持 @规则 和 html/body 选择器不变
      }
      return `#${containerId} ${trimmedSelector} {`
    })
    
    styleElement.textContent = scopedCSS
    
    // 清理函数
    return () => {
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
    }
  }, [css, containerId])
  
  return null
}

// 代码执行沙箱组件
const CodeExecutor: React.FC<{
  code: string
  language: string
  customImports?: Record<string, any>
  onConsole?: (message: ConsoleMessage) => void
  css?: string
  containerId?: string
}> = ({ code, language, customImports = {}, onConsole, css = '', containerId = 'sandbox-preview' }) => {
  const [result, setResult] = useState<React.ReactElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const executeTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const executionCountRef = useRef(0)
  const lastCodeRef = useRef<string>('')

  // 使用 useRef 来存储当前的 console 和 custom imports，避免无限重新渲染
  const consoleRef = useRef(onConsole)
  const customImportsRef = useRef(customImports)
  
  // 更新 refs
  useEffect(() => {
    consoleRef.current = onConsole
    customImportsRef.current = customImports
  })

  const executeCode = useCallback(() => {
    try {
      setError(null)

      // 清除之前的执行超时
      if (executeTimeoutRef.current) {
        clearTimeout(executeTimeoutRef.current)
      }

      // 延迟执行以避免频繁重新渲染
      executeTimeoutRef.current = setTimeout(() => {
        try {
          const { useState, useEffect, useMemo, useCallback, useRef } = React

          // 创建自定义console来捕获输出 - 使用 ref 避免依赖变化
          const customConsole = {
            log: (...args: any[]) => {
              consoleRef.current?.({
                id: `${Date.now()}-${Math.random()}`,
                type: 'log',
                message: args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' '),
                timestamp: Date.now()
              })
            },
            warn: (...args: any[]) => {
              consoleRef.current?.({
                id: `${Date.now()}-${Math.random()}`,
                type: 'warn',
                message: args.join(' '),
                timestamp: Date.now()
              })
            },
            error: (...args: any[]) => {
              consoleRef.current?.({
                id: `${Date.now()}-${Math.random()}`,
                type: 'error',
                message: args.join(' '),
                timestamp: Date.now()
              })
            },
            clear: () => {
              // 支持 console.clear
            }
          }

          // 根据语言类型执行不同的逻辑
          if (language === 'javascript' || language === 'jsx') {
            // 更强大的 JSX 转换
            const transformJSX = (code: string): string => {
              let transformed = code
              
              // 1. 处理自闭合标签 <div class="test" />
              transformed = transformed.replace(
                /<(\w+)([^>]*?)\/>/g,
                (match, tagName, attributes) => {
                  const props = parseAttributes(attributes.trim())
                  return `React.createElement("${tagName}", ${props})`
                }
              )
              
              // 2. 处理完整标签 <div class="test">content</div>
              transformed = transformed.replace(
                /<(\w+)([^>]*?)>(.*?)<\/\1>/gs,
                (match, tagName, attributes, children) => {
                  const props = parseAttributes(attributes.trim())
                  const childrenStr = children.trim() ? `"${children.trim()}"` : 'null'
                  return `React.createElement("${tagName}", ${props}, ${childrenStr})`
                }
              )
              
              return transformed
            }
            
            // 解析属性字符串
            const parseAttributes = (attrStr: string): string => {
              if (!attrStr) return 'null'
              
              const attrs: string[] = []
              
              // 匹配 key="value" 或 key='value' 形式
              attrStr.replace(/(\w+)=["']([^"']*?)["']/g, (match, key, value) => {
                // 处理特殊属性名
                const propName = key === 'class' ? 'className' : key
                attrs.push(`${propName}: "${value}"`)
                return match
              })
              
              // 匹配 key={expression} 形式
              attrStr.replace(/(\w+)=\{([^}]*)\}/g, (match, key, value) => {
                const propName = key === 'class' ? 'className' : key
                attrs.push(`${propName}: (${value})`)
                return match
              })
              
              // 匹配布尔属性 disabled checked 等
              const booleanAttrs = attrStr.replace(/\w+=[^\s>]+/g, '').trim()
              if (booleanAttrs) {
                booleanAttrs.split(/\s+/).forEach(attr => {
                  if (attr && !attrs.some(a => a.startsWith(attr + ':'))) {
                    attrs.push(`${attr}: true`)
                  }
                })
              }
              
              return attrs.length > 0 ? `{${attrs.join(', ')}}` : 'null'
            }

            // 处理代码
            let processedCode = code
            
            // 如果包含 JSX 且不在函数组件内，尝试转换
            if (/<[^>]*>/.test(code) && !/function\s+\w+\s*\(\s*\)\s*\{/.test(code)) {
              try {
                processedCode = transformJSX(code)
                console.log('JSX 转换:', { 原始: code, 转换: processedCode })
              } catch (err: any) {
                console.error('JSX 转换失败:', err)
                setError(`JSX 转换失败: ${err.message || '未知错误'}。建议使用函数组件方式或 React.createElement`)
                return
              }
            }

            // 创建执行环境
            const executeUserCode = new Function(
              'React',
              'hooks', 
              'customImports',
              'console',
              `
                "use strict";
                const { useState, useEffect, useMemo, useCallback, useRef, createElement, Fragment } = hooks;
                
                // 解构自定义导入
                ${Object.keys(customImportsRef.current).map(key => `const ${key} = customImports.${key};`).join('\n')}
                
                // 提供帮助函数
                const jsx = createElement;
                const h = createElement;
                
                // 用户代码
                ${processedCode}
              `
            )
            
            const result = executeUserCode(
              React,
              { 
                useState, 
                useEffect, 
                useMemo, 
                useCallback, 
                useRef,
                createElement: React.createElement,
                Fragment: React.Fragment
              },
              customImportsRef.current,
              customConsole
            )
            
            if (React.isValidElement(result)) {
              // 使用包装器组件来隔离执行环境
              const WrappedResult = () => result
              setResult(React.createElement(WrappedResult))
            } else if (typeof result === 'function') {
              // 如果返回的是函数组件，使用包装器来渲染
              try {
                const WrappedComponent = () => React.createElement(result)
                setResult(React.createElement(WrappedComponent))
              } catch (err: any) {
                setError(`组件渲染失败: ${err.message}`)
              }
            } else {
              setError(`代码执行错误。建议使用以下方式：

1. 函数组件 + JSX（推荐）：
function MyComponent() {
  return <div>Hello</div>
}
return <MyComponent />

2. React.createElement：
return React.createElement("div", null, "Hello")

3. 避免直接在顶层使用 JSX，如：
return <div>Hello</div> // ❌ 可能出错

请参考默认示例中的正确写法。`)
            }
          } else {
            setError(`暂不支持 ${language} 语言`)
          }
        } catch (err: any) {
          console.error('Code execution error:', err)
          setError(err.message || '代码执行出错')
        }
      }, 500) // 增加防抖时间到 500ms

    } catch (err: any) {
      console.error('Code execution error:', err)
      setError(err.message || '代码执行出错')
    }
  }, [code, language]) // 只依赖于 code 和 language

  useEffect(() => {
    // 确保初始化时立即执行
    executeCode()
    return () => {
      if (executeTimeoutRef.current) {
        clearTimeout(executeTimeoutRef.current)
      }
    }
  }, [code, language]) // 直接依赖 code 和 language，确保变化时重新执行

  // 额外的初始化 useEffect，确保组件挂载时执行
  useEffect(() => {
    // 组件首次挂载时强制执行一次
    const timer = setTimeout(() => {
      executeCode()
    }, 100) // 短延迟确保组件完全初始化
    
    return () => clearTimeout(timer)
  }, []) // 空依赖数组，只在挂载时执行一次

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-red-600 dark:text-red-400">
          <div className="font-medium mb-1">执行错误</div>
          <pre className="text-sm opacity-90 whitespace-pre-wrap">{error}</pre>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div id={containerId} className="space-y-4">
      {/* 注入自定义 CSS */}
      <CSSInjector css={css} containerId={containerId} />
      {result}
    </div>
  )
}

// 控制台组件
const Console: React.FC<{
  messages: ConsoleMessage[]
  onClear: () => void
}> = ({ messages, onClear }) => {
  return (
    <div className="border rounded-lg bg-black text-green-400 font-mono text-xs h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 flex-shrink-0">
        <span className="font-medium">控制台</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 px-2 text-green-400 hover:text-green-300"
        >
          清空
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {messages.length === 0 ? (
          <div className="text-gray-500">控制台输出将显示在这里...</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-2',
                msg.type === 'error' && 'text-red-400',
                msg.type === 'warn' && 'text-yellow-400',
                msg.type === 'info' && 'text-blue-400'
              )}
            >
              <span className="text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              <span className="flex-1">{msg.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// 主要的代码沙箱组件
export const CodeSandbox: React.FC<CodeSandboxProps> = ({
  initialCode = `// React 代码沙箱 - JSX 语法支持示例
// 
// 💡 提示：由于浏览器环境限制，请使用以下方式编写 JSX：
// 
// 方法1: 使用 React.createElement (推荐)
// 方法2: 在函数组件内使用标准 JSX 语法
// 方法3: 使用提供的 jsx() 或 h() 帮助函数

function ExampleComponent() {
  const [count, setCount] = useState(0)
  const [method, setMethod] = useState('jsx')
  
  useEffect(() => {
    console.log('计数更新:', count)
  }, [count])
  
  // 演示不同的写法
  if (method === 'createElement') {
    return React.createElement('div', { className: 'example-container' }, [
      React.createElement('h3', { key: 'title', className: 'example-title' }, 
        \`计数器示例 (createElement)\`
      ),
      React.createElement('p', { key: 'count', className: 'count-display' }, 
        \`当前计数: \${count}\`
      ),
      React.createElement('div', { key: 'buttons', className: 'button-group' }, [
        React.createElement('button', {
          key: 'inc',
          className: 'increment-btn',
          onClick: () => setCount(count + 1)
        }, '增加 ➕'),
        React.createElement('button', {
          key: 'reset',
          className: 'reset-btn', 
          onClick: () => setCount(0)
        }, '重置 🔄'),
        React.createElement('button', {
          key: 'method',
          className: 'method-btn',
          onClick: () => setMethod('jsx')
        }, '切换到JSX')
      ])
    ])
  }
  
  // 标准 JSX 语法 (在函数组件内部可以正常使用)
  return (
    <div className="example-container">
      <h3 className="example-title">
        计数器示例 (JSX)
      </h3>
      <p className="count-display">
        当前计数: <span className="count-number">{count}</span>
      </p>
      <div className="button-group">
        <button
          className="increment-btn"
          onClick={() => setCount(count + 1)}
        >
          增加 ➕
        </button>
        <button
          className="reset-btn"
          onClick={() => setCount(0)}
        >
          重置 🔄
        </button>
        <button
          className="method-btn"
          onClick={() => setMethod('createElement')}
        >
          切换到createElement
        </button>
      </div>
      {count > 5 && (
        <div className="achievement">
          🎉 恭喜！你已经点击了 {count} 次！
        </div>
      )}
    </div>
  )
}

// 返回组件实例
return <ExampleComponent />`,
  initialCSS = `/* 自定义样式示例 */
.example-container {
  padding: 1rem;
  border: 2px solid #3b82f6;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #dbeafe 0%, #fce7f3 100%);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.example-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.2);
}

.example-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1f2937;
  text-align: center;
}

.count-display {
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 1.1rem;
}

.count-number {
  font-weight: 700;
  color: #3b82f6;
  font-size: 1.2em;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.message {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
  font-style: italic;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.increment-btn, .reset-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.increment-btn {
  background: #10b981;
  color: white;
}

.increment-btn:hover {
  background: #059669;
  transform: scale(1.05);
}

.reset-btn {
  background: #ef4444;
  color: white;
}

.reset-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.method-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background: #8b5cf6;
  color: white;
}

.method-btn:hover {
  background: #7c3aed;
  transform: scale(1.05);
}

.achievement {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: #fbbf24;
  color: #92400e;
  border-radius: 0.375rem;
  text-align: center;
  font-weight: 600;
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0,-15px,0);
  }
  70% {
    transform: translate3d(0,-7px,0);
  }
  90% {
    transform: translate3d(0,-2px,0);
  }
}`,
  language = 'jsx',
  height = 400,
  theme = 'auto',
  showEditor = true,
  showPreview = true,
  showCSS = true,
  allowFullscreen = true,
  readOnly = false,
  className,
  onCodeChange,
  onCSSChange,
  onError,
  customImports = {},
  enableConsole = true
}) => {
  const [code, setCode] = useState(initialCode)
  const [css, setCSS] = useState(initialCSS)
  const [isRunning, setIsRunning] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview')
  const [activeEditorTab, setActiveEditorTab] = useState<'js' | 'css'>('js')
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([])
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split')
  const editorRef = useRef<any>(null)
  const cssEditorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const previewContainerId = `sandbox-preview-${Date.now()}`

  // 主题检测
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setIsDarkMode(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      setIsDarkMode(theme === 'dark')
    }
  }, [theme])

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
      onCodeChange?.(value)
    }
  }, [onCodeChange])

  const handleCSSChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setCSS(value)
      onCSSChange?.(value)
    }
  }, [onCSSChange])

  const handleConsoleMessage = useCallback((message: ConsoleMessage) => {
    setConsoleMessages(prev => [...prev.slice(-49), message]) // 保留最近50条消息
  }, [])

  const clearConsole = useCallback(() => {
    setConsoleMessages([])
  }, [])

  const resetCode = useCallback(() => {
    setCode(initialCode)
    setCSS(initialCSS)
    clearConsole()
  }, [initialCode, initialCSS, clearConsole])

  const copyCode = useCallback(() => {
    const content = activeEditorTab === 'css' ? css : code
    navigator.clipboard.writeText(content)
  }, [code, css, activeEditorTab])

  const toggleFullscreen = useCallback(() => {
    if (!allowFullscreen) return
    setIsFullscreen(!isFullscreen)
  }, [allowFullscreen, isFullscreen])

  const handleError = useCallback((error: Error) => {
    onError?.(error)
    setConsoleMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'error',
      message: error.message,
      timestamp: Date.now()
    }])
  }, [onError])

  const editorElement = showEditor && (
    <div className="flex-1 min-h-0 flex flex-col">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              代码编辑器
            </CardTitle>
            <div className="flex items-center gap-2">
              {showCSS && (
                <Tabs value={activeEditorTab} onValueChange={(value) => setActiveEditorTab(value as any)}>
                  <TabsList className="h-7">
                    <TabsTrigger value="js" className="text-xs px-2 py-1">
                      <FileCode className="h-3 w-3 mr-1" />
                      {language.toUpperCase()}
                    </TabsTrigger>
                    <TabsTrigger value="css" className="text-xs px-2 py-1">
                      <Palette className="h-3 w-3 mr-1" />
                      CSS
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              {!showCSS && <Badge variant="secondary">{language.toUpperCase()}</Badge>}
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCode}
                className="h-6 px-2"
                title={`复制${activeEditorTab === 'css' ? 'CSS' : '代码'}`}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-6 overflow-hidden flex flex-col">
          {showCSS ? (
            <Tabs value={activeEditorTab} className="h-full flex flex-col">
              <TabsContent value="js" className="h-full">
                <div className="border rounded-lg overflow-hidden h-full">
                  <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={handleCodeChange}
                    onMount={(editor) => {
                      editorRef.current = editor
                    }}
                    theme={isDarkMode ? 'vs-dark' : 'light'}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      quickSuggestions: true,
                      suggestOnTriggerCharacters: true,
                      acceptSuggestionOnEnter: 'on',
                      parameterHints: { enabled: true },
                      hover: { enabled: true },
                      autoIndent: 'advanced',
                      formatOnType: true,
                      formatOnPaste: true,
                      folding: true,
                      readOnly,
                      contextmenu: !readOnly
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="css" className="h-full">
                <div className="border rounded-lg overflow-hidden h-full">
                  <Editor
                    height="100%"
                    language="css"
                    value={css}
                    onChange={handleCSSChange}
                    onMount={(editor) => {
                      cssEditorRef.current = editor
                    }}
                    theme={isDarkMode ? 'vs-dark' : 'light'}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      quickSuggestions: true,
                      suggestOnTriggerCharacters: true,
                      acceptSuggestionOnEnter: 'on',
                      parameterHints: { enabled: true },
                      hover: { enabled: true },
                      autoIndent: 'advanced',
                      formatOnType: true,
                      formatOnPaste: true,
                      folding: true,
                      readOnly,
                      contextmenu: !readOnly
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="border rounded-lg overflow-hidden h-full">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={handleCodeChange}
                onMount={(editor) => {
                  editorRef.current = editor
                }}
                theme={isDarkMode ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  quickSuggestions: true,
                  suggestOnTriggerCharacters: true,
                  acceptSuggestionOnEnter: 'on',
                  parameterHints: { enabled: true },
                  hover: { enabled: true },
                  autoIndent: 'advanced',
                  formatOnType: true,
                  formatOnPaste: true,
                  folding: true,
                  readOnly,
                  contextmenu: !readOnly
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const previewElement = showPreview && (
    <div className="flex-1 min-h-0 flex flex-col">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              预览
            </CardTitle>
            <div className="flex items-center gap-2">
              {enableConsole && (
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                  <TabsList className="h-7">
                    <TabsTrigger value="preview" className="text-xs px-2 py-1">
                      预览
                    </TabsTrigger>
                    <TabsTrigger value="console" className="text-xs px-2 py-1">
                      控制台
                      {consoleMessages.length > 0 && (
                        <Badge variant="secondary" className="ml-1 h-4 text-xs">
                          {consoleMessages.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRunning(!isRunning)}
                className="h-6 px-2"
              >
                {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-6 overflow-hidden flex flex-col">
          {enableConsole ? (
            <Tabs value={activeTab} className="h-full flex flex-col">
              <TabsContent value="preview" className="h-full">
                <div className="border rounded-lg p-4 h-full overflow-auto bg-background">
                  {isRunning ? (
                    <CodeSandboxErrorBoundary onError={handleError}>
                      <CodeExecutor
                        code={code}
                        language={language}
                        customImports={customImports}
                        onConsole={handleConsoleMessage}
                        css={css}
                        containerId={previewContainerId}
                      />
                    </CodeSandboxErrorBoundary>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Pause className="h-8 w-8 mx-auto mb-2" />
                        <p>代码执行已暂停</p>
                        <p className="text-sm">点击播放按钮继续</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="console" className="h-full">
                <Console messages={consoleMessages} onClear={clearConsole} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="border rounded-lg p-4 h-full overflow-auto bg-background">
              {isRunning ? (
                <CodeSandboxErrorBoundary onError={handleError}>
                  <CodeExecutor
                    code={code}
                    language={language}
                    customImports={customImports}
                    onConsole={handleConsoleMessage}
                    css={css}
                    containerId={previewContainerId}
                  />
                </CodeSandboxErrorBoundary>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Pause className="h-8 w-8 mx-auto mb-2" />
                    <p>代码执行已暂停</p>
                    <p className="text-sm">点击播放按钮继续</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const mainContent = (
    <div 
      className={cn("w-full flex flex-col", className)} 
      ref={containerRef}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                代码沙箱
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                实时 React 代码编辑器和预览环境
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="split">分屏</SelectItem>
                  <SelectItem value="editor">仅编辑器</SelectItem>
                  <SelectItem value="preview">仅预览</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={resetCode}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              {allowFullscreen && (
                <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div 
            className={cn(
              "flex gap-4 h-full",
              viewMode === 'split' && "flex-col lg:flex-row",
              viewMode === 'editor' && "flex-col",
              viewMode === 'preview' && "flex-col"
            )}
          >
            {viewMode !== 'preview' && editorElement}
            {viewMode !== 'editor' && previewElement}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-background z-50 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="absolute top-6 right-6 z-10"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          退出全屏
        </Button>
        <div className="w-full h-full pt-12">
          {mainContent}
        </div>
      </div>
    )
  }

  return mainContent
}

export type { CodeSandboxProps }
export default CodeSandbox