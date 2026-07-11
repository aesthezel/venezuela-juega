import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { JamEvent } from '../types';
import JamCountdown from './JamCountdown';

gsap.registerPlugin(ScrollTrigger);

interface JamHeroProps {
    jam: JamEvent;
}

const statusLabel: Record<string, string> = {
    upcoming: 'PRÓXIMAMENTE',
    open: 'INSCRIPCIONES ABIERTAS',
    active: 'EN CURSO',
    voting: 'VOTACIÓN ABIERTA',
    ended: 'FINALIZADO',
    draft: 'BORRADOR',
};

const statusColor: Record<string, string> = {
    upcoming: 'badge-warning',
    open: 'badge-success',
    active: 'badge-success',
    voting: 'badge-info',
    ended: 'badge-neutral',
    draft: 'badge-ghost',
};

const JamHero = ({ jam }: JamHeroProps) => {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from(badgeRef.current, { y: -30, opacity: 0, duration: 0.6 })
              .from(titleRef.current, { y: 60, opacity: 0, duration: 0.9 }, '-=0.3')
              .from(subRef.current, { y: 40, opacity: 0, duration: 0.7 }, '-=0.5')
              .from(ctaRef.current, { y: 30, opacity: 0, duration: 0.6 }, '-=0.4');
        }, heroRef);
        return () => ctx.revert();
    }, []);

    const gradient = jam.heroGradient ?? 'from-[#1a0a0d] via-[#0d0a11] to-[#0a0d1a]';

    return (
        <div
            ref={heroRef}
            className={`relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${gradient} overflow-hidden`}
        >
            {/* Glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse 70% 50% at 50% 40%, ${jam.accentColor ?? '#e34262'}22 0%, transparent 70%)`,
                }}
            />

            {/* Particles layer (static decorative dots) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 24 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/5"
                        style={{
                            width: `${Math.random() * 6 + 2}px`,
                            height: `${Math.random() * 6 + 2}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-4xl mx-auto pt-32 pb-20">
                {/* Status badge */}
                <div ref={badgeRef}>
                    <span className={`badge badge-lg font-black tracking-widest text-xs uppercase ${statusColor[jam.status] ?? 'badge-neutral'}`}>
                        {statusLabel[jam.status] ?? jam.status.toUpperCase()}
                    </span>
                </div>

                {/* Sponsor row */}
                {jam.sponsors.length > 0 && (
                    <div className="flex items-center gap-3 opacity-70">
                        <span className="text-xs text-base-content/50 uppercase tracking-widest">Con el apoyo de</span>
                        {jam.sponsors.map((s) => (
                            <img key={s.name} src={s.logo} alt={s.name} className="h-6 w-auto object-contain" />
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1
                    ref={titleRef}
                    className="text-5xl sm:text-6xl lg:text-8xl font-black leading-none tracking-tight text-white"
                    style={{ textShadow: `0 0 80px ${jam.accentColor ?? '#e34262'}66` }}
                >
                    {jam.name}
                </h1>

                {/* Tagline */}
                {jam.tagline && (
                    <p
                        ref={subRef}
                        className="text-xl sm:text-2xl text-base-content/70 font-medium max-w-2xl"
                    >
                        {jam.tagline}
                    </p>
                )}

                {/* Countdown or TBA */}
                <div ref={ctaRef} className="mt-4 flex flex-col items-center gap-6">
                    {jam.startDate ? (
                        <JamCountdown targetDate={jam.startDate} label="para el inicio" />
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <span
                                className="text-4xl font-black tracking-[0.3em] uppercase"
                                style={{ color: jam.accentColor ?? '#e34262' }}
                            >
                                TBA
                            </span>
                            <span className="text-sm text-base-content/50 uppercase tracking-widest">Fechas por confirmar</span>
                        </div>
                    )}

                    {jam.submissionUrl ? (
                        <a
                            href={jam.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-lg font-black text-white border-0 shadow-2xl"
                            style={{ backgroundColor: jam.accentColor ?? '#e34262' }}
                            aria-label={`Participar en ${jam.name} en ${jam.platform ?? 'Itch.io'} (abre en nueva pestaña)`}
                        >
                            Participar en {jam.platform ?? 'Itch.io'}
                        </a>
                    ) : (
                        <button
                            disabled
                            className="btn btn-lg btn-disabled font-black"
                            aria-label="Inscripciones próximamente"
                        >
                            Próximamente en {jam.platform ?? 'Itch.io'}
                        </button>
                    )}
                </div>
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce">
                <div className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5">
                    <div className="w-1 h-2 rounded-full bg-white/60" />
                </div>
            </div>
        </div>
    );
};

export default JamHero;
