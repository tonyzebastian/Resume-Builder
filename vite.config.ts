import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure fonts are copied to dist
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names && assetInfo.names[0] && assetInfo.names[0].endsWith('.ttf')) {
            return 'fonts/[name].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      }
    }
  },
  // Ensure public files are properly served
  publicDir: 'public'
})