import { h } from 'preact';
import { forwardRef } from 'preact/compat';

export interface ProgressDotsProps {
    activeTab: 'stats' | 'explore';
    onTabChange: (tab: 'stats' | 'explore') => void;
    /** @deprecated — pass progressBarRef instead for zero-setState animation */
    progress?: number;
}

/**
 * ProgressDots — two pill buttons indicating the active tab.
 * The active pill's fill bar is driven by a CSS custom property `--progress`
 * set directly on the element via `ref` (no React state updates per frame).
 */
const ProgressDots = forwardRef<HTMLDivElement, ProgressDotsProps>(
    ({ activeTab, onTabChange }, ref) => (
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
                            ref={ref}
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                                // --progress is set imperatively via ref; falls back to 0% if not provided
                                width: 'var(--progress, 0%)',
                                background: 'linear-gradient(to right, #f2b63d, #e34262)',
                            }}
                        />
                    )}
                </button>
            ))}
        </div>
    )
);

export default ProgressDots;
