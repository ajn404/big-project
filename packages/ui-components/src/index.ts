import { ComponentType } from 'react'
import { componentRegistry } from './registry'
import { initializeComponents } from './initialize'

// 类型定义
export interface ComponentInfo {
  id: string
  name: string
  description: string
  category: ComponentCategory
  component: ComponentType<any>
  props?: Record<string, any>
  template: string
  preview?: string
  tags?: string[]
  version?: string
  author?: string
  createdAt?: Date
  updatedAt?: Date
}

export type ComponentCategory =
  | 'UI组件'
  | '提示组件'
  | '交互组件'
  | '3D组件'
  | '图表组件'
  | '表单组件'
  | '布局组件'
  | '媒体组件'
  | '创意编程'
  | '其他'


// 创建全局实例
export { componentRegistry }

// 组件类别常量
export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  'UI组件',
  '提示组件',
  '交互组件',
  '3D组件',
  '图表组件',
  '表单组件',
  '布局组件',
  '媒体组件',
  '创意编程',
  '其他'
]

// 便捷函数
export const registerComponent = (id: string, component: ComponentType<any>, metadata?: Partial<ComponentInfo>): void => {
  componentRegistry.register(id, component, metadata)
}

export const getRegisteredComponent = (id: string): ComponentInfo | undefined => {
  return componentRegistry.get(id)
}

export const getAllRegisteredComponents = (): ComponentInfo[] => {
  return componentRegistry.getAll()
}

export const searchComponents = (query: string): ComponentInfo[] => {
  return componentRegistry.search(query)
}

export const getComponentsByCategory = (category: ComponentCategory): ComponentInfo[] => {
  return componentRegistry.getByCategory(category)
}

export { initializeComponents }

// 导出工具函数
export * from './lib'

// 导出自动注册相关功能
export { 
  createAutoRegisterComponent, 
  processAutoRegisterQueue,
  getQueuedComponentsCount,
  clearAutoRegisterQueue,
  CATEGORIES
} from './auto-register'

// 导出组件发现工具
export {
  getComponentsByCategory as getComponentsByCategoryUtil,
  searchComponentsByName,
  getAvailableCategories,
  getComponentStats,
  validateComponentRegistration
} from './utils/component-discovery'

// 导出所有组件
export * from './components'