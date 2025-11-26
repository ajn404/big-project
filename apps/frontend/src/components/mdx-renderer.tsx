import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import remarkToc from 'remark-toc'
import rehypeRaw from 'rehype-raw'
import { visit } from 'unist-util-visit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui-components'
import { Badge } from '@workspace/ui-components'
import { Button } from '@workspace/ui-components'
import { Alert, AlertDescription } from '@workspace/ui-components'
import { Code, Info, AlertTriangle, CheckCircle, Copy, ExternalLink, Play, Eye, EyeOff } from 'lucide-react'
import { ComponentRenderer } from './component-renderer'
import { generateHeadingId } from '@/lib/heading-utils'
import { ImageProvider, useImageContext } from '@/contexts/image-context'
import { ImagePreview } from './image-preview'
import { useQuery } from '@apollo/client'
import { GET_ASSETS } from '@/lib/graphql/asset-queries'

interface MDXRendererProps {
  content: string
}

// MDX图片组件，支持预览和马赛克
function MDXImage({ src, alt, ...props }: any) {
  const { addImage, openPreview, images } = useImageContext()
  const [isRegistered, setIsRegistered] = React.useState(false)
  const [showPreview, setShowPreview] = React.useState(false)
  const [isMosaicDefault, setIsMosaicDefault] = React.useState(false)
  
  // 查询资产信息获取马赛克设置
  const { data: assetsData } = useQuery(GET_ASSETS, {
    variables: { limit: 1000 }, // 获取所有资产
  })
  
  // 只在第一次渲染时注册图片，避免重复调用
  React.useEffect(() => {
    if (src && !isRegistered) {
      addImage({ src, alt: alt || '' })
      setIsRegistered(true)
    }
  }, [src, alt, addImage, isRegistered])
  
  // 检查当前图片是否设置了默认马赛克
  React.useEffect(() => {
    if (assetsData?.assets && src) {
      const asset = assetsData.assets.find((asset: any) => asset.url === src)
      if (asset) {
        setIsMosaicDefault(asset.isMosaicDefault || false)
      }
    }
  }, [assetsData, src])
  
  const handleClick = React.useCallback(() => {
    const index = images.findIndex(img => img.src === src)
    if (index !== -1) {
      openPreview(index)
    }
  }, [images, src, openPreview])
  
  const togglePreview = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setShowPreview(!showPreview)
  }, [showPreview])
  
  const shouldShowMosaic = isMosaicDefault && !showPreview
  
  return (
    <span className="relative inline-block my-6">
      <img 
        src={src} 
        alt={alt || ''} 
        className={`max-w-full h-auto rounded-lg shadow-md border border-border cursor-pointer hover:shadow-lg transition-all ${
          shouldShowMosaic ? 'filter blur-lg' : ''
        }`}
        onClick={handleClick}
        {...props} 
      />
      {isMosaicDefault && (
        <button
          className={`absolute top-2 right-2 opacity-80 hover:opacity-100 px-2 py-1 rounded text-xs transition-colors ${
            showPreview ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={togglePreview}
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
      {shouldShowMosaic && (
        <span className="absolute  pointer-events-none inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
          <span className="bg-white bg-opacity-90  pointer-events-none px-3 py-1 rounded text-sm font-medium">
            点击预览按钮查看图片
          </span>
        </span>
      )}
    </span>
  )
}

// 代码沙箱组件
const CodeSandbox = ({ code }: { code: string }) => {
  const [result, setResult] = React.useState<JSX.Element | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const executeCode = () => {
    try {
      setError(null)
      
      // 创建一个安全的沙箱环境
      const { useState, useEffect, useMemo, useCallback } = React
      
      // 创建函数体，提供React hooks
      const functionBody = `
        const React = arguments[0];
        const { useState, useEffect, useMemo, useCallback } = arguments[1];
        
        ${code}
      `
      console.log(code,'functionBody')
      // 执行代码
      const ComponentFunction = new Function(functionBody)
      const Component = ComponentFunction(React, { useState, useEffect, useMemo, useCallback })
      
      if (React.isValidElement(Component)) {
        setResult(Component)
      } else {
        setError('代码必须返回一个有效的React元素')
      }
    } catch (err: any) {
      setError(err.message || '代码执行出错')
    }
  }

  React.useEffect(() => {
    executeCode()
  }, [code])

  return (
    <div className="border border-border rounded-lg overflow-hidden my-6">
      <div className="bg-muted px-4 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          <span className="font-medium text-sm">代码沙箱</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={executeCode}
          className="h-6 px-2"
        >
          <Play className="h-3 w-3 mr-1" />
          运行
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* 代码区域 */}
        <div className="border-r border-border">
          <div className="bg-muted/50 px-3 py-1 text-xs text-muted-foreground border-b border-border">
            代码编辑器
          </div>
          <pre className="p-4 text-sm font-mono bg-background overflow-x-auto max-h-64">
            <code>{code}</code>
          </pre>
        </div>
        
        {/* 渲染结果 */}
        <div>
          <div className="bg-muted/50 px-3 py-1 text-xs text-muted-foreground border-b border-border">
            渲染结果
          </div>
          <div className="p-4 min-h-32">
            {error ? (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-700 dark:text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            ) : result ? (
              <div className="space-y-4">{result}</div>
            ) : (
              <div className="text-muted-foreground text-sm">等待代码执行...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- 替换 remarkCustomComponents ---
const remarkCustomComponents = () => {
  return (tree: any) => {
    const blocks: any[] = []

    visit(tree, 'text', (node, _, parent) => {
      if (parent.type === 'code' || parent.type === 'inlineCode') return
      if (parent.type === 'html') return
      const value = node.value
      if (!value) return

      // 支持多行内容 + 属性 + JSX
      const regex = /^:::(\w+)(?:\{([\s\S]*?)\})?\n([\s\S]*?)^:::/gm
      let match

      while ((match = regex.exec(value)) !== null) {
        const [, type, attrRaw, content] = match
        const attributes = attrRaw?.trim() || ''
        
        blocks.push({
          type,
          attributes,
          content: content.trim()
        })
      }
    })
    if (!blocks.length) return

    // 遍历树替换节点
    visit(tree, 'text', (node, index, parent) => {
      if (parent.type === 'code' || parent.type === 'inlineCode') return
      if (parent.type === 'html') return
      const value = node.value
      if (!value) return

      const regex = /^:::(\w+)(?:\{([\s\S]*?)\})?\n([\s\S]*?)^:::/gm
      let match
      const newNodes: any[] = []
      let lastIndex = 0

      while ((match = regex.exec(value)) !== null) {
        const [fullMatch, type, attrRaw, content] = match
        const start = match.index
        const end = start + fullMatch.length

        // 添加前面的普通文本
        if (start > lastIndex) {
          newNodes.push({
            type: 'text',
            value: value.slice(lastIndex, start)
          })
        }

        // 插入自定义组件HTML
        newNodes.push({
          type: 'html',
          value: `<div data-component="${type}" data-attributes="${(attrRaw || '').replace(/"/g, '&quot;')}" data-content="${content.replace(/"/g, '&quot;')}"></div>`
        })

        lastIndex = end
      }

      // 添加剩余文本
      if (lastIndex < value.length) {
        newNodes.push({
          type: 'text',
          value: value.slice(lastIndex)
        })
      }

      if (newNodes.length && parent && typeof index === 'number') {
        parent.children.splice(index, 1, ...newNodes)
      }
    })
  }
}

// 处理高亮文本的remark插件
const remarkHighlight = () => {
  return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      if (parent.type === 'code' || parent.type === 'inlineCode') return
      if (parent.type === 'html') return
      const text = node.value
      if (text && text.includes('==')) {
        const parts = text.split(/(==.*?==)/g)
        if (parts.length > 1) {
          const newChildren: any[] = []
          
          parts.forEach((part: string) => {
            if (part.startsWith('==') && part.endsWith('==')) {
              // 高亮文本
              newChildren.push({
                type: 'html',
                value: `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${part.slice(2, -2)}</mark>`
              })
            } else if (part) {
              // 普通文本
              newChildren.push({
                type: 'text',
                value: part
              })
            }
          })
          
          if (parent && typeof index === 'number' && newChildren.length > 0) {
            parent.children.splice(index, 1, ...newChildren)
            return index + newChildren.length - 1 // 跳过新插入的节点
          }
        }
      }
    })
  }
}

// 自定义组件映射
const customComponents = {
  // 代码块组件 - 添加复制功能
  code({ node, _, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''
    const isInline = node.position?.start.line === node.position?.end.line

    if (isInline) {
      return (
        <code 
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono border border-border" 
          {...props}
        >
          {children}
        </code>
      )
    }

    // 块级代码使用 figure 而不是 div 来避免嵌套问题
    return (
      <figure className="relative group my-4 not-prose">
        <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border border-border border-b-0">
          <span className="text-sm font-medium text-foreground">
            {language || 'text'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
            onClick={() => {
              navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        <pre className="bg-background border border-border border-t-0 rounded-b-lg overflow-x-auto">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </figure>
    )
  },

  // 预格式化文本 - 处理独立的 pre 标签
  pre({ children }: any) {
    // 如果已经被 code 组件处理，直接返回内容
    return <>{children}</>
  },

  // 标题组件 - 添加锚点
  h1({ children, ...props }: any) {
    const id = generateHeadingId(String(children))
    return (
      <h1 
        id={id}
        className="text-3xl font-bold mb-6 mt-8 first:mt-0 pb-2 border-b border-border relative group" 
        {...props}
      >
        {children}
        <a 
          href={`#${id}`}
          className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        >
          #
        </a>
      </h1>
    )
  },

  h2({ children, ...props }: any) {
    const id = generateHeadingId(String(children))
    return (
      <h2 
        id={id}
        className="text-2xl font-semibold mb-4 mt-8 relative group" 
        {...props}
      >
        {children}
        <a 
          href={`#${id}`}
          className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        >
          #
        </a>
      </h2>
    )
  },

  h3({ children, ...props }: any) {
    const id = generateHeadingId(String(children))
    return (
      <h3 
        id={id}
        className="text-xl font-semibold mb-3 mt-6 relative group" 
        {...props}
      >
        {children}
        <a 
          href={`#${id}`}
          className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        >
          #
        </a>
      </h3>
    )
  },

  // 段落 - 避免嵌套块级元素
  p({ children, ...props }: any) {
    // 检查子元素是否包含块级元素
    const hasBlockElement = React.Children.toArray(children).some((child: any) => {
      if (React.isValidElement(child)) {
        const type = child.type
        // 检查是否是块级组件
        return typeof type === 'function' && 
               (type.name === 'code' || type.name === 'table' || type.name === 'figure')
      }
      return false
    })

    // 如果包含块级元素，使用 div 而不是 p
    if (hasBlockElement) {
      return <div className="mb-4 leading-7 text-foreground" {...props}>{children}</div>
    }

    return <p className="mb-4 leading-7 text-foreground" {...props}>{children}</p>
  },

  // 列表
  ul({ children, ...props }: any) {
    return <ul className="mb-4 ml-6 space-y-1" {...props}>{children}</ul>
  },

  ol({ children, ...props }: any) {
    return <ol className="mb-4 ml-6 space-y-1" {...props}>{children}</ol>
  },

  li({ children, ...props }: any) {
    // 检查是否是任务列表项
    if (typeof children === 'string' && (children.includes('☐') || children.includes('✓'))) {
      const isChecked = children.includes('✓')
      const text = children.replace(/[☐✓]\s?/, '')
      
      return (
        <li className="flex items-center space-x-2 list-none ml-0" {...props}>
          <div className={`w-4 h-4 border rounded flex items-center justify-center text-xs ${
            isChecked 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-muted-foreground'
          }`}>
            {isChecked && '✓'}
          </div>
          <span className={isChecked ? 'line-through text-muted-foreground' : ''}>{text}</span>
        </li>
      )
    }

    return <li className="marker:text-primary" {...props}>{children}</li>
  },

  // 引用块
  blockquote({ children, ...props }: any) {
    return (
      <blockquote 
        className="border-l-4 border-primary pl-4 my-4 bg-muted/50 p-4 rounded-r-lg italic" 
        {...props}
      >
        {children}
      </blockquote>
    )
  },

  // 链接 - 添加外链图标
  a({ href, children, ...props }: any) {
    const isExternal = href?.startsWith('http')
    
    return (
      <a 
        href={href}
        className="text-primary hover:underline inline-flex items-center gap-1"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
        {isExternal && <ExternalLink className="h-3 w-3" />}
      </a>
    )
  },

  // 图片 - 响应式和样式优化，支持预览
  img({ src, alt, ...props }: any) {
    return <MDXImage src={src} alt={alt} {...props} />
  },

  // 表格 - 使用 figure 避免嵌套问题
  table({ children, ...props }: any) {
    return (
      <figure className="overflow-x-auto my-6 border border-border rounded-lg not-prose">
        <table className="w-full border-collapse" {...props}>
          {children}
        </table>
      </figure>
    )
  },

  thead({ children, ...props }: any) {
    return <thead className="bg-muted" {...props}>{children}</thead>
  },

  th({ children, ...props }: any) {
    return (
      <th 
        className="border-b border-border p-3 text-left font-semibold text-foreground" 
        {...props}
      >
        {children}
      </th>
    )
  },

  td({ children, ...props }: any) {
    return (
      <td 
        className="border-b border-border p-3 text-foreground" 
        {...props}
      >
        {children}
      </td>
    )
  },

  // 分割线
  hr({ ...props }: any) {
    return <hr className="my-8 border-t-2 border-border" {...props} />
  },

  // 自定义组件
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Alert: ({ type = 'info', children, ...props }: any) => {
    const icons = {
      info: Info,
      warning: AlertTriangle,
      success: CheckCircle,
      error: AlertTriangle,
    }
    const Icon = icons[type as keyof typeof icons] || Info
    
    return (
      <Alert className="my-4" {...props}>
        <Icon className="h-4 w-4" />
        <AlertDescription>
          {children}
        </AlertDescription>
      </Alert>
    )
  },
  
  // 处理自定义组件语法
  div: ({ 'data-component': component, 'data-attributes': attributes, 'data-content': content, children, ...props }: any) => {
    if (!component) {
      return <div {...props}>{children}</div>
    }
    
    // 解析属性
    const attrs: any = {}
    if (attributes) {
      const attrMatches = attributes.match(/(\w+)="([^"]*)"/g)
      if (attrMatches) {
        attrMatches.forEach((match: string) => {
          const [, key, valueStr] = match.match(/(\w+)="([^"]*)"/) || []
          if (key && valueStr !== undefined) {
            let value: any = valueStr;
            if (valueStr === 'true') value = true;
            else if (valueStr === 'false') value = false;
            else if (!isNaN(Number(valueStr)) && valueStr.trim() !== '') value = Number(valueStr);
            attrs[key] = value;
          }
        })
      }
    }
    
    switch (component) {
      case 'button':
        return (
          <div className="my-4">
            <Button variant="default" size="default">
              {content}
            </Button>
          </div>
        )
      
      case 'alert':
        const icons = {
          info: Info,
          warning: AlertTriangle,
          success: CheckCircle,
          error: AlertTriangle,
        }
        const Icon = icons[attrs.type as keyof typeof icons] || Info
        
        return (
          <Alert className="my-4">
            <Icon className="h-4 w-4" />
            <AlertDescription>
              {content}
            </AlertDescription>
          </Alert>
        )
      
      case 'card':
        return (
          <Card className="my-4">
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {content.split('\n').map((line: string, index: number) => {
                  if (line.startsWith('## ')) {
                    return <h3 key={index} className="font-semibold mb-2 mt-3 first:mt-0">{line.slice(3)}</h3>
                  } else if (line.startsWith('# ')) {
                    return <h2 key={index} className="font-bold mb-2 mt-3 first:mt-0">{line.slice(2)}</h2>
                  } else if (line.startsWith('- ')) {
                    return <div key={index} className="flex items-start space-x-2"><span>•</span><span>{line.slice(2)}</span></div>
                  } else if (line.includes('**') && line.includes('**')) {
                    const parts = line.split(/(\*\*.*?\*\*)/g)
                    return (
                      <p key={index} className="mb-2 last:mb-0">
                        {parts.map((part: string, i: number) => 
                          part.startsWith('**') && part.endsWith('**') 
                            ? <strong key={i}>{part.slice(2, -2)}</strong>
                            : part
                        )}
                      </p>
                    )
                  } else if (line.trim()) {
                    return <p key={index} className="mb-2 last:mb-0">{line}</p>
                  }
                  return null
                })}
              </div>
            </CardContent>
          </Card>
        )
        
      case 'react':
        // 渲染component-renderer.tsx中的React组件
        const componentName = attrs.component
        if (componentName) {
          const finalProps = { ...attrs };
          if (content && componentName === 'ShaderPlayground') {
              finalProps.initialFragmentShader = content;
          }
          return (
            <div className="my-6">
              <ComponentRenderer componentName={componentName} props={finalProps} />
            </div>
          )
        }
        return (
          <Alert className="my-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              React组件名称未指定。请使用格式：:::react{`{component="ComponentName"}`}:::
            </AlertDescription>
          </Alert>
        )
        
      case 'sandbox':
        // 代码沙箱组件
        return (
          <div className="my-6">
            <CodeSandbox code={content} />
          </div>
        )
      
      default:
        return <div {...props}>{children}</div>
    }
  }
}

// 内部组件，使用图片上下文
function MDXContent({ content }: { content: string }) {
  const { images, currentIndex, isPreviewOpen, closePreview, goToPrevious, goToNext, clearImages } = useImageContext()

  // 组件卸载时清理图片
  React.useEffect(() => {
    return () => {
      clearImages()
    }
  }, [clearImages])

  return (
    <>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent">
        <ReactMarkdown
          remarkPlugins={[
            remarkGfm,        // GitHub Flavored Markdown (表格、删除线、任务列表等)
            remarkMath,       // 数学公式支持
            remarkToc,        // 目录生成
            remarkCustomComponents, // 自定义组件解析
            remarkHighlight,  // 高亮文本处理
          ]}
          rehypePlugins={[
            rehypeRaw,        // 处理原始HTML
            // rehypeSlug,    // 禁用自动ID生成，使用我们的自定义函数
            rehypeHighlight,  // 代码高亮
            rehypeKatex,      // 数学公式渲染
          ]}
          components={customComponents}
          // 配置选项避免嵌套问题
          skipHtml={false}
          disallowedElements={[]}
        >
          {content}
        </ReactMarkdown>
      </div>
      
      {/* 图片预览组件 */}
      <ImagePreview
        isOpen={isPreviewOpen}
        onClose={closePreview}
        currentIndex={currentIndex}
        images={images}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </>
  )
}

export function MDXRenderer({ content }: MDXRendererProps) {
  if (!content?.trim()) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Code className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">暂无内容</h3>
        <p className="text-sm">文章内容为空</p>
      </div>
    )
  }

  return (
    <ImageProvider>
      <MDXContent content={content} />
    </ImageProvider>
  )
}