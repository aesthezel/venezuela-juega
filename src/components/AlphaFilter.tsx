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
    <div className={`w-full ${className || ''}`}>
      <div className="flex flex-wrap gap-1.5 pt-1">
        <button
          type="button"
          onClick={() => onAlphaChange(null)}
          className={`btn btn-sm ${activeAlpha === null ? 'btn-accent text-white' : 'btn-ghost border border-surface-700'}`}
          title="Mostrar todos"
          aria-pressed={activeAlpha === null}
        >
          Todos
        </button>

        {keys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onAlphaChange(k)}
            className={`btn btn-sm w-9 h-9 p-0 flex items-center justify-center ${activeAlpha === k ? 'btn-accent text-white' : 'btn-ghost border border-surface-700 hover:bg-base-200'}`}
            aria-pressed={activeAlpha === k}
            aria-label={k === '#' ? 'Títulos que comienzan con números o símbolos' : `Títulos que comienzan con ${k}`}
            title={k === '#' ? 'Números o símbolos' : k}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlphaFilter;