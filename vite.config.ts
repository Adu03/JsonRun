import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  base: '/JsonRun/', // GitHub Pages仓库名称 - Adu03/JsonRun
  plugins: [
    react(),
    viteCompression({
      verbose: true, // 是否在控制台输出压缩结果
      disable: false, // 是否禁用压缩
      threshold: 10240, // 体积大于 10KB 才进行压缩
      algorithm: 'gzip', // 压缩算法
      ext: '.gz', // 生成的压缩包后缀
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          'codemirror-vendor': [
            '@uiw/react-codemirror', 
            '@codemirror/lang-json', 
            '@uiw/codemirror-theme-vscode',
            '@codemirror/state',
            '@codemirror/view'
          ]
        }
      }
    },
    // 提升静态资源的打包警告限制大小到 1000kb
    chunkSizeWarningLimit: 1000
  }
})
