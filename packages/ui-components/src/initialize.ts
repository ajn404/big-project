// 初始化组件注册表
export async function initializeComponents() {
  // 处理自动注册队列
  try {
    const { processAutoRegisterQueue } = await import('./auto-register')
    processAutoRegisterQueue()
  } catch (error) {
    console.warn('处理自动注册队列时出错:', error)
  }
}