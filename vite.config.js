import path, { resolve } from 'path';
import fs from 'fs';
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';


// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'CMS_',

  // This transpiles everything but I have to prefix everything in src with @triniti/cms
  root: `${resolve(__dirname, 'src')}`,

  rollupOptions: {
    preserveEntrySignatures: 'strict',
  },

  build: {
    rollupOptions: {
      input: Object.fromEntries(
        globSync('src/**/*.jsx').map(file => [
          // This remove `src/` as well as the file extension from each
          // file, so e.g. src/nested/foo.js becomes nested/foo
          path.relative(
            'src',
            file.slice(0, file.length - path.extname(file).length)
          ),
          // This expands the relative paths to absolute paths, so e.g.
          // src/nested/foo becomes /project/src/nested/foo.js
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      output: {
        format: 'es',
        dir: 'dist'
      }
    },
  },
  
  plugins: [
    nodePolyfills(),
    react(),
    // replaceUndefinedEnvVars(),
  ],

  resolve: {
    alias: {
      '@app': `${resolve(__dirname, 'demo/src')}`,
      '@triniti/cms': `${resolve(__dirname, 'src')}`,
      '@assets': `${resolve(__dirname, 'src/assets')}`,
      '@config': `${resolve(__dirname, 'demo/src/config')}`,
    },
  }
})
