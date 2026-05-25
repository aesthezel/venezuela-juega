import { useAuth as useOidcAuth } from 'react-oidc-context';
import type { User } from 'oidc-client-ts';

/**
 * Thin adapter over react-oidc-context (SpacetimeAuth OIDC) exposing the shape
 * the rest of the app already consumes. The AuthProvider itself comes from
 * react-oidc-context and is mounted in App.tsx with oidcConfig.
 */
export interface AppAuth {
    /** OIDC user when authenticated, else null (anonymous browsing). */
    user: User | null;
    /** SpacetimeAuth ID token (JWT) passed to SpacetimeDB, or null. */
    idToken: string | null;
    /** Stable per-user id (JWT sub) — used to key the SpacetimeDB connection. */
    sub: string | null;
    /** True until the OIDC state resolves / during a redirect round-trip. */
    loading: boolean;
    /** Redirect to the SpacetimeAuth hosted login page. */
    login: () => Promise<void>;
    /** Clear the local session (reverts to anonymous). */
    logout: () => Promise<void>;
}

export const useAuth = (): AppAuth => {
    const auth = useOidcAuth();
    const user = auth.isAuthenticated && auth.user ? auth.user : null;
    return {
        user,
        idToken: user?.id_token ?? null,
        sub: (user?.profile?.sub as string | undefined) ?? null,
        loading: auth.isLoading,
        login: () => auth.signinRedirect(),
        // Local sign-out (no federated round-trip); SpacetimeDB reconnects anonymously.
        logout: () => auth.removeUser(),
    };
};
