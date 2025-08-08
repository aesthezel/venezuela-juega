import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { BackButton } from "@/src/components";
import { AboutPageProps } from "@/src/types";

const Card = ({ children }: { children: preact.ComponentChildren }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">{children}</div>
);

const AboutPage = ({ onNavigateToCatalog }: AboutPageProps) => {
    return (
        <main className="container mx-auto px-4 py-8 animate-fade-in text-gray-300">
            <BackButton onClick={onNavigateToCatalog} className="mb-8" />

            <div className="space-y-12">
                <section>
                    <h2 className="text-3xl font-bold text-cyan-400 mb-4 pl-4">Sobre la lista de videojuegos</h2>
                    <Card>
                        <p className="mb-4">
                            Venezuela Juega es una iniciativa comunitaria sin fines de lucro dedicada a la documentación y visibilización de la industria de desarrollo de videojuegos en Venezuela. Nuestro objetivo es crear una base de datos centralizada, abierta y accesible que sirva como referencia histórica y punto de encuentro para desarrolladores, estudiantes, periodistas y entusiastas.
                        </p>
                        <p>
                            El proyecto nació en 2020 de la necesidad de unificar la información dispersa sobre los juegos creados por talento venezolano, celebrando nuestros logros y fomentando el crecimiento de la industria local.
                        </p>
                    </Card>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-cyan-400 mb-4 pl-4">Colaboradores</h2>
                    <Card>
                        <div className="flex items-center space-x-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">David Pino</h3>
                                <p className="text-cyan-500">Mantenedor principal y desarrollador</p>
                                <p className="mt-2">
                                   Creador de esta iniciativa, encargado de la recolección de datos, el desarrollo de la plataforma.
                                </p>
                                <div className="flex space-x-4 mt-3">
                                    <a href="https://github.com/aesthezel" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                        <FontAwesomeIcon icon={faGithub} size="lg" />
                                    </a>
                                    <a href="https://x.com/aesthezel" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                        <FontAwesomeIcon icon={faTwitter} size="lg" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* TODO: Añadir la parte de contribución correctamente
                <section>
                    <h2 className="text-3xl font-bold text-cyan-400 mb-4 pl-4">Contacto y Colaboraciones</h2>
                    <Card>
                        <p>
                            ¿Quieres añadir tu juego, sugerir una corrección o colaborar con el proyecto? ¡Nos encantaría saber de ti! Puedes contactarnos a través de:
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            <li>Correo Electrónico: <a href="mailto:davidpino@quesillostudios.com" className="text-cyan-400 hover:underline">davidpino@quesillostudios.com</a></li>
                            <li>Formulario de Contribución: <a href="#" className="text-cyan-400 hover:underline">Añade tu juego aquí</a></li>
                        </ul>
                    </Card>
                </section>
                */}

                <section>
                    <h2 className="text-3xl font-bold text-cyan-400 mb-4 pl-4">Patrocinadores</h2>
                    <Card>
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="bg-slate-700 p-4 rounded-lg text-center">
                                <span className="text-gray-400">*</span>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>
            <style>
                {`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}
            </style>
        </main>
    );
};

export default AboutPage;