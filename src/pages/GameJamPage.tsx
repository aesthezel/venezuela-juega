import { h } from 'preact';
import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { ExternalLinkIcon } from '@/src/components/icons';

interface Talk {
    title: string;
    url: string;
    videoId: string;
}

const GameJamPage: FunctionalComponent = () => {
    const [showMore, setShowMore] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<Talk | null>(null);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isExpired, setIsExpired] = useState(false);

    const signUpLink = 'https://docs.google.com/forms/d/e/1FAIpQLSeQ74krSdM8n_tQkwCNMO_KndDiLkpVBCWOIrTDiFoNjfMH_w/viewform?usp=dialog';

    const talks: Talk[] = [
        {
            title: "Pitcheando videojuegos en la PostCrisis",
            url: "https://www.youtube.com/live/0s9cVVPmtJo",
            videoId: "0s9cVVPmtJo"
        },
        {
            title: "Creando videojuegos con narrativa cultural",
            url: "https://www.youtube.com/live/495jluK7678",
            videoId: "495jluK7678"
        },
        {
            title: "Publicando después del GameJam+",
            url: "https://www.youtube.com/live/bReeMnp9xRk",
            videoId: "bReeMnp9xRk"
        },
        {
            title: "Encuentra tu audiencia | Panel con creadores de contenido",
            url: "https://www.youtube.com/live/4oVKFd2WdoQ",
            videoId: "4oVKFd2WdoQ"
        },
        {
            title: "Producción Musical con FMOD",
            url: "https://www.youtube.com/live/zxJeQ9L2MTk",
            videoId: "zxJeQ9L2MTk"
        },
        {
            title: "Comprendiendo tu Estructura de Costos",
            url: "https://www.youtube.com/live/p6X1uBwcC7c",
            videoId: "p6X1uBwcC7c"
        },
        {
            title: "Acercando el Arte al Videojuego",
            url: "https://www.youtube.com/live/OvMsT0uQVOY",
            videoId: "OvMsT0uQVOY"
        }
    ];

    const deadline = new Date('2025-10-17T23:59:59');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = deadline.getTime() - now;

            if (distance < 0) {
                setIsExpired(true);
                clearInterval(timer);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const openVideoModal = (talk: Talk) => {
        setSelectedVideo(talk);
    };

    const closeVideoModal = () => {
        setSelectedVideo(null);
    };

    return (
        <div className="min-h-screen bg-surface-900 text-gray-200">
            <header
                className="w-full bg-gradient-to-r from-brand-gold via-brand-red-dark to-brand-gold text-white py-8 px-6 md:px-12 shadow-lg">
                <div className="max-w-6xl mx-auto">
                    {/* Layout para móvil: logo arriba, texto abajo */}
                    <div className="flex flex-col items-center space-y-4 md:hidden">
                        <img
                            src="https://venezuela-juega.s3.us-east-005.dream.io/gamejamplus/gj%2B_white.png"
                            alt="GJ+ Logo"
                            className="w-16 h-16 object-contain"
                        />
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">GameJamPlus 10th Edition - 25/26</h1>
                            <p className="text-base opacity-90">Crea videojuegos en 48 horas. ¡Resalta tu creatividad y crea tu juego!</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <img
                                    src="https://venezuela-juega.s3.us-east-005.dream.io/gamejamplus/gj%2B_white.png"
                                    alt="GJ+ Logo"
                                    className="w-12 h-12 object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">GameJamPlus 10th Edition - 25/26</h1>
                                <p className="text-lg opacity-90">Crea videojuegos en 48 horas. ¡Resalta tu creatividad y crea tu juego!</p>
                            </div>
                        </div>
                        <nav className="flex space-x-4">
                            <a href={signUpLink}
                                className="bg-white/20 backdrop-blur hover:bg-white/30 text-white px-6 py-3 rounded-lg shadow-sm text-base font-medium transition-all">
                                Inscríbete ahora
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto py-10 px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <aside className="md:col-span-1">
                        <div className="sticky top-20 space-y-6">
                            <section id="inscripcion"
                                className="bg-gradient-to-br from-surface-800 to-surface-700 p-6 rounded-xl shadow-xl border border-surface-600/50 relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-teal to-accent-indigo">
                                        Inscríbete ahora
                                    </h3>
                                </div>

                                <div
                                    className="mb-4 p-4 bg-gradient-to-r from-brand-gold/70 to-accent-orange/50 border border-brand-red/50 rounded-lg">
                                    <p className="text-xs text-brand-red mb-2 font-medium">TIEMPO RESTANTE</p>
                                    {isExpired ? (
                                        <p className="text-brand-red font-bold text-lg">¡INSCRIPCIONES CERRADAS!</p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 text-center">
                                            <div className="bg-surface-700/50 rounded p-2">
                                                <div className="text-xl font-bold text-white">{timeLeft.days}</div>
                                                <div className="text-xs text-gray-300">Días</div>
                                            </div>
                                            <div className="bg-surface-700/50 rounded p-2">
                                                <div className="text-xl font-bold text-white">{timeLeft.hours}</div>
                                                <div className="text-xs text-gray-300">Horas</div>
                                            </div>
                                            <div className="bg-surface-700/50 rounded p-2">
                                                <div className="text-xl font-bold text-white">{timeLeft.minutes}</div>
                                                <div className="text-xs text-gray-300">Min</div>
                                            </div>
                                            <div className="bg-surface-700/50 rounded p-2">
                                                <div className="text-xl font-bold text-white">{timeLeft.seconds}</div>
                                                <div className="text-xs text-gray-300">Seg</div>
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-300 mt-2 text-center">
                                        Fecha límite: 16 de Octubre del 2025
                                    </p>
                                </div>
                                <ul className="space-y-3">
                                    <li>
                                        <a className={`block w-full text-center px-4 py-2 rounded transition-colors ${isExpired
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : 'border border-brand-gold hover:bg-brand-gold/10 text-brand-gold hover:text-brand-gold'
                                            }`}
                                            href={isExpired ? '#' : signUpLink}
                                            target={isExpired ? '_self' : '_blank'}
                                            rel="noopener">
                                            {isExpired ? 'Inscripciones cerradas' : '¡Inscribirse!'}
                                        </a>
                                    </li>
                                </ul>
                            </section>

                            <section
                                className="bg-gradient-to-br from-surface-800 to-surface-700 p-6 rounded-xl shadow-xl border border-surface-600/50 relative overflow-hidden">

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-teal to-accent-indigo">
                                            Material informativo
                                        </h3>
                                    </div>

                                    <p className="text-gray-300 text-sm mb-4 opacity-90">
                                        Recursos esenciales para prepararte y tener éxito en la GameJam+
                                    </p>

                                    <div className="space-y-3">
                                        <a className="group flex items-center gap-4 p-3 bg-surface-700/40 hover:bg-gradient-to-r hover:from-accent-indigo/20 hover:to-accent-mauve-dark/20 border border-surface-600/30 hover:border-accent-indigo/40 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-indigo/10"
                                            href="https://docs.google.com/document/d/1Vli9OsOCoAdRrOOazSjvA5IcdydAP7aWpzaGf6cJSoI/edit?usp=sharing"
                                            target="_blank"
                                            rel="noopener">
                                            <div
                                                className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-brand-blue to-accent-mauve-deep rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                                🏹
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="font-semibold text-white group-hover:text-accent-lime transition-colors">
                                                    Guía de supervivencia en la GJ+
                                                </h4>
                                                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                                                    Cómo participar y disfrutar de una game jam
                                                </p>
                                            </div>
                                            <div
                                                className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <ExternalLinkIcon
                                                    className="text-gray-400 group-hover:text-accent-mauve transition-colors"
                                                    size="sm"
                                                />
                                            </div>
                                        </a>

                                        <a className="group flex items-center gap-4 p-3 bg-surface-700/40 hover:bg-gradient-to-r hover:from-accent-mauve-dark/20 hover:to-pink-500/20 border border-surface-600/30 hover:border-accent-mauve-dark/40 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-mauve-dark/10"
                                            href="https://docs.google.com/presentation/d/1s3klip-CpG-GoiwOv-rrRjsP1Ylc_HIcnUQQS-dmwuE/edit?usp=sharing"
                                            target="_blank"
                                            rel="noopener">
                                            <div
                                                className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-accent-mauve-dark to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                                🤔
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="font-semibold text-white group-hover:text-accent-mauve transition-colors">
                                                    Cómo funciona la GJ+
                                                </h4>
                                                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                                                    Presentación completa del formato y las reglas a seguir
                                                </p>
                                            </div>
                                            <div
                                                className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <ExternalLinkIcon
                                                    className="text-gray-400 group-hover:text-accent-mauve transition-colors"
                                                    size="sm"
                                                />
                                            </div>
                                        </a>
                                    </div>

                                    {/* Call to action */}
                                    <div className="mt-5 pt-4 border-t border-surface-600/30">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <div
                                                className="w-2 h-2 bg-gradient-to-r from-accent-teal to-accent-indigo rounded-full animate-pulse"></div>
                                            <span>Recursos actualizados regularmente</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-gradient-to-br from-surface-800 to-surface-700 p-6 rounded-xl shadow-xl border border-surface-600/50 relative overflow-hidden">

                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-teal to-accent-indigo">
                                        Únete a la comunidad
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    <a
                                        href="https://link.venezuelajuega.com/discord"
                                        target="_blank"
                                        rel="noopener"
                                        className="flex items-center gap-3 px-3 py-2 bg-accent-indigo-dark/20 hover:bg-accent-indigo-dark/30 border border-accent-indigo/40 rounded-lg transition-colors group"
                                    >
                                        <div
                                            className="w-8 h-8 bg-accent-indigo rounded flex items-center justify-center text-white text-sm group-hover:bg-accent-indigo transition-colors">
                                            💬
                                        </div>
                                        <div>
                                            <p className="text-accent-indigo font-medium text-sm">Discord</p>
                                            <p className="text-gray-400 text-xs">Únete a la conversación</p>
                                        </div>
                                    </a>

                                    <a
                                        href="https://instagram.com/venezuelajuega"
                                        target="_blank"
                                        rel="noopener"
                                        className="flex items-center gap-3 px-3 py-2 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 rounded-lg transition-colors group"
                                    >
                                        <div
                                            className="w-8 h-8 bg-gradient-to-br from-accent-mauve-dark to-pink-500 rounded flex items-center justify-center text-white text-sm group-hover:scale-105 transition-transform">
                                            📸
                                        </div>
                                        <div>
                                            <p className="text-pink-300 font-medium text-sm">Instagram</p>
                                            <p className="text-gray-400 text-xs">Síguenos para updates</p>
                                        </div>
                                    </a>

                                    <a
                                        href="https://tiktok.com/@venezuelajuega"
                                        target="_blank"
                                        rel="noopener"
                                        className="flex items-center gap-3 px-3 py-2 bg-surface-700/50 hover:bg-surface-600/50 border border-surface-600 rounded-lg transition-colors group"
                                    >
                                        <div
                                            className="w-8 h-8 bg-black rounded flex items-center justify-center text-white text-sm group-hover:bg-gray-800 transition-colors">
                                            🎵
                                        </div>
                                        <div>
                                            <p className="text-gray-200 font-medium text-sm">TikTok</p>
                                            <p className="text-gray-400 text-xs">Contenido divertido</p>
                                        </div>
                                    </a>
                                </div>
                            </section>
                        </div>
                    </aside>

                    <section className="md:col-span-2 space-y-6">
                        <article id="info" className="p-6 rounded-lg shadow-lg border border-surface-700 bg-gradient-to-br from-surface-800 to-surface-700 rounded-xl shadow-xl relative overflow-hidden">
                            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">¿Qué es una Game Jam?</h2>
                            <p className="text-gray-300 mb-4">
                                Una Game Jam es un evento donde desarrolladores, artistas, diseñadores y músicos se
                                reúnen para crear uno o varios juegos en un tiempo limitado — en este caso, 48 horas.
                                El objetivo es fomentar la creatividad, el aprendizaje y la colaboración. Las Jam son
                                excelentes para experimentar ideas, conocer gente y ampliar tu portafolio.
                                No es necesario ser profesional para participar, incluso invitamos y fomentamos que se
                                unan cada vez más personas nuevas y con interés en participar en la industria de
                                videojuegos.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium mb-1 text-accent-teal">Estructura típica</h3>
                                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                                        <li>Presentación del tema en el cual se basará la jam</li>
                                        <li>Formación de equipos y planificación</li>
                                        <li>48 horas de desarrollo</li>
                                        <li>Entrega y revisión</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-1 text-accent-teal">Consejos</h3>
                                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                                        <li>Define un alcance realista</li>
                                        <li>Prioriza prototipo jugable</li>
                                        <li>Hidrátate, descansa y continúa desarrollando</li>
                                        <li>Comunica tareas dentro del equipo</li>
                                    </ul>
                                </div>
                            </div>
                        </article>

                        <article className="p-6 rounded-lg shadow-lg border border-surface-700 bg-gradient-to-br from-surface-800 to-surface-700 rounded-xl shadow-xl relative overflow-hidden">
                            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
                                Charlas de GameJam+ 25/26
                            </h2>
                            <p className="text-gray-300 mb-6 text-sm">
                                ¡Prepárate para participar en la Game Jam con estas charlas especializadas sobre
                                desarrollo de videojuegos, diseño y la industria en general!
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {talks.map((talk, index) => (
                                    <div
                                        key={index}
                                        className="group cursor-pointer bg-surface-700/30 border border-surface-600 rounded-lg overflow-hidden hover:border-accent-teal-dark/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent-teal-dark/10"
                                        onClick={() => openVideoModal(talk)}
                                    >
                                        <div
                                            className="relative aspect-video bg-surface-700 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={`https://img.youtube.com/vi/${talk.videoId}/maxresdefault.jpg`}
                                                alt={talk.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                            <div
                                                className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                                <div
                                                    className="w-12 h-12 bg-brand-red-dark rounded-full flex items-center justify-center group-hover:bg-brand-red transition-colors duration-300">
                                                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="text-sm font-medium text-white group-hover:text-accent-teal transition-colors duration-200 line-clamp-2">
                                                {talk.title}
                                            </h4>
                                            <p className="text-xs text-gray-400 mt-1">Click para reproducir</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="p-6 rounded-lg shadow-lg border border-surface-700 bg-gradient-to-br from-surface-800 to-surface-700 rounded-xl shadow-xl relative overflow-hidden">
                            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">Preguntas frecuentes</h2>

                            <div className="space-y-3">
                                <details
                                    className="group bg-surface-700/30 border border-surface-600/50 rounded-lg overflow-hidden transition-all duration-300 hover:border-accent-teal-dark/40">
                                    <summary
                                        className="cursor-pointer px-4 py-3 flex items-center justify-between bg-surface-700/20 hover:bg-surface-600/30 transition-colors duration-200">
                                        <span className="font-medium text-accent-teal group-hover:text-accent-teal">
                                            ¿Puedo participar solo?
                                        </span>
                                        <svg
                                            className="w-5 h-5 text-accent-teal transform transition-transform duration-200 group-open:rotate-180"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div
                                        className="px-4 py-3 text-sm text-gray-300 bg-surface-800/50 border-t border-surface-600/30">
                                        <p>Sí, absolutamente. Hay modalidades tanto individuales como por equipos. Si
                                            participas solo, tendrás la libertad total sobre tu proyecto, pero también
                                            puedes unirte a otros participantes durante el evento para formar equipos
                                            espontáneos.</p>
                                    </div>
                                </details>

                                <details
                                    className="group bg-surface-700/30 border border-surface-600/50 rounded-lg overflow-hidden transition-all duration-300 hover:border-accent-teal-dark/40">
                                    <summary
                                        className="cursor-pointer px-4 py-3 flex items-center justify-between bg-surface-700/20 hover:bg-surface-600/30 transition-colors duration-200">
                                        <span className="font-medium text-accent-teal group-hover:text-accent-teal">
                                            ¿Hay premios?
                                        </span>
                                        <svg
                                            className="w-5 h-5 text-accent-teal transform transition-transform duration-200 group-open:rotate-180"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div
                                        className="px-4 py-3 text-sm text-gray-300 bg-surface-800/50 border-t border-surface-600/30">
                                        <p>En muchas ediciones hay menciones y premios especiales. Normalmente la GJ+ se
                                            basa en un proceso de multiples etapas luego de participar en las 48H de la
                                            jam, en lo cual se evalua el trabajo y se entra en una fase de selección
                                            para ser considerado un juego que pueda presentarse en la gran final en
                                            Brasil.</p>
                                    </div>
                                </details>

                                <details
                                    className="group bg-surface-700/30 border border-surface-600/50 rounded-lg overflow-hidden transition-all duration-300 hover:border-accent-teal-dark/40">
                                    <summary
                                        className="cursor-pointer px-4 py-3 flex items-center justify-between bg-surface-700/20 hover:bg-surface-600/30 transition-colors duration-200">
                                        <span className="font-medium text-accent-teal group-hover:text-accent-teal">
                                            ¿Qué necesito para participar?
                                        </span>
                                        <svg
                                            className="w-5 h-5 text-accent-teal transform transition-transform duration-200 group-open:rotate-180"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div
                                        className="px-4 py-3 text-sm text-gray-300 bg-surface-800/50 border-t border-surface-600/30">
                                        <p>Solo necesitas ganas de crear y una computadora con acceso a internet. Puedes
                                            usar cualquier herramienta de desarrollo que prefieras: Unity, Godot,
                                            GameMaker, o incluso herramientas web. La creatividad es más importante que
                                            las herramientas.</p>
                                    </div>
                                </details>

                                <details
                                    className="group bg-surface-700/30 border border-surface-600/50 rounded-lg overflow-hidden transition-all duration-300 hover:border-accent-teal-dark/40">
                                    <summary
                                        className="cursor-pointer px-4 py-3 flex items-center justify-between bg-surface-700/20 hover:bg-surface-600/30 transition-colors duration-200">
                                        <span className="font-medium text-accent-teal group-hover:text-accent-teal">
                                            ¿Cuándo es el evento?
                                        </span>
                                        <svg
                                            className="w-5 h-5 text-accent-teal transform transition-transform duration-200 group-open:rotate-180"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div
                                        className="px-4 py-3 text-sm text-gray-300 bg-surface-800/50 border-t border-surface-600/30">
                                        <p>La GameJam+ 25/26 se realizará durante 48 horas consecutivas. Nuestra sede
                                            dara inicio a la jam el dia 17 de Octubre y finalizarian el 19 de Octubre
                                            del 2025. Mantente atento a nuestras redes sociales para conocer todos los
                                            detalles del cronograma.</p>
                                    </div>
                                </details>
                            </div>

                            <div className="mt-6 pt-4 border-t border-surface-600/30">
                                <button
                                    className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-indigo-dark to-accent-mauve-deep hover:from-accent-indigo hover:to-accent-mauve-dark text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                    onClick={() => setShowMore((s) => !s)}
                                >
                                    <span>{showMore ? 'Ocultar información' : 'Ver más información'}</span>
                                    <svg
                                        className={`w-4 h-4 transform transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showMore && (
                                    <div
                                        className="mt-4 p-4 bg-gradient-to-r from-surface-800/80 to-surface-700/80 rounded-lg border border-surface-600/50 backdrop-blur-sm">
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="w-2 h-2 bg-accent-teal rounded-full mt-2 flex-shrink-0"></div>
                                                <div>
                                                    <span className="text-accent-teal font-semibold">Contacto del organizador:</span>
                                                    <p className="text-gray-300">David Pino</p>
                                                    <p className="text-gray-300">hola@venezuelajuega.com</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="w-2 h-2 bg-accent-mauve rounded-full mt-2 flex-shrink-0"></div>
                                                <div>
                                                    <span
                                                        className="text-accent-mauve font-semibold">Horario de soporte:</span>
                                                    <p className="text-gray-300">Lunes a Viernes, 9:00 AM - 6:00 PM
                                                        (hora Venezuela)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </article>
                    </section>
                </div>

                <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            `}</style>
            </main>

            {/* Modal para reproducir videos */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={closeVideoModal}>
                    <div
                        className="relative max-w-4xl w-full max-h-[90vh] bg-surface-800 rounded-lg overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-surface-700">
                            <h3 className="text-lg font-semibold text-white pr-8">{selectedVideo.title}</h3>
                            <button
                                onClick={closeVideoModal}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="aspect-video">
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameJamPage;