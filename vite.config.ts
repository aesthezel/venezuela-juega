import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
    base: '.',
    plugins: [preact()],
    resolve: {
        alias: {
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat',
            'react': 'preact/compat',
        },
    },
});