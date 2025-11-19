// 测试自动注册系统的脚本
import { 
  initializeComponents,
  getAllRegisteredComponents,
  getQueuedComponentsCount,
  getComponentStats,
  validateComponentRegistration
} from './index'

// 导入组件以触发自动注册
import './components'

export function testAutoRegisterSystem() {
  console.log('🧪 开始测试自动注册系统...')
  
  // 检查排队的组件
  console.log('📋 排队等待注册的组件数量:', getQueuedComponentsCount())
  
  // 初始化组件
  console.log('🚀 初始化组件注册表...')
  initializeComponents()
  
  // 获取所有注册的组件
  const allComponents = getAllRegisteredComponents()
  console.log('✅ 已注册的组件总数:', allComponents.length)
  
  // 显示组件统计
  const stats = getComponentStats()
  console.log('📊 组件统计:', stats)
  
  // 验证特定组件
  console.log('🔍 验证自动注册组件:')
  const testComponents = ['AutoRegisterExample', 'SimpleButton']
  
  testComponents.forEach(name => {
    const validation = validateComponentRegistration(name)
    console.log(`  ${name}:`, validation.isRegistered ? '✅ 已注册' : '❌ 未注册')
    if (validation.issues.length > 0) {
      console.log(`    问题: ${validation.issues.join(', ')}`)
    }
  })
  
  // 列出所有组件
  console.log('\n📦 所有已注册的组件:')
  allComponents.forEach(component => {
    console.log(`  - ${component.name} (${component.category}) - ${component.description}`)
  })
  
  console.log('\n🎉 自动注册系统测试完成!')
  return {
    totalComponents: allComponents.length,
    stats,
    components: allComponents.map(c => ({ name: c.name, category: c.category }))
  }
}

// 如果直接运行此文件 - 注释掉以避免构建错误
// 在需要时可以手动调用 testAutoRegisterSystem()