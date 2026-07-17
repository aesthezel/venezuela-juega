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
    const logoRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from(badgeRef.current, { y: -20, opacity: 0, duration: 0.5 })
                .from(logoRef.current, { scale: 0.85, opacity: 0, duration: 0.7 }, '-=0.2')
                .from(titleRef.current, { y: 40, opacity: 0, duration: 0.7 }, '-=0.4')
                .from(subRef.current, { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
                .from(ctaRef.current, { y: 20, opacity: 0, duration: 0.5 }, '-=0.3');
        }, heroRef);
        return () => ctx.revert();
    }, []);

    const gradient = jam.heroGradient ?? 'from-[#1a0a0d] via-[#0d0a11] to-[#0a0d1a]';
    const accent = jam.accentColor ?? '#e34262';

    const heroStyle: h.JSX.CSSProperties = jam.heroImage
        ? {
            backgroundImage: `url(${jam.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
        : {};

    const heroBase = 'relative w-full min-h-[100svh] flex flex-col justify-center items-center overflow-hidden';
    const heroClass = jam.heroImage
        ? heroBase
        : `${heroBase} bg-gradient-to-br ${gradient}`;

    return (
        <div ref={heroRef} className={heroClass} style={heroStyle}>

            {/* ── Overlays ─────────────────────────────── */}
            {jam.heroImage ? (
                <>
                    <div
                        className="absolute inset-0 z-0"
                        style={{ backgroundColor: 'rgba(10,5,20,0.70)' }}
                    />
                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/20 to-black/90 pointer-events-none" />
                </>
            ) : (
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        background: `radial-gradient(ellipse 70% 50% at 50% 40%, ${accent}22 0%, transparent 70%)`,
                    }}
                />
            )}

            {/* ── Contenido principal ──────────────────── */}
            <div
                className={[
                    'relative z-10',
                    'w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl',
                    'mx-auto px-4 sm:px-6 lg:px-8',
                    'pt-12 pb-24 sm:pb-32 lg:pb-60',
                    'flex flex-col items-center text-center',
                    'gap-3 sm:gap-4 md:gap-5 lg:gap-7',
                ].join(' ')}
            >

                {/* Badge de estado */}
                <div ref={badgeRef}>
                    <span
                        className={`badge badge-md font-black tracking-widest text-[10px] sm:text-xs uppercase ${statusColor[jam.status] ?? 'badge-neutral'}`}
                    >
                        {statusLabel[jam.status] ?? jam.status.toUpperCase()}
                    </span>
                </div>

                {/* Logo */}
                <div ref={logoRef} className="flex flex-col items-center w-full">
                    {jam.logo ? (
                        <img
                            src={jam.logo}
                            alt={`Logo de ${jam.shortName ?? jam.name}`}
                            className="w-auto object-contain drop-shadow-2xl h-20 sm:h-32 md:h-44 lg:h-56 xl:h-64 max-h-[18svh]"
                        />
                    ) : (
                        <div
                            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-2xl border border-white/10"
                            style={{
                                background: `linear-gradient(90deg, ${accent}33 0%, ${accent}11 100%)`,
                                boxShadow: `0 0 40px ${accent}44`,
                            }}
                            aria-hidden="true"
                        >
                            🎮
                        </div>
                    )}
                </div>

                {/* Título */}
                <h1
                    ref={titleRef}
                    className="font-black leading-none tracking-tight text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                    style={{ textShadow: `0 20px 200px ${accent}30` }}
                >
                    {jam.name}
                </h1>

                {/* Tagline */}
                {jam.tagline && (
                    <p
                        ref={subRef}
                        className="font-medium text-white/70 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl"
                    >
                        {jam.tagline}
                    </p>
                )}

                {/* Countdown + CTA */}
                <div ref={ctaRef} className="flex flex-col items-center gap-2 sm:gap-3 w-full">
                    {jam.startDate ? (
                        <JamCountdown targetDate={jam.startDate} label="para el inicio" />
                    ) : (
                        <div className="flex flex-col items-center gap-1">
                            <span
                                className="text-2xl sm:text-3xl font-black tracking-[0.3em] uppercase"
                                style={{ color: accent }}
                            >
                                TBA
                            </span>
                            <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest">
                                Fechas por confirmar
                            </span>
                        </div>
                    )}

                    {/* Rango de fechas */}
                    {jam.startDate && jam.endDate && (
                        <div className="flex items-center gap-2 text-white/40">
                            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest">
                                {jam.startDate.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })}
                                {' — '}
                                {jam.endDate.toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    )}

                    {/* Botón CTA */}
                    {jam.submissionUrl ? (
                        <a
                            href={jam.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm sm:btn-md lg:btn-lg font-black text-white border-0 shadow-2xl mt-1"
                            style={{ backgroundColor: accent }}
                            aria-label={`Participar en ${jam.name} en ${jam.platform ?? 'Itch.io'} (abre en nueva pestaña)`}
                        >
                            Participar en {jam.platform ?? 'Itch.io'}
                        </a>
                    ) : (
                        <button
                            disabled
                            className="btn btn-sm sm:btn-md lg:btn-lg btn-disabled font-black mt-1"
                            aria-label="Inscripciones próximamente"
                        >
                            Próximamente en {jam.platform ?? 'Itch.io'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default JamHero;
