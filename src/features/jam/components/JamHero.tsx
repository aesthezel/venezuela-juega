import { h } from 'preact';
import type { CSSProperties } from 'preact';
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
    const scrollRef = useRef<HTMLButtonElement>(null);
    const registerBtnRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from(badgeRef.current, { y: -20, opacity: 0, duration: 0.5 })
                .from(logoRef.current, { scale: 0.85, opacity: 0, duration: 0.7 }, '-=0.2')
                .from(titleRef.current, { y: 40, opacity: 0, duration: 0.7 }, '-=0.4')
                .from(subRef.current, { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
                .from(ctaRef.current, { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
                .from(scrollRef.current, { opacity: 0, duration: 0.6, delay: 0.4 });
        }, heroRef);

        const now = new Date();
        const registrationOpen =
            Boolean(jam.registrationUrl) &&
            (!jam.registrationOpenDate || now >= jam.registrationOpenDate) &&
            (!jam.registrationCloseDate || now <= jam.registrationCloseDate);

        const btn = registerBtnRef.current;
        let pulse: gsap.core.Tween | undefined;
        const hoverHandlers: Array<[string, EventListener]> = [];

        if (btn && registrationOpen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const accent = jam.accentColor ?? '#e34262';
            pulse = gsap.to(btn, {
                scale: 1.04,
                boxShadow: `0 0 22px ${accent}99, 0 0 44px ${accent}44`,
                duration: 1.1,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
            });
            const onEnter = () => pulse?.pause();
            const onLeave = () => pulse?.resume();
            hoverHandlers.push(['mouseenter', onEnter], ['mouseleave', onLeave]);
            hoverHandlers.forEach(([event, handler]) => btn.addEventListener(event, handler));
        }

        return () => {
            ctx.revert();
            hoverHandlers.forEach(([event, handler]) => btn?.removeEventListener(event, handler));
        };
    }, [jam]);

    const scrollToNextSection = () => {
        const next = heroRef.current?.nextElementSibling;
        if (next) {
            next.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }
    };

    const gradient = jam.heroGradient ?? 'from-[#1a0a0d] via-[#0d0a11] to-[#0a0d1a]';
    const accent = jam.accentColor ?? '#e34262';
    const accentText = jam.accentTextColor ?? '#ffffff';

    // --- Registration window logic ---
    const now = new Date();
    const afterOpen = !jam.registrationOpenDate || now >= jam.registrationOpenDate;
    const beforeClose = !jam.registrationCloseDate || now <= jam.registrationCloseDate;
    const isRegistrationOpen = Boolean(jam.registrationUrl) && afterOpen && beforeClose;

    // Hint text shown when the window is closed
    const registrationHint = jam.registrationUrl
        ? !afterOpen
            ? `Inscripciones desde el ${jam.registrationOpenDate!.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })}`
            : !beforeClose
                ? 'Inscripciones cerradas'
                : null
        : null;

    const heroStyle: CSSProperties = jam.heroImage
        ? {
            backgroundImage: `url(${jam.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
        : {};

    const heroBase = 'relative w-full min-h-[90svh] flex flex-col justify-center items-center overflow-hidden';
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
                    {jam.status === 'upcoming' && (
                        jam.startDate ? (
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
                        )
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

                    {/* Botón de Inscripción (opcional) */}
                    {jam.registrationUrl && (
                        isRegistrationOpen ? (
                            <a
                                ref={registerBtnRef}
                                href={jam.registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm sm:btn-md lg:btn-lg font-black shadow-2xl mt-1 border-2"
                                style={{
                                    backgroundColor: accent,
                                    color: accentText,
                                    borderColor: accent,
                                }}
                                aria-label={`Inscribirse en ${jam.name} (abre en nueva pestaña)`}
                            >
                                {jam.registrationLabel ?? 'Inscribirse'}
                            </a>
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    disabled
                                    className="btn btn-sm sm:btn-md lg:btn-lg btn-disabled font-black mt-1 border-2"
                                    aria-label={registrationHint ?? 'Inscripciones no disponibles'}
                                >
                                    {jam.registrationLabel ?? 'Inscribirse'}
                                </button>
                                {registrationHint && (
                                    <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">
                                        {registrationHint}
                                    </span>
                                )}
                            </div>
                        )
                    )}

                    {/* Botón de participación / plataforma */}
                    {jam.submissionUrl ? (
                        <a
                            href={jam.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={[
                                'btn btn-sm sm:btn-md lg:btn-lg font-black border-2 shadow-lg mt-1',
                                isRegistrationOpen ? 'btn-ghost border-white/20 text-white/70 hover:border-white/40' : 'border-0 shadow-2xl',
                            ].join(' ')}
                            style={isRegistrationOpen ? {} : { backgroundColor: accent, color: accentText }}
                            aria-label={`Participar en ${jam.name} en ${jam.platform ?? 'Itch.io'} (abre en nueva pestaña)`}
                        >
                            Participar en {jam.platform ?? 'Itch.io'}
                        </a>
                    ) : (
                        !isRegistrationOpen && !jam.registrationUrl && (
                            <button
                                disabled
                                className="btn btn-sm sm:btn-md lg:btn-lg btn-disabled font-black mt-1"
                                aria-label="Inscripciones próximamente"
                            >
                                Próximamente en {jam.platform ?? 'Itch.io'}
                            </button>
                        )
                    )}
                </div>

            </div>

            {/* ── Scroll CTA ───────────────────────────── */}
            <button
                ref={scrollRef}
                type="button"
                onClick={scrollToNextSection}
                className={[
                    'absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-10',
                    'flex flex-col items-center gap-1.5 cursor-pointer',
                    'text-white/60 hover:text-white transition-colors duration-300',
                    'group outline-none',
                ].join(' ')}
                aria-label="Bajar para ver más contenido"
            >
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                    Descubre más
                </span>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 animate-bounce group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
        </div>
    );
};

export default JamHero;
