import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { useContext, useEffect, useState, useCallback } from 'preact/hooks';
import {
    type User,
    signInWithPopup,
    signOut,
    onIdTokenChanged,
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '@/firebase/config';

interface AuthContextValue {
    /** Firebase user, or null when signed out (anonymous browsing). */
    user: User | null;
    /** Current Firebase ID token (JWT) passed to SpacetimeDB, or null. */
    idToken: string | null;
    /** True until Firebase resolves the initial auth state. */
    loading: boolean;
    signInGoogle: () => Promise<void>;
    signInGithub: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    idToken: null,
    loading: true,
    signInGoogle: async () => {},
    signInGithub: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ComponentChildren }) => {
    const [user, setUser] = useState<User | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fires on login, logout, and ~1h token refresh.
        const unsub = onIdTokenChanged(auth, async (u) => {
            setUser(u);
            setIdToken(u ? await u.getIdToken() : null);
            setLoading(false);
        });
        return unsub;
    }, []);

    const signInGoogle = useCallback(async () => { await signInWithPopup(auth, googleProvider); }, []);
    const signInGithub = useCallback(async () => { await signInWithPopup(auth, githubProvider); }, []);
    const logout = useCallback(async () => { await signOut(auth); }, []);

    return (
        <AuthContext.Provider value={{ user, idToken, loading, signInGoogle, signInGithub, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
