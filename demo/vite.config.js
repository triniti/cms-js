import { resolve } from 'path';
import fs from 'fs';
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import react from '@vitejs/plugin-react'


// SSL Cert and Key
const https = (() => {
  const cert = resolve(__dirname, 'localhost.crt');
  const key = resolve(__dirname, 'localhost.key');
  if (fs.existsSync(cert) && fs.existsSync(key)) {
    return {
      key: fs.readFileSync(key),
      cert: fs.readFileSync(cert),
    }
  }
  return false;
})();


// Undefined env vars are left in index as %EXAMPLE%. This removes them.
const replaceUndefinedEnvVars = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        /%[\w\d_]+%/g,
        '',
      )
    },
  }
}

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
    replaceUndefinedEnvVars(),
  ],
  server: {
    root: `${resolve(__dirname, 'src/index.jsx')}`,
    open: 'index.html',
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    https,
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
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
})
