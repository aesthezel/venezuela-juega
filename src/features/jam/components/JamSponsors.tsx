import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { gsap } from 'gsap';
import type { JamEvent } from '../types';

interface JamSponsorsProps {
    jam: JamEvent;
}

const JamSponsors = ({ jam }: JamSponsorsProps) => {
    const rowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const row = rowRef.current;
        if (!row) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const wiggle = (logo: HTMLElement) => {
            gsap.to(logo, {
                keyframes: [
                    { x: -6, rotate: -5, duration: 0.1 },
                    { x: 6, rotate: 5, duration: 0.1 },
                    { x: -5, rotate: -4, duration: 0.1 },
                    { x: 5, rotate: 4, duration: 0.1 },
                    { x: -3, rotate: -2.5, duration: 0.1 },
                    { x: 3, rotate: 2.5, duration: 0.1 },
                    { x: 0, rotate: 0, duration: 0.13 },
                ],
                ease: 'none',
            });
        };

        const findLogo = (target: EventTarget | null): HTMLElement | null =>
            target instanceof HTMLElement ? target.closest<HTMLElement>('[data-sponsor-logo]') : null;

        const onMouseOver = (e: MouseEvent) => {
            const logo = findLogo(e.target);
            if (logo && row.contains(logo)) wiggle(logo);
        };

        const onMouseOut = (e: MouseEvent) => {
            const logo = findLogo(e.target);
            if (!logo) return;
            const related = e.relatedTarget instanceof Node ? e.relatedTarget : null;
            if (related && logo.contains(related)) return;
            gsap.killTweensOf(logo);
        };

        row.addEventListener('mouseover', onMouseOver);
        row.addEventListener('mouseout', onMouseOut);
        return () => {
            row.removeEventListener('mouseover', onMouseOver);
            row.removeEventListener('mouseout', onMouseOut);
            gsap.killTweensOf(row.querySelectorAll('[data-sponsor-logo]'));
        };
    }, []);

    if (!jam.sponsors.length) return null;

    return (
        <section className="py-14 px-6 bg-base-200/50 border-y border-base-300">
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
                <h2 className="text-xs uppercase tracking-widest text-base-content/50 font-bold text-center">
                    Sponsors y aliados
                </h2>
                <div ref={rowRef} className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
                    {jam.sponsors.map((s) =>
                        s.url ? (
                            <a
                                key={s.name}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-sponsor-logo
                                className="opacity-70 hover:opacity-100 transition-opacity"
                                aria-label={`Visitar sitio de ${s.name}`}
                            >
                                <img
                                    src={s.logo}
                                    alt={s.name}
                                    className={s.height ? 'w-auto object-contain' : 'h-12 w-auto object-contain'}
                                    style={s.height ? { height: s.height } : undefined}
                                />
                            </a>
                        ) : (
                            <span key={s.name} data-sponsor-logo className="opacity-70">
                                <img
                                    src={s.logo}
                                    alt={s.name}
                                    className={s.height ? 'w-auto object-contain' : 'h-12 w-auto object-contain'}
                                    style={s.height ? { height: s.height } : undefined}
                                />
                            </span>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default JamSponsors;
