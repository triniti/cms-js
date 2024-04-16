import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

console.log(resolve(__dirname, '../src'));

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'CMS_',
  // Trying to not prefix everything with @triniti/cms
  // root: `${resolve(__dirname, 'src')}`,
  // include: [
  //   `${resolve(__dirname, '../src/**/*.jsx')}`,
  // ],
  
  // This transpiles everything but I have to prefix everything in src with @triniti/cms
  root: `${resolve(__dirname, 'src')}`,

  // publicDir: `${resolve(__dirname, 'src')}`,

  rollupOptions: {
    preserveEntrySignatures: 'strict',
  },
  
  plugins: [
    nodePolyfills(),
    react(),
  ],
  server: {
    root: `${resolve(__dirname, 'src/index.jsx')}`,
    open: 'index.html',
  },
  // build: {
  //   rollupOptions: {
  //     input: {
  //       app: './index.html',
  //     },
  //   },
  // },
  resolve: {
    alias: {
      '@app': `${resolve(__dirname, 'src')}`,
      '@triniti/cms': `${resolve(__dirname, '../src')}`,
      '@assets': `${resolve(__dirname, '../src/assets')}`,
      '@config': `${resolve(__dirname, '../src/config')}`,
    },
  },
  // define: {
  //   'process.env': {}
  // },
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
})
