import { useState, useMemo, useEffect } from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { Router, route } from 'preact-router';
import { Game } from '@/types';
import { useMetadata, useCatalogFilters } from '@/hooks';
import { FireflyProvider } from '@/common/hooks/FireflyContext';
import { Header, Modal, LoadingSpinner, Footer, ScrollToTop, FireflyOverlay } from '@/components';
import CatalogPage from '@/pages/CatalogPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Redirect from '@/pages/Redirect';

// Heavy pages — code-split and loaded only when their route is visited
const GameDetailPage = lazy(() => import('@/pages/GameDetailPage'));
const ChartsPage = lazy(() => import('@/pages/ChartsPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const GameJamsPage = lazy(() => import('@/pages/GameJamsPage'));
const AddGamePage = lazy(() => import('@/pages/AddGamePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const DeveloperPage = lazy(() => import('@/pages/DeveloperPage'));
const JamListPage = lazy(() => import('@/pages/JamListPage'));
const JamDetailPage = lazy(() => import('@/pages/JamDetailPage'));
const DocsListPage = lazy(() => import('@/pages/DocsListPage'));
const DocDetailPage = lazy(() => import('@/pages/DocDetailPage'));

import { SpacetimeDBProvider } from '@/spacetimedb/SpacetimeDBProvider';
import ActiveJamsBanner from '@/features/jam/components/ActiveJamsBanner';
import {
    gamesSignal,
    jamGamesSignal,
    jamSettingsSignal,
    catalogLoadingSignal,
    catalogErrorSignal,
    isRefreshingSignal,
    allGamesSignal,
    loadCatalogGames,
    loadJamCatalogData,
    refreshAllCatalog,
} from '@/state/catalogSignals';

const App = () => {
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    // Initial load: Main games only (Snapshot + Cache, 0 KB PapaParse)
    useEffect(() => {
        loadCatalogGames();

        // Lazy fetch jams only if direct route entry requires it
        const path = window.location.pathname;
        if (path.startsWith('/jam') || path.startsWith('/game-jam')) {
            loadJamCatalogData();
        } else if (path.startsWith('/game/') || path.startsWith('/games/')) {
            const slug = path.split('/')[2];
            if (slug && !gamesSignal.value.some(g => g.slug === slug)) {
                loadJamCatalogData();
            }
        }
    }, []);

    const games = gamesSignal.value;
    const jamGames = jamGamesSignal.value;
    const jamSettings = jamSettingsSignal.value;
    const loading = catalogLoadingSignal.value;
    const error = catalogErrorSignal.value;
    const isRefreshing = isRefreshingSignal.value;
    const allGames = allGamesSignal.value;

    useMetadata(currentPath, games);

    // Catalog filtering
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
        const url: string = e.url;

        // Lazy load jam data on-demand if navigating into jams or an unknown game slug
        if (url.startsWith('/jam') || url.startsWith('/game-jam')) {
            loadJamCatalogData();
        } else if (url.startsWith('/game/') || url.startsWith('/games/')) {
            const slug = url.split('/')[2];
            if (slug && !gamesSignal.value.some(g => g.slug === slug)) {
                loadJamCatalogData();
            }
        }

        if (typeof window !== 'undefined') {
            const prev = currentPath;
            if (url.startsWith('/game/') || url.startsWith('/games/')) {
                if (prev.startsWith('/jam/')) {
                    sessionStorage.setItem('game_return_to', prev);
                } else if (prev.startsWith('/jams') || prev.startsWith('/game-jams')) {
                    sessionStorage.setItem('game_return_to', '/jams');
                } else if (prev === '/' || prev.startsWith('/game') || prev.startsWith('/games')) {
                    sessionStorage.setItem('game_return_to', '/');
                } else if (prev) {
                    sessionStorage.setItem('game_return_to', prev);
                }
            }
        }
        setCurrentPath(url);
        window.scrollTo(0, 0);
    };

    const handleOpenModal = (game: Game) => setSelectedGame(game);
    const handleCloseModal = () => setSelectedGame(null);
    const navigateToCatalog = () => route('/');

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
        isLoading: loading,
        isRefreshing,
        onRefresh: () => refreshAllCatalog(true),
    };

    if (loading && !['/', '/game', '/games'].includes(currentPath)) return <LoadingSpinner />;
    if (error) return <div className="text-center text-secondary text-2xl p-10">{error}</div>;

    return (
        <SpacetimeDBProvider>
            <FireflyProvider currentPath={currentPath}>
                <div className="relative min-h-screen font-sans flex flex-col overflow-x-clip isolate">
                    {/* Deep Layers */}
                    <FireflyOverlay />

                    {/* Main Content Layers */}
                    <div className="relative flex flex-col min-h-screen">
                        <Header
                            currentPath={currentPath}
                            isRefreshing={isRefreshing}
                            onRefresh={() => refreshAllCatalog(true)}
                        />
                        <div className="flex-grow app-content pb-24">
                            <ActiveJamsBanner />
                            <Suspense fallback={<LoadingSpinner />}>
                                <Router onChange={handleRouteChange}>
                                    <CatalogPage path="/" {...catalogPageProps} />
                                    <CatalogPage path="/game" {...catalogPageProps} />
                                    <CatalogPage path="/games" {...catalogPageProps} />
                                    <JamListPage path="/jams" games={jamGames} settings={jamSettings} onGameClick={handleOpenModal} />
                                    <Redirect path="/game-jams" to="/jams" />
                                    <Redirect path="/game-jams/" to="/jams" />
                                    <Redirect path="/jams/" to="/jams" />
                                    <JamDetailPage path="/jam/:jamName" games={jamGames} onGameClick={handleOpenModal} />
                                    <JamDetailPage path="/jam/:jamName/:edition" games={jamGames} onGameClick={handleOpenModal} />
                                    <DocsListPage path="/docs" />
                                    <DocDetailPage path="/docs/:docSlug" />
                                    <Redirect path="/recursos" to="/docs" />
                                    <Redirect path="/docs/" to="/docs" />
                                    <CalendarPage path="/calendar" games={games} onNavigateToCatalog={navigateToCatalog} onEventClick={handleOpenModal} />
                                    <ChartsPage path="/charts" games={allGames} onNavigateToCatalog={navigateToCatalog} onGameClick={handleOpenModal} />
                                    <GameDetailPage path="/game/:gameSlug" games={allGames} />
                                    <GameDetailPage path="/games/:gameSlug" games={allGames} />
                                    <DeveloperPage path="/developer/:devSlug" games={games} jamGames={jamGames} onGameClick={handleOpenModal} />
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