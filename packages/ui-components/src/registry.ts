import { ComponentType } from 'react'
import { ComponentInfo, ComponentCategory, ComponentRegistry } from './types'

class ComponentRegistryImpl implements ComponentRegistry {
  components: Record<string, ComponentInfo> = {}

  register(id: string, component: ComponentType<any>, metadata: Partial<ComponentInfo> = {}): void {
    this.components[id] = {
      id,
      component,
      name: metadata.name || id,
      description: metadata.description || '',
      category: metadata.category || '其他',
      template: metadata.template || `:::react{component="${metadata.name || id}"}\n内容\n:::`,
      tags: metadata.tags || [],
      version: metadata.version || '1.0.0',
      author: metadata.author || 'User',
      createdAt: metadata.createdAt || new Date(),
      updatedAt: metadata.updatedAt || new Date(),
      props: metadata.props,
      preview: metadata.preview,
      ...metadata
    }
  }

  get(id: string): ComponentInfo | undefined {
    return this.components[id]
  }

  getAll(): ComponentInfo[] {
    return Object.values(this.components)
  }

  getByCategory(category: ComponentCategory): ComponentInfo[] {
    return this.getAll().filter(comp => comp.category === category)
  }

  search(query: string): ComponentInfo[] {
    const lowerQuery = query.toLowerCase()
    return this.getAll().filter(comp =>
      comp.name.toLowerCase().includes(lowerQuery) ||
      comp.description.toLowerCase().includes(lowerQuery) ||
      (comp.tags && comp.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    )
  }

  clear(): void {
    this.components = {}
  }

  remove(id: string): void {
    delete this.components[id]
  }
}

const componentRegistry = new ComponentRegistryImpl()
// 创建全局注册表实例
export { componentRegistry }

export type { ComponentInfo, ComponentRegistry }