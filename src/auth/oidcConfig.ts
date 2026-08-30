import { WebStorageStateStore, type UserManagerSettings } from 'oidc-client-ts';

/**
 * SpacetimeAuth OIDC config for react-oidc-context.
 * authority = SpacetimeAuth issuer; client_id from the SpacetimeAuth dashboard.
 * Hosted login (redirect flow + PKCE): the user picks the provider on
 * SpacetimeAuth's page (Google/GitHub/email/magic link).
 */
export const oidcConfig: UserManagerSettings & { onSigninCallback?: () => void } = {
    authority: import.meta.env.VITE_SPACETIMEAUTH_AUTHORITY,
    client_id: import.meta.env.VITE_SPACETIMEAUTH_CLIENT_ID,
    // Must exactly match a Redirect URI registered in the SpacetimeAuth client.
    redirect_uri: window.location.origin,
    post_logout_redirect_uri: window.location.origin,
    scope: 'openid email profile offline_access',
    response_type: 'code',
    // Persist the session across reloads.
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    // Strip ?code&state from the URL after the redirect lands.
    onSigninCallback: () => {
        window.history.replaceState({}, document.title, window.location.pathname);
    },
};
