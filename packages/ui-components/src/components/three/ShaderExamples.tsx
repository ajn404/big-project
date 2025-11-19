// Book of Shaders 经典案例集合
export const BookOfShadersExamples = {
  // 第一章：基础
  basic: {
    name: '基础颜色',
    description: '最简单的片段着色器',
    fragment: `
precision mediump float;

void main() {
    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // 洋红色
}
`
  },

  // 第二章：算法绘图
  gradient: {
    name: '线性渐变', 
    description: 'Book of Shaders 第2章',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(st.x);
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  step: {
    name: '阶梯函数',
    description: '使用 step 函数创建硬边',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 在 x=0.5 处创建一个阶梯
    float y = step(0.5, st.x);
    
    vec3 color = vec3(y);
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  smoothstep: {
    name: '平滑阶梯',
    description: '使用 smoothstep 创建平滑过渡',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 在 0.3 和 0.7 之间创建平滑过渡
    float y = smoothstep(0.3, 0.7, st.x);
    
    vec3 color = vec3(y);
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  // 第三章：颜色
  hsb: {
    name: 'HSB 颜色空间',
    description: 'HSB 颜色轮',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

vec3 rgb2hsb(in vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsb2rgb(in vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(0.0);
    
    // 使用极坐标
    vec2 toCenter = vec2(0.5) - st;
    float angle = atan(toCenter.y, toCenter.x) + u_time;
    float radius = length(toCenter) * 2.0;
    
    // HSB 颜色
    color = hsb2rgb(vec3((angle / 6.28318) + 0.5, radius, 1.0));
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  // 第四章：形状
  circle: {
    name: '圆形',
    description: '使用距离函数绘制圆形',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 移动坐标到中心
    st -= 0.5;
    st *= 2.0; // 缩放
    
    // 计算到中心的距离
    float d = length(st);
    
    // 创建圆形
    float circle = 1.0 - smoothstep(0.0, 0.02, abs(d - 0.5));
    
    // 添加脉冲效果
    circle += 1.0 - smoothstep(0.0, 0.02, abs(d - (0.3 + 0.2 * sin(u_time * 3.0))));
    
    vec3 color = vec3(circle);
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  rectangle: {
    name: '矩形',
    description: '使用 step 函数绘制矩形',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;

float rect(vec2 st, vec2 size) {
    size = 0.5 - size * 0.5;
    vec2 uv = smoothstep(size, size + vec2(0.01), st);
    uv *= smoothstep(size, size + vec2(0.01), vec2(1.0) - st);
    return uv.x * uv.y;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    vec3 color = vec3(rect(st, vec2(0.6, 0.4)));
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  // 第五章：算法绘图进阶
  truchet: {
    name: 'Truchet 瓦片',
    description: '程序化瓦片图案',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 truchetPattern(in vec2 _st, in float _index) {
    _index = fract(((_index - 0.5) * 2.0));
    if (_index > 0.75) {
        _st = vec2(1.0) - _st;
    } else if (_index > 0.5) {
        _st = vec2(1.0 - _st.x, _st.y);
    } else if (_index > 0.25) {
        _st = 1.0 - vec2(1.0 - _st.x, _st.y);
    }
    return _st;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st *= 10.0;
    
    vec2 ipos = floor(st);  // integer
    vec2 fpos = fract(st);  // fraction
    
    vec2 tile = truchetPattern(fpos, random(ipos + u_time * 0.1));
    
    float color = 0.0;
    color = smoothstep(tile.x - 0.3, tile.x, tile.y) - 
            smoothstep(tile.x, tile.x + 0.3, tile.y);
    
    gl_FragColor = vec4(vec3(color), 1.0);
}
`
  }
}

// 进阶 Shader 效果
export const AdvancedShaderExamples = {
  voronoi: {
    name: 'Voronoi 图',
    description: '细胞状分割效果',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)), 
              dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    
    vec3 color = vec3(0.0);
    
    // 缩放
    st *= 5.0;
    
    // 瓦片空间
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    
    float m_dist = 1.0;  // 最小距离
    
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = random2(i_st + neighbor);
            
            // 动画点
            point = 0.5 + 0.5 * sin(u_time + 6.2831 * point);
            
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);
            
            m_dist = min(m_dist, dist);
        }
    }
    
    // 着色
    color += m_dist;
    color += 1.0 - step(0.02, m_dist);
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },

  fbm: {
    name: '分形布朗运动',
    description: '多层噪声合成',
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

#define OCTAVES 6
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    vec3 color = vec3(0.0);
    
    vec2 q = vec2(0.0);
    q.x = fbm(st + 0.00 * u_time);
    q.y = fbm(st + vec2(1.0));
    
    vec2 r = vec2(0.0);
    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
    r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);
    
    float f = fbm(st + r);
    
    color = mix(vec3(0.101961, 0.619608, 0.666667),
                vec3(0.666667, 0.666667, 0.498039),
                clamp((f * f) * 4.0, 0.0, 1.0));
    
    color = mix(color,
                vec3(0.0, 0.0, 0.164706),
                clamp(length(q), 0.0, 1.0));
    
    color = mix(color,
                vec3(0.666667, 1.0, 1.0),
                clamp(length(r.x), 0.0, 1.0));
    
    gl_FragColor = vec4((f * f * f + 0.6 * f * f + 0.5 * f) * color, 1.0);
}
`
  }
}