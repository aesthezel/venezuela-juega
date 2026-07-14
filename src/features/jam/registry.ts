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
        heroGradient: 'from-[#44276a] via-[#e5054b] to-[#44276a]',
        //heroImage: undefined,
        // logo: undefined,
        accentColor: '#1696ab',
        objectives: [
            {
                title: 'Ayudar a las víctimas del terremoto',
                description:
                    'Venezuela sufrió un devastador terremoto. La participación es gratuita y las donaciones son completamente voluntarias. No es necesario hacer una donación para participar, ni participar en el Game Jam para realizar una donación.',
                icon: '❤️‍🩹',
            },
            {
                title: '¿A dónde va la ayuda?',
                description:
                    'El 100 % de los fondos recaudados será destinado directamente a las labores de asistencia que WFP está llevando a cabo en Venezuela.',
                icon: '🤝',
            }
        ],
        isCharity: true,
        phases: [
            {
                label: 'Inscripciones',
                description: 'Regístrate en itch.io y forma tu equipo.',
                startDate: new Date('2026-07-14T00:00:00-04:00'),
                endDate: new Date('2026-07-23T23:59:59-04:00'),
                icon: '📝',
            },
            {
                label: 'Desarrollo',
                description: '48 horas para crear tu juego desde cero.',
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
                question: 'Acerca de Global Game Jam',
                answer: 'Global Game Jam es una organización sin fines de lucro cuya misión es brindar a personas de todo el mundo la oportunidad de aprender, experimentar y crear juntas mediante el desarrollo de videojuegos. Además de organizar el Game Jam más grande del mundo, con más de 800 sedes a nivel global, GGJ trabaja durante todo el año para apoyar, promover y fortalecer a la comunidad internacional de desarrollo de videojuegos.',
            },
            {
                question: 'Acerca de World Food Program USA',
                answer: 'World Food Program USA es una organización sin fines de lucro 501(c)(3), con sede en Washington D. C., que apoya la misión de World Food Programme movilizando a responsables políticos, empresas y personas de Estados Unidos para impulsar el esfuerzo global por poner fin al hambre.',
            }
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
