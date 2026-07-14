import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { JamEvent } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface JamStatBarProps {
    jam: JamEvent;
}

const JamStatBar = ({ jam }: JamStatBarProps) => {
    const stats = jam.stats;
    if (!stats || (!stats.participants && !stats.submissions && !stats.countries)) return null;

    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            gsap.from('.jam-stat-item', {
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                },
            });
        }, el);
        return () => ctx.revert();
    }, []);

    const items = [
        stats.participants && { value: stats.participants, label: 'Participantes' },
        stats.submissions && { value: stats.submissions, label: 'Juegos enviados' },
        stats.countries && { value: stats.countries, label: 'Países' },
    ].filter(Boolean) as { value: number; label: string }[];

    return (
        <div ref={sectionRef} className="py-12 bg-base-200 border-y border-base-300">
            <div className="stats stats-vertical sm:stats-horizontal shadow w-full max-w-3xl mx-auto bg-base-200">
                {items.map(({ value, label }) => (
                    <div key={label} className="stat jam-stat-item text-center">
                        <div className="stat-value text-secondary text-4xl font-black">
                            {value.toLocaleString()}+
                        </div>
                        <div className="stat-label uppercase tracking-widest text-xs">{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JamStatBar;
