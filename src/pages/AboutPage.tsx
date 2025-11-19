import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { BackButton } from "@/src/components";
import { AboutPageProps } from "@/src/types";

// Definimos los datos fuera para mantener el componente limpio
const CONTRIBUTORS = [
    {
        name: "César Márquez",
        role: "Contribuidor y diseñador",
        description: "Colaborador de la iniciativa, encargado de asesorías y aplicación de mejoras para optimizar el diseño gráfico del proyecto.",
        socials: [
            { icon: faYoutube, url: "https://youtube.com/@cesar.marquez" },
            { icon: faInstagram, url: "https://instagram.com/cesmarquezl" }
        ]
    },
    {
        name: "David Pino",
        role: "Mantenedor principal y desarrollador",
        description: "Creador de esta iniciativa, encargado de la recolección de datos y el desarrollo de la plataforma.",
        socials: [
            { icon: faGithub, url: "https://github.com/aesthezel" },
            { icon: faTwitter, url: "https://x.com/aesthezel" }
        ]
    }
];

const Card = ({ children, className = "" }: { children: preact.ComponentChildren, className?: string }) => (
    <div className={`bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 hover:border-slate-600 transition-all ${className}`}>
        {children}
    </div>
);

const AboutPage = ({ onNavigateToCatalog }: AboutPageProps) => {
    return (
        <main className="container mx-auto px-4 py-8 animate-fade-in text-gray-300">
            <BackButton onClick={onNavigateToCatalog} className="mb-8" />

            <div className="space-y-16">

                <section>
                    <h2 className="text-3xl font-bold text-white mb-6 pl-4">
                        Sobre la lista de videojuegos
                    </h2>
                    <Card>
                        <p className="mb-4 text-lg leading-relaxed">
                            Venezuela Juega es una iniciativa comunitaria sin fines de lucro dedicada a la documentación y visibilización de la industria de desarrollo de videojuegos en Venezuela. Nuestro objetivo es crear una base de datos centralizada, abierta y accesible que sirva como referencia histórica y punto de encuentro para desarrolladores, estudiantes, periodistas y entusiastas.
                        </p>
                        <p className="text-lg leading-relaxed">
                            El proyecto nació en 2020 de la necesidad de unificar la información dispersa sobre los juegos creados por talento venezolano, celebrando nuestros logros y fomentando el crecimiento de la industria local.
                        </p>
                    </Card>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-white mb-6 pl-4">
                        Colaboradores
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {CONTRIBUTORS.map((person, idx) => (
                            <Card key={idx} className="h-full flex flex-col justify-between hover:-translate-y-1 duration-300">
                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xl font-bold text-white shadow-inner">
                                            {person.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{person.name}</h3>
                                            <p className="text-cyan-400 text-sm font-medium">{person.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-300 mb-6 leading-relaxed">
                                        {person.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-700 flex gap-4">
                                    {person.socials.map((social, sIdx) => (
                                        <a
                                            key={sIdx}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-400 hover:text-white hover:scale-110 transition-all"
                                            aria-label={`Link a ${social.url}`}
                                        >
                                            <FontAwesomeIcon icon={social.icon} size="lg" />
                                        </a>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-white mb-6 pl-4">
                        Patrocinadores
                    </h2>
                    <Card>
                        <p className="text-sm text-gray-400 mb-4">Gracias a quienes apoyan este proyecto:</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="bg-slate-700/50 border border-slate-600 p-4 rounded-lg text-center min-w-[100px]">
                                <span className="text-gray-400 font-mono text-xs">Próximamente</span>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>

            <style>
                {`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}
            </style>
        </main>
    );
};

export default AboutPage;