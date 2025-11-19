import { ThreeScene, InteractiveDemo, ExampleCard, InfiniteGradientCarousel } from './components'
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
  },
  {
    id: 'interactive-demo',
    name: 'InteractiveDemo',
    description: '交互式演示组件，包含动画和悬停效果',
    category: '交互组件',
    component: InteractiveDemo,
    template: `:::react{component="InteractiveDemo" title="自定义演示" gridSize=9}\n交互式演示区域\n:::`,
  },
  {
    id: 'three-scene',
    name: 'ThreeScene',
    description: '3D场景组件，用于展示3D内容',
    category: '3D组件',
    component: ThreeScene,
    template: `:::react{component="ThreeScene" width=500 height=400}\n3D场景渲染区域\n:::`,
  },
  {
    id: 'InfiniteGradientCarousel',
    name: 'InfiniteGradientCarousel',
    description: '3D场景组件，用于展示3D内容',
    category: '3D组件',
    component: InfiniteGradientCarousel,
    template: `:::react{component="ThreeScene" width=500 height=400}\n3D场景渲染区域\n:::`,
  }
]

// 初始化组件注册表
export function initializeComponents() {
  components.forEach(component => {
    registerComponent(component.id, component.component, component)
  })
}