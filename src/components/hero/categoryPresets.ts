import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import {
    faDesktop, faMobileAlt, faTv, faRocket, faPuzzlePiece, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { Game, GameStatus, GameOrigin } from '@/src/types';

/** Which data pool a category filters against */
export type CategoryDataSource = 'games' | 'jams' | 'all';

export interface CategoryPreset {
    id: string;
    label: string;
    description: string;
    icon: IconDefinition;
    accentFrom: string;
    accentTo: string;
    /** Which data source to use: 'games' (general), 'jams' (game jams), 'all' (both) */
    dataSource: CategoryDataSource;
    filterFn?: (game: Game) => boolean;
    filterRecord?: Record<string, string[]>;
}

export const CATEGORY_PRESETS: CategoryPreset[] = [
    {
        id: 'released',
        label: 'Lanzados',
        description: 'Juegos completados y listos para jugar ahora mismo',
        icon: faRocket,
        accentFrom: '#449489',
        accentTo: '#8fcccb',
        dataSource: 'games',
        filterRecord: { status: [GameStatus.RELEASED] },
    },
    {
        id: 'demos',
        label: 'Demos',
        description: 'Disponibles para probar antes de su lanzamiento oficial',
        icon: faStar,
        accentFrom: '#f2b63d',
        accentTo: '#e34262',
        dataSource: 'all',
        filterRecord: { status: [GameStatus.RELEASED_DEMO] },
    },
    {
        id: 'pc',
        label: 'Juegos de computadora',
        description: 'Descubre títulos hechos para escritorio por estudios venezolanos',
        icon: faDesktop,
        accentFrom: '#457cd6',
        accentTo: '#8fcccb',
        dataSource: 'games',
        filterFn: (g) => g.platform.some(p => /windows|linux|mac/i.test(p)),
    },
    {
        id: 'mobile',
        label: 'Juegos Móviles',
        description: 'Experiencias en la palma de tu mano, disponibles para Android e iOS',
        icon: faMobileAlt,
        accentFrom: '#b4ba47',
        accentTo: '#6d8c32',
        dataSource: 'games',
        filterFn: (g) => g.platform.some(p => /android|ios|móvil|mobile/i.test(p)),
    },
    {
        id: 'console',
        label: 'Consolas',
        description: 'Títulos diseñados para PlayStation, Xbox, Switch y más',
        icon: faTv,
        accentFrom: '#4b3b9c',
        accentTo: '#9c656c',
        dataSource: 'games',
        filterFn: (g) => g.platform.some(p => /playstation|xbox|switch|nintendo|consola|ps[0-9]|wii/i.test(p)),
    },
    {
        id: 'gamejam',
        label: 'Game Jams',
        description: 'Creados en competencias creativas con tiempo limitado',
        icon: faPuzzlePiece,
        accentFrom: '#d46e33',
        accentTo: '#f2b63d',
        dataSource: 'jams',
        filterFn: () => true,
    },
];
