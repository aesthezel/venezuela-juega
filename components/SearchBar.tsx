import { useState, useEffect, useRef, useMemo, useCallback } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Game } from '../interfaces/Game';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    games: Game[];
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const SearchBar = ({ searchTerm, onSearchChange, games }: SearchBarProps) => {
    const [suggestions, setSuggestions] = useState<Game[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    
    const searchRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const debouncedLocalTerm = useDebounce(localSearchTerm, 150);
    const debouncedGlobalTerm = useDebounce(localSearchTerm, 300);

    useEffect(() => {
        if (searchTerm !== localSearchTerm) {
            setLocalSearchTerm(searchTerm);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedGlobalTerm !== searchTerm) {
            onSearchChange(debouncedGlobalTerm);
        }
    }, [debouncedGlobalTerm, onSearchChange, searchTerm]);

    const searchIndex = useMemo(() => {
        return games.map(game => ({
            ...game,
            searchText: `${game.title} ${game.developers.join(' ')}`.toLowerCase()
        }));
    }, [games]);

    const filteredSuggestions = useMemo(() => {
        if (debouncedLocalTerm.length < 2) {
            return [];
        }
        
        const searchLower = debouncedLocalTerm.toLowerCase();
        const results = [];

        for (let i = 0; i < searchIndex.length && results.length < 5; i++) {
            const game = searchIndex[i];
            if (game.searchText.includes(searchLower)) {
                results.push(game);
            }
        }
        
        return results;
    }, [debouncedLocalTerm, searchIndex]);

    useEffect(() => {
        const shouldShow = filteredSuggestions.length > 0 && 
                          debouncedLocalTerm.length >= 2 && 
                          document.activeElement === searchRef.current;
        
        setSuggestions(filteredSuggestions);
        setShowSuggestions(shouldShow);
        
        if (!shouldShow) {
            setActiveSuggestion(-1);
        }
    }, [filteredSuggestions, debouncedLocalTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                searchRef.current && !searchRef.current.contains(target) &&
                dropdownRef.current && !dropdownRef.current.contains(target)
            ) {
                setShowSuggestions(false);
                setActiveSuggestion(-1);
            }
        };

        if (showSuggestions) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showSuggestions]);

    const handleInputChange = useCallback((e: Event) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        setLocalSearchTerm(value);

        if (value === '') {
            onSearchChange('');
        }
    }, [onSearchChange]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
                    selectSuggestion(suggestions[activeSuggestion]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowSuggestions(false);
                setActiveSuggestion(-1);
                searchRef.current?.blur();
                break;
        }
    }, [showSuggestions, suggestions, activeSuggestion]);

    const selectSuggestion = useCallback((game: Game) => {
        setLocalSearchTerm(game.title);
        onSearchChange(game.title);
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        searchRef.current?.blur();
    }, [onSearchChange]);

    const clearSearch = useCallback(() => {
        setLocalSearchTerm('');
        onSearchChange('');
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        searchRef.current?.focus();
    }, [onSearchChange]);

    const handleFocus = useCallback(() => {
        if (localSearchTerm.length >= 2) {
            setShowSuggestions(filteredSuggestions.length > 0);
        }
    }, [localSearchTerm.length, filteredSuggestions.length]);

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            setShowSuggestions(false);
            setActiveSuggestion(-1);
        }, 150);
    }, []);

    const highlightMatch = useCallback((text: string, searchTerm: string) => {
        if (!searchTerm || searchTerm.length < 2) return text;
        
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        
        return parts.map((part, index) => 
            regex.test(part) ? (
                <mark key={index} className="bg-cyan-400 text-slate-900 px-1 rounded">
                    {part}
                </mark>
            ) : part
        );
    }, []);

    return (
        <div className="relative">
            <div className="relative">
                <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
                />
                <input
                    ref={searchRef}
                    type="text"
                    placeholder="Buscar juegos..."
                    value={localSearchTerm}
                    onInput={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full pl-10 pr-10 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 transition-all duration-200 placeholder-gray-400"
                    autoComplete="off"
                />
                {localSearchTerm && (
                    <button
                        onClick={clearSearch}
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-sm" />
                    </button>
                )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div 
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto"
                >
                    {suggestions.map((game, index) => (
                        <div
                            key={`${game.id}-${index}`}
                            onClick={() => selectSuggestion(game)}
                            className={`px-4 py-3 cursor-pointer transition-colors border-b border-slate-700 last:border-b-0 ${
                                index === activeSuggestion 
                                    ? 'bg-cyan-500 bg-opacity-20 border-cyan-400' 
                                    : 'hover:bg-slate-700'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <img 
                                    src={game.imageUrl} 
                                    alt={game.title}
                                    className="w-12 h-12 object-cover rounded flex-shrink-0"
                                    loading="lazy"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-white font-medium truncate">
                                        {highlightMatch(game.title, debouncedLocalTerm)}
                                    </div>
                                    <div className="text-gray-400 text-sm truncate">
                                        {game.developers.join(', ')}
                                    </div>
                                    {game.genre.length > 0 && (
                                        <div className="flex gap-1 mt-1">
                                            {game.genre.slice(0, 2).map(genre => (
                                                <span 
                                                    key={genre}
                                                    className="bg-slate-600 text-gray-300 text-xs px-1.5 py-0.5 rounded"
                                                >
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {suggestions.length === 5 && (
                        <div className="px-4 py-2 text-center text-gray-400 text-sm bg-slate-900">
                            Escribe más caracteres para refinar la búsqueda
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;