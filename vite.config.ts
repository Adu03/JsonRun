import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/JsonRun/', // GitHub Pages仓库名称
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'monaco-editor': ['@monaco-editor/react', 'monaco-editor'],
          'antd': ['antd'],
          'react': ['react', 'react-dom']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@monaco-editor/react', 'monaco-editor']
  },
  server: {
    fs: {
      // 允许为Monaco Editor提供静态资源
      strict: false
    }
  }
})
