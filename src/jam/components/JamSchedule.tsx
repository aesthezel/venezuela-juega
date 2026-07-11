import { h } from 'preact';
import type { JamEvent } from '../types';

interface JamScheduleProps {
    jam: JamEvent;
}

const JamSchedule = ({ jam }: JamScheduleProps) => {
    if (!jam.phases.length) return null;

    const formatDate = (d: string | null | undefined) => {
        if (!d) return 'TBA';
        return new Date(d).toLocaleDateString('es-VE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <section className="py-20 px-6 bg-base-100">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-black text-center text-white mb-4 uppercase tracking-tight">
                    Cronograma
                </h2>
                <p className="text-base-content/50 text-center text-sm uppercase tracking-widest mb-14">
                    Fases del evento
                </p>

                <ul className="timeline timeline-vertical">
                    {jam.phases.map((phase, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                            <li key={phase.label}>
                                {i > 0 && <hr className="bg-secondary/30" />}
                                {isLeft ? (
                                    <>
                                        <div className="timeline-start timeline-box bg-base-200 border border-base-300 shadow-lg max-w-xs">
                                            <div className="font-black text-white text-sm">{phase.label}</div>
                                            {phase.description && (
                                                <p className="text-base-content/60 text-xs mt-1">{phase.description}</p>
                                            )}
                                            <div className="text-secondary text-xs font-bold mt-2">
                                                {formatDate(phase.startDate)}
                                                {phase.endDate && phase.endDate !== phase.startDate
                                                    ? ` → ${formatDate(phase.endDate)}`
                                                    : ''}
                                            </div>
                                        </div>
                                        <div className="timeline-middle">
                                            <span className="text-xl">{phase.icon ?? '●'}</span>
                                        </div>
                                        <hr className="bg-secondary/30" />
                                    </>
                                ) : (
                                    <>
                                        <hr className="bg-secondary/30" />
                                        <div className="timeline-middle">
                                            <span className="text-xl">{phase.icon ?? '●'}</span>
                                        </div>
                                        <div className="timeline-end timeline-box bg-base-200 border border-base-300 shadow-lg max-w-xs">
                                            <div className="font-black text-white text-sm">{phase.label}</div>
                                            {phase.description && (
                                                <p className="text-base-content/60 text-xs mt-1">{phase.description}</p>
                                            )}
                                            <div className="text-secondary text-xs font-bold mt-2">
                                                {formatDate(phase.startDate)}
                                                {phase.endDate && phase.endDate !== phase.startDate
                                                    ? ` → ${formatDate(phase.endDate)}`
                                                    : ''}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};

export default JamSchedule;
