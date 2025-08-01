import { useState, useRef, useEffect } from 'preact/hooks';
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

interface MultiSelectDropdownProps {
    title: string;
    category: string;
    items: string[];
    selectedItems: string[];
    onToggleItem: (category: string, item: string) => void;
}

const FilterButtons = ({ title, items, category, activeItems, onFilterChange }: FilterSectionProps) => (
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

const MultiSelectDropdown = ({ title, category, items, selectedItems, onToggleItem }: MultiSelectDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Hook para cerrar el dropdown si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const selectedCount = selectedItems.length;

    return (
        <div className="relative" ref={dropdownRef}>
            <h3 className="text-lg font-semibold mb-3 text-gray-300">{title}</h3>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg flex justify-between items-center transition-colors"
            >
                <span>
                    {selectedCount > 0 ? `${selectedCount} seleccionado(s)` : `Seleccionar ${title.toLowerCase()}`}
                </span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    <ul>
                        {items.sort().map(item => (
                            <li key={item} className="p-2 hover:bg-slate-700 cursor-pointer">
                                <label className="flex items-center space-x-3 text-white">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 bg-slate-600 border-slate-500 rounded text-cyan-500 focus:ring-cyan-500"
                                        checked={selectedItems.includes(item)}
                                        onChange={() => onToggleItem(category, item)}
                                    />
                                    <span>{item}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const FilterPanel = ({ genres, platforms, activeFilters, onFilterChange }: FilterPanelProps) => {
    return (
        <div className="space-y-6">
            <FilterButtons
                title="Estado"
                items={Object.values(GameStatus)}
                category="status"
                activeItems={activeFilters.status || []}
                onFilterChange={onFilterChange}
            />
            <MultiSelectDropdown
                title="Género"
                category="genre"
                items={genres}
                selectedItems={activeFilters.genre || []}
                onToggleItem={onFilterChange}
            />
            <MultiSelectDropdown
                title="Plataforma"
                category="platform"
                items={platforms}
                selectedItems={activeFilters.platform || []}
                onToggleItem={onFilterChange}
            />
        </div>
    );
};

export default FilterPanel;