import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Code, Info, AlertTriangle, CheckCircle, Copy, ExternalLink } from 'lucide-react'

interface MDXRendererProps {
  content: string
}

// 自定义组件映射
const customComponents = {
  // 代码块组件 - 添加复制功能
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''

    if (inline) {
      return (
        <code 
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono border border-border" 
          {...props}
        >
          {children}
        </code>
      )
    }

    return (
      <div className="relative group my-4">
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
      </div>
    )
  },

  // 标题组件 - 添加锚点
  h1({ children, ...props }: any) {
    return (
      <h1 
        className="text-3xl font-bold mb-6 mt-8 first:mt-0 pb-2 border-b border-border relative group" 
        {...props}
      >
        {children}
        <a 
          href={`#${String(children).toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-')}`}
          className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        >
          #
        </a>
      </h1>
    )
  },

  h2({ children, ...props }: any) {
    return (
      <h2 
        className="text-2xl font-semibold mb-4 mt-8 relative group" 
        {...props}
      >
        {children}
        <a 
          href={`#${String(children).toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-')}`}
          className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        >
          #
        </a>
      </h2>
    )
  },

  h3({ children, ...props }: any) {
    return (
      <h3 
        className="text-xl font-semibold mb-3 mt-6 relative group" 
        {...props}
      >
        {children}
        <a 
          href={`#${String(children).toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-')}`}
          className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        >
          #
        </a>
      </h3>
    )
  },

  // 段落
  p({ children, ...props }: any) {
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

  // 图片 - 响应式和样式优化
  img({ src, alt, ...props }: any) {
    return (
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full h-auto rounded-lg my-6 shadow-md border border-border" 
        {...props} 
      />
    )
  },

  // 表格
  table({ children, ...props }: any) {
    return (
      <div className="overflow-x-auto my-6 border border-border rounded-lg">
        <table className="w-full border-collapse" {...props}>
          {children}
        </table>
      </div>
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
  }
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
    <div className="prose prose-slate dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,        // GitHub Flavored Markdown (表格、删除线、任务列表等)
          remarkMath,       // 数学公式支持
          remarkToc,        // 目录生成
        ]}
        rehypePlugins={[
          rehypeSlug,       // 为标题添加 id
          rehypeHighlight,  // 代码高亮
          rehypeKatex,      // 数学公式渲染
        ]}
        components={customComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}