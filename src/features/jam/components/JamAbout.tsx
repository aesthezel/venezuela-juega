import { h } from 'preact';
import type { JamEvent } from '../types';
import { renderRichText } from '../renderRichText';

interface JamAboutProps {
    jam: JamEvent;
}

const JamAbout = ({ jam }: JamAboutProps) => {
    return (
        <section className="py-20 px-6 bg-base-100">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-black text-center text-white mb-4 uppercase tracking-tight">
                    ¿Por qué esta jam?
                </h2>
                <p className="text-base-content/50 text-center text-sm uppercase tracking-widest mb-14">
                    Jugamos para ayudar
                </p>

                {/* Objectives */}
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mb-16">
                    {jam.objectives.map((obj) => (
                        <div key={obj.title} className="card bg-base-200 border border-base-300 shadow-xl">
                            <div className="card-body gap-4">
                                {obj.icon && (
                                    <span className="text-5xl">{obj.icon}</span>
                                )}
                                <h3 className="card-title text-white font-black text-xl">
                                    {obj.title}
                                </h3>
                                <p className="text-base-content/70 leading-relaxed">
                                    {renderRichText(obj.description)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sponsors */}
                {jam.sponsors.length > 0 && (
                    <div className="flex flex-col items-center gap-6">
                        <h3 className="text-xs uppercase tracking-widest text-base-content/40 font-bold">
                            Sponsors y aliados
                        </h3>
                        <div className="flex flex-wrap items-center justify-center gap-8">
                            {jam.sponsors.map((s) =>
                                s.url ? (
                                    <a
                                        key={s.name}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="opacity-60 hover:opacity-100 transition-opacity"
                                        aria-label={`Visitar sitio de ${s.name}`}
                                    >
                                        <img
                                            src={s.logo}
                                            alt={s.name}
                                            className="h-12 w-auto object-contain"
                                        />
                                    </a>
                                ) : (
                                    <span
                                        key={s.name}
                                        className="opacity-60"
                                    >
                                        <img
                                            src={s.logo}
                                            alt={s.name}
                                            className="h-12 w-auto object-contain filter brightness-0 invert"
                                        />
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default JamAbout;
