import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import commonjs from 'vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      ...eslintPlugin({
        failOnError: false,
      }),
      apply: 'serve',
      enforce: 'post',
    },
    Components({
      /* options */
    }),
    commonjs(/* options */),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
