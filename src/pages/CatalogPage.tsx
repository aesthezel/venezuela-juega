import { h } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
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
    HeroMosaic,
    PageTransition
} from '@/components';
import { ViewMode, GameOrigin } from '@/types';
import { CatalogPageProps } from "@/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { CategoryPreset } from '@/components/hero';

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
    jamGames,
}: CatalogPageProps) => {

    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [alpha, setAlpha] = useState<string | null>(null);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        Object.values(activeFilters || {}).forEach(arr => count += (arr?.length || 0));
        if (yearRange && (yearRange.min !== minYear || yearRange.max !== maxYear)) count++;
        return count;
    }, [activeFilters, yearRange, minYear, maxYear]);

    const hasActiveFilters = activeFilterCount > 0;

    // ── Category selection handler ──────────────────────────────────────
    const handleCategorySelect = useCallback((categoryId: string, preset: CategoryPreset) => {
        // Clear all existing filters first
        onClearAllFilters();

        // If "all" selected, just clear — done
        if (categoryId === 'all') return;

        // Apply filterRecord entries (e.g. { platform: ['PC'], status: ['Lanzado'] })
        if (preset.filterRecord) {
            Object.entries(preset.filterRecord).forEach(([category, values]) => {
                values.forEach(value => {
                    onFilterChange(category, value);
                });
            });
        }

        // For filterFn-based presets, we apply matching status/platform/origin filters
        // based on the preset id to integrate with the existing FilterPanel system
        if (preset.filterFn && !preset.filterRecord) {
            switch (categoryId) {
                case 'gamejam':
                    // Game jams filter by origin — no direct FilterPanel match,
                    // but we can use search term as workaround
                    onFilterChange('origin', GameOrigin.GAME_JAM);
                    break;
                case 'highlighted':
                    onFilterChange('highlighted', 'true');
                    break;
                case 'pc':
                    // Apply all platforms that match the PC regex
                    allPlatforms.filter(p => /windows|linux|mac/i.test(p))
                        .forEach(p => onFilterChange('platform', p));
                    break;
                case 'mobile':
                    // Apply all platforms that match the mobile regex used in presets
                    allPlatforms.filter(p => /android|ios|móvil|mobile/i.test(p))
                        .forEach(p => onFilterChange('platform', p));
                    break;
                case 'console':
                    // Apply all platforms that match the console regex used in presets
                    allPlatforms.filter(p => /playstation|xbox|switch|nintendo|consola|ps[0-9]|wii/i.test(p))
                        .forEach(p => onFilterChange('platform', p));
                    break;
            }
        }
    }, [onClearAllFilters, onFilterChange]);

    useEffect(() => {
        const saved = typeof window !== 'undefined' ? (localStorage.getItem('catalog:viewMode') as ViewMode | null) : null;
        if (saved === 'grid' || saved === 'list') setViewMode(saved);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') localStorage.setItem('catalog:viewMode', viewMode);
    }, [viewMode]);

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
        <div className="w-full min-h-screen">
            <HeroMosaic games={games} jamGames={jamGames} onGameClick={onGameClick} onCategorySelect={handleCategorySelect} />

            <PageTransition>
                <main id="catalog-content" className="container mx-auto px-4 py-8 relative z-10">

                    <div className="sticky top-0 z-30 bg-base-100/40 backdrop-blur-md py-4 -mx-4 px-4 border-b border-surface-700 mb-8 shadow-2xl transition-all duration-300 will-change-transform">
                        <div className="container mx-auto">
                            <div className="flex gap-2 md:gap-4 items-center justify-between">
                                <div className="flex-1 relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-teal-dark to-accent-mauve-deep rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                    <div className="relative">
                                        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} games={games} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                                    <button
                                        onClick={() => (document.getElementById('mobile_filter_modal') as HTMLDialogElement)?.showModal()}
                                        className="lg:hidden btn btn-square btn-neutral border-surface-700 shadow-lg relative"
                                        title="Filtros"
                                    >
                                        <FontAwesomeIcon icon={faFilter} />
                                        {activeFilterCount > 0 && (
                                            <span className="badge badge-primary badge-xs absolute -top-1 -right-1 animate-pulse border-none w-4 h-4 p-0">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </button>

                                    <div className="hidden md:block">
                                        <GameCounter filteredCount={alpha ? alphaFilteredGames.length : filteredGames.length} totalCount={games.length} />
                                    </div>
                                    <ViewModeToggle mode={viewMode} onChange={setViewMode} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12 space-y-12">
                        <Highlights games={games} onGameClick={onGameClick} />
                        {/*<GameJamPlusSection games={games} onGameClick={onGameClick}/>*/}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

                        <aside className="hidden lg:block lg:col-span-3">
                            <div className="card bg-base-200/50 shadow-xl border border-surface-700 p-6 sticky top-52 transition-all z-10 will-change-transform">

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
                                    alpha={alpha}
                                    onAlphaChange={setAlpha}
                                />
                            </div>
                        </aside>

                        <dialog id="mobile_filter_modal" className="modal modal-bottom lg:hidden">
                            <div className="modal-box p-0 max-h-[85vh] flex flex-col bg-base-100 border border-surface-700 rounded-t-3xl shadow-2xl">
                                <div className="p-6 pb-4 flex items-center justify-between border-b border-surface-700 bg-base-100 sticky top-0 z-10">
                                    <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                                        <FontAwesomeIcon icon={faFilter} className="text-primary" />
                                        Filtros
                                    </h2>
                                    <form method="dialog">
                                        <button className="btn btn-circle btn-ghost btn-sm">
                                            <FontAwesomeIcon icon={faTimes} size="lg" />
                                        </button>
                                    </form>
                                </div>
                                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
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
                                        alpha={alpha}
                                        onAlphaChange={setAlpha}
                                    />
                                </div>
                                <div className="p-6 pt-4 border-t border-surface-700 bg-base-100 sticky bottom-0">
                                    <form method="dialog">
                                        <button className="btn btn-primary w-full shadow-lg shadow-primary/50">
                                            Ver {alphaFilteredGames.length} juegos
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <form method="dialog" className="modal-backdrop backdrop-blur-sm bg-base-300/80">
                                <button>close</button>
                            </form>
                        </dialog>

                        <section className="lg:col-span-9 min-h-[50vh]">
                            <div className="lg:hidden mb-6 flex justify-between items-center text-sm bg-base-200/50 p-3 rounded-lg border border-surface-700">
                                <span className="text-base-content/70 font-medium">{alphaFilteredGames.length} juegos encontrados</span>
                                {activeFilterCount > 0 && (
                                    <span className="badge badge-primary font-bold">
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
            </PageTransition>


        </div>
    );
};

export default CatalogPage;