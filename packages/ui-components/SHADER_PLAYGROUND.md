# 🎨 Shader Playground - Book of Shaders 实践组件

## 📋 组件介绍

ShaderPlayground 是一个专为学习和实践 **Book of Shaders** 而设计的实时 Shader 编辑器和可视化工具。它提供了：

- 🖥️ **实时预览**：所见即所得的 Shader 效果
- 📝 **代码编辑器**：内置语法高亮的 GLSL 编辑器
- 🎯 **经典案例**：内置 Book of Shaders 经典案例库
- ⚡ **即时编译**：代码修改后立即生效
- 🎪 **丰富预设**：从入门到高级的完整案例集

## 🚀 快速开始

### 基本使用

```tsx
import { ShaderPlayground } from '@workspace/ui-components'

function MyPage() {
  return (
    <ShaderPlayground 
      width={500}
      height={400}
      showEditor={true}
    />
  )
}
```

### 使用自定义 Shader

```tsx
const customShader = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(st.x, st.y, abs(sin(u_time)));
    gl_FragColor = vec4(color, 1.0);
}
`

<ShaderPlayground 
  initialFragmentShader={customShader}
  width={600}
  height={500}
/>
```

## 📚 内置预设案例

### 🎯 入门级案例
- **Hello Shader**: 最简单的颜色变化
- **彩虹渐变**: RGB 颜色动画
- **线性渐变**: Book of Shaders 第2章

### 🔷 几何形状
- **动态圆形**: 脉动的圆形效果
- **同心圆**: 多层圆环动画
- **网格矩阵**: 方格网络效果

### 🌊 噪声纹理
- **简单噪声**: 基础随机噪声
- **Perlin 噪声**: 平滑噪声效果
- **分形布朗运动**: 多层噪声合成

### 🌀 分形数学
- **Mandelbrot 分形**: 经典分形集合
- **Julia 分形**: 动态 Julia 集合

### ✨ 特殊效果
- **时空隧道**: 3D 隧道错觉
- **等离子体**: 多彩等离子效果

## 🎛️ 可用的 Uniform 变量

在你的 Fragment Shader 中可以使用以下内置变量：

```glsl
uniform vec2 u_resolution;  // 画布分辨率 (width, height)
uniform float u_time;       // 运行时间 (秒)
uniform vec2 u_mouse;       // 鼠标位置 (0-1 normalized)

// 标准 WebGL 变量
vec4 gl_FragCoord;          // 当前像素坐标
```

## 📖 Book of Shaders 学习路径

### 第1步：基础概念
```glsl
precision mediump float;

void main() {
    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // 洋红色
}
```

### 第2步：使用坐标
```glsl
precision mediump float;
uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(st.x, st.y, 0.0);
    gl_FragColor = vec4(color, 1.0);
}
```

### 第3步：添加时间动画
```glsl
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(st.x, st.y, abs(sin(u_time)));
    gl_FragColor = vec4(color, 1.0);
}
```

### 第4步：使用形状函数
```glsl
precision mediump float;
uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 到中心的距离
    float dist = distance(st, vec2(0.5));
    
    // 创建圆形
    float circle = 1.0 - smoothstep(0.0, 0.02, abs(dist - 0.3));
    
    vec3 color = vec3(circle);
    gl_FragColor = vec4(color, 1.0);
}
```

## 🛠️ 组件 Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `width` | number | 400 | 画布宽度 |
| `height` | number | 400 | 画布高度 |
| `initialVertexShader` | string | 默认顶点着色器 | 初始顶点着色器代码 |
| `initialFragmentShader` | string | 彩虹渐变 | 初始片段着色器代码 |
| `showEditor` | boolean | true | 是否显示代码编辑器 |
| `className` | string | '' | 自定义 CSS 类名 |

## 🎪 MDX 使用示例

在 MDX 文件中使用：

```markdown
# Shader 学习笔记

这是一个实时的 Shader 编辑器：

:::react{component="ShaderPlayground" width="500" height="400" showEditor="true"}
实时 Shader 编程环境
:::

你可以在编辑器中修改代码，实时看到效果变化！
```

## 🎯 学习建议

### 1. **从预设开始**
- 选择 "Hello Shader" 预设，理解基础结构
- 尝试修改颜色值，观察变化

### 2. **理解坐标系统**
```glsl
vec2 st = gl_FragCoord.xy / u_resolution.xy;
// st 现在是标准化坐标 (0.0 到 1.0)
```

### 3. **实验数学函数**
```glsl
sin(x)     // 正弦波
cos(x)     // 余弦波
step(a, x) // 阶梯函数
smoothstep(a, b, x) // 平滑阶梯
mix(a, b, t) // 线性插值
```

### 4. **添加动画**
```glsl
uniform float u_time;
float wave = sin(u_time); // 基于时间的动画
```

### 5. **创建形状**
```glsl
float circle = 1.0 - step(0.3, distance(st, vec2(0.5)));
```

## 🔗 推荐资源

- 📖 [The Book of Shaders](https://thebookofshaders.com/) - 官方教程
- 🎮 [Shadertoy](https://www.shadertoy.com/) - 在线 Shader 社区
- 📚 [OpenGL ES Shading Language](https://www.khronos.org/files/opengles_shading_language.pdf) - GLSL 规范

## 💡 常见技巧

### 创建渐变
```glsl
vec3 color = mix(colorA, colorB, st.x);
```

### 创建条纹
```glsl
float stripes = sin(st.x * 10.0);
```

### 创建同心圆
```glsl
float rings = sin(distance(st, vec2(0.5)) * 20.0);
```

### 添加噪声
```glsl
float noise = fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
```

现在开始你的 Shader 学习之旅吧！🚀