import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import { defineConfig } from 'vite';
// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [vue(), vueJsx()],
    build: {
        manifest: true,
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name][extname]',
                assetFileNames: 'assets/[name][extname]',
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
    server: {
        host: 'localhost',
        port: 8080,
        https: false,
        open: true, // 设置代理proxy
        proxy: {
            '/pull': {
                target: 'http://localhost:3000/',
                changeOrigin: true, //表示是否跨域，
                rewrite: (path) => path.replace(/^\/pull/, ''),
            },
        },
    },
});
