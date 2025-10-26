
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-phaser': ['phaser'],
        }
      }
    },
    chunkSizeWarningLimit: 2000
  }
})
