import { h } from 'preact';
import { useRef, useEffect, useMemo, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { gsap } from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { getAllJams } from '../registry';
import type { JamEvent } from '../types';

const isRegistrationOpen = (jam: JamEvent): boolean => {
    if (!jam.registrationUrl) return false;
    const now = new Date();
    if (jam.registrationOpenDate && now < jam.registrationOpenDate) return false;
    if (jam.registrationCloseDate && now > jam.registrationCloseDate) return false;
    return true;
};

const MARQUEE_PX_PER_SECOND = 55;

const ActiveJamsBanner = () => {
    const barRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [marqueeReady, setMarqueeReady] = useState(false);
    const [groupWidth, setGroupWidth] = useState(0);

    const activeJams = useMemo(() => getAllJams().filter(isRegistrationOpen), []);

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

    useEffect(() => {
        const track = trackRef.current;
        const bar = barRef.current;
        if (!track || !bar || !marqueeReady || groupWidth <= 0) return;

        gsap.set(track, { x: 0 });
        const tween = gsap.to(track, {
            x: -groupWidth,
            duration: groupWidth / MARQUEE_PX_PER_SECOND,
            ease: 'none',
            repeat: -1,
        });

        const onEnter = () => tween.pause();
        const onLeave = () => tween.resume();
        bar.addEventListener('mouseenter', onEnter);
        bar.addEventListener('mouseleave', onLeave);

        return () => {
            bar.removeEventListener('mouseenter', onEnter);
            bar.removeEventListener('mouseleave', onLeave);
            tween.kill();
        };
    }, [marqueeReady, groupWidth]);

    useEffect(() => {
        const bar = barRef.current;
        if (!bar) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;

        const gold = '#f2b63d';
        const baseContent = 'rgba(234, 231, 236, 1)';
        const baseContentDim = 'rgba(234, 231, 236, 0.5)';
        const chipBg = 'rgba(255, 255, 255, 0.05)';
        const chipBorder = 'rgba(255, 255, 255, 0.1)';
        const chipBgHover = 'rgba(242, 182, 61, 0.12)';
        const chipBorderHover = 'rgba(242, 182, 61, 0.45)';

        const findCta = (target: EventTarget | null): HTMLElement | null =>
            target instanceof HTMLElement ? target.closest<HTMLElement>('[data-banner-cta]') : null;

        const animateTo = (el: HTMLElement, isText: boolean, hovered: boolean) => {
            const isTextCta = isText;
            if (isTextCta) {
                gsap.to(el, {
                    color: hovered ? gold : baseContentDim,
                    duration: hovered ? 0.3 : 0.35,
                    ease: 'power2.out',
                    overwrite: true,
                });
                return;
            }
            gsap.to(el, {
                backgroundColor: hovered ? chipBgHover : chipBg,
                borderColor: hovered ? chipBorderHover : chipBorder,
                color: baseContent,
                boxShadow: hovered ? '0 0 18px rgba(242, 182, 61, 0.12)' : '0 0 0px rgba(242, 182, 61, 0)',
                duration: hovered ? 0.3 : 0.35,
                ease: 'power2.out',
                overwrite: true,
            });
        };

        const onMouseOver = (e: MouseEvent) => {
            const el = findCta(e.target);
            if (!el || !bar.contains(el)) return;
            animateTo(el, el.dataset.bannerCta === 'text', true);
        };

        const onMouseOut = (e: MouseEvent) => {
            const el = findCta(e.target);
            if (!el) return;
            const related = e.relatedTarget instanceof Node ? e.relatedTarget : null;
            if (related && el.contains(related)) return;
            animateTo(el, el.dataset.bannerCta === 'text', false);
        };

        bar.addEventListener('mouseover', onMouseOver);
        bar.addEventListener('mouseout', onMouseOut);
        return () => {
            bar.removeEventListener('mouseover', onMouseOver);
            bar.removeEventListener('mouseout', onMouseOut);
            gsap.killTweensOf(bar.querySelectorAll('[data-banner-cta]'));
        };
    }, []);

    if (activeJams.length === 0) return null;

    const renderGroup = (ariaHidden: boolean) => (
        <div
            aria-hidden={ariaHidden || undefined}
            className={`flex items-center gap-x-6 ${marqueeReady ? 'shrink-0 pr-6' : 'flex-wrap justify-center gap-y-2'}`}
        >
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-brand-gold">
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
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                    aria-label={`Ir a ${jam.name}`}
                >
                    <span aria-hidden="true">{jam.shortName ?? jam.name}</span>
                    {jam.registrationCloseDate && (
                        <span className="text-white/50 font-medium text-[10px] uppercase tracking-wide">
                            cierra {jam.registrationCloseDate.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })}
                        </span>
                    )}
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px] text-brand-gold" />
                </button>
            ))}
            <button
                type="button"
                data-banner-cta="text"
                onClick={() => route('/jams')}
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-base-content/50 whitespace-nowrap cursor-pointer"
            >
                Ver todas
            </button>
        </div>
    );

    return (
        <div
            ref={barRef}
            className="relative z-30 mt-20 w-full bg-base-200/80 backdrop-blur-md border-b border-surface-700 px-4 py-2.5 overflow-hidden"
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
                    <div ref={trackRef} className="flex w-max">
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
