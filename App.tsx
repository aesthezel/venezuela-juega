// noinspection JSNonASCIINames
import Papa from 'papaparse';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { Router, RoutableProps, route } from 'preact-router';
import { Game } from "@/src/types";
import { useDebounce } from '@/src/hooks';
import { parseStringToArray, mapStatus, generateSlug, ensureUniqueSlug, updateMetadata } from '@/src/utils';
import { Header, Modal, LoadingSpinner, Footer, ScrollToTop } from '@/src/components';
import {ChartsPage, AddGamePage, AboutPage, CalendarPage, GameDetailPage, CatalogPage, GameJamPage } from '@/src/pages';

declare const gtag: (type: string, event: string, params: Record<string, any>) => void;

// TODO: move to another component and fix something about vertical centering
const NotFoundPage = (_props: RoutableProps) => (
    <section className="fixed inset-0 z-10 flex items-center justify-center px-4">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Página no encontrada</h1>
            <p className="text-gray-400 mb-6">La ruta que intentaste abrir no existe.</p>
            <button
                onClick={() => route('/')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Ir al catálogo
            </button>
        </div>
    </section>
);

// TODO: move to metada settings file
const pageMetadata = {
    '/': {
        title: 'Venezuela Juega — Catálogo de la industria de videojuegos',
        description: 'Explora, filtra y descubre videojuegos desarrollados en Venezuela. Un catálogo completo de la industria venezolana.'
    },
    '/calendar': {
        title: 'Calendario de Lanzamientos — Venezuela Juega',
        description: 'Sigue las fechas de lanzamiento de los próximos videojuegos desarrollados en Venezuela.'
    },
    '/charts': {
        title: 'Estadísticas de la Industria — Venezuela Juega',
        description: 'Visualiza datos y gráficos sobre el ecosistema de desarrollo de videojuegos en Venezuela.'
    },
    '/about': {
        title: 'Acerca de la Iniciativa — Venezuela Juega',
        description: 'Conoce más sobre la iniciativa Venezuela Juega, sus colaboradores y cómo puedes contribuir.'
    },
};

// TODO: refactor and separate hooks, useStates and useEffects properly
const App = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
        status: [],
        genre: [],
        platform: [],
        stores: [],
    });
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [currentPath, setCurrentPath] = useState('/');

    const [yearRange, setYearRange] = useState<{ min: number; max: number } | null>(null);
    const [isYearFilterManuallySet, setIsYearFilterManuallySet] = useState(false);
    const [minYear, setMinYear] = useState(new Date().getFullYear() - 40);
    const [maxYear, setMaxYear] = useState(new Date().getFullYear());


    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Screenshot helper
    const parseScreenshots = (value?: string): string[] => {
        if (!value) return [];
        const trimmed = value.trim();
        if (!trimmed) return [];
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    return parsed
                        .filter((v) => typeof v === 'string')
                        .map((v) => v.trim())
                        .filter(Boolean);
                }
            } catch {
                // TODO: do a fallback
            }
        }

        return parseStringToArray(value).map((v) => v.trim()).filter(Boolean);
    };

    useEffect(() => {
        // @ts-ignore
        const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
        // @ts-ignore
        const SHEET_NAME = import.meta.env.VITE_SHEET_NAME;
        const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

        const CORRECT_HEADERS = [
            'Título del videojuego', 'Plataforma(s)', 'Género(s)', 'Desarrollador(es)',
            'Distribuidor', 'Fecha de lanzamiento', 'Última actualización', 'Estado actual',
            'Tiendas', 'Enlace(s)', 'Presskit', 'Pitch', 'Financiamiento', 'Motor',
            'Origen inicial', 'Idioma(s) disponible(s)', 'Destacado', 'Descripción del Destacado', 'steam_appid',
            'google_appid', 'Enlace directo', 'Steam', 'GOG', 'Itch', 'Nintendo Shop',
            'PlayStation Store', 'Microsoft Store', 'Play Store', 'App Store', 'Meta',
            'Tienda externa', 'Hero', 'Portada', 'Mini Image', 'Trailer', 'Screenshots', 'Descripción'
        ];

        Papa.parse(SPREADSHEET_URL, {
            download: true,
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as string[][];
                const headerIndex = data.findIndex(row => row[0] === 'Título del videojuego');

                if (headerIndex === -1) {
                    setError('Error: No se encontró la fila de encabezado "Título del videojuego" en el CSV.');
                    setLoading(false);
                    return;
                }

                const gameRows = data.slice(headerIndex + 1);
                const existingSlugs = new Set<string>();

                const storeColumns = [
                    'Steam', 'Itch', 'Nintendo Shop', 'PlayStation Store',
                    'Microsoft Store', 'Play Store', 'App Store', 'Meta', 'GOG', 'Tienda externa'
                ];

                const parsedGames = gameRows.map((row: string[]): Game | null => {
                    const rowObject = CORRECT_HEADERS.reduce((obj, header, i) => {
                        if (header && i < row.length) {
                            obj[header] = row[i];
                        }
                        return obj;
                    }, {} as { [key: string]: string });

                    const title = rowObject['Título del videojuego'];
                    if (!title) {
                        return null;
                    }

                    const baseSlug = generateSlug(title);
                    const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs);

                    const stores = storeColumns
                        .map(storeName => ({
                            name: storeName,
                            url: rowObject[storeName]?.trim(),
                        }))
                        .filter(store => store.url);

                    const links = Object.keys(rowObject)
                        .filter(key => key.startsWith('Link') && key.endsWith('Name'))
                        .map(nameKey => {
                            const urlKey = nameKey.replace('Name', 'URL');
                            const name = rowObject[nameKey]?.trim();
                            const url = rowObject[urlKey]?.trim();
                            return (name && url) ? { name, url } : null;
                        })
                        .filter((link): link is { name: string; url: string } => link !== null);

                    return {
                        id: (games.length || 0) + existingSlugs.size + 1,
                        slug: uniqueSlug,
                        title: title,
                        platform: parseStringToArray(rowObject['Plataforma(s)']),
                        genre: parseStringToArray(rowObject['Género(s)']),
                        developers: parseStringToArray(rowObject['Desarrollador(es)']),
                        publishers: parseStringToArray(rowObject['Distribuidor']),
                        releaseDate: rowObject['Fecha de lanzamiento'] || 'No especificada',
                        lastUpdateDate: rowObject['Última actualización'] || undefined,
                        status: mapStatus(rowObject['Estado actual']),
                        stores: stores,
                        links: links,
                        pressKitUrl: rowObject['Presskit'] || undefined,
                        pitch: rowObject['Pitch'] || '',
                        funding: rowObject['Financiamiento'] || undefined,
                        engine: rowObject['Motor'] || 'No especificado',
                        languages: parseStringToArray(rowObject['Idioma(s) disponible(s)']),
                        imageUrl: rowObject['Mini Image'] || '',
                        imageCover: rowObject['Portada'] || '',
                        imageHero: rowObject['Hero'] || '',
                        description: rowObject['Descripción'] || '',
                        isHighlighted: rowObject['Destacado']?.toUpperCase() === 'TRUE',
                        highlightReason: rowObject['Descripción del Destacado'] || '',
                        screenshots: parseScreenshots(rowObject['Screenshots']),
                    };
                }).filter((game): game is Game => game !== null);

                setGames(parsedGames);
                setLoading(false);
            },
            error: (err) => {
                setError('Ha habido un error al cargar la lista de juegos');
                console.error(err);
                setLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        if (games.length > 0) {
            const currentYear = new Date().getFullYear();
            const years = games
                .map(g => {
                    const yearMatch = g.releaseDate.match(/\b\d{4}\b/);
                    return yearMatch ? parseInt(yearMatch[0], 10) : null;
                })
                .filter((y): y is number => y !== null);

            const uniqueYears = [...new Set(years)].sort((a, b) => a - b);

            const newMinYear = uniqueYears.length > 0 ? uniqueYears[0] : currentYear - 40;
            const newMaxYear = uniqueYears.length > 0 ? uniqueYears[uniqueYears.length - 1] : currentYear;

            setMinYear(newMinYear);
            setMaxYear(newMaxYear);
            setYearRange({ min: newMinYear, max: newMaxYear });
        }
    }, [games]);

    const allGenres = useMemo(() => Array.from(new Set(games.flatMap(g => g.genre))), [games]);
    const allPlatforms = useMemo(() => Array.from(new Set(games.flatMap(g => g.platform))), [games]);
    const allStores = useMemo(() => Array.from(new Set(games.flatMap(g => g.stores.map(s => s.name)))), [games]);

    const filteredGames = useMemo(() => {
        return games.filter(game => {
            const searchMatch = debouncedSearchTerm === '' ||
                game.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                game.developers.some(dev => dev.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
                game.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

            const statusMatch = activeFilters.status.length === 0 || activeFilters.status.includes(game.status);
            const genreMatch = activeFilters.genre.length === 0 || activeFilters.genre.some(f => game.genre.includes(f));
            const platformMatch = activeFilters.platform.length === 0 || activeFilters.platform.some(f => game.platform.includes(f));
            const storeMatch = activeFilters.stores.length === 0 || activeFilters.stores.some(f => game.stores.some(s => s.name === f));

            const releaseYearMatch = game.releaseDate.match(/\b\d{4}\b/);
            const releaseYear = releaseYearMatch ? parseInt(releaseYearMatch[0], 10) : null;

            let yearMatch = true;
            if (isYearFilterManuallySet) {
                if (releaseYear === null) {
                    yearMatch = false;
                } else if (yearRange) {
                    yearMatch = releaseYear >= yearRange.min && releaseYear <= yearRange.max;
                }
            }

            return searchMatch && statusMatch && genreMatch && platformMatch && storeMatch && yearMatch;
        });
    }, [debouncedSearchTerm, activeFilters, games, yearRange, isYearFilterManuallySet]);

    const handleFilterChange = (category: string, value: string) => {
        setActiveFilters(prev => {
            const currentFilters = prev[category] || [];
            const newFilters = currentFilters.includes(value)
                ? currentFilters.filter(item => item !== value)
                : [...currentFilters, value];
            return { ...prev, [category]: newFilters };
        });
    };

    const handleYearRangeChange = (newRange: { min: number; max: number }) => {
        setYearRange(newRange);
        setIsYearFilterManuallySet(true);
    };

    const clearFilterCategory = (category: string) => {
        setActiveFilters(prev => ({
            ...prev,
            [category]: [],
        }));
    };

    const handleOpenModal = (game: Game) => setSelectedGame(game);
    const handleCloseModal = () => setSelectedGame(null);

    const handleGameClick = (game: Game) => {
        route(`/game/${encodeURIComponent(game.slug)}`);
    };

    const clearFilters = () => {
        setActiveFilters({ status: [], genre: [], platform: [], stores: [] });
        setYearRange({ min: minYear, max: maxYear });
        setIsYearFilterManuallySet(false);
    };

    const handleAddNewGame = (newGameData: Omit<Game, 'id' | 'slug'>) => {
        const existingSlugs = new Set(games.map(g => g.slug));
        const baseSlug = generateSlug(newGameData.title);
        const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs);

        const newGame: Game = {
            ...newGameData,
            id: games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1,
            slug: uniqueSlug,
        };
        setGames(prevGames => [newGame, ...prevGames]);
    };

    const handleRouteChange = (e: any) => {
        const currentUrl = e.url;
        setCurrentPath(e.url);

        if (typeof gtag === 'function') {
            gtag('event', 'page_view', {
                page_path: e.url,
                page_title: document.title,
                page_location: window.location.href
            });
        }

        const gameSlugMatch = currentUrl.match(/^\/games?\/([^/]+)/);

        if (gameSlugMatch && gameSlugMatch[1]) {
            const gameSlug = decodeURIComponent(gameSlugMatch[1]);
            const foundGame = games.find(g => g.slug.toLowerCase() === gameSlug.toLowerCase());

            if (foundGame) {
                document.title = `${foundGame.title} — Venezuela Juega`;
                const description = foundGame.description.substring(0, 155).trim() + '...';
                const imageUrl = foundGame.imageCover || foundGame.imageHero || foundGame.imageUrl;

                updateMetadata('meta[name="description"]', 'content', description);
                updateMetadata('meta[property="og:title"]', 'content', foundGame.title);
                updateMetadata('meta[property="og:description"]', 'content', description);
                updateMetadata('meta[property="og:image"]', 'content', imageUrl);
                updateMetadata('meta[name="twitter:card"]', 'content', 'summary_large_image');
            }
        } else {
            const metadata = pageMetadata[currentUrl as keyof typeof pageMetadata] || pageMetadata['/'];

            document.title = metadata.title;
            updateMetadata('meta[name="description"]', 'content', metadata.description);
            updateMetadata('meta[property="og:title"]', 'content', metadata.title);
            updateMetadata('meta[property="og:description"]', 'content', metadata.description);
            // Volvemos a poner la imagen por defecto
            updateMetadata('meta[property="og:image"]', 'content', 'URL_A_TU_IMAGEN_PRINCIPAL_AQUI'); // Reemplaza con una URL a tu logo o imagen principal
            updateMetadata('meta[name="twitter:card"]', 'content', 'summary');
        }

        const pageUrl = window.location.href;
        updateMetadata('link[rel="canonical"]', 'href', pageUrl);
        updateMetadata('meta[property="og:url"]', 'content', pageUrl);
    };

    const navigateToCatalog = () => {
        route('/');
    };

    const catalogPageProps = {
        games: games,
        filteredGames: filteredGames,
        allGenres: allGenres,
        allPlatforms: allPlatforms,
        allStores: allStores,
        searchTerm: searchTerm,
        onSearchChange: setSearchTerm,
        activeFilters: activeFilters,
        onFilterChange: handleFilterChange,
        onClearCategory: clearFilterCategory,
        onClearAllFilters: clearFilters,
        onGameClick: handleOpenModal,
        minYear: minYear,
        maxYear: maxYear,
        yearRange: yearRange,
        onYearRangeChange: handleYearRangeChange,
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-center text-red-500 text-2xl p-10">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-gray-200 font-sans flex flex-col">
            <Header currentPath={currentPath} />

            <div className="flex-grow">
                <Router onChange={handleRouteChange}>
                    <CatalogPage path="/" {...catalogPageProps} />
                    <CatalogPage path="/game" {...catalogPageProps} />
                    <CatalogPage path="/game/" {...catalogPageProps} />
                    <CatalogPage path="/games" {...catalogPageProps} />
                    <CatalogPage path="/games/" {...catalogPageProps} />

                    <GameJamPage path="/gamejam" />
                    <GameJamPage path="/gamejam/" />

                    <CalendarPage
                        path="/calendar"
                        games={games}
                        onNavigateToCatalog={navigateToCatalog}
                        onEventClick={handleOpenModal}
                    />

                    <ChartsPage path="/charts" games={games} onNavigateToCatalog={navigateToCatalog} />
                    <AboutPage path="/about" onNavigateToCatalog={navigateToCatalog} />

                    <GameDetailPage path="/game/:gameSlug" games={games} />
                    <GameDetailPage path="/game/:gameSlug/" games={games} />

                    <GameDetailPage path="/games/:gameSlug" games={games} />
                    <GameDetailPage path="/games/:gameSlug/" games={games} />

                    <AddGamePage path="/add-game" onAddNewGame={handleAddNewGame} onNavigateToCatalog={navigateToCatalog} />

                    <NotFoundPage default />
                </Router>
            </div>

            <Footer />
            <ScrollToTop />
            {selectedGame && <Modal game={selectedGame} onClose={handleCloseModal} />}
        </div>
    );
};

export default App;