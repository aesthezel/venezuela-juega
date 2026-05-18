/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SPREADSHEET_ID: string;
    readonly VITE_SHEET_NAME: string;
    readonly VITE_GAMEJAMSHEET_ID: string;
    readonly VITE_GAMEJAMSHEET_NAME_GAMES: string;
    readonly VITE_GAMEJAMSHEET_NAME_SETTINGS: string;
    readonly VITE_SPACETIMEDB_URI: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}