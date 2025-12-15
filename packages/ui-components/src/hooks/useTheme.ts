import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light' | 'system'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('vite-ui-theme') as Theme) || 'system'
    }
    return 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const root = window.document.documentElement
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setResolvedTheme(systemTheme)
    } else {
      setResolvedTheme(theme)
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('vite-ui-theme', newTheme)
    setThemeState(newTheme)
  }

  return {
    theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === 'dark'
  }
}