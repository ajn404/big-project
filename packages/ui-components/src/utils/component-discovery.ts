// 这个文件提供组件发现和自动注册的工具函数
import { ComponentInfo } from '../types'
import { getAllRegisteredComponents } from '..'

/**
 * 获取指定分类的所有组件
 */
export function getComponentsByCategory(category: string): ComponentInfo[] {
  return getAllRegisteredComponents().filter(component => component.category === category)
}

/**
 * 按名称搜索组件
 */
export function searchComponentsByName(query: string): ComponentInfo[] {
  const lowerQuery = query.toLowerCase()
  return getAllRegisteredComponents().filter(component =>
    component.name.toLowerCase().includes(lowerQuery) ||
    component.description.toLowerCase().includes(lowerQuery)
  )
}

/**
 * 获取所有可用的组件分类
 */
export function getAvailableCategories(): string[] {
  const components = getAllRegisteredComponents()
  const categories = new Set(components.map(c => c.category))
  return Array.from(categories).sort()
}

/**
 * 获取组件统计信息
 */
export function getComponentStats() {
  const components = getAllRegisteredComponents()
  const categoryCounts = components.reduce((acc, component) => {
    acc[component.category] = (acc[component.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    total: components.length,
    byCategory: categoryCounts,
    recentlyAdded: components
      .filter(c => c.createdAt && c.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .length
  }
}

/**
 * 验证组件是否正确注册
 */
export function validateComponentRegistration(componentName: string): {
  isRegistered: boolean
  component?: ComponentInfo
  issues: string[]
} {
  const component = getAllRegisteredComponents().find(c => c.name === componentName)
  const issues: string[] = []

  if (!component) {
    return {
      isRegistered: false,
      issues: [`组件 "${componentName}" 未找到`]
    }
  }

  // 基本验证
  if (!component.component) {
    issues.push('组件实现缺失')
  }
  
  if (!component.description) {
    issues.push('缺少组件描述')
  }

  if (!component.template) {
    issues.push('缺少 MDX 模板')
  }

  return {
    isRegistered: true,
    component,
    issues
  }
}