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
            tl.from(badgeRef.current, { y: -30, opacity: 0, duration: 0.6 })
                .from(logoRef.current, { scale: 0.8, opacity: 0, duration: 0.8 }, '-=0.3')
                .from(titleRef.current, { y: 60, opacity: 0, duration: 0.9 }, '-=0.5')
                .from(subRef.current, { y: 40, opacity: 0, duration: 0.7 }, '-=0.5')
                .from(ctaRef.current, { y: 30, opacity: 0, duration: 0.6 }, '-=0.4');
        }, heroRef);
        return () => ctx.revert();
    }, []);

    const gradient = jam.heroGradient ?? 'from-[#1a0a0d] via-[#0d0a11] to-[#0a0d1a]';
    const accent = jam.accentColor ?? '#e34262';

    const heroStyle = jam.heroImage
        ? { backgroundImage: `url(${jam.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : undefined;

    const heroClass = jam.heroImage
        ? 'relative min-h-[100svh] flex flex-col justify-center items-center overflow-hidden'
        : `relative min-h-[100svh] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br ${gradient}`;

    return (
        <div ref={heroRef} className={heroClass} style={heroStyle}>

            {jam.heroImage ? (
                <div
                    className="absolute inset-0 z-0"
                    style={{ backgroundColor: 'rgba(10,5,15,0.72)' }}
                />
            ) : (
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        background: `radial-gradient(ellipse 70% 50% at 50% 40%, ${accent}22 0%, transparent 70%)`,
                    }}
                />
            )}

            <div className="absolute inset-0 pointer-events-none z-0">
                {Array.from({ length: 24 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/5"
                        style={{
                            width: `${(i * 7 % 6) + 2}px`,
                            height: `${(i * 7 % 6) + 2}px`,
                            top: `${(i * 13 % 100)}%`,
                            left: `${(i * 17 % 100)}%`,
                        }}
                    />
                ))}
            </div>

            <div className="text-center relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center gap-4 -mt-30 md:-mt-60 pt-20">

                <div ref={badgeRef}>
                    <span className={`badge badge-md font-black tracking-widest text-xs uppercase ${statusColor[jam.status] ?? 'badge-neutral'}`}>
                        {statusLabel[jam.status] ?? jam.status.toUpperCase()}
                    </span>
                </div>

                <div ref={logoRef} className="flex flex-col items-center gap-3">
                    {jam.logo ? (
                        <img
                            src={jam.logo}
                            alt={`Logo de ${jam.shortName ?? jam.name}`}
                            className="h-16 sm:h-24 w-auto object-contain drop-shadow-2xl"
                        />
                    ) : (
                        <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-2xl border border-white/10"
                            style={{
                                background: `linear-gradient(135deg, ${accent}33 0%, ${accent}11 100%)`,
                                boxShadow: `0 0 40px ${accent}44`,
                            }}
                            aria-hidden="true"
                        >
                            🎮
                        </div>
                    )}

                </div>

                <h1
                    ref={titleRef}
                    className="text-4xl sm:text-5xl lg:text-7xl font-black leading-none tracking-tight text-white mt-2"
                    style={{ textShadow: `0 0 80px ${accent}66` }}
                >
                    {jam.name}
                </h1>

                {/* Tagline */}
                {jam.tagline && (
                    <p
                        ref={subRef}
                        className="text-lg sm:text-xl text-base-content/70 font-medium max-w-2xl"
                    >
                        {jam.tagline}
                    </p>
                )}

                {/* Countdown o TBA + CTA */}
                <div ref={ctaRef} className="flex flex-col items-center gap-5 mt-2">
                    {jam.startDate ? (
                        <JamCountdown targetDate={jam.startDate} label="para el inicio" />
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <span
                                className="text-3xl font-black tracking-[0.3em] uppercase"
                                style={{ color: accent }}
                            >
                                TBA
                            </span>
                            <span className="text-xs text-base-content/50 uppercase tracking-widest">Fechas por confirmar</span>
                        </div>
                    )}

                    {/* Fecha del evento (si hay startDate y endDate) */}
                    {jam.startDate && jam.endDate && (
                        <div className="flex items-center gap-2 text-base-content/50">
                            <span className="text-xs font-medium uppercase tracking-widest">
                                {jam.startDate.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })}
                                {' — '}
                                {jam.endDate.toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    )}

                    {jam.submissionUrl ? (
                        <a
                            href={jam.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-lg font-black text-white border-0 shadow-2xl mt-2"
                            style={{ backgroundColor: accent }}
                            aria-label={`Participar en ${jam.name} en ${jam.platform ?? 'Itch.io'} (abre en nueva pestaña)`}
                        >
                            Participar en {jam.platform ?? 'Itch.io'}
                        </a>
                    ) : (
                        <button
                            disabled
                            className="btn btn-lg btn-disabled font-black mt-2"
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
