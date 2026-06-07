import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { BackButton, ContributorCard, PageTransition } from "@/components";
import { AboutPageProps } from "@/types";

// Definimos los datos fuera para mantener el componente limpio
const CONTRIBUTORS = [
    {
        name: "Raúl Díaz",
        role: "Desarrollador web y base de datos",
        description: "Enriquecedor de la base de datos, creación de nuevos módulos y sistemas relacionados con la plataforma.",
        avatarUrl: "https://venezuela-juega.s3.us-east-005.dream.io/collaborators/raul-diaz.jpg",
        socials: [
            { icon: faGithub, url: "https://github.com/Raukdv" },
            { icon: faLinkedin, url: "https://linkedin.com/in/raul-e-diaz-valladares-devback" },
            { icon: faInstagram, url: "https://www.instagram.com/rauksan" }
        ]
    },
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
    <div className={`card bg-base-200 shadow-xl border border-surface-700 ${className}`}>
        <div className="card-body">
            {children}
        </div>
    </div>
);

const AboutPage = ({ onNavigateToCatalog }: AboutPageProps) => {
    return (
        <PageTransition>
            <main className="container mx-auto px-4 py-8 text-base-content/70">
                <BackButton onClick={onNavigateToCatalog} className="mb-6" />

                {/* Page header */}
                <header className="mb-10">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-base-content leading-tight mb-3">
                                Sobre
                                <span className="text-primary"> Venezuela Juega</span>
                            </h1>
                            <p className="text-base-content/70 text-base md:text-lg max-w-2xl leading-relaxed">
                                Conoce la iniciativa, los colaboradores y el propósito detrás de la base de datos de videojuegos venezolanos más completa.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Divider */}
                <div className="divider mb-12"></div>

                <div className="space-y-12">

                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-2xl md:text-3xl font-black text-base-content">
                                Iniciativa
                            </h2>
                        </div>
                        <Card>
                            <p className="mb-4 text-lg leading-relaxed">
                                Venezuela Juega es una iniciativa comunitaria sin fines de lucro dedicada a la documentación y visibilización de la industria de desarrollo de videojuegos en Venezuela. Nuestro objetivo es crear una base de datos centralizada, abierta y accesible que sirva como referencia histórica y punto de encuentro para desarrolladores, estudiantes, periodistas y entusiastas.
                            </p>
                            <p className="text-lg leading-relaxed">
                                El proyecto nació en el año 2020 a raíz de la necesidad de unificar la información dispersa sobre los juegos creados por talento venezolano, celebrando nuestros logros y fomentando el crecimiento de la industria local.
                            </p>
                        </Card>
                    </section>

                    {/* Section Divider */}
                    <div className="divider"></div>

                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-2xl md:text-3xl font-black text-base-content">
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
                    <div className="divider"></div>

                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-2xl md:text-3xl font-black text-base-content">
                                Patrocinadores
                            </h2>
                        </div>
                        <Card>
                            <p className="text-sm text-base-content/70 mb-4">Gracias a quienes apoyan este proyecto:</p>
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="badge badge-outline badge-lg p-4 h-auto min-w-[100px]">
                                    <span className="text-base-content/70 font-mono text-xs">Próximamente</span>
                                </div>
                            </div>
                        </Card>
                    </section>
                </div>
            </main>
        </PageTransition>
    );
};

export default AboutPage;