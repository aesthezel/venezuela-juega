import { h } from 'preact';
import type { JamEvent } from '../types';
import { renderRichText } from '../renderRichText';

interface JamScheduleProps {
    jam: JamEvent;
}

const JamSchedule = ({ jam }: JamScheduleProps) => {
    if (!jam.phases.length) return null;

    const formatDate = (d: Date | null | undefined) => {
        if (!d) return 'TBA';
        return d.toLocaleDateString('es-VE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <section className="py-24 px-6 bg-base-100">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl sm:text-4xl font-black text-center text-white mb-4 uppercase tracking-tight">
                        CRONOGRAMA
                    </h2>
                </div>

                <div className="relative">
                    {/* Línea vertical central simple */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-base-300 -translate-x-1/2 hidden md:block" />

                    <div className="flex flex-col gap-12 sm:gap-16">
                        {jam.phases.map((phase, i) => {
                            const isEven = i % 2 === 0;

                            return (
                                <div key={phase.label} className={`flex flex-col md:flex-row items-center justify-between w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Espacio vacío en desktop */}
                                    <div className="hidden md:block md:w-5/12" />

                                    {/* Icono central minimalista */}
                                    <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-base-200 border-4 border-base-100 shrink-0 mb-6 md:mb-0">
                                        <span className="text-2xl">{phase.icon ?? '🎯'}</span>
                                    </div>

                                    {/* Tarjeta de contenido limpia */}
                                    <div className="w-full md:w-5/12">
                                        <div className={`p-8 rounded-3xl bg-base-200/50 border border-base-300 ${isEven ? 'md:text-right' : 'md:text-left'} text-center`}>
                                            <div className="text-base-content/50 font-mono text-sm tracking-wider mb-4">
                                                {formatDate(phase.startDate)}
                                                {phase.endDate && phase.endDate !== phase.startDate && (
                                                    <span> — {formatDate(phase.endDate)}</span>
                                                )}
                                            </div>
                                            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
                                                {phase.label}
                                            </h3>
                                            {phase.description && (
                                                <p className="text-base-content/70 leading-relaxed sm:text-lg">
                                                    {renderRichText(phase.description)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JamSchedule;
