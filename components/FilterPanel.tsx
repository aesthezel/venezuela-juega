import { GameStatus } from '../types';

interface FilterPanelProps {
    genres: string[];
    platforms: string[];
    activeFilters: Record<string, string[]>;
    onFilterChange: (category: string, value: string) => void;
}

interface FilterSectionProps {
    title: string;
    items: string[];
    category: string;
    activeItems: string[];
    onFilterChange: (category: string, value: string) => void;
}

const FilterSection = ({ title, items, category, activeItems, onFilterChange }: FilterSectionProps) => (
    <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-300">{title}</h3>
        <div className="flex flex-wrap gap-2">
            {items.map(item => (
                <button
                    key={item}
                    onClick={() => onFilterChange(category, item)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors duration-300 ${
                        activeItems.includes(item)
                            ? 'bg-cyan-500 text-white font-bold'
                            : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                    }`}
                >
                    {item}
                </button>
            ))}
        </div>
    </div>
);


const FilterPanel = ({ genres, platforms, activeFilters, onFilterChange }: FilterPanelProps) => {
    return (
        <div className="space-y-6">
            <FilterSection
                title="Estado"
                items={Object.values(GameStatus)}
                category="status"
                activeItems={activeFilters.status || []}
                onFilterChange={onFilterChange}
            />
            <FilterSection
                title="Género"
                items={genres}
                category="genre"
                activeItems={activeFilters.genre || []}
                onFilterChange={onFilterChange}
            />
            <FilterSection
                title="Plataforma"
                items={platforms}
                category="platform"
                activeItems={activeFilters.platform || []}
                onFilterChange={onFilterChange}
            />
        </div>
    );
};

export default FilterPanel;
