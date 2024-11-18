import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          'game-core': [
            './src/hooks/useGameState.ts',
            './src/utils/constants/index.ts',
            './src/utils/calculations/index.ts',
          ],
          'ui-components': [
            './src/components/ModernGameLayout.tsx',
            './src/components/ModernGrid.tsx',
            './src/components/ModernControls.tsx',
          ],
        },
      },
    },
    sourcemap: true,
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});