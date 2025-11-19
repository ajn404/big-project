import React from 'react'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'

interface SimpleButtonProps {
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

function SimpleButton({ 
  children = '按钮', 
  variant = 'primary', 
  size = 'md', 
  onClick 
}: SimpleButtonProps) {
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      className={`
        rounded font-medium transition-colors duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// Auto-register the component
const RegisteredSimpleButton = createAutoRegisterComponent({
  id: 'simple-button',
  name: 'SimpleButton',
  description: '简单的按钮组件，支持多种样式和尺寸',
  category: CATEGORIES.UI,
  template: `:::react{component="SimpleButton" variant="primary" size="md"}
点击我
:::`,
  tags: ['按钮', 'UI', '交互'],
  version: '1.0.0',
  author: 'Developer',
  props: {
    variant: {
      type: 'string',
      default: 'primary',
      options: ['primary', 'secondary', 'success', 'warning', 'danger']
    },
    size: {
      type: 'string', 
      default: 'md',
      options: ['sm', 'md', 'lg']
    }
  }
})(SimpleButton)

export { RegisteredSimpleButton as SimpleButton }