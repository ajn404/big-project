# UI Components Library

这是一个可重用的UI组件库，提供了多种类别的组件。

## 项目结构

```
src/
├── components/
│   ├── ui/                 # 基础UI组件
│   │   ├── ExampleCard.tsx
│   │   └── index.ts
│   ├── interactive/        # 交互组件
│   │   ├── InteractiveDemo.tsx
│   │   └── index.ts
│   ├── three/             # Three.js 3D组件
│   │   ├── ThreeScene.tsx
│   │   ├── FloatingCubes.tsx
│   │   └── index.ts
│   ├── charts/            # 图表组件
│   ├── forms/             # 表单组件
│   ├── layout/            # 布局组件
│   ├── media/             # 媒体组件
│   ├── other/             # 其他组件
│   ├── ComponentRenderer.tsx
│   └── index.ts
├── index.ts
├── initialize.ts
├── registry.ts
└── types.ts
```

## 组件分类

### UI组件 (`ui/`)
基础的用户界面组件，如卡片、按钮、表单控件等。

### 交互组件 (`interactive/`)
提供用户交互功能的组件，如演示组件、可操作的界面元素等。

### 3D组件 (`three/`)
基于 Three.js、@react-three/fiber 和 @react-three/drei 的3D组件。

**主要组件：**
- `ThreeScene`: 3D场景容器组件
- `FloatingCubes`: 浮动立方体组件

**依赖：**
- `@react-three/fiber`: React Three.js 渲染器
- `@react-three/drei`: Three.js 辅助组件库
- `three`: Three.js 核心库

### 图表组件 (`charts/`)
数据可视化和图表组件（待实现）。

### 表单组件 (`forms/`)
专门的表单控件和表单布局组件（待实现）。

### 布局组件 (`layout/`)
页面布局和容器组件（待实现）。

### 媒体组件 (`media/`)
图像、视频和音频相关组件（待实现）。

### 其他组件 (`other/`)
不属于上述分类的特殊用途组件（待实现）。

## 使用方法

### 安装依赖

```bash
npm install @react-three/fiber @react-three/drei three
npm install --save-dev @types/three
```

### 导入组件

```tsx
// 导入特定组件
import { ThreeScene, FloatingCubes } from '@workspace/ui-components'

// 或者按分类导入
import { ThreeScene } from '@workspace/ui-components/src/components/three'
```

### 使用 Three.js 组件

```tsx
function App() {
  return (
    <div>
      <ThreeScene
        width={600}
        height={400}
        autoRotate={true}
        showStars={true}
        cubesColor="#ff6b6b"
        cubesOpacity={0.9}
      />
    </div>
  )
}
```

## 当前实现状态

### ✅ 已完成
- ✅ 项目结构重组，按功能分类
- ✅ TypeScript 类型安全编译
- ✅ 基础组件导出系统
- ✅ Three.js 组件接口定义
- ✅ 依赖管理（peer dependencies）

### 🚧 部分完成
- 🚧 Three.js 组件当前使用占位符实现
- 🚧 需要在消费项目中安装完整的 Three.js 依赖

### 📝 待实现
- 📝 动态加载 Three.js 依赖的完整实现
- 📝 其他分类的组件（charts、forms、layout等）

## 实际使用 Three.js 组件

当前的 `ThreeScene` 和 `FloatingCubes` 是占位符版本。要使用完整的 Three.js 功能：

1. 在你的项目中安装依赖：
```bash
npm install @react-three/fiber @react-three/drei three @types/three
```

2. 参考 `ThreeSceneWithDeps.tsx` 中的注释代码
3. 或者直接使用 `apps/frontend/src/components/three/scene.tsx` 的实现

## ThreeScene 组件属性（设计接口）

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `width` | `number \| string` | `400` | 场景宽度 |
| `height` | `number \| string` | `300` | 场景高度 |
| `className` | `string` | `""` | CSS类名 |
| `cameraPosition` | `[number, number, number]` | `[0, 0, 10]` | 相机位置 |
| `enableZoom` | `boolean` | `false` | 是否允许缩放 |
| `autoRotate` | `boolean` | `true` | 是否自动旋转 |
| `autoRotateSpeed` | `number` | `0.5` | 自动旋转速度 |
| `showStars` | `boolean` | `true` | 是否显示星空背景 |
| `showFloatingCubes` | `boolean` | `true` | 是否显示浮动立方体 |
| `cubesColor` | `string` | `"#3b82f6"` | 立方体颜色 |
| `cubesOpacity` | `number` | `0.8` | 立方体透明度 |
| `ambientLightIntensity` | `number` | `0.5` | 环境光强度 |
| `pointLightPosition` | `[number, number, number]` | `[10, 10, 10]` | 点光源位置 |

## 开发

```bash
# 类型检查
npm run type-check

# 构建
npm run build

# 开发模式（监听变化）
npm run dev
```