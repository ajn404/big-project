import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化日期
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

// 获取难度颜色样式
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'BEGINNER':
      return 'border-green-200 text-green-800 bg-green-50'
    case 'INTERMEDIATE':
      return 'border-yellow-200 text-yellow-800 bg-yellow-50'
    case 'ADVANCED':
      return 'border-red-200 text-red-800 bg-red-50'
    default:
      return 'border-gray-200 text-gray-800 bg-gray-50'
  }
}

// 获取难度标签
export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'BEGINNER':
      return '初级'
    case 'INTERMEDIATE':
      return '中级'
    case 'ADVANCED':
      return '高级'
    default:
      return '未知'
  }
}

// 截断文本
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 格式化时间为相对时间
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} 分钟前`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} 小时前`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} 天前`
  } else {
    return formatDate(dateObj)
  }
}
