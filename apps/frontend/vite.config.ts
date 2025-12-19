import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import path from 'path'
import { analyzer } from 'vite-bundle-analyzer'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Monaco Editor 静态资源拷贝插件
function monacoEditorPlugin() {
  return {
    name: 'monaco-editor-plugin',
    writeBundle() {
      // 在构建完成后拷贝Monaco Editor静态资源
      const monacoEditorPath = path.resolve(__dirname, '../../node_modules/.pnpm/monaco-editor@0.44.0/node_modules/monaco-editor/min/vs')
      const outputPath = path.resolve(__dirname, 'dist/monaco/vs')
      
      if (fs.existsSync(monacoEditorPath)) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true })
        fs.cpSync(monacoEditorPath, outputPath, { recursive: true })
        console.log('✅ Monaco Editor 静态资源已拷贝到:', outputPath)
      } else {
        console.warn('⚠️  Monaco Editor 静态资源源目录不存在:', monacoEditorPath)
      }
    },
    configureServer(server) {
      // 开发时提供Monaco Editor静态资源服务
      const monacoEditorPath = path.resolve(__dirname, '../../node_modules/.pnpm/monaco-editor@0.44.0/node_modules/monaco-editor/min/vs')
      
      server.middlewares.use('/monaco/vs', (req, res, next) => {
        const filePath = path.join(monacoEditorPath, req.url || '')
        
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath)
          const contentType = ext === '.js' ? 'application/javascript' :
                            ext === '.css' ? 'text/css' :
                            ext === '.json' ? 'application/json' :
                            'application/octet-stream'
          
          res.setHeader('Content-Type', contentType)
          res.setHeader('Access-Control-Allow-Origin', '*')
          fs.createReadStream(filePath).pipe(res)
        } else {
          next()
        }
      })
    }
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mdx({
      providerImportSource: '@mdx-js/react'
    }),
    monacoEditorPlugin(),
    // 在analyze模式下启用bundle分析器
    mode === 'analyze' && analyzer({
      analyzerMode: 'server',
      openAnalyzer: true,
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      three: path.resolve(__dirname, 'node_modules/three')
    },
    dedupe: ['three']
  },
  optimizeDeps: {
    include: ['three']
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
      external: ['ml5'],
      output: {
        globals: {
          ml5: 'ml5'
        },
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