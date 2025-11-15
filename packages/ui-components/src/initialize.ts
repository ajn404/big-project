import { ExampleCard } from './components/ExampleCard'
import { InteractiveDemo } from './components/InteractiveDemo'
import { ThreeScene } from './components/ThreeScene'
import { ComponentInfo } from './types'
import { registerComponent } from '.'

// 组件配置
const components: ComponentInfo[] = [
  {
    id: 'example-card',
    name: 'ExampleCard',
    description: '示例卡片组件，用于展示基本的卡片布局',
    category: 'UI组件',
    component: ExampleCard,
    template: `:::react{component="ExampleCard" title="自定义标题" description="自定义描述"}\n示例卡片内容\n:::`,
    preview: '一个简洁的卡片组件，支持标题、描述和自定义内容',
    tags: ['卡片', 'UI', '布局'],
    version: '1.0.0',
    author: 'System',
    createdAt: new Date()
  },
  {
    id: 'interactive-demo',
    name: 'InteractiveDemo',
    description: '交互式演示组件，包含动画和悬停效果',
    category: '交互组件',
    component: InteractiveDemo,
    template: `:::react{component="InteractiveDemo" title="自定义演示" gridSize=9}\n交互式演示区域\n:::`,
    preview: '带有渐变背景和交互动画的演示组件',
    tags: ['交互', '动画', '演示'],
    version: '1.0.0',
    author: 'System',
    createdAt: new Date()
  },
  {
    id: 'three-scene',
    name: 'ThreeScene',
    description: '3D场景组件，用于展示3D内容',
    category: '3D组件',
    component: ThreeScene,
    template: `:::react{component="ThreeScene" width=500 height=400}\n3D场景渲染区域\n:::`,
    preview: '3D场景展示组件，支持自定义尺寸和背景色',
    tags: ['3D', 'Three.js', '场景'],
    version: '1.0.0',
    author: 'System',
    createdAt: new Date()
  }
]

// 初始化组件注册表
export function initializeComponents() {
  components.forEach(component => {
    registerComponent(component.id, component.component, component)
  })
}