import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrip, faList } from '@fortawesome/free-solid-svg-icons';
import { ViewMode } from '@/src/types';

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

const ViewModeToggle = ({ mode, onChange, className }: ViewModeToggleProps) => {
  return (
    <div
      className={`inline-flex rounded-lg overflow-hidden border border-surface-600 bg-surface-800 ${className || ''}`}
      role="group"
      aria-label="Cambiar modo de vista"
    >
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`px-2.5 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal-dark ${
          mode === 'grid' ? 'bg-accent-teal-dark text-white' : 'text-gray-300 hover:bg-surface-700'
        }`}
        aria-pressed={mode === 'grid'}
        aria-label="Ver en cuadrícula"
        title="Ver en cuadrícula"
      >
        <FontAwesomeIcon icon={faGrip} className="h-4 w-4" />
        <span className="sr-only">Grid</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('list')}
        className={`px-2.5 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal-dark ${
          mode === 'list' ? 'bg-accent-teal-dark text-white' : 'text-gray-300 hover:bg-surface-700'
        }`}
        aria-pressed={mode === 'list'}
        aria-label="Ver en lista"
        title="Ver en lista"
      >
        <FontAwesomeIcon icon={faList} className="h-4 w-4" />
        <span className="sr-only">Lista</span>
      </button>
    </div>
  );
};

export default ViewModeToggle;