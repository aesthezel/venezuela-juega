import { h } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import {
    Highlights,
    GameCounter,
    SearchBar,
    FilterPanel,
    GameGrid,
    GameList,
    ViewModeToggle,
    AlphaFilter,
    GameJamPlusSection,
    HeroMosaic
} from '@/src/components';
import { ViewMode } from '@/src/types';
import { CatalogPageProps } from "@/src/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

const CatalogPage = ({
                         games,
                         filteredGames,
                         allGenres,
                         allPlatforms,
                         allStores,
                         searchTerm,
                         onSearchChange,
                         activeFilters,
                         onFilterChange,
                         onClearCategory,
                         onClearAllFilters,
                         onGameClick,
                         minYear,
                         maxYear,
                         yearRange,
                         onYearRangeChange,
                     }: CatalogPageProps) => {

    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [alpha, setAlpha] = useState<string | null>(null);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        Object.values(activeFilters || {}).forEach(arr => count += (arr?.length || 0));
        if (yearRange && (yearRange.min !== minYear || yearRange.max !== maxYear)) count++;
        return count;
    }, [activeFilters, yearRange, minYear, maxYear]);

    const hasActiveFilters = activeFilterCount > 0;

    useEffect(() => {
        const saved = typeof window !== 'undefined' ? (localStorage.getItem('catalog:viewMode') as ViewMode | null) : null;
        if (saved === 'grid' || saved === 'list') setViewMode(saved);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') localStorage.setItem('catalog:viewMode', viewMode);
    }, [viewMode]);

    useEffect(() => {
        if (isMobileFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileFilterOpen]);

    const alphaFilteredGames = useMemo(() => {
        if (!alpha) return filteredGames;
        const normalizeFirstChar = (title: string) => {
            const trimmed = (title || '').trim();
            if (!trimmed) return '';
            const first = trimmed[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            return first.toUpperCase();
        };
        return filteredGames.filter((g) => {
            const character = normalizeFirstChar(g.title);
            const isLetter = /^[A-Z]$/.test(character);
            if (alpha === '#') return !isLetter;
            return character === alpha;
        });
    }, [filteredGames, alpha]);

    return (
        <div className="w-full bg-slate-900 min-h-screen">
            <HeroMosaic games={games} onGameClick={onGameClick} />

            <main id="catalog-content" className="container mx-auto px-4 py-8">

                <div className="mb-12 space-y-12">
                    <Highlights games={games} onGameClick={onGameClick}/>
                    {/*<GameJamPlusSection games={games} onGameClick={onGameClick}/>*/}
                </div>

                <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md py-4 -mx-4 px-4 border-b border-slate-800 mb-8 shadow-2xl transition-all duration-300">
                    <div className="container mx-auto flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                            <div className="w-full md:flex-1 relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative">
                                    <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} games={games} />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto justify-between md:justify-end">
                                <button
                                    onClick={() => setIsMobileFilterOpen(true)}
                                    className="lg:hidden flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-lg transition-colors border border-slate-700 relative shadow-sm"
                                >
                                    <FontAwesomeIcon icon={faFilter} />
                                    <span>Filtros</span>
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>

                                <div className="flex items-center gap-3">
                                    <div className="hidden md:block">
                                        <GameCounter filteredCount={alpha ? alphaFilteredGames.length : filteredGames.length} totalCount={games.length} />
                                    </div>
                                    <ViewModeToggle mode={viewMode} onChange={setViewMode} />
                                </div>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto pb-1 scrollbar-hide">
                            <AlphaFilter activeAlpha={alpha} onAlphaChange={setAlpha} className="md:justify-center" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 sticky top-52 backdrop-blur-sm transition-all z-20">

                            <FilterPanel
                                genres={allGenres}
                                platforms={allPlatforms}
                                stores={allStores}
                                activeFilters={activeFilters}
                                onFilterChange={onFilterChange}
                                onClearCategory={onClearCategory}
                                onClearAll={onClearAllFilters}
                                clearAllEnabled={hasActiveFilters}
                                minYear={minYear}
                                maxYear={maxYear}
                                yearRange={yearRange}
                                onYearRangeChange={onYearRangeChange}
                            />
                        </div>
                    </aside>

                    {isMobileFilterOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                            <div
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
                                onClick={() => setIsMobileFilterOpen(false)}
                            />
                            <div className="relative w-[85%] max-w-sm h-full bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 overflow-y-auto animate-slide-in-right">
                                <div className="p-6 flex flex-col min-h-full">
                                    <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-900 z-10 pb-4 border-b border-slate-800">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <FontAwesomeIcon icon={faFilter} className="text-cyan-500" />
                                            Filtros
                                        </h2>
                                        <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-full w-10 h-10 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faTimes} size="lg" />
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <FilterPanel
                                            genres={allGenres}
                                            platforms={allPlatforms}
                                            stores={allStores}
                                            activeFilters={activeFilters}
                                            onFilterChange={onFilterChange}
                                            onClearCategory={onClearCategory}
                                            onClearAll={onClearAllFilters}
                                            clearAllEnabled={hasActiveFilters}
                                            minYear={minYear}
                                            maxYear={maxYear}
                                            yearRange={yearRange}
                                            onYearRangeChange={onYearRangeChange}
                                        />
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 pb-4">
                                        <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-cyan-900/50">
                                            Ver {alphaFilteredGames.length} juegos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <section className="lg:col-span-9 min-h-[50vh]">
                        <div className="lg:hidden mb-6 flex justify-between items-center text-sm bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <span className="text-slate-300 font-medium">{alphaFilteredGames.length} juegos encontrados</span>
                            {activeFilterCount > 0 && (
                                <span className="text-cyan-400 font-bold bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-900">
                                    {activeFilterCount} filtros activos
                                </span>
                            )}
                        </div>

                        {viewMode === 'grid' ? (
                            <GameGrid games={alphaFilteredGames} onGameClick={onGameClick} />
                        ) : (
                            <GameList games={alphaFilteredGames} onGameClick={onGameClick} />
                        )}
                    </section>
                </div>
            </main>

            <style>{`
                @keyframes slide-in-right {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default CatalogPage;