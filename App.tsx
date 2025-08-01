import { useState, useMemo, useEffect } from 'preact/hooks';
import Papa from 'papaparse';
import { Game, GameStatus } from './types';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import GameGrid from './components/GameGrid';
import Modal from './components/Modal';
import Highlights from './components/Highlights';
import ChartsPage from './components/ChartsPage';
import AddGamePage from './components/pages/AddGamePage.tsx';
import GameCounter from './components/GameCounter';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from "./components/Footer.tsx";
import AboutPage from "./components/pages/AboutPage.tsx";

/// HELPER FUNCTIONS
const parseStringToArray = (str: string | undefined): string[] => {
    if (!str) return [];
    return str.split(',').map(item => item.trim()).filter(Boolean);
};

const mapStatus = (statusStr: string | undefined): GameStatus => {
    const statusMap: { [key: string]: GameStatus } = {
        'publicado': GameStatus.RELEASED,
        'en desarrollo': GameStatus.IN_DEVELOPMENT,
        'pausado': GameStatus.ON_HOLD,
        'cancelado': GameStatus.CANCELED,
    };
    // Fallback GameStatus
    return statusMap[statusStr?.toLowerCase() || ''] || GameStatus.IN_DEVELOPMENT;
};
/// HELPER FUNCTIONS

type Page = 'catalog' | 'charts' | 'add-game' | 'about';

const App = () => {
    const [currentPage, setCurrentPage] = useState<Page>('catalog');
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

    useEffect(() => {
        const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1tVBCGdGaTSTTikMKWFVT4Lzmq71TRikWSzIjiIR15FA/pub?gid=0&single=true&output=csv';

        Papa.parse(SPREADSHEET_URL, {
            download: true,
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as string[][];

                const headerIndex = data.findIndex(row => row[0] === 'Título del videojuego'); // Found row header

                if (headerIndex === -1) {
                    setError('Error: No se encontró la fila de encabezado "Título del videojuego" en el CSV.');
                    setLoading(false);
                    return;
                }

                const headers = data[headerIndex];
                const gameRows = data.slice(headerIndex + 1);

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

                    return {
                        id: index + 1,
                        title: rowObject['Título del videojuego'],
                        platform: parseStringToArray(rowObject['Plataforma(s)']),
                        genre: parseStringToArray(rowObject['Género(s)']),
                        developers: parseStringToArray(rowObject['Desarrollador(es)']),
                        publishers: parseStringToArray(rowObject['Distribuidor']),
                        releaseDate: rowObject['Lanzamiento'] || 'No especificada',
                        lastUpdateDate: rowObject['Última actualización'] || undefined,
                        status: mapStatus(rowObject['Estado actual']),
                        stores: [],
                        links: [],
                        presskitUrl: rowObject['Presskit'] || undefined,
                        pitch: rowObject['Pitch'] || '',
                        funding: rowObject['Financiamiento'] || undefined,
                        engine: rowObject['Motor'] || 'No especificado',
                        languages: parseStringToArray(rowObject['Idioma(s) disponible(s)']),
                        imageUrl: rowObject['Portada'] || `https://picsum.photos/seed/${encodeURIComponent(rowObject['Título del videojuego'] || index)}/500/300`, // `https://picsum.photos/seed/${encodeURIComponent(rowObject['Título del videojuego'] || index)}/500/300`
                        description: rowObject['Descripción'] || 'Sin descripción.',
                        isHighlighted: rowObject['Destacado']?.toUpperCase() === 'TRUE',
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
            const searchMatch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = activeFilters.status.length === 0 || activeFilters.status.includes(game.status);
            const genreMatch = activeFilters.genre.length === 0 || activeFilters.genre.some(f => game.genre.includes(f));
            const platformMatch = activeFilters.platform.length === 0 || activeFilters.platform.some(f => game.platform.includes(f));
            return searchMatch && statusMatch && genreMatch && platformMatch;
        });
    }, [searchTerm, activeFilters, games]);

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
    const clearFilters = () => setActiveFilters({ status: [], genre: [], platform: [] });
    const navigateTo = (page: Page) => setCurrentPage(page);

    const handleAddNewGame = (newGameData: Omit<Game, 'id'>) => {
        const newGame: Game = {
            ...newGameData,
            id: games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1,
        };
        setGames(prevGames => [newGame, ...prevGames]);
        navigateTo('catalog');
    };

    const renderPage = () => {
        if (loading) {
            return <LoadingSpinner />;
        }
        if (error) {
            return <div className="text-center text-red-500 text-2xl p-10">{error}</div>;
        }

        switch(currentPage) {
            case 'charts':
                return <ChartsPage games={games} onNavigateToCatalog={() => navigateTo('catalog')} />;
            case 'add-game':
                return <AddGamePage onAddNewGame={handleAddNewGame} onNavigateToCatalog={() => navigateTo('catalog')} />;
            case 'about':
                return <AboutPage onNavigateToCatalog={() => navigateTo('catalog')} />;
            case 'catalog':
            default:
                return (
                    <main className="container mx-auto px-4 py-8">
                        <Highlights games={games} onGameClick={handleOpenModal} />

                        <GameCounter filteredCount={filteredGames.length} totalCount={games.length} />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <aside className="md:col-span-1">
                                <div className="sticky top-8">
                                    <h2 className="text-2xl font-bold mb-4 text-cyan-400">Filtros</h2>
                                    <div className="space-y-6 bg-slate-800 p-6 rounded-lg shadow-lg">
                                        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                                        <FilterPanel
                                            genres={allGenres}
                                            platforms={allPlatforms}
                                            activeFilters={activeFilters}
                                            onFilterChange={handleFilterChange}
                                            onClearCategory={clearFilterCategory}
                                        />
                                        <button
                                            onClick={clearFilters}
                                            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                                        >
                                            Limpiar todos los filtros
                                        </button>
                                    </div>
                                </div>
                            </aside>
                            <section className="md:col-span-3">
                                <GameGrid games={filteredGames} onGameClick={handleOpenModal} />
                            </section>
                        </div>
                    </main>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-gray-200 font-sans flex flex-col">
            <Header onNavigate={navigateTo} currentPage={currentPage} />

            <div className="flex-grow">
                {renderPage()}
            </div>

            {selectedGame && <Modal game={selectedGame} onClose={handleCloseModal} />}

            <Footer />
        </div>
    );
};

export default App;