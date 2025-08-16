import { h } from 'preact';

interface AlphaFilterProps {
  activeAlpha: string | null; // null === all
  onAlphaChange: (value: string | null) => void;
  className?: string;
}

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A-Z
const keys = ['#', ...letters];

const AlphaFilter = ({ activeAlpha, onAlphaChange, className }: AlphaFilterProps) => {
  return (
    <div className="w-full">
      <div className={`flex items-center justify-between gap-2 ${className || ''}`}>
        <button
          type="button"
          onClick={() => onAlphaChange(null)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
            activeAlpha === null
              ? 'bg-cyan-500 border-cyan-500 text-white'
              : 'bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700'
          }`}
          title="Mostrar todos"
          aria-pressed={activeAlpha === null}
        >
          Todos
        </button>

        {/* Sin barras de desplazamiento visibles */}
        <div className="flex-1 overflow-hidden [scrollbar-width:none] [ms-overflow-style:none] [&_*::-webkit-scrollbar]:hidden">
          <div className="flex flex-wrap gap-1">
            {keys.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onAlphaChange(k)}
                className={`px-2.5 py-1.5 text-sm rounded-md border transition-colors ${
                  activeAlpha === k
                    ? 'bg-cyan-500 border-cyan-500 text-white'
                    : 'bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700'
                }`}
                aria-pressed={activeAlpha === k}
                aria-label={k === '#' ? 'Títulos que comienzan con números o símbolos' : `Títulos que comienzan con ${k}`}
                title={k === '#' ? 'Números o símbolos' : k}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphaFilter;