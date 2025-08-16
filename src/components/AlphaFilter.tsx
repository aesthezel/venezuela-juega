import { h } from 'preact';

interface AlphaFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A-Z
const keys = ['#', ...letters];

const AlphaFilter = ({ value, onChange, className }: AlphaFilterProps) => {
  return (
    <div className={`w-full`}>
      <div className={`flex items-center justify-between gap-2 ${className || ''}`}>
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
            value === null
              ? 'bg-cyan-500 border-cyan-500 text-white'
              : 'bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700'
          }`}
          title="Mostrar todos"
          aria-pressed={value === null}
        >
          Todos
        </button>

        <div className="flex-1 overflow-x-auto">
          <div className="inline-flex whitespace-nowrap gap-1">
            {keys.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onChange(k)}
                className={`px-2.5 py-1.5 text-sm rounded-md border transition-colors ${
                  value === k
                    ? 'bg-cyan-500 border-cyan-500 text-white'
                    : 'bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700'
                }`}
                aria-pressed={value === k}
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