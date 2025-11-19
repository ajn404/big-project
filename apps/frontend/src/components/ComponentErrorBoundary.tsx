import React from 'react'
import { Alert, AlertDescription } from '@workspace/ui-components'
import { AlertTriangle } from 'lucide-react'

interface ComponentErrorBoundaryProps {
  children: React.ReactNode
  componentName: string
  fallback?: React.ReactNode
}

interface ComponentErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ComponentErrorBoundary extends React.Component<
  ComponentErrorBoundaryProps,
  ComponentErrorBoundaryState
> {
  constructor(props: ComponentErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ComponentErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Component "${this.props.componentName}" rendering error:`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-600 dark:text-red-400">
            <div className="font-medium mb-1">
              组件 "{this.props.componentName}" 渲染失败
            </div>
            <div className="text-sm opacity-90">
              {this.state.error?.message || '未知错误'}
            </div>
            <div className="text-xs mt-2 opacity-75">
              请检查组件实现或联系开发者
            </div>
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}

export default ComponentErrorBoundary