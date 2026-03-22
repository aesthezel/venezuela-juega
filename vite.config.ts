import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/',
    plugins: [
        preact(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './'),
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat',
            'react': 'preact/compat',
        },
    },
});