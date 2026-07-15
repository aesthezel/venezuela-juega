import { h } from 'preact';
import type { JamEvent } from '../types';
import { renderRichText } from '../renderRichText';

interface JamFAQProps {
    jam: JamEvent;
}

const JamFAQ = ({ jam }: JamFAQProps) => {
    if (!jam.faqs.length) return null;

    return (
        <section className="py-20 px-6 bg-base-200">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-black text-center text-white mb-4 uppercase tracking-tight">
                    Preguntas frecuentes
                </h2>
                <p className="text-base-content/50 text-center text-sm uppercase tracking-widest mb-14">
                    Todo lo que necesitas saber
                </p>

                <div className="flex flex-col gap-3">
                    {jam.faqs.map((faq, i) => (
                        <div key={i} className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-2xl shadow">
                            <input type="radio" name="faq-accordion" defaultChecked={i === 0} />
                            <div className="collapse-title font-black text-white text-sm pr-10">
                                {faq.question}
                            </div>
                            <div className="collapse-content">
                                <p className="text-base-content/70 text-sm leading-relaxed pt-2">
                                    {renderRichText(faq.answer)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default JamFAQ;
