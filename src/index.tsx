import '@/src/styles';
import { render } from 'preact';
import App from './App';

// Handle SPA deep-link redirects from GitHub Pages (public/404.html adds ?p=<original_path>)
(function handleSpaRedirectParam() {
    try {
        const l = window.location;
        const params = new URLSearchParams(l.search);
        const p = params.get('p');
        if (p) {
            // Restore original URL from 'p' parameter
            // p = "/original/path?query=val"
            const restored = decodeURIComponent(p);
            // We use a dummy origin to parse the relative path + query
            const url = new URL(restored, window.location.origin);

            // Merge any OTHER query parameters back into the URL (if any existed besides 'p')
            params.delete('p');
            params.forEach((value, key) => {
                url.searchParams.set(key, value);
            });

            // Replace the current history entry with the original path
            window.history.replaceState({}, '', url.pathname + url.search + url.hash);
        }
    } catch (e) {
        console.error("Failed to restore SPA path:", e);
    }
})();

// Normalize trailing slash (avoid blank page when route doesn't match '/path/' vs '/path')
// Keep the site base path intact (works for both User/Org pages and Project pages on GH Pages).
(function normalizeTrailingSlash() {
    try {
        const { pathname, search, hash } = window.location;
        // Vite exposes the base at build time (e.g., '/' or '/<repo>/')
        const base = (import.meta as any).env?.BASE_URL || '/';

        // Only strip the trailing slash if:
        // - There is more path than just the base
        // - And it ends with a slash
        // This ensures we don't break '/repo/' base paths on GH Pages.
        if (pathname.length > base.length && pathname.endsWith('/')) {
            const normalized = pathname.replace(/\/+$/, ''); // remove trailing slashes
            const target = normalized + search + hash;
            window.history.replaceState({}, '', target);
        }
    } catch (e) {
        // No-op: normalization is best-effort
    }
})();

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

render(<App />, rootElement);