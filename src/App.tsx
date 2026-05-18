import { useState, useMemo } from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { Router, route } from 'preact-router';
import { Game } from "@/src/types";
import { useGamesData, useMetadata, useCatalogFilters } from '@/src/hooks';
import { FireflyProvider } from '@/src/hooks/FireflyContext';
import { Header, Modal, LoadingSpinner, Footer, ScrollToTop, FireflyOverlay } from '@/src/components';
import {
    CatalogPage,
    GameDetailPage,
    NotFoundPage,
    Redirect
} from '@/src/pages';

// Heavy pages — loaded only when their route is visited
const ChartsPage = lazy(() => import('@/src/pages/ChartsPage'));
const CalendarPage = lazy(() => import('@/src/pages/CalendarPage'));
const GameJamsPage = lazy(() => import('@/src/pages/GameJamsPage'));
const GameJamGalleryPage = lazy(() => import('@/src/pages/GameJamGalleryPage'));
const AddGamePage = lazy(() => import('@/src/pages/AddGamePage'));
const AboutPage = lazy(() => import('@/src/pages/AboutPage'));

import { SpacetimeDBProvider } from '@/src/spacetimedb/SpacetimeDBProvider';

const App = () => {
    const { games, loading, error, jamGames, jamSettings } = useGamesData();

    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useMetadata(currentPath, games);

    // All filter state lives here — extracted from the God Object
    const {
        filteredGames,
        state: filterState,
        allGenres,
        allPlatforms,
        allStores,
        allOrigins,
        minYear,
        maxYear,
        handleSearchChange,
        handleFilterChange,
        handleClearCategory,
        handleClearAll,
        handleYearRangeChange,
    } = useCatalogFilters(games);

    const handleRouteChange = (e: any) => {
        setCurrentPath(e.url);
        window.scrollTo(0, 0);
    };

    const handleOpenModal = (game: Game) => setSelectedGame(game);
    const handleCloseModal = () => setSelectedGame(null);
    const navigateToCatalog = () => route('/');

    const allGames = useMemo(() => [...games, ...jamGames], [games, jamGames]);

    const catalogPageProps = {
        games,
        filteredGames,
        allGenres,
        allPlatforms,
        allStores,
        allOrigins,
        searchTerm: filterState.searchTerm,
        onSearchChange: handleSearchChange,
        activeFilters: filterState.activeFilters,
        onFilterChange: handleFilterChange,
        onClearCategory: handleClearCategory,
        onClearAllFilters: handleClearAll,
        onGameClick: handleOpenModal,
        jamGames,
        minYear,
        maxYear,
        yearRange: filterState.yearRange,
        onYearRangeChange: handleYearRangeChange,
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center text-secondary text-2xl p-10">{error}</div>;

    return (
        <SpacetimeDBProvider>
            <FireflyProvider currentPath={currentPath}>
                <div className="relative min-h-screen font-sans flex flex-col overflow-x-clip isolate">
                    {/* Deep Layers */}
                    <FireflyOverlay />

                    {/* Main Content Layers */}
                    <div className="relative flex flex-col min-h-screen">
                        <Header currentPath={currentPath} games={games} jamGames={jamGames} />
                        <div className="flex-grow app-content pb-24">
                            <Suspense fallback={<LoadingSpinner />}>
                                <Router onChange={handleRouteChange}>
                                    <CatalogPage path="/" {...catalogPageProps} />
                                    <CatalogPage path="/game" {...catalogPageProps} />
                                    <CatalogPage path="/games" {...catalogPageProps} />
                                    <GameJamGalleryPage path="/gamejam-gallery" games={games} onGameClick={handleOpenModal} />
                                    <Redirect path="/gamejam-gallery/" to="/gamejam-gallery" />
                                    <GameJamsPage path="/game-jams" games={jamGames} settings={jamSettings} onGameClick={handleOpenModal} />
                                    <Redirect path="/game-jams/" to="/game-jams" />
                                    <CalendarPage path="/calendar" games={games} onNavigateToCatalog={navigateToCatalog} onEventClick={handleOpenModal} />
                                    <ChartsPage path="/charts" games={allGames} onNavigateToCatalog={navigateToCatalog} onGameClick={handleOpenModal} />
                                    <GameDetailPage path="/game/:gameSlug" games={allGames} />
                                    <GameDetailPage path="/games/:gameSlug" games={allGames} />
                                    <AddGamePage path="/add-game" onAddNewGame={() => { }} onNavigateToCatalog={navigateToCatalog} />
                                    <AddGamePage path="/add-game/" onAddNewGame={() => { }} onNavigateToCatalog={navigateToCatalog} />
                                    <AboutPage path="/about" onNavigateToCatalog={navigateToCatalog} />
                                    <AboutPage path="/credits" onNavigateToCatalog={navigateToCatalog} />
                                    <NotFoundPage default games={games} onGameClick={handleOpenModal} />
                                </Router>
                            </Suspense>
                        </div>
                    </div>

                    <Footer />

                    <ScrollToTop />
                    {selectedGame && (
                        <div className="relative z-[100]">
                            <Modal game={selectedGame} onClose={handleCloseModal} />
                        </div>
                    )}
                </div>
            </FireflyProvider>
        </SpacetimeDBProvider>
    );
};

export default App;