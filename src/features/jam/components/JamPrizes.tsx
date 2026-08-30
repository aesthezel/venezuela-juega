import { h } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import type { JamEvent } from '../types';
import { renderRichText } from '../renderRichText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface JamPrizesProps {
    jam: JamEvent;
}

const SCROLL_AMOUNT = 340;

const JamPrizes = ({ jam }: JamPrizesProps) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollArrows = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        updateScrollArrows();
        el.addEventListener('scroll', updateScrollArrows, { passive: true });
        window.addEventListener('resize', updateScrollArrows);
        return () => {
            el.removeEventListener('scroll', updateScrollArrows);
            window.removeEventListener('resize', updateScrollArrows);
        };
    }, [updateScrollArrows]);

    const scrollPrizes = useCallback(
        (dir: 'left' | 'right') => {
            const el = trackRef.current;
            if (!el) return;
            el.scrollBy({ left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: 'smooth' });
            setTimeout(updateScrollArrows, 350);
        },
        [updateScrollArrows]
    );

    if (!jam.prizes?.length) return null;

    return (
        <section className="py-20 px-6 bg-base-200">
            <div className="max-w-5xl mx-auto">
                {/* Header + arrows */}
                <div className="flex items-end justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black text-center sm:text-left text-white mb-4 uppercase tracking-tight">
                            Categorías de premios
                        </h2>
                        <p className="text-base-content/50 text-center sm:text-left text-sm uppercase tracking-widest">
                            Reconocemos la excelencia en cada área
                        </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 shrink-0 pb-1">
                        <button
                            onClick={() => scrollPrizes('left')}
                            disabled={!canScrollLeft}
                            aria-label="Premios anteriores"
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-base-100 border border-base-300 text-base-content/70 shadow-lg transition-all duration-200 hover:text-white hover:border-base-content/40 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-base-content/70 disabled:hover:border-base-300"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
                        </button>
                        <button
                            onClick={() => scrollPrizes('right')}
                            disabled={!canScrollRight}
                            aria-label="Siguientes premios"
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-base-100 border border-base-300 text-base-content/70 shadow-lg transition-all duration-200 hover:text-white hover:border-base-content/40 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-base-content/70 disabled:hover:border-base-300"
                        >
                            <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                        </button>
                    </div>
                </div>

                {/* Slider */}
                <div className="relative">
                    <div
                        ref={trackRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory -mx-1 px-1 py-2"
                    >
                        {jam.prizes.map((prize, i) => (
                            <div key={prize.category} className="snap-center shrink-0 w-72 sm:w-80">
                                <div className="card bg-base-100 border border-base-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full">
                                    <div className="card-body items-center text-center gap-3">
                                        <span className="text-5xl">{prize.emoji}</span>
                                        <h3 className={`card-title text-${prize.color ?? 'secondary'} font-black text-lg`}>
                                            {prize.category}
                                        </h3>
                                        {prize.description && (
                                            <p className="text-base-content/60 text-sm leading-relaxed">
                                                {renderRichText(prize.description)}
                                            </p>
                                        )}
                                        <div className={`badge badge-${prize.color ?? 'secondary'} badge-outline text-xs font-bold mt-2`}>
                                            #{String(i + 1).padStart(2, '0')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Fade edges */}
                    {canScrollLeft && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-base-200 to-transparent z-10" />
                    )}
                    {canScrollRight && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-base-200 to-transparent z-10" />
                    )}
                </div>
            </div>
        </section>
    );
};

export default JamPrizes;
