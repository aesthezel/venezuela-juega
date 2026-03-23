import { useState, useRef, useEffect } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTrash, 
    faChevronDown, 
    faCalendarAlt, 
    faCheck, 
    faFilter, 
    faTags, 
    faDesktop, 
    faStore 
} from '@fortawesome/free-solid-svg-icons';
import { GameStatus } from "@/src/types";
import { h } from "preact";

interface FilterPanelProps {
    genres: string[];
    platforms: string[];
    stores: string[];
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
    icon?: any;
    itemColorMap?: Record<string, string>;
}

interface MultiSelectDropdownProps {
    title: string;
    category: string;
    items: string[];
    selectedItems: string[];
    onToggleItem: (category: string, item: string) => void;
    onClearCategory: (category: string) => void;
    icon?: any;
}

const FilterButtons = ({ title, items, category, activeItems, onFilterChange, icon, itemColorMap }: FilterSectionProps) => (
    <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-400 font-medium text-sm tracking-wider uppercase">
            {icon && <FontAwesomeIcon icon={icon} className="text-xs" />}
            <h3>{title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
            {items.map(item => {
                const isActive = activeItems.includes(item);
                const statusColorBase = itemColorMap ? itemColorMap[item] : null;
                
                return (
                    <button
                        key={item}
                        onClick={() => onFilterChange(category, item)}
                        className={`group relative px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 border ${
                            isActive
                                ? 'text-white border-transparent'
                                : 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border-slate-700/50'
                        }`}
                        style={isActive && statusColorBase ? {
                            backgroundColor: `var(--color-${statusColorBase})`,
                            boxShadow: `0 10px 15px -3px var(--color-${statusColorBase} / 0.4)`
                        } : {}}
                    >
                        {isActive && !statusColorBase && (
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 animate-gradient-half"></div>
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                            {isActive && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
                            {item}
                        </span>
                    </button>
                );
            })}
        </div>
    </div>
);

const MultiSelectDropdown = ({ title, category, items, selectedItems, onToggleItem, onClearCategory, icon }: MultiSelectDropdownProps) => {
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

    return (
        <div className="relative group" ref={dropdownRef}>
            <div className="flex justify-between items-end mb-2 px-1">
                <div className="flex items-center gap-2 text-slate-400 font-medium text-sm tracking-wider uppercase">
                    {icon && <FontAwesomeIcon icon={icon} className="text-xs" />}
                    <h3>{title}</h3>
                </div>
                {selectedCount > 0 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onClearCategory(category); }}
                        className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-tight transition-colors"
                    >
                        Limpiar
                    </button>
                )}
            </div>
            
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${
                    isOpen 
                        ? 'bg-slate-800/90 border-cyan-500/50 ring-2 ring-cyan-500/10' 
                        : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
                }`}
            >
                <div className="flex items-center gap-2">
                    {selectedCount > 0 ? (
                        <div className="flex items-center gap-2">
                            <span className="bg-cyan-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full">
                                {selectedCount}
                            </span>
                            <span className="text-sm font-semibold text-white truncate max-w-[120px]">
                                {selectedItems.join(', ')}
                            </span>
                        </div>
                    ) : (
                        <span className="text-sm font-medium text-slate-500">Filtrar por {title.toLowerCase()}</span>
                    )}
                </div>
                <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`text-xs text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-500' : 'group-hover:text-slate-400'}`} 
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                    <div className="max-h-60 overflow-y-auto py-2 scrollbar-hide">
                        {items.sort().map(item => (
                            <div 
                                key={item} 
                                onClick={() => onToggleItem(category, item)}
                                className="px-4 py-2.5 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group/item transition-colors"
                            >
                                <span className={`text-sm tracking-wide transition-colors ${selectedItems.includes(item) ? 'text-cyan-400 font-bold' : 'text-slate-300 group-hover/item:text-white'}`}>
                                    {item}
                                </span>
                                <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                                    selectedItems.includes(item) 
                                        ? 'bg-cyan-500 border-cyan-500 scale-110 shadow-lg shadow-cyan-500/20' 
                                        : 'border-slate-700 group-hover/item:border-slate-500'
                                }`}>
                                    {selectedItems.includes(item) && <FontAwesomeIcon icon={faCheck} className="text-[10px] text-white" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const YearRangeInputs = ({ minYear, maxYear, yearRange, onYearRangeChange }: { minYear: number; maxYear: number; yearRange: { min: number; max: number } | null; onYearRangeChange: (range: { min: number; max: number }) => void }) => {
    const [minVal, setMinVal] = useState<string>(String(yearRange?.min ?? minYear));
    const [maxVal, setMaxVal] = useState<string>(String(yearRange?.max ?? maxYear));

    useEffect(() => {
        setMinVal(String(yearRange?.min ?? minYear));
        setMaxVal(String(yearRange?.max ?? maxYear));
    }, [yearRange, minYear, maxYear]);

    const commitChanges = () => {
        let newMin = parseInt(minVal, 10);
        let newMax = parseInt(maxVal, 10);

        if (isNaN(newMin)) newMin = minYear;
        if (isNaN(newMax)) newMax = maxYear;

        newMin = Math.max(minYear, Math.min(newMin, maxYear));
        newMax = Math.max(minYear, Math.min(newMax, maxYear));

        if (newMin > newMax) {
            [newMin, newMax] = [newMax, newMin];
        }

        onYearRangeChange({ min: newMin, max: newMax });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400 font-medium text-sm tracking-wider uppercase">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                <h3>Lanzamiento</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 items-center">
                <div className="relative group">
                    <input
                        type="number"
                        value={minVal}
                        onInput={(e) => setMinVal(e.currentTarget.value)}
                        onBlur={commitChanges}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-slate-800/40 border border-slate-700/50 text-white rounded-xl p-3 text-center text-sm font-bold focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all group-hover:border-slate-600"
                        placeholder={String(minYear)}
                    />
                    <div className="absolute -top-2 left-3 bg-slate-900 px-1.5 text-[9px] text-slate-500 font-bold uppercase tracking-widest group-focus-within:text-cyan-500 transition-colors">Desde</div>
                </div>
                <div className="relative group">
                    <input
                        type="number"
                        value={maxVal}
                        onInput={(e) => setMaxVal(e.currentTarget.value)}
                        onBlur={commitChanges}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-slate-800/40 border border-slate-700/50 text-white rounded-xl p-3 text-center text-sm font-bold focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all group-hover:border-slate-600"
                        placeholder={String(maxYear)}
                    />
                    <div className="absolute -top-2 left-3 bg-slate-900 px-1.5 text-[9px] text-slate-500 font-bold uppercase tracking-widest group-focus-within:text-cyan-500 transition-colors">Hasta</div>
                </div>
            </div>
        </div>
    );
};

const FilterPanel = ({ 
    genres, 
    platforms, 
    stores, 
    activeFilters, 
    onFilterChange, 
    onClearCategory, 
    onClearAll, 
    clearAllEnabled, 
    minYear, 
    maxYear, 
    yearRange, 
    onYearRangeChange 
}: FilterPanelProps) => {
    
    const hasActiveFilters = clearAllEnabled || (yearRange && (yearRange.min !== minYear || yearRange.max !== maxYear));

    const handleClearAllClick = (e: MouseEvent) => {
        e.preventDefault();
        if (!hasActiveFilters) return;
        onClearAll?.();
    };

    const statusColorMap: Record<string, string> = {
        "Lanzado": "status-released",
        "En desarrollo": "status-in-development",
        "Pausado": "status-on-hold",
        "Cancelado": "status-canceled",
        "Demo": "status-demo",
        "Prototipo": "status-prototype",
        "Perdido": "status-lost",
        "Acceso anticipado": "status-early",
        "Recuperado": "status-recovered",
        "Desconocido": "status-unknown"
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <FilterButtons
                title="Estado"
                items={Object.values(GameStatus)}
                category="status"
                activeItems={activeFilters.status || []}
                onFilterChange={onFilterChange}
                icon={faFilter}
                itemColorMap={statusColorMap}
            />

            <MultiSelectDropdown
                title="Géneros"
                category="genre"
                items={genres}
                selectedItems={activeFilters.genre || []}
                onToggleItem={onFilterChange}
                onClearCategory={onClearCategory}
                icon={faTags}
            />

            <MultiSelectDropdown
                title="Tiendas"
                category="stores"
                items={stores}
                selectedItems={activeFilters.stores || []}
                onToggleItem={onFilterChange}
                onClearCategory={onClearCategory}
                icon={faStore}
            />

            <MultiSelectDropdown
                title="Plataformas"
                category="platform"
                items={platforms}
                selectedItems={activeFilters.platform || []}
                onToggleItem={onFilterChange}
                onClearCategory={onClearCategory}
                icon={faDesktop}
            />

            <YearRangeInputs
                minYear={minYear}
                maxYear={maxYear}
                yearRange={yearRange}
                onYearRangeChange={onYearRangeChange}
            />

            <div className="pt-4 border-t border-slate-700/50">
                <button
                    onClick={handleClearAllClick}
                    disabled={!hasActiveFilters}
                    className={`w-full group flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                        hasActiveFilters 
                            ? 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 shadow-lg shadow-red-900/10 hover:shadow-red-500/20' 
                            : 'bg-slate-800/30 text-slate-600 border border-slate-700/30 cursor-not-allowed opacity-50'
                    }`}
                >
                    <FontAwesomeIcon icon={faTrash} className={`transition-transform duration-300 ${hasActiveFilters ? 'group-hover:rotate-12 group-hover:scale-110' : ''}`} />
                    <span>Reiniciar Filtros</span>
                </button>
            </div>

            <style>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
                
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }

                @keyframes gradient-half {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-half {
                    background-size: 200% 200%;
                    animation: gradient-half 3s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default FilterPanel;