import { useState, useEffect } from 'preact/hooks';
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

const AccordionItem = ({ title, icon, isOpen, onClick, children, badgeCount }: { title: string; icon: any; isOpen: boolean; onClick: () => void; children: any; badgeCount?: number }) => {
    return (
        <div className={`border-b border-surface-700/30 last:border-0 pb-2 last:pb-0 transition-all duration-300`}>
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between py-3 group cursor-pointer outline-none"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-accent-teal-dark text-white shadow-lg shadow-accent-teal-dark/20' : 'bg-white/5 text-surface-400 group-hover:bg-white/10 group-hover:text-surface-200'}`}>
                        <FontAwesomeIcon icon={icon} className="text-sm" />
                    </div>
                    <div className="flex flex-col items-start translate-y-[1px]">
                        <span className={`text-xs font-black uppercase tracking-[0.15em] transition-colors ${isOpen ? 'text-white' : 'text-surface-400 group-hover:text-surface-200'}`}>
                            {title}
                        </span>
                        {badgeCount !== undefined && badgeCount > 0 && !isOpen && (
                            <span className="text-[10px] text-accent-teal font-bold animate-fade-in">
                                {badgeCount} {badgeCount === 1 ? 'seleccionado' : 'seleccionados'}
                            </span>
                        )}
                    </div>
                </div>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-[10px] text-surface-500 transition-all duration-500 ${isOpen ? 'rotate-180 text-accent-teal-dark' : 'group-hover:text-surface-400'}`}
                />
            </button>

            {isOpen && (
                <div className="pb-4 animate-slide-up origin-top">
                    {children}
                </div>
            )}
        </div>
    );
};

const FilterList = ({ items, selectedItems, onToggleItem, category, onClear }: { items: string[]; selectedItems: string[]; onToggleItem: (category: string, item: string) => void; category: string; onClear: (category: string) => void }) => {
    return (
        <div className="space-y-4">
            {selectedItems.length > 0 && (
                <div className="flex justify-end">
                    <button
                        onClick={() => onClear(category)}
                        className="text-[10px] font-black text-brand-red/80 hover:text-brand-red uppercase tracking-widest transition-colors flex items-center gap-1.5"
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-[9px]" />
                        Limpiar
                    </button>
                </div>
            )}
            <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-1">
                {items.sort().map(item => {
                    const isSelected = selectedItems.includes(item);
                    return (
                        <div
                            key={item}
                            onClick={() => onToggleItem(category, item)}
                            className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between group/item transition-all duration-200 ${isSelected ? 'bg-accent-teal-dark/10 border border-accent-teal-dark/20' : 'hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <span className={`text-sm tracking-wide transition-colors ${isSelected ? 'text-accent-teal font-bold' : 'text-surface-400 group-hover/item:text-surface-200'}`}>
                                {item}
                            </span>
                            <div className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-all duration-300 ${isSelected
                                ? 'bg-accent-teal-dark border-accent-teal-dark scale-105 shadow-lg shadow-accent-teal-dark/20'
                                : 'border-surface-700 group-hover/item:border-surface-600'
                                }`}>
                                {isSelected && <FontAwesomeIcon icon={faCheck} className="text-[10px] text-white" />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const FilterButtons = ({ items, category, activeItems, onFilterChange, itemColorMap }: {
    items: string[];
    category: string;
    activeItems: string[];
    onFilterChange: (category: string, value: string) => void;
    itemColorMap?: Record<string, string>
}) => (
    <div className="flex flex-wrap gap-2 pt-1">
        {items.map(item => {
            const isActive = activeItems.includes(item);
            const statusColorBase = itemColorMap ? itemColorMap[item] : null;

            return (
                <button
                    key={item}
                    onClick={() => onFilterChange(category, item)}
                    className={`group relative px-4 py-2 text-[11px] font-black rounded-xl transition-all duration-300 border uppercase tracking-wider ${isActive
                        ? 'text-white border-transparent'
                        : 'bg-white/5 hover:bg-white/10 text-surface-500 hover:text-surface-200 border-white/5'
                        }`}
                    style={isActive && statusColorBase ? {
                        backgroundColor: `var(--color-${statusColorBase})`,
                        boxShadow: `0 8px 15px -3px var(--color-${statusColorBase} / 0.3)`
                    } : {}}
                >
                    {isActive && !statusColorBase && (
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-teal-dark to-accent-mauve-deep animate-gradient-half"></div>
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        {isActive && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
                        {item}
                    </span>
                </button>
            );
        })}
    </div>
);

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
        <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="relative group">
                <input
                    type="number"
                    value={minVal}
                    onInput={(e) => setMinVal(e.currentTarget.value)}
                    onBlur={commitChanges}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 px-3 text-center text-sm font-black focus:ring-2 focus:ring-accent-teal-dark/50 focus:border-accent-teal-dark/50 outline-none transition-all group-hover:border-white/20 backdrop-blur-md"
                    placeholder={String(minYear)}
                />
                <div className="absolute -top-2 left-3 bg-surface-900 px-2 text-[9px] text-surface-500 font-black uppercase tracking-[0.2em] group-focus-within:text-accent-teal transition-colors">Desde</div>
            </div>
            <div className="relative group">
                <input
                    type="number"
                    value={maxVal}
                    onInput={(e) => setMaxVal(e.currentTarget.value)}
                    onBlur={commitChanges}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 px-3 text-center text-sm font-black focus:ring-2 focus:ring-accent-teal-dark/50 focus:border-accent-teal-dark/50 outline-none transition-all group-hover:border-white/20 backdrop-blur-md"
                    placeholder={String(maxYear)}
                />
                <div className="absolute -top-2 left-3 bg-surface-900 px-2 text-[9px] text-surface-500 font-black uppercase tracking-[0.2em] group-focus-within:text-accent-teal transition-colors">Hasta</div>
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

    const [openSection, setOpenSection] = useState<string | null>('status');
    const hasActiveCategories = Object.values(activeFilters || {}).some(filters => filters && filters.length > 0);
    const hasActiveFilters = hasActiveCategories || clearAllEnabled || (yearRange && (yearRange.min !== minYear || yearRange.max !== maxYear));

    const toggleSection = (sectionId: string) => {
        setOpenSection(openSection === sectionId ? null : sectionId);
    };

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
        <div className="animate-fade-in flex flex-col">
            <div className="space-y-2 pr-1">
                <AccordionItem
                    title="Estado de desarrollo"
                    icon={faFilter}
                    isOpen={openSection === 'status'}
                    onClick={() => toggleSection('status')}
                    badgeCount={activeFilters.status?.length}
                >
                    <FilterButtons
                        items={Object.values(GameStatus)}
                        category="status"
                        activeItems={activeFilters.status || []}
                        onFilterChange={onFilterChange}
                        itemColorMap={statusColorMap}
                    />
                </AccordionItem>

                <AccordionItem
                    title="Géneros"
                    icon={faTags}
                    isOpen={openSection === 'genre'}
                    onClick={() => toggleSection('genre')}
                    badgeCount={activeFilters.genre?.length}
                >
                    <FilterList
                        items={genres}
                        selectedItems={activeFilters.genre || []}
                        onToggleItem={onFilterChange}
                        category="genre"
                        onClear={onClearCategory}
                    />
                </AccordionItem>

                <AccordionItem
                    title="Tiendas"
                    icon={faStore}
                    isOpen={openSection === 'stores'}
                    onClick={() => toggleSection('stores')}
                    badgeCount={activeFilters.stores?.length}
                >
                    <FilterList
                        items={stores}
                        selectedItems={activeFilters.stores || []}
                        onToggleItem={onFilterChange}
                        category="stores"
                        onClear={onClearCategory}
                    />
                </AccordionItem>

                <AccordionItem
                    title="Plataformas"
                    icon={faDesktop}
                    isOpen={openSection === 'platform'}
                    onClick={() => toggleSection('platform')}
                    badgeCount={activeFilters.platform?.length}
                >
                    <FilterList
                        items={platforms}
                        selectedItems={activeFilters.platform || []}
                        onToggleItem={onFilterChange}
                        category="platform"
                        onClear={onClearCategory}
                    />
                </AccordionItem>

                <AccordionItem
                    title="Año de lanzamiento"
                    icon={faCalendarAlt}
                    isOpen={openSection === 'year'}
                    onClick={() => toggleSection('year')}
                    badgeCount={(yearRange && (yearRange.min !== minYear || yearRange.max !== maxYear)) ? 1 : 0}
                >
                    <YearRangeInputs
                        minYear={minYear}
                        maxYear={maxYear}
                        yearRange={yearRange}
                        onYearRangeChange={onYearRangeChange}
                    />
                </AccordionItem>
            </div>

            <div className="pt-6 mt-4 border-t border-surface-700/50">
                <button
                    onClick={handleClearAllClick}
                    disabled={!hasActiveFilters}
                    className={`w-full group flex items-center justify-center gap-3 py-4 px-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 ${hasActiveFilters
                        ? 'bg-brand-red/10 hover:bg-brand-red text-brand-red hover:text-white border border-brand-red/20 hover:border-brand-red shadow-xl shadow-red-900/10 hover:shadow-brand-red/30'
                        : 'bg-surface-800/30 text-surface-700 border border-surface-700/20 cursor-not-allowed grayscale'
                        }`}
                >
                    <FontAwesomeIcon icon={faTrash} className={`transition-transform duration-500 ${hasActiveFilters ? 'group-hover:rotate-12 group-hover:scale-125' : ''}`} />
                    <span>Reiniciar todos los filtros</span>
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

                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default FilterPanel;