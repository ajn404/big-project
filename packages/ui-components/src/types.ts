import { ComponentType } from 'react'

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
  | '其他'

export interface ComponentRegistry {
  components: Record<string, ComponentInfo>
  register: (id: string, component: ComponentType<any>, metadata?: Partial<ComponentInfo>) => void
  get: (id: string) => ComponentInfo | undefined
  getAll: () => ComponentInfo[]
  getByCategory: (category: ComponentCategory) => ComponentInfo[]
  search: (query: string) => ComponentInfo[]
  clear: () => void
  remove: (id: string) => void
}