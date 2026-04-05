/**
 * SpacetimeDB Client Configuration
 * To update these values, check your .env/env.local or update here.
 */
export const SPACETIMEDB_URI = import.meta.env.VITE_SPACETIMEDB_URI || 'ws://localhost:3000';
export const MODULE_NAME = import.meta.env.VITE_SPACETIMEDB_MODULE_NAME || 'venezuela-juega';
export const AUTH_TOKEN_KEY = 'spacetimedb_auth_token';
