import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/',
    plugins: [preact()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './'),
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat',
            'react': 'preact/compat',
        },
    },
});