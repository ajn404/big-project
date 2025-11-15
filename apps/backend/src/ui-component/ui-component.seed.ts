import { Injectable, Logger } from '@nestjs/common';
import { UIComponentService } from './ui-component.service';
import { ComponentCategory, ComponentStatus } from '../database/entities/ui-component.entity';

@Injectable()
export class UIComponentSeedService {
  private readonly logger = new Logger(UIComponentSeedService.name);

  constructor(private readonly uiComponentService: UIComponentService) {}

  async seedInitialComponents(): Promise<void> {
    this.logger.log('开始初始化组件数据...');

    const initialComponents = [
      {
        name: 'ExampleCard',
        description: '示例卡片组件，用于展示基本的卡片布局',
        category: ComponentCategory.UI_COMPONENT,
        template: `:::react{component="ExampleCard" title="自定义标题" description="自定义描述"}
示例卡片内容
:::`,
        preview: '一个简洁的卡片组件，支持标题、描述和自定义内容',
        tagNames: ['卡片', 'UI', '布局'],
        version: '1.0.0',
        author: 'System',
        status: ComponentStatus.ACTIVE,
        props: ['title', 'description', 'className'],
        propsSchema: JSON.stringify({
          type: 'object',
          properties: {
            title: { type: 'string', description: '卡片标题' },
            description: { type: 'string', description: '卡片描述' },
            className: { type: 'string', description: '自定义CSS类名' }
          }
        }),
        documentation: `# ExampleCard 组件

这是一个基础的卡片组件，用于显示简单的内容布局。

## 属性
- \`title\`: 卡片标题
- \`description\`: 卡片描述  
- \`className\`: 自定义样式类

## 使用示例
\`\`\`jsx
<ExampleCard 
  title="示例标题" 
  description="这是一个示例描述" 
/>
\`\`\``,
        examples: JSON.stringify([
          {
            name: '基础用法',
            props: { title: '基础标题', description: '基础描述' }
          },
          {
            name: '自定义样式',
            props: { title: '自定义标题', description: '自定义描述', className: 'custom-card' }
          }
        ])
      },
      {
        name: 'InteractiveDemo',
        description: '交互式演示组件，包含动画和悬停效果',
        category: ComponentCategory.INTERACTION,
        template: `:::react{component="InteractiveDemo" title="自定义演示" gridSize=9}
交互式演示区域
:::`,
        preview: '带有渐变背景和交互动画的演示组件',
        tagNames: ['交互', '动画', '演示'],
        version: '1.0.0',
        author: 'System',
        status: ComponentStatus.ACTIVE,
        props: ['title', 'gridSize', 'backgroundColor'],
        propsSchema: JSON.stringify({
          type: 'object',
          properties: {
            title: { type: 'string', description: '演示标题' },
            gridSize: { type: 'number', description: '网格大小', default: 9 },
            backgroundColor: { type: 'string', description: '背景色' }
          }
        }),
        documentation: `# InteractiveDemo 组件

一个具有交互效果的演示组件，支持悬停动画和自定义网格布局。

## 特性
- 悬停交互效果
- 自定义网格大小
- 渐变背景动画

## 属性
- \`title\`: 演示标题
- \`gridSize\`: 网格大小 (默认: 9)
- \`backgroundColor\`: 自定义背景色`,
        examples: JSON.stringify([
          {
            name: '默认设置',
            props: { title: '交互演示' }
          },
          {
            name: '大网格',
            props: { title: '大网格演示', gridSize: 16 }
          }
        ])
      },
      {
        name: 'ThreeScene',
        description: '3D场景组件，用于展示3D内容',
        category: ComponentCategory.THREE_D,
        template: `:::react{component="ThreeScene" width=500 height=400}
3D场景渲染区域
:::`,
        preview: '3D场景展示组件，支持自定义尺寸和背景色',
        tagNames: ['3D', 'Three.js', '场景'],
        version: '1.0.0',
        author: 'System',
        status: ComponentStatus.ACTIVE,
        props: ['width', 'height', 'backgroundColor', 'cameraPosition'],
        propsSchema: JSON.stringify({
          type: 'object',
          properties: {
            width: { type: 'number', description: '场景宽度', default: 500 },
            height: { type: 'number', description: '场景高度', default: 400 },
            backgroundColor: { type: 'string', description: '背景色' },
            cameraPosition: { 
              type: 'object', 
              description: '相机位置',
              properties: {
                x: { type: 'number' },
                y: { type: 'number' },
                z: { type: 'number' }
              }
            }
          }
        }),
        documentation: `# ThreeScene 组件

基于 Three.js 的 3D 场景渲染组件。

## 特性
- Three.js 3D 渲染
- 自定义场景尺寸
- 可配置相机位置

## 属性
- \`width\`: 场景宽度 (默认: 500)
- \`height\`: 场景高度 (默认: 400)
- \`backgroundColor\`: 背景色
- \`cameraPosition\`: 相机位置 {x, y, z}`,
        examples: JSON.stringify([
          {
            name: '默认场景',
            props: { width: 500, height: 400 }
          },
          {
            name: '大场景',
            props: { width: 800, height: 600 }
          }
        ])
      }
    ];

    for (const componentData of initialComponents) {
      try {
        // 检查组件是否已存在
        try {
          await this.uiComponentService.findByName(componentData.name);
          this.logger.log(`组件 ${componentData.name} 已存在，跳过创建`);
          continue;
        } catch (error) {
          // 组件不存在，继续创建
        }

        await this.uiComponentService.create(componentData);
        this.logger.log(`成功创建组件: ${componentData.name}`);
      } catch (error) {
        this.logger.error(`创建组件 ${componentData.name} 失败:`, error);
      }
    }

    this.logger.log('组件数据初始化完成!');
  }
}