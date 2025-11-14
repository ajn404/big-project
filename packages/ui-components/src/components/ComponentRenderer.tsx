import React, { Suspense } from 'react'
import { componentRegistry } from '../registry'

interface ComponentRendererProps {
  componentName: string
  props?: Record<string, any>
  className?: string
  showInfo?: boolean
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ 
  componentName, 
  props = {}, 
  className = "",
  showInfo = true 
}) => {
  if (!componentName) {
    return (
      <div className={`border border-red-200 bg-red-50 dark:bg-red-950 p-4 rounded-lg ${className}`}>
        <div className="flex items-center text-red-600 dark:text-red-400">
          <span className="mr-2">⚠️</span>
          <span>未指定组件名称</span>
        </div>
      </div>
    )
  }

  const componentInfo = componentRegistry.getComponent(componentName)

  if (!componentInfo) {
    return (
      <div className={`border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg ${className}`}>
        <div className="flex items-center text-yellow-600 dark:text-yellow-400">
          <span className="mr-2">⚠️</span>
          <span>组件 "{componentName}" 不存在或未注册</span>
        </div>
        <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
          可用组件: {componentRegistry.getAllComponents().map(c => c.name).join(', ')}
        </div>
      </div>
    )
  }

  const Component = componentInfo.component

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 组件信息 */}
      {showInfo && (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <div className="flex items-center">
            <span className="text-blue-500 mr-2">⚛️</span>
            <div>
              <span className="font-medium">{componentInfo.name}</span>
              <div className="text-xs text-gray-500">{componentInfo.description}</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {componentInfo.category}
          </div>
        </div>
      )}

      {/* 组件渲染区域 */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-500">加载中...</span>
            </div>
          }
        >
          <Component {...props} />
        </Suspense>
      </div>

      {/* Props 展示 */}
      {Object.keys(props).length > 0 && showInfo && (
        <details className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
            组件属性 (Props)
          </summary>
          <pre className="mt-2 text-xs overflow-x-auto text-gray-600 dark:text-gray-400">
            {JSON.stringify(props, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}