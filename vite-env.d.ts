/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SPREADSHEET_ID: string;
    readonly VITE_SHEET_NAME: string;
    readonly VITE_GAMEJAMSHEET_ID: string;
    readonly VITE_GAMEJAMSHEET_NAME_GAMES: string;
    readonly VITE_GAMEJAMSHEET_NAME_SETTINGS: string;
    readonly VITE_SPACETIMEDB_URI: string;
    readonly VITE_SPACETIMEDB_MODULE_NAME?: string;
    /** Enables the SpacetimeDB runtime trace (see src/spacetimedb/debug/sdbTrace.ts). */
    readonly VITE_SDB_DEBUG?: string;
    /** Main-thread task threshold in ms used by the trace (default 50). */
    readonly VITE_SDB_TRACE_SLOW_MS?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}