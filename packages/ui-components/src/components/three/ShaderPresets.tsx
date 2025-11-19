// 预设的 Shader 库，方便快速学习和使用
export const shaderPresets = {
  // 基础入门
  hello: {
    name: 'Hello Shader',
    category: '入门',
    description: '最简单的 Shader',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 简单的颜色变化
    vec3 color = vec3(st.x, st.y, abs(sin(u_time)));
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  rainbow: {
    name: '彩虹渐变',
    category: '入门',
    description: 'RGB 颜色渐变动画',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    vec3 color = vec3(0.0);
    color.r = sin(u_time * 2.0 + st.x * 3.14159);
    color.g = sin(u_time * 2.0 + st.x * 3.14159 + 2.094);
    color.b = sin(u_time * 2.0 + st.x * 3.14159 + 4.188);
    
    // 添加波纹效果
    float wave = sin(st.y * 10.0 + u_time * 3.0) * 0.1;
    color += wave;
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  // Book of Shaders 经典案例
  gradient: {
    name: '线性渐变',
    category: 'Book of Shaders',
    description: '第2章：算法绘图',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 水平渐变
    vec3 color = vec3(st.x);
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  step_function: {
    name: '阶梯函数',
    category: 'Book of Shaders',
    description: '使用 step 创建硬边',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 动态阶梯
    float line = step(0.5 + sin(u_time) * 0.3, st.x);
    
    vec3 color = vec3(line);
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  smoothstep_demo: {
    name: '平滑阶梯',
    category: 'Book of Shaders',
    description: '平滑过渡效果',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 平滑过渡
    float pct = smoothstep(0.2 + sin(u_time) * 0.2, 0.8 + sin(u_time) * 0.2, st.x);
    
    // 混合颜色
    vec3 colorA = vec3(0.149, 0.141, 0.912);
    vec3 colorB = vec3(1.000, 0.833, 0.224);
    vec3 color = mix(colorA, colorB, pct);
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  // 几何形状
  circle: {
    name: '动态圆形',
    category: '几何',
    description: '脉动的圆形',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st = st * 2.0 - 1.0; // 中心化
    
    float dist = length(st);
    float radius = 0.5 + sin(u_time * 3.0) * 0.2;
    
    float circle = 1.0 - smoothstep(radius - 0.02, radius + 0.02, dist);
    
    // 添加颜色
    vec3 color = vec3(circle) * vec3(1.0, 0.5 + sin(u_time) * 0.5, 0.8);
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  concentric_circles: {
    name: '同心圆',
    category: '几何',
    description: '多层同心圆效果',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 center = vec2(0.5);
    float dist = distance(st, center);
    
    // 同心圆
    float rings = sin(dist * 15.0 - u_time * 5.0);
    rings = smoothstep(0.0, 0.5, rings);
    
    // 渐变颜色
    vec3 color = vec3(rings);
    color *= vec3(1.0 - dist, 0.5 + sin(u_time) * 0.5, dist);
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  matrix: {
    name: '网格矩阵',
    category: '几何',
    description: '方格网络效果',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 创建网格
    st *= 10.0; // 缩放
    vec2 grid = fract(st); // 取小数部分
    
    // 网格线
    float lineX = smoothstep(0.0, 0.1, grid.x) * smoothstep(1.0, 0.9, grid.x);
    float lineY = smoothstep(0.0, 0.1, grid.y) * smoothstep(1.0, 0.9, grid.y);
    
    float pattern = lineX * lineY;
    
    // 添加动画
    pattern *= sin(u_time + length(floor(st))) * 0.5 + 0.5;
    
    vec3 color = vec3(pattern) * vec3(0.0, 1.0, 0.5);
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  // 噪声和纹理
  simple_noise: {
    name: '简单噪声',
    category: '噪声',
    description: '基础随机噪声',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 缩放
    st *= 10.0;
    
    // 网格噪声
    vec2 ipos = floor(st);
    float rnd = random(ipos);
    
    // 动画
    rnd = sin(u_time + rnd * 6.28) * 0.5 + 0.5;
    
    vec3 color = vec3(rnd);
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  perlin_noise: {
    name: 'Perlin 噪声',
    category: '噪声',
    description: '平滑的 Perlin 噪声效果',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 多层噪声
    float n = noise(st * 5.0 + u_time * 0.5);
    n += 0.5 * noise(st * 10.0 + u_time * 0.8);
    n += 0.25 * noise(st * 20.0 + u_time * 1.2);
    
    vec3 color = vec3(n);
    color *= vec3(0.8, 1.0, 1.2); // 蓝色调
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  // 分形和数学
  mandelbrot: {
    name: 'Mandelbrot 分形',
    category: '分形',
    description: '经典 Mandelbrot 集合',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

vec2 complexMul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    
    // 动态缩放和偏移
    float zoom = 1.0 + sin(u_time * 0.5) * 0.5;
    st = st * (3.0 / zoom) + vec2(-0.5 + sin(u_time * 0.2) * 0.3, sin(u_time * 0.15) * 0.2);
    
    vec2 z = vec2(0.0);
    vec2 c = st;
    
    int iterations = 0;
    const int maxIterations = 80;
    
    for (int i = 0; i < maxIterations; i++) {
        if (length(z) > 2.0) break;
        z = complexMul(z, z) + c;
        iterations++;
    }
    
    float t = float(iterations) / float(maxIterations);
    
    // 彩虹颜色映射
    vec3 color = vec3(0.0);
    if (t < 1.0) {
        color = 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)) + u_time);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  julia: {
    name: 'Julia 分形',
    category: '分形',
    description: 'Julia 集合动画',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

vec2 complexMul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    st *= 2.0;
    
    vec2 z = st;
    // 动态 Julia 参数
    vec2 c = vec2(0.7885 * cos(u_time * 0.3), 0.7885 * sin(u_time * 0.3));
    
    int iterations = 0;
    const int maxIterations = 60;
    
    for (int i = 0; i < maxIterations; i++) {
        if (length(z) > 2.0) break;
        z = complexMul(z, z) + c;
        iterations++;
    }
    
    float t = float(iterations) / float(maxIterations);
    
    // 火焰色彩
    vec3 color = vec3(0.0);
    if (t < 1.0) {
        color.r = sin(t * 3.14159 + u_time) * 0.5 + 0.5;
        color.g = sin(t * 6.28318 + u_time * 1.5) * 0.3;
        color.b = t * t;
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  // 特效
  tunnel: {
    name: '时空隧道',
    category: '特效',
    description: '3D 隧道错觉',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st = st * 2.0 - 1.0;
    st.x *= u_resolution.x / u_resolution.y;
    
    // 极坐标
    float radius = length(st);
    float angle = atan(st.y, st.x);
    
    // 隧道效果
    float tunnel = 1.0 / radius;
    tunnel += u_time * 2.0;
    
    // 条纹
    float stripes = sin(tunnel * 5.0) * sin(angle * 8.0);
    stripes = smoothstep(0.0, 0.5, stripes);
    
    // 颜色
    vec3 color = vec3(stripes);
    color *= vec3(1.0, 0.5 + sin(u_time) * 0.5, 0.8);
    
    // 渐晕效果
    color *= 1.0 - radius * 0.5;
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  plasma: {
    name: '等离子体',
    category: '特效',
    description: '多彩等离子效果',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 多个正弦波叠加
    float plasma = sin(st.x * 10.0 + u_time);
    plasma += sin(st.y * 10.0 + u_time * 1.5);
    plasma += sin((st.x + st.y) * 10.0 + u_time * 0.5);
    plasma += sin(sqrt(st.x * st.x + st.y * st.y) * 10.0 + u_time * 2.0);
    
    plasma /= 4.0;
    
    // 彩虹映射
    vec3 color = vec3(0.0);
    color.r = sin(plasma * 3.14159 + 0.0) * 0.5 + 0.5;
    color.g = sin(plasma * 3.14159 + 2.094) * 0.5 + 0.5;
    color.b = sin(plasma * 3.14159 + 4.188) * 0.5 + 0.5;
    
    gl_FragColor = vec4(color, 1.0);
}
`
  }
}

// 按分类组织预设
export const shaderCategories = {
  '入门': ['hello', 'rainbow'],
  'Book of Shaders': ['gradient', 'step_function', 'smoothstep_demo'],
  '几何': ['circle', 'concentric_circles', 'matrix'],
  '噪声': ['simple_noise', 'perlin_noise'],
  '分形': ['mandelbrot', 'julia'],
  '特效': ['tunnel', 'plasma']
}

// 获取指定分类的预设
export function getPresetsByCategory(category: string) {
  const presetKeys = shaderCategories[category as keyof typeof shaderCategories] || []
  return presetKeys.map(key => ({
    key,
    ...shaderPresets[key as keyof typeof shaderPresets]
  }))
}

// 获取所有预设
export function getAllPresets() {
  return Object.entries(shaderPresets).map(([key, preset]) => ({
    key,
    ...preset
  }))
}