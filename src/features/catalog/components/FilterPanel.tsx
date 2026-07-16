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
    faStore,
    faFont
} from '@fortawesome/free-solid-svg-icons';
import { GameStatus } from "@/types";
import AlphaFilter from './AlphaFilter';

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
    alpha: string | null;
    onAlphaChange: (value: string | null) => void;
}

const AccordionItem = ({ title, icon, isOpen, onClick, children, badgeCount }: { title: string; icon: any; isOpen: boolean; onClick: () => void; children: any; badgeCount?: number }) => {
    return (
        <div className={`collapse collapse-arrow bg-base-200/50 mb-2 border border-base-300 ${isOpen ? 'collapse-open' : 'collapse-close'}`}>
            <div 
                className="collapse-title flex items-center gap-3 cursor-pointer min-h-0 py-3 pl-3"
                onClick={onClick}
            >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isOpen ? 'bg-accent-teal-dark text-white' : 'bg-transparent text-base-content/70'}`}>
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs font-bold uppercase tracking-[0.1em]">
                        {title}
                    </span>
                    {badgeCount !== undefined && badgeCount > 0 && !isOpen && (
                        <span className="text-[10px] text-accent font-bold mt-1">
                            {badgeCount} {badgeCount === 1 ? 'seleccionado' : 'seleccionados'}
                        </span>
                    )}
                </div>
            </div>

            <div className="collapse-content">
                {children}
            </div>
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
                        className="text-[10px] font-black text-secondary/80 hover:text-secondary uppercase tracking-widest transition-colors flex items-center gap-1.5"
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
                            className={`px-3 py-2 rounded-xl cursor-pointer flex items-center justify-between group/item transition-colors ${isSelected ? 'bg-accent/10 border border-accent/20' : 'hover:bg-base-300 border border-transparent'}`}
                        >
                            <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-accent font-bold' : 'text-base-content/70 group-hover/item:text-base-content'}`}>
                                {item}
                            </span>
                            <input 
                                type="checkbox" 
                                className="checkbox checkbox-accent checkbox-sm"
                                checked={isSelected}
                                readOnly
                            />
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
                    className={`btn btn-sm ${isActive ? 'btn-active text-white border-transparent' : 'btn-ghost border border-surface-700'}`}
                    style={isActive && statusColorBase ? {
                        backgroundColor: `var(--color-${statusColorBase})`
                    } : {}}
                >
                    {isActive && <FontAwesomeIcon icon={faCheck} className="opacity-70" />}
                    {item}
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
                    className="input input-bordered w-full text-center font-bold"
                    placeholder={String(minYear)}
                />
                <div className="absolute -top-2 left-3 bg-base-200 px-2 text-[10px] text-base-content/60 font-bold uppercase tracking-wider group-focus-within:text-accent transition-colors">Desde</div>
            </div>
            <div className="relative group">
                <input
                    type="number"
                    value={maxVal}
                    onInput={(e) => setMaxVal(e.currentTarget.value)}
                    onBlur={commitChanges}
                    onKeyDown={handleKeyDown}
                    className="input input-bordered w-full text-center font-bold"
                    placeholder={String(maxYear)}
                />
                <div className="absolute -top-2 left-3 bg-base-200 px-2 text-[10px] text-base-content/60 font-bold uppercase tracking-wider group-focus-within:text-accent transition-colors">Hasta</div>
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
    onYearRangeChange,
    alpha,
    onAlphaChange
}: FilterPanelProps) => {

    const [openSection, setOpenSection] = useState<string | null>('status');
    const hasActiveCategories = Object.values(activeFilters || {}).some(filters => filters && filters.length > 0);
    const hasActiveFilters = hasActiveCategories || clearAllEnabled || (yearRange && (yearRange.min !== minYear || yearRange.max !== maxYear)) || alpha !== null;

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
                    title="Inicial del título"
                    icon={faFont}
                    isOpen={openSection === 'alpha'}
                    onClick={() => toggleSection('alpha')}
                    badgeCount={alpha ? 1 : 0}
                >
                    <AlphaFilter activeAlpha={alpha} onAlphaChange={onAlphaChange} className="md:justify-center" />
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

            <div className="pt-4 mt-2">
                <button
                    onClick={handleClearAllClick}
                    disabled={!hasActiveFilters}
                    className="btn btn-error btn-outline btn-block"
                >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Reiniciar todos los filtros</span>
                </button>
            </div>


        </div>
    );
};

export default FilterPanel;