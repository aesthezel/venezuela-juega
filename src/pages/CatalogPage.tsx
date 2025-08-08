import { h } from 'preact';
import { Game } from '@/src/types';
import {
  Highlights,
  GameCounter,
  SearchBar,
  FilterPanel,
  GameGrid
} from '@/src/components';

export interface CatalogPageProps {
  path?: string;
  games: Game[];
  filteredGames: Game[];
  allGenres: string[];
  allPlatforms: string[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilters: Record<string, string[]>;
  onFilterChange: (category: string, value: string) => void;
  onClearCategory: (category: string) => void;
  onClearAllFilters: () => void;
  onGameClick: (game: Game) => void;
}

const CatalogPage = ({
  games,
  filteredGames,
  allGenres,
  allPlatforms,
  searchTerm,
  onSearchChange,
  activeFilters,
  onFilterChange,
  onClearCategory,
  onClearAllFilters,
  onGameClick,
}: CatalogPageProps) => {
  const hasActiveFilters = Object.values(activeFilters || {}).some(arr => arr && arr.length > 0);

  return (
    <main className="container mx-auto px-4 py-8">
      <Highlights games={games} onGameClick={onGameClick} />
      <GameCounter filteredCount={filteredGames.length} totalCount={games.length} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="sticky sticky-panel" style={{ top: 'calc(var(--header-height, 0px) + 2rem)' }}>
            <div className="space-y-6 bg-slate-800 p-6 rounded-lg shadow-lg">
              <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} games={games} />
              <hr className="border-t border-slate-700" />
              <FilterPanel
                genres={allGenres}
                platforms={allPlatforms}
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
                onClearCategory={onClearCategory}
                onClearAll={onClearAllFilters}
                clearAllEnabled={hasActiveFilters}
              />
              <hr className="border-t border-slate-700" />
            </div>
          </div>
        </aside>

        <section className="md:col-span-3">
          <GameGrid games={filteredGames} onGameClick={onGameClick} />
        </section>
      </div>
    </main>
  );
};

export default CatalogPage;