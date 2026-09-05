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
            </div>
        </section>
    );
};

export default JamAbout;
