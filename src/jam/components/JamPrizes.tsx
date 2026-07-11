import { h } from 'preact';
import type { JamEvent } from '../types';

interface JamPrizesProps {
    jam: JamEvent;
}

const JamPrizes = ({ jam }: JamPrizesProps) => {
    if (!jam.prizes.length) return null;

    return (
        <section className="py-20 px-6 bg-base-200">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-black text-center text-white mb-4 uppercase tracking-tight">
                    Categorías de premios
                </h2>
                <p className="text-base-content/50 text-center text-sm uppercase tracking-widest mb-14">
                    Reconocemos la excelencia en cada área
                </p>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {jam.prizes.map((prize, i) => (
                        <div
                            key={prize.category}
                            className={`card bg-base-100 border border-base-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
                        >
                            <div className="card-body items-center text-center gap-3">
                                <span className="text-5xl">{prize.emoji}</span>
                                <h3 className={`card-title text-${prize.color ?? 'secondary'} font-black text-lg`}>
                                    {prize.category}
                                </h3>
                                {prize.description && (
                                    <p className="text-base-content/60 text-sm leading-relaxed">
                                        {prize.description}
                                    </p>
                                )}
                                <div className={`badge badge-${prize.color ?? 'secondary'} badge-outline text-xs font-bold mt-2`}>
                                    #{String(i + 1).padStart(2, '0')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default JamPrizes;
