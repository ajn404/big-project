// 直接导入 @workspace/ui-components
import { 
  componentRegistry as uiComponentRegistry,
  COMPONENT_CATEGORIES as uiCategories,
  ComponentInfo as UIComponentInfo,
  ComponentCategory as UIComponentCategory
} from '@workspace/ui-components'

// 使用导入的组件注册表
const componentRegistry = uiComponentRegistry
const COMPONENT_CATEGORIES = uiCategories

// 重新导出类型以保持兼容性
export type ComponentInfo = UIComponentInfo
export type ComponentCategory = UIComponentCategory

console.log('✅ Using @workspace/ui-components package')

// 组件管理工具类
export class ComponentManager {
  static getAvailableComponents(): ComponentInfo[] {
    try {
      return componentRegistry.getAll ? componentRegistry.getAll() : []
    } catch (error) {
      console.warn('Failed to get components:', error)
      return []
    }
  }

  static getComponentsByCategory(category: ComponentCategory): ComponentInfo[] {
    try {
      return componentRegistry.getByCategory ? componentRegistry.getByCategory(category) : []
    } catch (error) {
      console.warn('Failed to get components by category:', error)
      return []
    }
  }

  static searchComponents(query: string): ComponentInfo[] {
    try {
      return componentRegistry.search ? componentRegistry.search(query) : []
    } catch (error) {
      console.warn('Failed to search components:', error)
      return []
    }
  }

  static registerComponent(id: string, component: any, metadata: Partial<ComponentInfo>): void {
    try {
      if (componentRegistry.register) {
        componentRegistry.register(id, component, metadata)
      }
    } catch (error) {
      console.error('Failed to register component:', error)
    }
  }

  static updateComponent(id: string, updates: Partial<ComponentInfo>): boolean {
    try {
      const existing = componentRegistry.get ? componentRegistry.get(id) : null
      if (existing) {
        // 重新注册组件来模拟更新
        const updatedComponent = { ...existing, ...updates, updatedAt: new Date() }
        this.registerComponent(id, updatedComponent.component, updatedComponent)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to update component:', error)
      return false
    }
  }

  static removeComponent(id: string): boolean {
    try {
      if (componentRegistry.remove) {
        componentRegistry.remove(id)
        return true
      } else {
        console.warn('Component removal not supported with ui-components package')
        return false
      }
    } catch (error) {
      console.error('Failed to remove component:', error)
      return false
    }
  }

  static getComponentTemplate(componentName: string): string {
    try {
      const componentInfo = componentRegistry.get(componentName)
      return componentInfo?.template || `:::react{component="${componentName}"}\n内容\n:::`
    } catch (error) {
      console.warn('Failed to get component template:', error)
      return `:::react{component="${componentName}"}\n内容\n:::`
    }
  }

  static getComponentTemplates(): Array<{name: string, description: string, category: string, template: string, tags?: string[]}> {
    try {
      return componentRegistry.getAll().map((comp: ComponentInfo) => ({
        name: comp.name,
        description: comp.description,
        category: comp.category,
        template: comp.template,
        tags: comp.tags
      }))
    } catch (error) {
      console.warn('Failed to get component templates:', error)
      return []
    }
  }

  // 生成MDX编辑器的组件模板
  static generateMDXTemplates(): Array<{name: string, description: string, category: string, template: string}> {
    try {
      const components = componentRegistry.getAll()
      
      return components.map((comp: ComponentInfo) => ({
        name: comp.name,
        description: comp.description,
        category: `React组件 - ${comp.category}`,
        template: comp.template
      }))
    } catch (error) {
      console.warn('Failed to generate MDX templates:', error)
      return []
    }
  }

  // 按分类分组组件
  static getGroupedComponents(): Record<string, ComponentInfo[]> {
    try {
      const components = componentRegistry.getAll()
      const grouped: Record<string, ComponentInfo[]> = {}

      components.forEach((comp: ComponentInfo) => {
        const category = comp.category || '其他'
        if (!grouped[category]) {
          grouped[category] = []
        }
        grouped[category].push(comp)
      })

      return grouped
    } catch (error) {
      console.warn('Failed to group components:', error)
      return {}
    }
  }

  // 获取组件分类
  static getCategories(): string[] {
    return COMPONENT_CATEGORIES
  }

  // 导出组件配置
  static exportComponents(): ComponentInfo[] {
    return this.getAvailableComponents()
  }

  // 导入组件配置
  static importComponents(components: ComponentInfo[]): void {
    components.forEach(comp => {
      this.registerComponent(comp.id, null, comp)
    })
  }
}

export default ComponentManager