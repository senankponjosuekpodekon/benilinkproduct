import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: env.API_BASE_URL ? {
          '/api': {
            target: env.API_BASE_URL,
            changeOrigin: true,
            secure: false
          }
        } : undefined,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.PAYPAL_CLIENT_ID': JSON.stringify(env.PAYPAL_CLIENT_ID),
        'process.env.STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.STRIPE_PUBLISHABLE_KEY),
        'process.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL),
        'process.env.APP_BASE_URL': JSON.stringify(env.APP_BASE_URL),
        'process.env.STRIPE_SUCCESS_PATH': JSON.stringify(env.STRIPE_SUCCESS_PATH || '/?checkout=success'),
        'process.env.STRIPE_CANCEL_PATH': JSON.stringify(env.STRIPE_CANCEL_PATH || '/?checkout=cancel')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
