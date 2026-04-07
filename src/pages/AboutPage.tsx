import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { BackButton, ContributorCard } from "@/src/components";
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
            { icon: faLinkedin, url: "https://linkedin.com/in/aesthezel" },
            { icon: faTwitter, url: "https://x.com/aesthezel" },
            { icon: faInstagram, url: "https://instagram.com/aes.thezel" }
        ]
    }
];

const Card = ({ children, className = "" }: { children: preact.ComponentChildren, className?: string }) => (
    <div className={`bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const AboutPage = ({ onNavigateToCatalog }: AboutPageProps) => {
    return (
        <main className="container mx-auto px-4 py-8 text-gray-300">
            <BackButton onClick={onNavigateToCatalog} className="mb-6" />

            {/* Page header */}
            <header className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3">
                            Sobre
                            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent"> Venezuela Juega</span>
                        </h1>
                        <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
                            Conoce la iniciativa, los colaboradores y el propósito detrás de la base de datos de videojuegos venezolanos más completa.
                        </p>
                    </div>
                </div>
            </header>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-orange-500/20 via-slate-700/30 to-transparent mb-12" />

            <div className="space-y-12">

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl md:text-3xl font-black text-white">
                            Iniciativa
                        </h2>
                    </div>
                    <Card>
                        <p className="mb-4 text-lg leading-relaxed">
                            Venezuela Juega es una iniciativa comunitaria sin fines de lucro dedicada a la documentación y visibilización de la industria de desarrollo de videojuegos en Venezuela. Nuestro objetivo es crear una base de datos centralizada, abierta y accesible que sirva como referencia histórica y punto de encuentro para desarrolladores, estudiantes, periodistas y entusiastas.
                        </p>
                        <p className="text-lg leading-relaxed">
                            El proyecto nació en 2020 de la necesidad de unificar la información dispersa sobre los juegos creados por talento venezolano, celebrando nuestros logros y fomentando el crecimiento de la industria local.
                        </p>
                    </Card>
                </section>

                {/* Section Divider */}
                <div className="h-px bg-slate-800/50 w-full" />

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl md:text-3xl font-black text-white">
                            Colaboradores
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {CONTRIBUTORS.map((person, idx) => (
                            <ContributorCard key={idx} person={person} />
                        ))}
                    </div>
                </section>

                {/* Section Divider */}
                <div className="h-px bg-slate-800/50 w-full" />

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl md:text-3xl font-black text-white">
                            Patrocinadores
                        </h2>
                    </div>
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

            <style>{`
                @keyframes about-fade-in {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                main { animation: about-fade-in 0.4s ease-out forwards; }
            `}</style>
        </main>
    );
};

export default AboutPage;