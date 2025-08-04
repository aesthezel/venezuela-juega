import { JSX } from "preact/jsx-runtime";

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {

    const handleInput = (e: JSX.TargetedEvent<HTMLInputElement>) => {
        onSearchChange(e.currentTarget.value);
    }

    const clearSearch = () => {
        onSearchChange('');
    }

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>

            <input
                type="text"
                placeholder="Buscar por título..."
                value={searchTerm}
                onInput={handleInput}
                className="w-full bg-slate-700 border-2 border-slate-600 text-white rounded-lg p-3 pl-10 pr-10 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors duration-300"
            />

            {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                        onClick={clearSearch}
                        type="button"
                        className="text-gray-400 hover:text-white focus:outline-none"
                        aria-label="Limpiar búsqueda"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchBar;