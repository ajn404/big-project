export const sampleMarkdowns = {
  reactHooks: `---
title: "React Hooks 完全指南"
description: "深入理解 React Hooks 的原理和最佳实践"
category: "React"
tags: ["React", "Hooks", "JavaScript", "前端"]
difficulty: "INTERMEDIATE"
estimatedTime: 45
prerequisites: ["JavaScript 基础", "React 基础"]
---

# React Hooks 完全指南

React Hooks 是 React 16.8 引入的新特性，它让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

## 什么是 Hooks？

Hooks 是一些可以让你在函数组件里"钩入" React state 及生命周期等特性的函数。

### 基本规则

- 只在最顶层使用 Hook
- 只在 React 函数中调用 Hook

## useState Hook

\`useState\` 是最常用的 Hook，用于在函数组件中添加状态。

\`\`\`jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
\`\`\`

### 状态更新

状态更新可以是一个值或者一个函数：

\`\`\`jsx
// 直接设置值
setCount(42)

// 使用函数更新
setCount(prevCount => prevCount + 1)
\`\`\`

## useEffect Hook

\`useEffect\` Hook 可以让你在函数组件中执行副作用操作。

\`\`\`jsx
import { useState, useEffect } from 'react'

function Timer() {
  const [seconds, setSeconds] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
    
    // 清理函数
    return () => clearInterval(interval)
  }, []) // 空依赖数组表示只在挂载和卸载时执行
  
  return <div>Timer: {seconds}s</div>
}
\`\`\`

### 依赖数组

- **空数组 []**：只在挂载和卸载时执行
- **有依赖**：在依赖项变化时执行
- **无依赖数组**：每次渲染都执行

## 自定义 Hooks

你可以创建自己的 Hooks 来重用组件间的状态逻辑。

\`\`\`jsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  
  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(initialValue)
  
  return { count, increment, decrement, reset }
}

// 使用自定义 Hook
function CounterComponent() {
  const { count, increment, decrement, reset } = useCounter(10)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
\`\`\`

## 常用 Hooks 总结

| Hook | 用途 | 示例 |
|------|------|------|
| useState | 状态管理 | \`const [state, setState] = useState(initial)\` |
| useEffect | 副作用 | \`useEffect(() => {}, [deps])\` |
| useContext | 上下文 | \`const value = useContext(Context)\` |
| useReducer | 复杂状态 | \`const [state, dispatch] = useReducer(reducer, initial)\` |
| useMemo | 性能优化 | \`const memoized = useMemo(() => expensive(), [deps])\` |
| useCallback | 回调优化 | \`const callback = useCallback(() => {}, [deps])\` |

## 最佳实践

### 1. 合理使用依赖数组

\`\`\`jsx
// ❌ 错误：遗漏依赖
useEffect(() => {
  fetchData(userId)
}, []) // userId 应该在依赖中

// ✅ 正确
useEffect(() => {
  fetchData(userId)
}, [userId])
\`\`\`

### 2. 避免在循环中调用 Hooks

\`\`\`jsx
// ❌ 错误
function BadComponent({ items }) {
  return items.map(item => {
    const [selected, setSelected] = useState(false) // 不能在循环中
    return <div key={item.id}>...</div>
  })
}

// ✅ 正确：将组件拆分
function GoodComponent({ items }) {
  return items.map(item => 
    <ItemComponent key={item.id} item={item} />
  )
}
\`\`\`

### 3. 使用 ESLint 插件

安装 \`eslint-plugin-react-hooks\` 来自动检测 Hooks 规则违反：

\`\`\`bash
npm install eslint-plugin-react-hooks --save-dev
\`\`\`

## 总结

React Hooks 提供了一种更简洁的方式来使用 React 的特性。通过遵循 Hooks 的规则和最佳实践，你可以编写出更易维护和测试的代码。

> 💡 **提示**: 从简单的 \`useState\` 和 \`useEffect\` 开始学习，然后逐步掌握更高级的 Hooks。

---

## 下一步

- [ ] 尝试重构一个 class 组件为函数组件
- [ ] 创建自己的自定义 Hook
- [ ] 学习 React Context 和 useContext`,

  typeScriptBasics: `---
title: "TypeScript 基础教程"
description: "从零开始学习 TypeScript，掌握现代前端开发必备技能"
category: "TypeScript"
tags: ["TypeScript", "JavaScript", "前端", "类型系统"]
difficulty: "BEGINNER"
estimatedTime: 60
prerequisites: ["JavaScript 基础"]
---

# TypeScript 基础教程

TypeScript 是 JavaScript 的一个超集，它添加了静态类型定义。TypeScript 代码最终会被编译为纯 JavaScript。

## 目录

## 数学公式支持

现在支持 LaTeX 数学公式！

内联数学公式：$E = mc^2$ 和 $\pi \approx 3.14159$

块级数学公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

## 为什么要使用 TypeScript？

### 优势

- **类型安全**: 在编译时捕获错误
- **更好的IDE支持**: 自动补全、重构、导航
- **代码可读性**: 类型注解让代码更易理解
- **大型项目友好**: 更好的代码组织和维护

### 对比 JavaScript

\`\`\`javascript
// JavaScript
function greet(name) {
  return "Hello, " + name
}

greet(123) // 运行时才发现问题
\`\`\`

\`\`\`typescript
// TypeScript
function greet(name: string): string {
  return "Hello, " + name
}

greet(123) // 编译时就会报错
\`\`\`

## 基本类型

### 原始类型

\`\`\`typescript
// 字符串
let message: string = "Hello World"

// 数字
let count: number = 42

// 布尔值
let isActive: boolean = true

// undefined 和 null
let u: undefined = undefined
let n: null = null
\`\`\`

### 数组

\`\`\`typescript
// 数组的两种写法
let numbers: number[] = [1, 2, 3]
let fruits: Array<string> = ["apple", "banana"]

// 只读数组
let readonlyNumbers: readonly number[] = [1, 2, 3]
\`\`\`

### 元组 (Tuple)

\`\`\`typescript
// 固定长度和类型的数组
let user: [string, number] = ["Alice", 25]

// 解构
let [name, age] = user
\`\`\`

## 对象类型

### 接口 (Interface)

\`\`\`typescript
interface User {
  id: number
  name: string
  email?: string // 可选属性
  readonly createdAt: Date // 只读属性
}

const user: User = {
  id: 1,
  name: "Alice",
  createdAt: new Date()
}
\`\`\`

### 类型别名 (Type Alias)

\`\`\`typescript
type Point = {
  x: number
  y: number
}

type Status = "pending" | "success" | "error"

const point: Point = { x: 10, y: 20 }
const status: Status = "pending"
\`\`\`

## 函数类型

### 函数声明

\`\`\`typescript
// 普通函数
function add(a: number, b: number): number {
  return a + b
}

// 箭头函数
const multiply = (a: number, b: number): number => a * b

// 可选参数
function greet(name: string, greeting?: string): string {
  return \`\${greeting || "Hello"}, \${name}!\`
}

// 默认参数
function createUser(name: string, age: number = 18): User {
  return { id: Math.random(), name, createdAt: new Date() }
}
\`\`\`

### 函数重载

\`\`\`typescript
function format(value: number): string
function format(value: string): string
function format(value: boolean): string
function format(value: any): string {
  return String(value)
}
\`\`\`

## 类和继承

### 基本类

\`\`\`typescript
class Animal {
  protected name: string
  
  constructor(name: string) {
    this.name = name
  }
  
  public speak(): string {
    return \`\${this.name} makes a sound\`
  }
}

class Dog extends Animal {
  private breed: string
  
  constructor(name: string, breed: string) {
    super(name)
    this.breed = breed
  }
  
  public speak(): string {
    return \`\${this.name} barks\`
  }
  
  public getBreed(): string {
    return this.breed
  }
}
\`\`\`

### 抽象类

\`\`\`typescript
abstract class Shape {
  abstract getArea(): number
  
  public displayArea(): void {
    console.log(\`Area: \${this.getArea()}\`)
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super()
  }
  
  getArea(): number {
    return Math.PI * this.radius ** 2
  }
}
\`\`\`

## 泛型 (Generics)

### 基本泛型

\`\`\`typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg
}

let result1 = identity<string>("hello")
let result2 = identity<number>(42)
let result3 = identity("world") // 类型推断
\`\`\`

### 泛型接口

\`\`\`typescript
interface Container<T> {
  value: T
  getValue(): T
}

class StringContainer implements Container<string> {
  constructor(public value: string) {}
  
  getValue(): string {
    return this.value
  }
}
\`\`\`

### 约束泛型

\`\`\`typescript
interface Lengthwise {
  length: number
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

logLength("hello") // ✅ string 有 length 属性
logLength([1, 2, 3]) // ✅ array 有 length 属性
// logLength(42) // ❌ number 没有 length 属性
\`\`\`

## 联合类型和交叉类型

### 联合类型

\`\`\`typescript
type StringOrNumber = string | number

function format(value: StringOrNumber): string {
  if (typeof value === "string") {
    return value.toUpperCase()
  } else {
    return value.toString()
  }
}
\`\`\`

### 交叉类型

\`\`\`typescript
type Name = { name: string }
type Age = { age: number }
type Person = Name & Age

const person: Person = {
  name: "Alice",
  age: 25
}
\`\`\`

## 实用工具类型

TypeScript 提供了许多内置的工具类型：

\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
  password: string
}

// Partial - 所有属性变为可选
type PartialUser = Partial<User>

// Pick - 选择指定属性
type PublicUser = Pick<User, "id" | "name" | "email">

// Omit - 排除指定属性
type UserWithoutPassword = Omit<User, "password">

// Required - 所有属性变为必需
type RequiredUser = Required<PartialUser>

// Record - 创建键值对类型
type UserRoles = Record<string, string>
\`\`\`

## 配置 TypeScript

### tsconfig.json

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
\`\`\`

## 最佳实践

### 1. 启用严格模式

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

### 2. 使用类型断言要谨慎

\`\`\`typescript
// ❌ 避免使用 any
const data: any = fetchData()

// ✅ 使用具体类型
interface ApiResponse {
  data: string[]
  status: number
}
const data: ApiResponse = fetchData()

// ❌ 危险的类型断言
const input = document.getElementById("input") as HTMLInputElement

// ✅ 安全的类型断言
const input = document.getElementById("input")
if (input instanceof HTMLInputElement) {
  input.value = "hello"
}
\`\`\`

### 3. 优先使用接口而不是类型别名

\`\`\`typescript
// ✅ 推荐：使用接口
interface User {
  name: string
  age: number
}

// 可以扩展
interface AdminUser extends User {
  permissions: string[]
}

// ❌ 类型别名无法扩展
type UserType = {
  name: string
  age: number
}
\`\`\`

## 常见错误和解决方案

### 1. 对象属性不存在

\`\`\`typescript
const user = { name: "Alice" }
// console.log(user.age) // ❌ Property 'age' does not exist

// 解决方案：定义完整的类型
interface User {
  name: string
  age?: number
}
const user: User = { name: "Alice" }
\`\`\`

### 2. 数组索引可能为 undefined

\`\`\`typescript
const items = ["a", "b", "c"]
// const first = items[0].toUpperCase() // ❌ 可能为 undefined

// 解决方案：添加检查
const first = items[0]?.toUpperCase() || ""
\`\`\`

## 总结

TypeScript 为 JavaScript 添加了强大的类型系统，能够：

- 提前发现错误
- 提供更好的开发体验
- 使代码更易维护
- 支持最新的 JavaScript 特性

### 学习路径

1. **基础阶段**: 掌握基本类型、接口、函数
2. **进阶阶段**: 学习泛型、工具类型、模块系统
3. **实践阶段**: 在真实项目中应用，配置构建工具

> 🎯 **建议**: 从现有的 JavaScript 项目开始，逐步添加类型注解，不要一开始就追求完美的类型覆盖。

---

## 下一步学习

- [ ] 搭建 TypeScript 开发环境
- [ ] 将一个 JavaScript 项目迁移到 TypeScript
- [ ] 学习与 React、Vue 等框架的集成
- [ ] 深入了解高级类型特性`,
  
  advancedFeatures:''
}

export function getRandomSampleMarkdown(): string {
  const samples = Object.values(sampleMarkdowns)
  return samples[Math.floor(Math.random() * samples.length)]
}

// 导入高级示例
import { advancedSample } from './advanced-sample'

// 添加到示例列表
sampleMarkdowns.advancedFeatures = advancedSample