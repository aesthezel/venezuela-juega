import React, { useState, useMemo } from 'react';
import { Game } from './types';
import { gamesData } from './data/games';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import GameGrid from './components/GameGrid';
import Modal from './components/Modal';
import Highlights from './components/Highlights';
import ChartsPage from './components/ChartsPage';
import AddGamePage from './components/AddGamePage';

type Page = 'catalog' | 'charts' | 'add-game';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('catalog');
    const [games, setGames] = useState<Game[]>(gamesData);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
        status: [],
        genre: [],
        platform: [],
    });
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

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

    const handleOpenModal = (game: Game) => {
        setSelectedGame(game);
    };

    const handleCloseModal = () => {
        setSelectedGame(null);
    };

    const clearFilters = () => {
        setActiveFilters({ status: [], genre: [], platform: [] });
    };

    const navigateTo = (page: Page) => {
        setCurrentPage(page);
    };
    
    const handleAddNewGame = (newGameData: Omit<Game, 'id'>) => {
        const newGame: Game = {
            ...newGameData,
            id: games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1,
        };
        setGames(prevGames => [newGame, ...prevGames]);
        navigateTo('catalog');
    };

    const renderPage = () => {
        switch(currentPage) {
            case 'charts':
                return <ChartsPage games={games} onNavigateToCatalog={() => navigateTo('catalog')} />;
            case 'add-game':
                return <AddGamePage onAddNewGame={handleAddNewGame} onNavigateToCatalog={() => navigateTo('catalog')} />;
            case 'catalog':
            default:
                return (
                    <main className="container mx-auto px-4 py-8">
                        <Highlights games={games} onGameClick={handleOpenModal} />

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
                                        />
                                        <button
                                            onClick={clearFilters}
                                            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                                        >
                                            Limpiar Filtros
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
        <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
            <Header onNavigate={navigateTo} currentPage={currentPage} />
            {renderPage()}
            {selectedGame && <Modal game={selectedGame} onClose={handleCloseModal} />}
        </div>
    );
};

export default App;
