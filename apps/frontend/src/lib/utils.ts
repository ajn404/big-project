import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getDifficultyColor(difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') {
  switch (difficulty) {
    case 'BEGINNER':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'INTERMEDIATE':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'ADVANCED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

export function getDifficultyLabel(difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') {
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