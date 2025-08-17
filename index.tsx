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
            // Replace the current URL with the original path so the router sees the correct route
            // p already contains the full path (and possible search) relative to the site base
            const target = p + l.hash;
            window.history.replaceState({}, '', target);
        }
    } catch (_) {
        console.error("Something going wrong with redirect fetching!!!")
    }
})();

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

render(<App />, rootElement);