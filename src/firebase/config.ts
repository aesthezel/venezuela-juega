import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

/**
 * Firebase client config. Values come from .env (VITE_FIREBASE_*).
 * The Web apiKey is public by design (it identifies the project, not a secret).
 *
 * Analytics intentionally NOT initialized — the site keeps its existing
 * Google Analytics (gtag G-2PXQQ9S5B6) declared in index.html. We only use Auth.
 */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// getApps() guard keeps HMR from re-initializing the app.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
