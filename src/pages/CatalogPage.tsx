import { h } from 'preact';
import { Game } from '@/src/types';
import {
  Highlights,
  GameCounter,
  SearchBar,
  FilterPanel,
  GameGrid
} from '@/src/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
  return (
    <main className="container mx-auto px-4 py-8">
      <Highlights games={games} onGameClick={onGameClick} />
      <GameCounter filteredCount={filteredGames.length} totalCount={games.length} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          {/* Usamos sticky-panel y top calculado con la variable del header */}
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
              />
              <hr className="border-t border-slate-700" />
              <button
                onClick={onClearAllFilters}
                className="w-full mt-4 bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <span>Limpiar todos los filtros</span>
                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
              </button>
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