import React, { Suspense } from 'react'
import { Code, AlertTriangle } from 'lucide-react'
import ComponentManager from '@/utils/component-manager'
import ComponentErrorBoundary from './ComponentErrorBoundary'

interface ComponentRendererProps {
  componentName: string
  props?: Record<string, any>
}

import { initializeComponents, componentRegistry as uiRegistry, Alert, AlertDescription } from '@workspace/ui-components'

// 获取组件注册表
const getComponentRegistry = () => {
  return uiRegistry || ComponentManager
}

// 注册现有组件到新的注册表
const initializeComponentRegistry = () => {
  const manager = getComponentRegistry()
  if (!manager) return
  initializeComponents()
  
}

// 初始化组件注册表
initializeComponentRegistry()


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
  const componentInfo = ComponentManager.getAvailableComponents().find(c => c.name === componentName) || null

  if (!componentInfo) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          组件 "{componentName}" 不存在或未注册
        </AlertDescription>
      </Alert>
    )
  }

  const Component = componentInfo.component

  // 检查组件是否为有效的 React 组件
  if (!Component || (typeof Component !== 'function' && typeof Component !== 'object')) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          组件 "{componentName}" 无效或未正确实现
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
          <span className="font-medium">React 组件: {componentInfo.name}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {componentInfo.category}
        </span>
      </div>

      {/* 组件渲染区域 */}
      <div className="border rounded-lg p-6 bg-background">
        <ComponentErrorBoundary componentName={componentName}>
          <Suspense 
            fallback={
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }
          >
            {React.createElement(Component, props)}
          </Suspense>
        </ComponentErrorBoundary>
      </div>

      {/* 组件说明 */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start">
          <Code className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              {componentInfo.name}
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              {componentInfo.description}
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

// 导出组件管理器供其他地方使用
export { ComponentManager }
export { ComponentManager as componentRegistry }