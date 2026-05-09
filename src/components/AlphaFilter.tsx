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
      <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${className || ''}`}>
        <button
          type="button"
          onClick={() => onAlphaChange(null)}
          className={`btn btn-sm ${activeAlpha === null ? 'btn-accent' : 'btn-ghost border border-surface-700'}`}
          title="Mostrar todos"
          aria-pressed={activeAlpha === null}
        >
          Todos
        </button>

        {/* Sin barras de desplazamiento visibles */}
        <div className="flex-1 overflow-x-auto pb-1 w-full [scrollbar-width:none] [ms-overflow-style:none] [&_*::-webkit-scrollbar]:hidden">
          <div className="join flex">
            {keys.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onAlphaChange(k)}
                className={`btn btn-sm join-item ${activeAlpha === k ? 'btn-accent' : 'btn-ghost border border-surface-700 hover:bg-base-200'}`}
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