import { describe, it, expect } from 'vitest';
import {
    parseMainRows,
    parseJamGamesRows,
    parseJamSettingsRows,
    generateSlug,
    ensureUniqueSlug,
    parseScreenshots,
    CORRECT_HEADERS
} from '../src/shared/catalogParser';
import { GameStatus, GameOrigin } from '../src/types';

describe('catalogParser module', () => {
    describe('Slug helpers', () => {
        it('generates a clean slug from titles with accents and special characters', () => {
            expect(generateSlug('¡El Chigüire Volador 2026! Línea')).toBe('el-chiguire-volador-2026-linea');
        });

        it('ensures slug uniqueness using counter suffix', () => {
            const existing = new Set<string>(['chiguire', 'chiguire-1']);
            expect(ensureUniqueSlug('chiguire', existing)).toBe('chiguire-2');
        });
    });

    describe('parseScreenshots', () => {
        it('parses JSON formatted array of URLs', () => {
            const raw = '["https://example.com/1.png", "https://example.com/2.png"]';
            expect(parseScreenshots(raw)).toEqual([
                'https://example.com/1.png',
                'https://example.com/2.png',
            ]);
        });

        it('parses comma-separated URLs', () => {
            const raw = 'https://example.com/1.png, https://example.com/2.png';
            expect(parseScreenshots(raw)).toEqual([
                'https://example.com/1.png',
                'https://example.com/2.png',
            ]);
        });
    });

    describe('parseMainRows', () => {
        it('returns empty array if required header is missing', () => {
            const data = [['Some Other Column', 'Foo']];
            expect(parseMainRows(data)).toEqual([]);
        });

        it('correctly normalizes valid rows into Game objects', () => {
            const headerRow = [...CORRECT_HEADERS];
            const dataRow = new Array(headerRow.length).fill('');
            const getIndex = (name: string) => headerRow.indexOf(name);

            dataRow[getIndex('Título del videojuego')] = 'Aventura Criolla';
            dataRow[getIndex('Descripción')] = 'Un juego de exploración por los llanos.';
            dataRow[getIndex('Estado actual')] = 'publicado';
            dataRow[getIndex('Plataforma(s)')] = 'PC, Linux';
            dataRow[getIndex('Género(s)')] = 'Aventura';
            dataRow[getIndex('Desarrollador(es)')] = 'Estudio Criollo';
            dataRow[getIndex('Fecha de lanzamiento')] = '2026-05-10';
            dataRow[getIndex('Steam')] = 'https://store.steampowered.com/app/12345';
            dataRow[getIndex('Origen inicial')] = 'Desde casa';

            const games = parseMainRows([headerRow, dataRow]);
            expect(games).toHaveLength(1);
            const game = games[0];
            expect(game.title).toBe('Aventura Criolla');
            expect(game.slug).toBe('aventura-criolla');
            expect(game.status).toBe(GameStatus.RELEASED);
            expect(game.origin).toBe(GameOrigin.FROM_HOME);
            expect(game.platform).toEqual(['PC', 'Linux']);
            expect(game.stores).toEqual([{ name: 'Steam', url: 'https://store.steampowered.com/app/12345' }]);
        });
    });

    describe('parseJamGamesRows & parseJamSettingsRows', () => {
        it('normalizes JamSettings rows', () => {
            const rows = [
                {
                    Organization: 'Valencia Game Jam',
                    Venue: 'Mediterranean Plaza',
                    Venue_City: 'Valencia',
                    UID: '8',
                    Order_Priority: '1'
                }
            ];
            const settings = parseJamSettingsRows(rows);
            expect(settings).toHaveLength(1);
            expect(settings[0].Organization).toBe('Valencia Game Jam');
            expect(settings[0].UID).toBe('8');
        });

        it('normalizes JamGames rows and defaults origin to GAME_JAM when blank', () => {
            const headerRow = [
                'Título del videojuego', 'Plataforma(s)', 'Género(s)', 'Desarrollador(es)',
                'Distribuidor', 'Jam_Org_UID', 'Jam_Edition', 'Fecha de lanzamiento',
                '', 'Estado actual', 'Tiendas', 'Enlace(s)', 'Presskit', 'Pitch',
                'Financiamiento', 'Motor', 'Origen inicial', 'Idioma(s) disponible(s)',
                'Destacado', 'Descripción del Destacado', 'steam_appid', 'google_appid',
                'Enlace directo', 'Steam', 'GOG', 'Itch', 'Nintendo Shop',
                'PlayStation Store', 'Microsoft Store', 'Play Store', 'App Store', 'Meta',
                'Tienda externa', 'Hero', 'Portada', 'Mini Image', 'Trailer', 'Screenshots', 'Descripción'
            ];
            const dataRow = new Array(headerRow.length).fill('');
            const getIndex = (name: string) => headerRow.indexOf(name);

            dataRow[getIndex('Título del videojuego')] = 'MaskMyth';
            dataRow[getIndex('Plataforma(s)')] = 'Windows';
            dataRow[getIndex('Género(s)')] = 'Rompecabezas';
            dataRow[getIndex('Desarrollador(es)')] = 'KouHaruto, CarthDwigth';
            dataRow[getIndex('Jam_Org_UID')] = '5';
            dataRow[getIndex('Jam_Edition')] = '2026';
            dataRow[getIndex('Estado actual')] = 'Lanzado';
            dataRow[getIndex('Motor')] = 'Unity';
            // Leave Origen inicial blank, as in the Google Sheet

            const jamGames = parseJamGamesRows([headerRow, dataRow]);
            expect(jamGames).toHaveLength(1);
            expect(jamGames[0].title).toBe('MaskMyth');
            expect(jamGames[0].Jam_Org_UID).toBe('5');
            expect(jamGames[0].Jam_Edition).toBe('2026');
            expect(jamGames[0].origin).toBe(GameOrigin.GAME_JAM);
        });
    });
});
