import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import path from 'path'
import { analyzer } from 'vite-bundle-analyzer'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mdx({
      providerImportSource: '@mdx-js/react'
    }),
    // 在analyze模式下启用bundle分析器
    mode === 'analyze' && analyzer({
      analyzerMode: 'server',
      openAnalyzer: true,
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'apollo-vendor': ['@apollo/client', 'graphql'],
          'markdown-vendor': ['react-markdown', 'remark-gfm', 'rehype-highlight', 'katex'],
          'ui-vendor': ['lucide-react', 'framer-motion']
        }
      }
    },
    sourcemap: mode === 'analyze'
  }
}))