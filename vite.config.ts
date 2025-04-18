import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    vue(),
    Icons({
      compiler: 'vue3',
      autoInstall: true
    })
  ],
  css: {
    postcss: './postcss.config.js',
    devSourcemap: true
  },
  build: {
    sourcemap: true,
  },
  server: {
    port: 5173,
    open: true,
    fs: {
      strict: false
    }
  },
})