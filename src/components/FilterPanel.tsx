import { useState, useRef, useEffect, useCallback } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { GameStatus } from "@/src/types";
import {h} from "preact";

interface FilterPanelProps {
    genres: string[];
    platforms: string[];
    activeFilters: Record<string, string[]>;
    onFilterChange: (category: string, value: string) => void;
    onClearCategory: (category: string) => void;
    onClearAll?: () => void;
    clearAllEnabled?: boolean;
    minYear: number;
    maxYear: number;
    yearRange: { min: number; max: number } | null;
    onYearRangeChange: (range: { min: number; max: number }) => void;
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
    onClearCategory: (category:string) => void;
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

const MultiSelectDropdown = ({ title, category, items, selectedItems, onToggleItem, onClearCategory }: MultiSelectDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleClearClick = (e: MouseEvent) => {
        e.stopPropagation();
        onClearCategory(category);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
                {selectedCount > 0 && (
                    <button
                        onClick={handleClearClick}
                        className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline focus:outline-none"
                    >
                        Limpiar
                    </button>
                )}
            </div>
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

const YearRangeInputs = ({ minYear, maxYear, yearRange, onYearRangeChange }) => {
    const [minVal, setMinVal] = useState(yearRange?.min);
    const [maxVal, setMaxVal] = useState(yearRange?.max);

    useEffect(() => {
        setMinVal(yearRange?.min);
        setMaxVal(yearRange?.max);
    }, [yearRange]);

    if (!yearRange) return null;

    const commitChanges = () => {
        let newMin = parseInt(String(minVal), 10) || minYear;
        let newMax = parseInt(String(maxVal), 10) || maxYear;

        // Clamp values within the allowed global range
        newMin = Math.max(minYear, Math.min(newMin, maxYear));
        newMax = Math.max(minYear, Math.min(newMax, maxYear));

        // Ensure min is not greater than max
        if (newMin > newMax) {
            [newMin, newMax] = [newMax, newMin]; // Swap them
        }

        onYearRangeChange({ min: newMin, max: newMax });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur(); // Trigger blur to commit changes
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-300">Fecha de lanzamiento</h3>
            <div className="flex items-center justify-between gap-4">
                <input
                    type="number"
                    value={minVal}
                    onInput={(e) => setMinVal(e.currentTarget.value)}
                    onBlur={commitChanges}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-slate-700 border-2 border-slate-600 text-white rounded-lg p-2 text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    aria-label="Año mínimo"
                />
                <span className="text-gray-400 font-bold">-</span>
                <input
                    type="number"
                    value={maxVal}
                    onInput={(e) => setMaxVal(e.currentTarget.value)}
                    onBlur={commitChanges}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-slate-700 border-2 border-slate-600 text-white rounded-lg p-2 text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    aria-label="Año máximo"
                />
            </div>
        </div>
    );
};

const FilterPanel = ({ genres, platforms, activeFilters, onFilterChange, onClearCategory, onClearAll, clearAllEnabled, minYear, maxYear, yearRange, onYearRangeChange }: FilterPanelProps) => {
    const hasActiveFilters = !(!(clearAllEnabled ?? Object.values(activeFilters || {}).some(arr => arr && arr.length > 0)) && !(yearRange && (yearRange.min !== minYear || yearRange.max !== maxYear)));

    const handleClearAllClick = (e: MouseEvent) => {
        e.preventDefault();
        if (!hasActiveFilters) return;
        onClearAll?.();
    };

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
                onClearCategory={onClearCategory}
            />
            <MultiSelectDropdown
                title="Plataforma"
                category="platform"
                items={platforms}
                selectedItems={activeFilters.platform || []}
                onToggleItem={onFilterChange}
                onClearCategory={onClearCategory}
            />
            <YearRangeInputs
                minYear={minYear}
                maxYear={maxYear}
                yearRange={yearRange}
                onYearRangeChange={onYearRangeChange}
            />

            <hr className="border-t border-slate-700" />

            <div>
                <button
                    onClick={handleClearAllClick}
                    disabled={!hasActiveFilters}
                    aria-disabled={!hasActiveFilters}
                    title="Limpiar todos los filtros"
                    className={`w-full mt-2 py-2 px-4 rounded-lg font-bold text-white transition-colors duration-200 inline-flex items-center justify-center gap-2 ${
                        hasActiveFilters ? 'bg-red-400 hover:bg-red-700 cursor-pointer' : 'bg-slate-700 opacity-60 cursor-not-allowed'
                    }`}
                >
                    <span>Limpiar todos los filtros</span>
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default FilterPanel;