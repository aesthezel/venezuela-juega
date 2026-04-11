import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface CompactStatProps {
    value: string | number;
    label: string;
    icon: IconDefinition;
    accentColor: string;
}

const CompactStat = ({ value, label, icon, accentColor }: CompactStatProps) => (
    <div className="flex flex-col items-center px-4 py-3 md:px-8 md:py-5 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm flex-1 min-w-[90px] md:min-w-[150px] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/[0.07] hover:border-white/[0.12] group">
        <span className="text-2xl md:text-4xl font-extrabold text-white mb-1 drop-shadow-lg">{value}</span>
        <span className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold tracking-widest uppercase text-slate-400 md:text-sm text-center leading-tight">
            <FontAwesomeIcon icon={icon} className="transition-colors duration-300" style={{ color: accentColor }} />
            {label}
        </span>
    </div>
);

export default CompactStat;
