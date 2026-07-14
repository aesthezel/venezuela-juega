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
        alias: [
            // ── Nueva arquitectura (más específicos primero) ──────────────────
            { find: '@/common', replacement: resolve(__dirname, './src/common') },
            { find: '@/features', replacement: resolve(__dirname, './src/features') },
            // ── Backward compat (apuntan a nueva ubicación) ───────────────────
            { find: '@/components', replacement: resolve(__dirname, './src/common/components') },
            { find: '@/hooks', replacement: resolve(__dirname, './src/common/hooks') },
            // ── Alias raíz (siempre al final) ─────────────────────────────────
            { find: '@', replacement: resolve(__dirname, './src') },
            // ── Compat Preact ↔ React ─────────────────────────────────────────
            { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
            { find: 'react-dom', replacement: 'preact/compat' },
            { find: 'react', replacement: 'preact/compat' },
        ],
    },
});