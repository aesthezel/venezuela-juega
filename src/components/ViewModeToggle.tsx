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
      className={`join ${className || ''}`}
      role="group"
      aria-label="Cambiar modo de vista"
    >
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`btn btn-sm join-item ${
          mode === 'grid' ? 'btn-active btn-accent' : 'btn-ghost'
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
        className={`btn btn-sm join-item ${
          mode === 'list' ? 'btn-active btn-accent' : 'btn-ghost'
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