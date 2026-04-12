import { useState, useMemo } from 'preact/hooks';
import { Router, route } from 'preact-router';
import { Game, ViewMode } from "@/src/types";
import { useGamesData, useMetadata } from '@/src/hooks';
import { FireflyProvider } from '@/src/hooks/FireflyContext';
import { generateSlug, ensureUniqueSlug } from '@/src/utils';
import { Header, Modal, LoadingSpinner, Footer, ScrollToTop, FireflyOverlay } from '@/src/components';
import {
    ChartsPage,
    AddGamePage,
    AboutPage,
    CalendarPage,
    GameDetailPage,
    CatalogPage,
    GameJamGalleryPage,
    GameJamsPage,
    NotFoundPage,
    Redirect
} from '@/src/pages';

import { SpacetimeDBProvider } from '@/src/spacetimedb/SpacetimeDBProvider';

const App = () => {
    const {
        games,
        loading,
        error,
        jamGames,
        jamSettings,
        jamLoading
    } = useGamesData();

    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
        status: [], genre: [], platform: [], stores: [], origin: [], highlighted: [],
    });
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    const [yearRange, setYearRange] = useState<{ min: number; max: number } | null>(null);
    const [isYearFilterManuallySet, setIsYearFilterManuallySet] = useState(false);

    useMetadata(currentPath, games);

    const filteredGames = useMemo(() => {
        return games.filter((game: Game) => {
            const searchMatch = searchTerm === '' ||
                game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                game.developers.some((dev: string) => dev.toLowerCase().includes(searchTerm.toLowerCase())) ||
                game.description.toLowerCase().includes(searchTerm.toLowerCase());

            const statusMatch = activeFilters.status.length === 0 || activeFilters.status.includes(game.status);
            const genreMatch = activeFilters.genre.length === 0 || activeFilters.genre.some((f: string) => game.genre.includes(f));
            const platformMatch = activeFilters.platform.length === 0 || activeFilters.platform.some((f: string) => game.platform.includes(f));
            const storeMatch = activeFilters.stores.length === 0 || activeFilters.stores.some((f: string) => game.stores.some((s: any) => s.name === f));
            const originMatch = activeFilters.origin.length === 0 || (game.origin && activeFilters.origin.includes(game.origin));
            const highlightedMatch = activeFilters.highlighted.length === 0 || (activeFilters.highlighted.includes('true') && !!game.isHighlighted);

            const releaseYearMatch = game.releaseDate.match(/\b\d{4}\b/);
            const releaseYear = releaseYearMatch ? parseInt(releaseYearMatch[0], 10) : null;

            let yearMatch = true;
            if (isYearFilterManuallySet && yearRange) {
                yearMatch = releaseYear !== null && releaseYear >= yearRange.min && releaseYear <= yearRange.max;
            }

            return searchMatch && statusMatch && genreMatch && platformMatch && storeMatch && originMatch && yearMatch && highlightedMatch;
        });
    }, [searchTerm, activeFilters, games, yearRange, isYearFilterManuallySet]);

    const handleFilterChange = (category: string, value: string) => {
        setActiveFilters(prev => {
            const current = prev[category] || [];
            const next = current.includes(value) ? current.filter(i => i !== value) : [...current, value];
            return { ...prev, [category]: next };
        });
    };

    const handleRouteChange = (e: any) => {
        setCurrentPath(e.url);
        window.scrollTo(0, 0); // FIX scroll position to top
    };

    const handleOpenModal = (game: Game) => setSelectedGame(game);
    const handleCloseModal = () => setSelectedGame(null);
    const navigateToCatalog = () => route('/');
    const allGames = useMemo(() => [...games, ...jamGames], [games, jamGames]);

    const { minYear, maxYear } = useMemo(() => {
        if (games.length === 0) return { minYear: 1980, maxYear: new Date().getFullYear() };
        const years = games
            .map(g => {
                const match = g.releaseDate.match(/\b\d{4}\b/);
                return match ? parseInt(match[0], 10) : null;
            })
            .filter((y): y is number => y !== null);

        return {
            minYear: years.length > 0 ? Math.min(...years) : 1980,
            maxYear: years.length > 0 ? Math.max(...years, new Date().getFullYear()) : new Date().getFullYear()
        };
    }, [games]);

    const catalogPageProps = {
        games,
        filteredGames,
        allGenres: Array.from(new Set(games.flatMap((g: Game) => g.genre))),
        allPlatforms: Array.from(new Set(games.flatMap((g: Game) => g.platform))),
        allStores: Array.from(new Set(games.flatMap((g: Game) => g.stores.map((s: any) => s.name)))),
        allOrigins: Array.from(new Set(games.map((g: Game) => g.origin).filter(Boolean) as string[])),
        searchTerm,
        onSearchChange: setSearchTerm,
        activeFilters,
        onFilterChange: handleFilterChange,
        onClearCategory: (category: string) => setActiveFilters(prev => ({ ...prev, [category]: [] })),
        onClearAllFilters: () => {
            setActiveFilters({ status: [], genre: [], platform: [], stores: [], origin: [], highlighted: [] });
            setYearRange(null);
            setIsYearFilterManuallySet(false);
        },
        onGameClick: handleOpenModal,
        jamGames,
        minYear,
        maxYear,
        yearRange,
        onYearRangeChange: (range: { min: number; max: number }) => { setYearRange(range); setIsYearFilterManuallySet(true); },
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center text-red-500 text-2xl p-10">{error}</div>;

    return (
        <SpacetimeDBProvider>
            <FireflyProvider currentPath={currentPath}>
                <div className="relative min-h-screen bg-slate-900 text-gray-200 font-sans flex flex-col">
                    <Header currentPath={currentPath} />
                    <div className="flex-grow app-content">
                        <Router onChange={handleRouteChange}>
                            <CatalogPage path="/" {...catalogPageProps} />
                            <CatalogPage path="/game" {...catalogPageProps} />
                            <CatalogPage path="/games" {...catalogPageProps} />
                            <GameJamGalleryPage path="/gamejam-gallery" games={games} onGameClick={handleOpenModal} />
                            <Redirect path="/gamejam-gallery/" to="/gamejam-gallery" />
                            <GameJamsPage path="/game-jams" games={jamGames} settings={jamSettings} onGameClick={handleOpenModal} />
                            <Redirect path="/game-jams/" to="/game-jams" />
                            <CalendarPage path="/calendar" games={games} onNavigateToCatalog={navigateToCatalog} onEventClick={handleOpenModal} />
                            <ChartsPage path="/charts" games={allGames} onNavigateToCatalog={navigateToCatalog} />
                            <GameDetailPage path="/game/:gameSlug" games={allGames} />
                            <GameDetailPage path="/games/:gameSlug" games={allGames} />
                            <AddGamePage path="/add-game" onAddNewGame={() => { }} onNavigateToCatalog={navigateToCatalog} />
                            <AboutPage path="/about" onNavigateToCatalog={navigateToCatalog} />
                            <AboutPage path="/credits" onNavigateToCatalog={navigateToCatalog} />
                            <NotFoundPage default games={allGames} onGameClick={handleOpenModal} />
                        </Router>
                    </div>
                    <Footer />
                    <ScrollToTop />
                    <FireflyOverlay />
                    {selectedGame && <Modal game={selectedGame} onClose={handleCloseModal} />}
                </div>
            </FireflyProvider>
        </SpacetimeDBProvider>
    );
};

export default App;