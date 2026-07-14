import type { JamEvent } from './types';

// ─── Registry ───────────────────────────────────────────────────────────────

const registry: JamEvent[] = [
    {
        slug: 'jam-benefica',
        edition: 'i',
        name: 'Jam Benéfica Global',
        shortName: 'Jam Benéfica',
        tagline: 'Crea juegos. Salva vidas.',
        status: 'upcoming',
        startDate: null,
        endDate: null,
        submissionUrl: null,
        platform: 'Itch.io',
        heroGradient: 'from-[#1a0a0d] via-[#0d0a11] to-[#0a0d1a]',
        accentColor: '#e34262',
        objectives: [
            {
                title: 'Ayudar a las víctimas del terremoto',
                description:
                    'Venezuela sufrió un devastador terremoto. Cada juego publicado en esta jam recauda fondos directamente para las familias afectadas a través de organizaciones humanitarias verificadas.',
                icon: '🫂',
            },
        ],
        isCharity: true,
        phases: [
            {
                label: 'Inscripciones',
                description: 'Regístrate en Itch.io y forma tu equipo.',
                startDate: null,
                endDate: null,
                icon: '📝',
            },
            {
                label: 'Desarrollo',
                description: '72 horas para crear tu juego desde cero.',
                startDate: null,
                endDate: null,
                icon: '🎮',
            },
            {
                label: 'Votación',
                description: 'La comunidad vota los mejores proyectos.',
                startDate: null,
                endDate: null,
                icon: '🗳️',
            },
            {
                label: 'Premiación',
                description: 'Anuncio de ganadores y distribución de fondos.',
                startDate: null,
                endDate: null,
                icon: '🏆',
            },
        ],
        faqs: [
            {
                question: '¿Cuánto cuesta participar?',
                answer: 'La participación es completamente gratuita. Si deseas apoyar la causa puedes hacer una donación voluntaria al publicar tu juego en Itch.io.',
            },
            {
                question: '¿Necesito ser venezolano para participar?',
                answer: 'No. La jam es global y abierta a cualquier desarrollador del mundo que quiera ayudar a Venezuela.',
            },
            {
                question: '¿Puedo participar en solitario?',
                answer: 'Sí, puedes participar solo o en equipos de hasta 4 personas.',
            },
            {
                question: '¿Qué motor de juego puedo usar?',
                answer: 'Cualquiera: Unity, Godot, GameMaker, Pygame, Construct, PICO-8, etc. Lo importante es el juego.',
            },
            {
                question: '¿Cómo se garantiza que los fondos llegan a las víctimas?',
                answer: 'Los fondos recaudados a través de Itch.io son canalizados por la organización Venezuela Juega en conjunto con ONGs humanitarias verificadas. Se publicará un reporte de transparencia al final.',
            },
        ],
        sponsors: [
            {
                name: 'Global Game Jam',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/GGJ_Logo.png/320px-GGJ_Logo.png',
                url: 'https://globalgamejam.org',
            },
        ],
    },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Devuelve todas las jams (excepto draft/ended) */
export function getActiveJams(): JamEvent[] {
    return registry.filter((j) => j.status !== 'draft' && j.status !== 'ended');
}

/** Devuelve la edición más reciente de un slug dado */
export function getLatestEdition(jamName: string): JamEvent | undefined {
    const editions = registry.filter((j) => j.slug === jamName);
    if (!editions.length) return undefined;
    return editions[editions.length - 1];
}

/** Devuelve una jam por slug + edición opcional */
export function getJamBySlug(jamName: string, edition?: string): JamEvent | undefined {
    if (edition) {
        return registry.find((j) => j.slug === jamName && j.edition === edition);
    }
    return getLatestEdition(jamName);
}

/** Todas las jams del registry */
export function getAllJams(): JamEvent[] {
    return registry;
}

export { registry as JamRegistry };
