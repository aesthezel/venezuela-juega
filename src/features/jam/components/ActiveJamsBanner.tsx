import { h } from 'preact';
import { useRef, useEffect, useMemo, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { getAllJams } from '../registry';
import type { JamEvent, JamStatus } from '../types';

const isJamActiveOrUpcoming = (jam: JamEvent): boolean => {
    // 1. Descartar si la jam está finalizada o en borrador
    if (jam.status === 'ended' || jam.status === 'draft') return false;

    // 2. Solo permitir estados en curso o próximamente
    const activeOrUpcomingStatuses: JamStatus[] = ['upcoming', 'open', 'active', 'voting'];
    if (!activeOrUpcomingStatuses.includes(jam.status)) return false;

    // 3. Si la fecha de culminación ya expiró, no mostrar
    const now = new Date();
    if (jam.endDate && now > jam.endDate) return false;

    return true;
};

const MARQUEE_PX_PER_SECOND = 55;

const ActiveJamsBanner = () => {
    const barRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [marqueeReady, setMarqueeReady] = useState(false);
    const [groupWidth, setGroupWidth] = useState(0);

    const activeJams = useMemo(() => getAllJams().filter(isJamActiveOrUpcoming), []);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        setMarqueeReady(true);
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track || !marqueeReady) return;
        const fragment = track.firstElementChild as HTMLElement | null;
        if (!fragment) return;

        const measure = () => {
            const w = fragment.offsetWidth;
            setGroupWidth((prev) => (prev === w ? prev : w));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(fragment);
        return () => ro.disconnect();
    }, [marqueeReady]);

    if (activeJams.length === 0) return null;

    const renderGroup = (ariaHidden: boolean) => (
        <div
            aria-hidden={ariaHidden || undefined}
            className={`flex items-center gap-x-6 ${marqueeReady ? 'shrink-0 pr-6' : 'flex-wrap justify-center gap-y-2'}`}
        >
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-widest text-brand-gold">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold" />
                </span>
                Jams activas
            </span>
            {activeJams.map((jam) => (
                <button
                    key={jam.slug}
                    type="button"
                    data-banner-cta="chip"
                    onClick={() => route(`/jam/${jam.slug}`)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 min-h-9 rounded-full bg-white/[0.05] border border-white/[0.1] text-white text-xs font-bold whitespace-nowrap cursor-pointer transition-colors hover:bg-brand-gold/10 hover:border-brand-gold/40"
                >
                    <span>{jam.shortName ?? jam.name}</span>
                    {jam.registrationCloseDate && jam.registrationCloseDate > new Date() && (
                        <span className="text-white/70 font-medium text-[11px] uppercase tracking-wide">
                            Inscríbete antes del {jam.registrationCloseDate.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })}
                        </span>
                    )}
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px] text-brand-gold" />
                </button>
            ))}
            <button
                type="button"
                data-banner-cta="text"
                onClick={() => route('/jams')}
                className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-base-content/70 hover:text-brand-gold whitespace-nowrap cursor-pointer transition-colors min-h-9 px-2"
            >
                Ver todas
            </button>
        </div>
    );

    return (
        <div
            ref={barRef}
            className="relative z-30 w-full bg-base-200/80 backdrop-blur-md border-b border-surface-700 px-4 py-2.5 overflow-hidden"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    background:
                        'linear-gradient(90deg, rgba(242,182,61,0.08) 0%, rgba(69,124,214,0.06) 50%, rgba(227,66,98,0.08) 100%)',
                }}
            />
            <div
                className={`relative max-w-6xl mx-auto ${marqueeReady ? 'mask-fade-edges' : 'flex flex-wrap items-center justify-center'}`}
            >
                {marqueeReady ? (
                    <div
                        ref={trackRef}
                        className="vj-marquee flex w-max"
                        style={groupWidth > 0 ? {
                            '--marquee-distance': `-${groupWidth}px`,
                            animationDuration: `${groupWidth / MARQUEE_PX_PER_SECOND}s`,
                        } as Record<string, string> : undefined}
                    >
                        {renderGroup(false)}
                        {renderGroup(true)}
                    </div>
                ) : (
                    renderGroup(false)
                )}
            </div>
        </div>
    );
};

export default ActiveJamsBanner;
