// Export ComponentRenderer if it exists
// export { ComponentRenderer } from './ComponentRenderer'

// UI Components
export * from './ui'

// Interactive Components  
export * from './interactive'

// Three.js Components
export * from './three'

// Future component categories (uncomment when components are added):
export * from './charts'
export * from './creative/collection'
// export * from './forms'
// export * from './layout'
// export * from './media'
// export * from './other'

// Note: 所有使用 createAutoRegisterComponent 装饰器的组件
// 会在被导入时自动添加到注册队列，并在 initializeComponents() 时注册