import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface TabButtonProps {
    icon: IconDefinition;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton = ({ icon, label, isActive, onClick }: TabButtonProps) => (
    <button
        onClick={onClick}
        className={`
            flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5
            rounded-xl text-[11px] md:text-xs font-bold uppercase tracking-[0.12em]
            transition-all duration-300 cursor-pointer border
            focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/50
            ${isActive
                ? 'bg-white/[0.1] border-white/[0.15] text-white shadow-lg'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
            }
        `}
    >
        <FontAwesomeIcon icon={icon} className={`text-xs ${isActive ? 'text-yellow-300' : ''}`} />
        <span className="hidden sm:inline">{label}</span>
    </button>
);

export default TabButton;
