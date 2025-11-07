import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Code, Info, AlertTriangle, CheckCircle } from 'lucide-react'

interface MDXRendererProps {
  content: string
}

// MDX组件映射
const components = {
  h1: ({ children, ...props }: any) => (
    <h1 className="text-3xl font-bold mb-6 mt-8 first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-semibold mb-4 mt-6" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-semibold mb-3 mt-4" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p className="mb-4 leading-7" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="mb-4 ml-6 list-disc" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="mb-4 ml-6 list-decimal" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="mb-1" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }: any) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      )
    }
    return (
      <div className="relative">
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
          <code className="text-sm font-mono" {...props}>
            {children}
          </code>
        </pre>
      </div>
    )
  },
  pre: ({ children, ...props }: any) => (
    <div className="relative mb-4">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto" {...props}>
        {children}
      </pre>
    </div>
  ),
  a: ({ children, href, ...props }: any) => (
    <a 
      href={href} 
      className="text-primary hover:underline" 
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  img: ({ src, alt, ...props }: any) => (
    <img 
      src={src} 
      alt={alt} 
      className="max-w-full h-auto rounded-lg my-4" 
      {...props} 
    />
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th className="border border-border p-2 bg-muted font-semibold text-left" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="border border-border p-2" {...props}>
      {children}
    </td>
  ),
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
  CodeBlock: ({ language, children, ...props }: any) => (
    <div className="relative mb-4">
      {language && (
        <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border-b">
          <div className="flex items-center">
            <Code className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">{language}</span>
          </div>
        </div>
      )}
      <pre className={`bg-muted p-4 overflow-x-auto ${language ? 'rounded-b-lg' : 'rounded-lg'}`}>
        <code className="text-sm font-mono" {...props}>
          {children}
        </code>
      </pre>
    </div>
  ),
}

export function MDXRenderer({ content }: MDXRendererProps) {
  const renderedContent = useMemo(() => {
    // 这里是一个简化的 MDX 渲染器
    // 在实际项目中，你需要使用 @mdx-js/react 和相关的编译器
    
    // 简单的 Markdown 解析（演示用）
    let html = content
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^\s*$/gm, '')
    
    html = '<p>' + html + '</p>'
    
    return { __html: html }
  }, [content])

  if (!content) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Code className="h-12 w-12 mx-auto mb-4" />
        <p>暂无内容</p>
      </div>
    )
  }

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={renderedContent} />
      
      {/* 提示：在实际项目中使用真正的 MDX 渲染器 */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              开发提示
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              这是一个简化的 MDX 渲染器演示。在实际项目中，建议使用 @mdx-js/react 和 @mdx-js/rollup 来处理 MDX 内容的编译和渲染。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}