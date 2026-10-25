import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

import fs from 'fs';

function catalogApiDevPlugin(): import('vite').Plugin {
    const serveSnapshot = (filePath: string, res: any) => {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
            res.end(data);
            return true;
        }
        return false;
    };

    return {
        name: 'catalog-api-dev-middleware',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url?.startsWith('/api/catalog')) {
                    const snap = resolve(__dirname, './public/data/games.json');
                    if (serveSnapshot(snap, res)) return;
                }
                if (req.url?.startsWith('/api/jams')) {
                    const snap = resolve(__dirname, './public/data/jams.json');
                    if (serveSnapshot(snap, res)) return;
                }
                next();
            });
        },
        configurePreviewServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url?.startsWith('/api/catalog')) {
                    const snap = resolve(__dirname, './dist/data/games.json');
                    if (serveSnapshot(snap, res)) return;
                }
                if (req.url?.startsWith('/api/jams')) {
                    const snap = resolve(__dirname, './dist/data/jams.json');
                    if (serveSnapshot(snap, res)) return;
                }
                next();
            });
        }
    };
}

export default defineConfig({
    base: '/',
    plugins: [
        preact(),
        tailwindcss(),
        catalogApiDevPlugin(),
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
    build: {
        // Raise limit to 600KB to silence remaining warnings after splitting
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks(id: string) {
                    // ── Heavy calendar lib: FullCalendar and all its plugins ──
                    if (id.includes('@fullcalendar')) {
                        return 'fullcalendar';
                    }
                    // ── Charts library ───────────────────────────────────────
                    if (id.includes('recharts') || id.includes('victory') ||
                        id.includes('chart.js') || id.includes('echarts') ||
                        id.includes('apexcharts') || id.includes('d3')) {
                        return 'charts';
                    }
                    // ── GSAP animation engine ─────────────────────────────────
                    if (id.includes('gsap')) {
                        return 'gsap';
                    }
                    // ── FontAwesome icon packs ────────────────────────────────
                    if (id.includes('@fortawesome')) {
                        return 'fontawesome';
                    }
                    // ── SpacetimeDB client SDK ────────────────────────────────
                    if (id.includes('@clockworklabs') || id.includes('spacetimedb') ||
                        id.includes('module_bindings')) {
                        return 'spacetimedb';
                    }
                    // ── Preact ecosystem (signals, compat, router) ────────────
                    if (id.includes('preact') || id.includes('@preact')) {
                        return 'preact';
                    }
                    // ── PapaParse: lazy-loaded, but included in vendor chunk ──
                    if (id.includes('papaparse')) {
                        return 'papaparse';
                    }
                },
            },
        },
    },
});