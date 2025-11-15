import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UIComponent, ComponentCategory, ComponentStatus } from '../entities/ui-component.entity';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class UIComponentSeedService {
  private readonly logger = new Logger(UIComponentSeedService.name);

  constructor(private dataSource: DataSource) {}

  async seed(): Promise<void> {
    this.logger.log('开始初始化UI组件种子数据...');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 检查是否已存在组件数据
      const existingComponents = await queryRunner.manager.count(UIComponent);
      if (existingComponents > 0) {
        this.logger.log(`已存在 ${existingComponents} 个组件，跳过种子数据初始化`);
        return;
      }

      // 创建或获取标签
      const tags = await this.createTags(queryRunner);

      // 创建组件数据
      const components = await this.createComponents(queryRunner, tags);

      await queryRunner.commitTransaction();
      this.logger.log(`成功初始化 ${components.length} 个UI组件`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('UI组件种子数据初始化失败:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createTags(queryRunner: any): Promise<{ [key: string]: Tag }> {
    this.logger.log('创建标签...');
    
    const tagData = [
      { name: '卡片', color: '#3B82F6' },
      { name: 'UI', color: '#10B981' },
      { name: '布局', color: '#F59E0B' },
      { name: '交互', color: '#8B5CF6' },
      { name: '动画', color: '#EC4899' },
      { name: '演示', color: '#06B6D4' },
      { name: '3D', color: '#EF4444' },
      { name: 'Three.js', color: '#84CC16' },
      { name: '场景', color: '#6366F1' },
      { name: '组件', color: '#F97316' }
    ];

    const tags: { [key: string]: Tag } = {};

    for (const tagInfo of tagData) {
      let tag = await queryRunner.manager.findOne(Tag, { 
        where: { name: tagInfo.name } 
      });

      if (!tag) {
        tag = queryRunner.manager.create(Tag, tagInfo);
        tag = await queryRunner.manager.save(Tag, tag);
      }

      tags[tagInfo.name] = tag;
    }

    return tags;
  }

  private async createComponents(queryRunner: any, tags: { [key: string]: Tag }): Promise<UIComponent[]> {
    this.logger.log('创建UI组件...');

    const componentData = [
      {
        name: 'ExampleCard',
        description: '示例卡片组件，用于展示基本的卡片布局和内容结构',
        category: ComponentCategory.UI_COMPONENT,
        template: `:::react{component="ExampleCard" title="自定义标题" description="自定义描述"}
示例卡片内容
:::`,
        preview: '一个简洁的卡片组件，支持标题、描述和自定义内容，适用于信息展示和内容布局',
        version: '1.0.0',
        author: 'System',
        status: ComponentStatus.ACTIVE,
        props: ['title', 'description', 'className', 'children'],
        propsSchema: JSON.stringify({
          type: 'object',
          properties: {
            title: { 
              type: 'string', 
              description: '卡片标题',
              example: '示例标题'
            },
            description: { 
              type: 'string', 
              description: '卡片描述信息',
              example: '这是一个示例描述'
            },
            className: { 
              type: 'string', 
              description: '自定义CSS类名',
              example: 'custom-card-style'
            },
            children: {
              type: 'string',
              description: '卡片内容',
              example: '卡片内部内容'
            }
          },
          required: ['title']
        }),
        documentation: `# ExampleCard 组件

这是一个基础的卡片组件，用于显示简单的内容布局。

## 功能特性
- 支持自定义标题和描述
- 可以添加自定义样式类
- 支持内部内容插槽
- 响应式设计

## 属性说明
- \`title\`: 卡片标题 (必填)
- \`description\`: 卡片描述 (可选)
- \`className\`: 自定义样式类 (可选)
- \`children\`: 卡片内容 (可选)

## 使用示例
\`\`\`jsx
<ExampleCard 
  title="示例标题" 
  description="这是一个示例描述" 
  className="my-custom-style"
>
  <p>这里是卡片的内容</p>
</ExampleCard>
\`\`\`

## 样式定制
可以通过className属性添加自定义样式，或者使用CSS变量进行主题定制。`,
        examples: JSON.stringify([
          {
            name: '基础用法',
            description: '最简单的卡片用法',
            props: { 
              title: '基础卡片', 
              description: '这是一个基础的卡片示例' 
            }
          },
          {
            name: '带内容的卡片',
            description: '包含丰富内容的卡片',
            props: { 
              title: '丰富内容卡片', 
              description: '这个卡片包含了更多的信息',
              className: 'enhanced-card'
            }
          },
          {
            name: '无描述卡片',
            description: '只有标题的简洁卡片',
            props: { 
              title: '简洁卡片' 
            }
          }
        ]),
        tagNames: ['卡片', 'UI', '布局']
      },
      {
        name: 'InteractiveDemo',
        description: '交互式演示组件，包含动画效果和悬停交互，用于展示动态内容',
        category: ComponentCategory.INTERACTION,
        template: `:::react{component="InteractiveDemo" title="自定义演示" gridSize=9 backgroundColor="#f0f9ff"}
交互式演示区域
:::`,
        preview: '带有渐变背景和交互动画的演示组件，支持网格布局和悬停效果',
        version: '1.0.0',
        author: 'System',
        status: ComponentStatus.ACTIVE,
        props: ['title', 'gridSize', 'backgroundColor', 'animationSpeed', 'children'],
        propsSchema: JSON.stringify({
          type: 'object',
          properties: {
            title: { 
              type: 'string', 
              description: '演示标题',
              example: '交互演示'
            },
            gridSize: { 
              type: 'number', 
              description: '网格大小，控制布局密度', 
              default: 9,
              minimum: 4,
              maximum: 20
            },
            backgroundColor: { 
              type: 'string', 
              description: '背景颜色',
              example: '#f0f9ff'
            },
            animationSpeed: {
              type: 'number',
              description: '动画速度（毫秒）',
              default: 300,
              minimum: 100,
              maximum: 2000
            }
          }
        }),
        documentation: `# InteractiveDemo 组件

一个具有交互效果的演示组件，支持悬停动画和自定义网格布局。

## 功能特性
- 悬停交互效果
- 自定义网格大小
- 渐变背景动画
- 可配置动画速度
- 响应式布局

## 属性说明
- \`title\`: 演示标题
- \`gridSize\`: 网格大小 (4-20，默认: 9)
- \`backgroundColor\`: 自定义背景色
- \`animationSpeed\`: 动画速度，单位毫秒

## 使用场景
- 产品功能演示
- 交互效果展示
- 动画原型演示
- 用户引导界面

## 最佳实践
- gridSize建议保持在6-12之间以获得最佳视觉效果
- backgroundColor使用浅色系以确保内容可读性
- animationSpeed不宜过快，推荐300-800ms`,
        examples: JSON.stringify([
          {
            name: '默认设置',
            description: '使用默认参数的交互演示',
            props: { 
              title: '交互演示' 
            }
          },
          {
            name: '大网格布局',
            description: '使用更大网格的演示',
            props: { 
              title: '大网格演示', 
              gridSize: 16,
              backgroundColor: '#fef3c7'
            }
          },
          {
            name: '快速动画',
            description: '使用快速动画效果',
            props: { 
              title: '快速动画演示',
              animationSpeed: 150,
              backgroundColor: '#f3e8ff'
            }
          }
        ]),
        tagNames: ['交互', '动画', '演示']
      },
      {
        name: 'ThreeScene',
        description: '基于Three.js的3D场景组件，用于展示3D模型和场景渲染',
        category: ComponentCategory.THREE_D,
        template: `:::react{component="ThreeScene" width=500 height=400 backgroundColor="#1a1a2e"}
3D场景渲染区域
:::`,
        preview: '3D场景展示组件，支持自定义尺寸、相机位置和背景色',
        version: '1.0.0',
        author: 'System',
        status: ComponentStatus.ACTIVE,
        props: ['width', 'height', 'backgroundColor', 'cameraPosition', 'enableControls', 'autoRotate'],
        propsSchema: JSON.stringify({
          type: 'object',
          properties: {
            width: { 
              type: 'number', 
              description: '场景宽度（像素）', 
              default: 500,
              minimum: 200
            },
            height: { 
              type: 'number', 
              description: '场景高度（像素）', 
              default: 400,
              minimum: 200
            },
            backgroundColor: { 
              type: 'string', 
              description: '背景颜色',
              example: '#1a1a2e'
            },
            cameraPosition: { 
              type: 'object', 
              description: '相机位置坐标',
              properties: {
                x: { type: 'number', default: 0 },
                y: { type: 'number', default: 0 },
                z: { type: 'number', default: 5 }
              }
            },
            enableControls: {
              type: 'boolean',
              description: '是否启用鼠标控制',
              default: true
            },
            autoRotate: {
              type: 'boolean',
              description: '是否自动旋转',
              default: false
            }
          }
        }),
        documentation: `# ThreeScene 组件

基于 Three.js 的 3D 场景渲染组件，提供丰富的3D展示能力。

## 功能特性
- Three.js 3D 渲染
- 自定义场景尺寸
- 可配置相机位置
- 支持鼠标交互控制
- 自动旋转功能
- 自定义背景色

## 属性说明
- \`width/height\`: 场景尺寸
- \`backgroundColor\`: 背景颜色
- \`cameraPosition\`: 相机位置 {x, y, z}
- \`enableControls\`: 启用鼠标控制
- \`autoRotate\`: 自动旋转

## 技术要求
- 现代浏览器支持WebGL
- 推荐使用Chrome或Firefox
- 移动端性能可能受限

## 性能优化
- 合理设置场景尺寸
- 避免过于复杂的模型
- 在移动设备上降低渲染质量

## 使用建议
- width和height建议保持16:9或4:3比例
- backgroundColor使用深色以突出3D内容
- 在性能敏感的页面谨慎使用`,
        examples: JSON.stringify([
          {
            name: '默认场景',
            description: '标准尺寸的3D场景',
            props: { 
              width: 500, 
              height: 400 
            }
          },
          {
            name: '大型场景',
            description: '更大尺寸的3D展示',
            props: { 
              width: 800, 
              height: 600,
              backgroundColor: '#000015',
              enableControls: true
            }
          },
          {
            name: '自动旋转场景',
            description: '带有自动旋转效果的场景',
            props: { 
              width: 400,
              height: 400,
              autoRotate: true,
              cameraPosition: { x: 0, y: 2, z: 8 }
            }
          }
        ]),
        tagNames: ['3D', 'Three.js', '场景']
      }
    ];

    const components: UIComponent[] = [];

    for (const componentInfo of componentData) {
      // 获取标签
      const componentTags = componentInfo.tagNames.map(tagName => tags[tagName]).filter(Boolean);

      // 创建组件
      const component = queryRunner.manager.create(UIComponent, {
        ...componentInfo,
        tags: componentTags
      });

      const savedComponent = await queryRunner.manager.save(UIComponent, component);
      components.push(savedComponent);
      
      this.logger.log(`创建组件: ${componentInfo.name}`);
    }

    return components;
  }
}