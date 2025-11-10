import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ThreeScene } from '@/components/three/scene'
import { Code, AlertTriangle } from 'lucide-react'

interface ComponentRendererProps {
  componentName: string
  props?: Record<string, any>
}

// 可用的组件映射
const availableComponents: Record<string, any> = {
  ThreeScene,
  // 在这里添加更多可用的组件
  ExampleCard: () => (
    <Card>
      <CardHeader>
        <CardTitle>示例组件</CardTitle>
        <CardDescription>这是一个示例React组件</CardDescription>
      </CardHeader>
      <CardContent>
        <p>这里可以放置任何React组件内容。</p>
      </CardContent>
    </Card>
  ),
  InteractiveDemo: () => (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
      <h3 className="text-xl font-bold mb-4">交互式演示</h3>
      <p className="mb-4">这是一个交互式组件演示区域。</p>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 bg-white/20 rounded animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  ),
}

export function ComponentRenderer({ componentName, props = {} }: ComponentRendererProps) {
  if (!componentName) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          未指定组件名称
        </AlertDescription>
      </Alert>
    )
  }

  const Component = availableComponents[componentName]

  if (!Component) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          组件 "{componentName}" 不存在或未注册
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* 组件信息 */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center">
          <Code className="h-5 w-5 mr-2" />
          <span className="font-medium">React 组件: {componentName}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          实时渲染
        </span>
      </div>

      {/* 组件渲染区域 */}
      <div className="border rounded-lg p-6 bg-background">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <Component {...props} />
        </Suspense>
      </div>

      {/* 组件说明 */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start">
          <Code className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              组件说明
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              这是一个实时渲染的 React 组件。你可以在这里看到组件的实际效果，
              这种方式非常适合展示交互式的学习内容或演示。
            </p>
          </div>
        </div>
      </div>

      {/* Props 展示（如果有的话） */}
      {Object.keys(props).length > 0 && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">组件属性 (Props):</h4>
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(props, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}