import { h } from 'preact';
import type { JamEvent } from '../types';

interface JamDonationProps {
    jam: JamEvent;
}

const JamDonation = ({ jam }: JamDonationProps) => {
    return (
        <section className="py-20 px-6 bg-base-200">
            <div className="max-w-4xl mx-auto">
                <div className="card lg:card-side bg-base-100 shadow-xl border border-secondary/20">
                    <figure className="lg:w-1/3 overflow-hidden">
                        <img src="https://venezuela-juega.s3.us-east-005.dream.io/globalgamejam/juntos/donation-image.jpg" alt="Donación Venezuela Juega" className="w-full h-full object-cover" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title text-3xl font-black text-secondary">
                            Evento benéfico
                        </h2>
                        <p className="text-base-content/80 text-lg my-4 leading-relaxed">
                            Esta jam no tiene premios competitivos. Nuestro único objetivo es recaudar fondos y ayudar a las víctimas de la crisis.
                            Cada juego publicado y cada aporte cuenta. Puedes donar directamente a las organizaciones verificadas.
                        </p>

                        {jam.donationGoal && (
                            <div className="w-full mb-4">
                                <div className="flex justify-between text-sm font-bold mb-1">
                                    <span>Meta de recaudación</span>
                                    <span className="text-secondary">{jam.donationGoal}</span>
                                </div>
                                <progress className="progress progress-secondary w-full" value="0" max="100"></progress>
                            </div>
                        )}

                        <div className="card-actions justify-end mt-4">
                            {jam.donationUrl ? (
                                <a href={jam.donationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary font-black">
                                    ❤️ Dona ahora
                                </a>
                            ) : (
                                <button className="btn btn-secondary btn-outline font-black cursor-not-allowed">
                                    Enlace de donación próximamente
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JamDonation;
