import type { JamEvent } from './types';

// ─── Registry ───────────────────────────────────────────────────────────────

const registry: JamEvent[] = [
    {
        slug: 'juntos-game-jam',
        edition: 'i',
        name: 'Juntos: Game Jam para Venezuela',
        shortName: 'Juntos Game Jam',
        tagline: 'Ayuda a los afectados en el terremoto',
        status: 'upcoming',
        startDate: new Date('2026-07-24T00:00:00-04:00'),
        endDate: new Date('2026-07-26T23:59:59-04:00'),
        submissionUrl: "https://itch.io/jam/juntos-game-jam-venezuela-earthquake-relief",
        donationUrl: "https://tiltify.com/wfpusa/wfpusa-influencers?origin=https://venezuelajuega.com",
        platform: 'itch.io',
        heroGradient: 'from-[#1a0a0d] via-[#0d0a11] to-[#0a0d1a]',
        // heroImage: undefined,  // Asigna una URL cuando tengas la imagen de fondo
        // logo: undefined,       // Asigna una URL cuando tengas el logotipo del evento
        accentColor: '#e34262',
        objectives: [
            {
                title: 'Ayudar a las víctimas del terremoto',
                description:
                    'Venezuela sufrió un devastador terremoto. La participación es gratuita y las donaciones son completamente voluntarias. No es necesario hacer una donación para participar, ni participar en el Game Jam para realizar una donación.',
                icon: '🫂',
            },
        ],
        isCharity: true,
        phases: [
            {
                label: 'Inscripciones',
                description: 'Regístrate en Itch.io y forma tu equipo.',
                startDate: new Date('2026-07-14T00:00:00-04:00'),
                endDate: new Date('2026-07-23T23:59:59-04:00'),
                icon: '📝',
            },
            {
                label: 'Desarrollo',
                description: '72 horas para crear tu juego desde cero.',
                startDate: new Date('2026-07-24T00:00:00-04:00'),
                endDate: new Date('2026-07-26T23:59:59-04:00'),
                icon: '🎮',
            }
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
                logo: 'https://s3-us-west-1.amazonaws.com/ggj/site/site-images/GGJ00_Logo_Light.svg',
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
