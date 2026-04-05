/**
 * SpacetimeDB Client Configuration
 * To update these values, check your .env/env.local or update here.
 */
const rawUri = import.meta.env.VITE_SPACETIMEDB_URI || 'ws://localhost:3000';

// Automatically upgrade ws:// to wss:// if the current page is HTTPS, 
// strictly for remote hosts (not localhost).
export const SPACETIMEDB_URI = (
    typeof window !== 'undefined' && 
    window.location.protocol === 'https:' && 
    rawUri.startsWith('ws://') && 
    !rawUri.includes('localhost')
) ? rawUri.replace('ws://', 'wss://') : rawUri;

export const MODULE_NAME = import.meta.env.VITE_SPACETIMEDB_MODULE_NAME || 'venezuela-juega';
export const AUTH_TOKEN_KEY = 'spacetimedb_auth_token'; // Local storage cache key

