import { h } from 'preact';
import type { JamEvent } from '../types';

interface JamCTAProps {
    jam: JamEvent;
}

const JamCTA = ({ jam }: JamCTAProps) => {
    return (
        <section
            className="relative py-28 px-6 overflow-hidden"
            style={{
                background: `linear-gradient(135deg, #1a0a0d 0%, #0d0a11 50%, #0a0d1a 100%)`,
            }}
        >
            {/* Glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${jam.accentColor ?? '#e34262'}1a 0%, transparent 70%)`,
                }}
            />

            <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
                <span className="text-6xl">😊</span>
                <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                    Tu donación puede cambiar<br />
                    <span style={{ color: jam.accentColor ?? '#e34262' }}>una vida real</span>
                </h2>
                <p className="text-base-content/60 text-lg max-w-xl leading-relaxed">
                    Venezuela necesita ayuda. Los desarrolladores de videojuegos tienen el poder
                    de unir a comunidades y recaudar fondos de forma creativa. Únete a la {jam.shortName ?? "Jam benéfica"} y demuestra que los juegos pueden cambiar vidas.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    {jam.submissionUrl ? (
                        <a
                            id="jam-register-cta"
                            href={jam.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-lg font-black border-0 shadow-2xl"
                            style={{ 
                                backgroundColor: jam.accentColor ?? '#e34262',
                                color: jam.accentTextColor ?? '#ffffff' 
                            }}
                            aria-label={`Participar en ${jam.name} en ${jam.platform ?? 'Itch.io'}`}
                        >
                            🎮 Participar ahora
                        </a>
                    ) : (
                        <button disabled className="btn btn-lg btn-disabled font-black" aria-label="Inscripciones próximamente">
                            🕐 Próximamente
                        </button>
                    )}
                    <a
                        href="/"
                        className="btn btn-lg btn-ghost border border-base-content/20 font-bold text-base-content/70"
                    >
                        Ver catálogo de juegos
                    </a>
                </div>
            </div>
        </section>
    );
};

export default JamCTA;
