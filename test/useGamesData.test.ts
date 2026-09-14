import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readCache, writeCache, clearCache } from '../src/common/hooks/useGamesData';

describe('useGamesData Cache System', () => {
    const mockStorage: Record<string, string> = {};

    beforeEach(() => {
        Object.keys(mockStorage).forEach(k => delete mockStorage[k]);

        vi.stubGlobal('sessionStorage', {
            getItem: (key: string) => mockStorage[key] || null,
            setItem: (key: string, val: string) => { mockStorage[key] = val; },
            removeItem: (key: string) => { delete mockStorage[key]; },
            clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
            get length() { return Object.keys(mockStorage).length; },
            key: (index: number) => Object.keys(mockStorage)[index] || null,
        });
    });

    it('writes and reads cache correctly when fresh', () => {
        const dummyData = [{ id: 1, title: 'Juego Uno' }];
        writeCache('vj_games_sheet1', 'sheet1', dummyData);

        const cached = readCache<typeof dummyData>('vj_games_sheet1', 'sheet1');
        expect(cached).not.toBeNull();
        expect(cached?.data).toEqual(dummyData);
        expect(cached?.isStale).toBe(false);
    });

    it('invalidates cache if the sheet version/id changed', () => {
        const dummyData = [{ id: 1, title: 'Juego Uno' }];
        writeCache('vj_games_sheet1', 'sheet1', dummyData);

        const cached = readCache<typeof dummyData>('vj_games_sheet1', 'sheet2');
        expect(cached).toBeNull();
    });

    it('marks cache as isStale when older than 3 minutes', () => {
        const dummyData = [{ id: 2, title: 'Juego Dos' }];
        const fourMinutesAgo = Date.now() - (4 * 60 * 1000);

        // Manually inject older timestamp
        mockStorage['vj_games_sheet1'] = JSON.stringify({
            data: dummyData,
            timestamp: fourMinutesAgo,
            version: 'sheet1',
        });

        const cached = readCache<typeof dummyData>('vj_games_sheet1', 'sheet1');
        expect(cached).not.toBeNull();
        expect(cached?.data).toEqual(dummyData);
        expect(cached?.isStale).toBe(true);
    });

    it('clearCache removes specific key or all vj_ keys', () => {
        mockStorage['vj_games_1'] = 'data1';
        mockStorage['vj_jam_1'] = 'data2';
        mockStorage['other_key'] = 'preserve';

        clearCache('vj_games_1');
        expect(mockStorage['vj_games_1']).toBeUndefined();
        expect(mockStorage['vj_jam_1']).toBe('data2');

        clearCache();
        expect(mockStorage['vj_jam_1']).toBeUndefined();
        expect(mockStorage['other_key']).toBe('preserve');
    });
});
