import {h} from 'preact';
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
    GameJamPlusSection
} from '@/src/components';
import { ViewMode } from '@/src/types';
import { CatalogPageProps } from "@/src/types";

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
    const hasActiveFilters = Object.values(activeFilters || {}).some(arr => arr && arr.length > 0);

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

            if (alpha === '#') {
                return !isLetter;
            }
            return character === alpha;
        });
    }, [filteredGames, alpha]);

    return (
        <main className="container mx-auto px-4 py-8">
            <Highlights games={games} onGameClick={onGameClick}/>
            <GameJamPlusSection games={games} onGameClick={onGameClick}/>
            <GameCounter filteredCount={alpha ? alphaFilteredGames.length : filteredGames.length} totalCount={filteredGames.length}/>

            <div className="mb-6 w-full flex justify-center">
                <div className="w-full max-w-5xl overflow-hidden [scrollbar-width:none] [ms-overflow-style:none] [&_*::-webkit-scrollbar]:hidden">
                    <AlphaFilter activeAlpha={alpha} onAlphaChange={setAlpha} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="md:col-span-1">
                    <div className="sticky sticky-panel" style={{top: 'calc(var(--header-height, 0px) + 2rem)'}}>
                        <div className="space-y-6 bg-slate-800 p-6 rounded-lg shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="min-w-0 sm:basis-[80%] sm:flex-1">
                                    <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} games={games} />
                                </div>
                                <div className="sm:basis-[20%] sm:flex-none flex justify-start sm:justify-end">
                                    <ViewModeToggle mode={viewMode} onChange={setViewMode} />
                                </div>
                            </div>

                            <hr className="border-t border-slate-700"/>
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
                    </div>
                </aside>

                <section className="md:col-span-3">
                    {viewMode === 'grid' ? (
                        <GameGrid games={alphaFilteredGames} onGameClick={onGameClick} />
                    ) : (
                        <GameList games={alphaFilteredGames} onGameClick={onGameClick} />
                    )}
                </section>
            </div>
        </main>
    );
};

export default CatalogPage;