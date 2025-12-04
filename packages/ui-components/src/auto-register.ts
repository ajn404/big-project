import { ComponentType } from 'react'
import { ComponentCategory } from './types'
import { registerComponent } from '.'

// 组件元数据接口
export interface ComponentMetadata {
  id: string
  name: string
  description: string
  category: ComponentCategory
  template?: string
  tags?: string[]
  version?: string
  author?: string
  preview?: string
  props?: Record<string, any>
}

// 组件配置接口
export interface AutoRegisterComponentConfig {
  component: ComponentType<any>
  metadata: ComponentMetadata
}

// 存储自动注册的组件
const autoRegisterQueue: AutoRegisterComponentConfig[] = []

/**
 * 自动注册组件的装饰器函数
 * @param metadata 组件元数据
 */
export function createAutoRegisterComponent(metadata: ComponentMetadata) {
  return function<T extends ComponentType<any>>(Component: T): T {
    // 将组件添加到自动注册队列
    autoRegisterQueue.push({
      component: Component,
      metadata
    })
    
    // // 立即注册组件（如果注册表已准备就绪）
    // try {
    //   registerComponent(metadata.id, Component, {
    //     ...metadata,
    //     template: metadata.template || `:::react{component="${metadata.name}"}\\n内容\\n:::`
    //   })
    // } catch (error) {
    //   console.warn(`延迟注册组件 ${metadata.name}:`, error)
    // }
    
    return Component
  }
}

/**
 * 批量注册所有排队的组件
 */
export function processAutoRegisterQueue() {
  autoRegisterQueue.forEach(({ component, metadata }) => {
    try {
      registerComponent(metadata.id, component, {
        ...metadata,
        template: metadata.template || `:::react{component="${metadata.name}"}\\n内容\\n:::`
      })
    } catch (error) {
      console.error(`注册组件 ${metadata.name} 失败:`, error)
    }
  })
}

/**
 * 获取自动注册队列中的组件数量
 */
export function getQueuedComponentsCount(): number {
  return autoRegisterQueue.length
}

/**
 * 清空自动注册队列
 */
export function clearAutoRegisterQueue(): void {
  autoRegisterQueue.length = 0
}

// 导出便捷的类别常量
export const CATEGORIES = {
  UI: 'UI组件' as ComponentCategory,
  INTERACTIVE: '交互组件' as ComponentCategory,
  THREE_D: '3D组件' as ComponentCategory,
  CHARTS: '图表组件' as ComponentCategory,
  FORMS: '表单组件' as ComponentCategory,
  LAYOUT: '布局组件' as ComponentCategory,
  MEDIA: '媒体组件' as ComponentCategory,
  ALERT: '提示组件' as ComponentCategory,
  CREATIVE: '创意编程' as ComponentCategory,
  OTHER: '其他' as ComponentCategory,
}