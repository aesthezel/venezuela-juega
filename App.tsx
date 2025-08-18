// noinspection JSNonASCIINames
import Papa from 'papaparse';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { Router, route } from 'preact-router';
import { Game } from "@/src/types";
import { useDebounce } from '@/src/hooks';
import { parseStringToArray, mapStatus, generateSlug, ensureUniqueSlug } from '@/src/utils';
import { Header, Modal, LoadingSpinner, Footer, ScrollToTop } from '@/src/components';
import {ChartsPage, AddGamePage, AboutPage, CalendarPage, GameDetailPage, CatalogPage } from '@/src/pages';

const App = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
        status: [],
        genre: [],
        platform: [],
    });
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [currentPath, setCurrentPath] = useState('/');

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
        const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1tVBCGdGaTSTTikMKWFVT4Lzmq71TRikWSzIjiIR15FA/pub?gid=0&single=true&output=csv';

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

                const headers = data[headerIndex];
                const gameRows = data.slice(headerIndex + 1);
                const existingSlugs = new Set<string>();

                const parsedGames = gameRows.map((row: string[], index: number): Game | null => {
                    const rowObject = headers.reduce((obj, header, i) => {
                        if (header) {
                            obj[header] = row[i];
                        }
                        return obj;
                    }, {} as { [key: string]: string });

                    if (!rowObject['Título del videojuego']) {
                        return null;
                    }

                    const title = rowObject['Título del videojuego'];
                    const baseSlug = generateSlug(title);
                    const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs);

                    return {
                        id: index + 1,
                        slug: uniqueSlug,
                        title: title,
                        platform: parseStringToArray(rowObject['Plataforma(s)']),
                        genre: parseStringToArray(rowObject['Género(s)']),
                        developers: parseStringToArray(rowObject['Desarrollador(es)']),
                        publishers: parseStringToArray(rowObject['Distribuidor']),
                        releaseDate: rowObject['Lanzamiento'] || 'No especificada',
                        lastUpdateDate: rowObject['Última actualización'] || undefined,
                        status: mapStatus(rowObject['Estado actual']),
                        stores: [],
                        links: [],
                        pressKitUrl: rowObject['Presskit'] || undefined,
                        pitch: rowObject['Pitch'] || '',
                        funding: rowObject['Financiamiento'] || undefined,
                        engine: rowObject['Motor'] || 'No especificado',
                        languages: parseStringToArray(rowObject['Idioma(s) disponible(s)']),
                        imageUrl: rowObject['Portada'] || '',
                        description: rowObject['Descripción'] || '',
                        isHighlighted: rowObject['Destacado']?.toUpperCase() === 'TRUE',
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

    const allGenres = useMemo(() => Array.from(new Set(games.flatMap(g => g.genre))), [games]);
    const allPlatforms = useMemo(() => Array.from(new Set(games.flatMap(g => g.platform))), [games]);

    const filteredGames = useMemo(() => {
        return games.filter(game => {
            const searchMatch = debouncedSearchTerm === '' || 
                game.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                game.developers.some(dev => dev.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
                game.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            
            const statusMatch = activeFilters.status.length === 0 || activeFilters.status.includes(game.status);
            const genreMatch = activeFilters.genre.length === 0 || activeFilters.genre.some(f => game.genre.includes(f));
            const platformMatch = activeFilters.platform.length === 0 || activeFilters.platform.some(f => game.platform.includes(f));
            return searchMatch && statusMatch && genreMatch && platformMatch;
        });
    }, [debouncedSearchTerm, activeFilters, games]);

    const handleFilterChange = (category: string, value: string) => {
        setActiveFilters(prev => {
            const currentFilters = prev[category] || [];
            const newFilters = currentFilters.includes(value)
                ? currentFilters.filter(item => item !== value)
                : [...currentFilters, value];
            return { ...prev, [category]: newFilters };
        });
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

    const clearFilters = () => setActiveFilters({ status: [], genre: [], platform: [] });

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
        setCurrentPath(e.url);
    };

    const navigateToCatalog = () => {
        route('/');
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
                    <CatalogPage
                        path="/"
                        games={games}
                        filteredGames={filteredGames}
                        allGenres={allGenres}
                        allPlatforms={allPlatforms}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        activeFilters={activeFilters}
                        onFilterChange={handleFilterChange}
                        onClearCategory={clearFilterCategory}
                        onClearAllFilters={clearFilters}
                        onGameClick={handleOpenModal}
                    />

                    {/* Handle /game without a slug by showing the catalog */}
                    <CatalogPage
                        path="/game"
                        games={games}
                        filteredGames={filteredGames}
                        allGenres={allGenres}
                        allPlatforms={allPlatforms}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        activeFilters={activeFilters}
                        onFilterChange={handleFilterChange}
                        onClearCategory={clearFilterCategory}
                        onClearAllFilters={clearFilters}
                        onGameClick={handleOpenModal}
                    />

                    <CalendarPage
                        path="/calendar"
                        games={games}
                        onNavigateToCatalog={navigateToCatalog}
                        onEventClick={handleOpenModal}
                    />
                    <ChartsPage path="/charts" games={games} onNavigateToCatalog={navigateToCatalog} />
                    <AboutPage path="/about" onNavigateToCatalog={navigateToCatalog} />
                    <GameDetailPage path="/game/:gameSlug" games={games} />
                    <AddGamePage path="/add-game" onAddNewGame={handleAddNewGame} onNavigateToCatalog={navigateToCatalog} />
                </Router>
            </div>

            <Footer />
            <ScrollToTop />
            {selectedGame && <Modal game={selectedGame} onClose={handleCloseModal} />}
        </div>
    );
};

export default App;