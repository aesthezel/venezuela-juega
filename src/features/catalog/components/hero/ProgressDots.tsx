import { h } from 'preact';

export interface ProgressDotsProps {
    activeTab: 'stats' | 'explore';
    onTabChange: (tab: 'stats' | 'explore') => void;
    progress: number;
}

const ProgressDots = ({ activeTab, onTabChange, progress }: ProgressDotsProps) => (
    <div className="flex items-center gap-3 mt-4">
        {(['explore', 'stats'] as const).map((tab) => (
            <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${activeTab === tab ? 'w-10 bg-white/20' : 'w-4 bg-white/10 hover:bg-white/15'
                    }`}
                aria-label={tab === 'stats' ? 'Ver métricas' : 'Ver categorías'}
            >
                {activeTab === tab && (
                    <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                            width: `${progress}%`,
                            background: 'linear-gradient(to right, #f2b63d, #e34262)',
                            transition: 'width 0.1s linear',
                        }}
                    />
                )}
            </button>
        ))}
    </div>
);

export default ProgressDots;
