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
    // Ensure fonts are copied to dist and optimize chunks
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names && assetInfo.names[0] && assetInfo.names[0].endsWith('.ttf')) {
            return 'fonts/[name].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        },
        manualChunks: {
          'pdf-lib': ['pdf-lib'],
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-scroll-area', '@radix-ui/react-switch'],
          'utils': ['sonner', '@vercel/speed-insights']
        }
      }
    }
  },
  // Ensure public files are properly served
  publicDir: 'public'
})