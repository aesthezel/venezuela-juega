import { useEffect } from 'preact/hooks';
import { Game } from '@/types';
import { updateMetadata } from '@/utils';
import { trackPageView, trackGameView, trackEvent } from '@/utils/analytics';

// TODO: move to a separate config file
const pageMetadata = {
    '/': {
        title: 'Venezuela Juega — Catálogo de la industria de videojuegos',
        description: 'Explora, filtra y descubre videojuegos desarrollados en Venezuela. Un catálogo completo de la industria venezolana.'
    },
    '/calendar': {
        title: 'Calendario de Lanzamientos — Venezuela Juega',
        description: 'Sigue las fechas de lanzamiento de los próximos videojuegos desarrollados en Venezuela.'
    },
    '/charts': {
        title: 'Estadísticas de la Industria — Venezuela Juega',
        description: 'Visualiza datos y gráficos sobre el ecosistema de desarrollo de videojuegos en Venezuela.'
    },
    '/about': {
        title: 'Acerca de la Iniciativa — Venezuela Juega',
        description: 'Conoce más sobre la iniciativa Venezuela Juega, sus colaboradores y cómo puedes contribuir.'
    },
    '/game-jams': {
        title: 'Game Jams Venezuela — Venezuela Juega',
        description: 'Descubre los increíbles juegos creados en menos de 48 horas por desarrolladores venezolanos en eventos Game Jam.'
    },
    '/jams': {
        title: 'Game Jams — Venezuela Juega',
        description: 'Explora y participa en las Game Jams de la comunidad de desarrollo de videojuegos en Venezuela: crea prototipos en 48 horas, colabora y compite.'
    },
};

export const useMetadata = (currentPath: string, games: Game[]) => {
    useEffect(() => {
        // GA4 page view
        trackPageView(currentPath, document.title);

        // Jam detail routes manage their own rich metadata and Event JSON-LD
        if (currentPath.startsWith('/jam/')) {
            return;
        }

        const gameSlugMatch = currentPath.match(/^\/games?\/([^/]+)/);

        if (gameSlugMatch && gameSlugMatch[1]) {
            const gameSlug = decodeURIComponent(gameSlugMatch[1]);
            const foundGame = games.find(g => g.slug.toLowerCase() === gameSlug.toLowerCase());

            if (foundGame) {
                const title = `${foundGame.title} — Venezuela Juega`;
                document.title = title;
                const description = foundGame.description ? foundGame.description.substring(0, 155).trim() + '...' : `${foundGame.title} en Venezuela Juega.`;
                const imageUrl = foundGame.imageCover || foundGame.imageHero || foundGame.imageUrl || 'https://venezuela-juega.s3.us-east-005.dream.io/brand/VenezuelaJuega_LogoColor.png';
                const pageUrl = `${window.location.origin}/game/${foundGame.slug}`;

                updateMetadata('meta[name="description"]', 'content', description);
                updateMetadata('meta[property="og:title"]', 'content', title);
                updateMetadata('meta[property="og:description"]', 'content', description);
                updateMetadata('meta[property="og:image"]', 'content', imageUrl);
                updateMetadata('meta[property="og:url"]', 'content', pageUrl);
                updateMetadata('link[rel="canonical"]', 'href', pageUrl);
                updateMetadata('meta[name="twitter:card"]', 'content', 'summary_large_image');
                updateMetadata('meta[name="twitter:title"]', 'content', title);
                updateMetadata('meta[name="twitter:description"]', 'content', description);
                updateMetadata('meta[name="twitter:image"]', 'content', imageUrl);

                trackGameView({ slug: foundGame.slug, title: foundGame.title });

                // Schema.org VideoGame JSON-LD
                const gameSchema: Record<string, any> = {
                    '@context': 'https://schema.org',
                    '@type': 'VideoGame',
                    name: foundGame.title,
                    description: foundGame.description || `${foundGame.title} — Videojuego venezolano en Venezuela Juega`,
                    image: [imageUrl],
                    url: pageUrl,
                    applicationCategory: 'Game',
                    inLanguage: 'es',
                };

                if (foundGame.genre && foundGame.genre.length > 0) {
                    gameSchema.genre = foundGame.genre;
                }
                if (foundGame.platform && foundGame.platform.length > 0) {
                    gameSchema.gamePlatform = foundGame.platform;
                }
                if (foundGame.developers && foundGame.developers.length > 0) {
                    gameSchema.author = {
                        '@type': 'Organization',
                        name: foundGame.developers.join(', '),
                    };
                }
                if (foundGame.publishers && foundGame.publishers.length > 0) {
                    gameSchema.publisher = {
                        '@type': 'Organization',
                        name: foundGame.publishers.join(', '),
                    };
                }
                if (foundGame.releaseDate && foundGame.releaseDate !== 'No especificada') {
                    gameSchema.datePublished = foundGame.releaseDate;
                }
                if (foundGame.stores && foundGame.stores.length > 0 && foundGame.stores[0].url) {
                    gameSchema.offers = {
                        '@type': 'Offer',
                        url: foundGame.stores[0].url,
                        availability: 'https://schema.org/InStock',
                        price: '0',
                        priceCurrency: 'USD',
                    };
                }

                let scriptEl = document.getElementById('game-schema') as HTMLScriptElement | null;
                if (!scriptEl) {
                    scriptEl = document.createElement('script');
                    scriptEl.id = 'game-schema';
                    scriptEl.type = 'application/ld+json';
                    document.head.appendChild(scriptEl);
                }
                scriptEl.textContent = JSON.stringify(gameSchema, null, 2);
            }
        } else {
            const metadata = pageMetadata[currentPath as keyof typeof pageMetadata] || pageMetadata['/'];

            document.title = metadata.title;
            updateMetadata('meta[name="description"]', 'content', metadata.description);
            updateMetadata('meta[property="og:title"]', 'content', metadata.title);
            updateMetadata('meta[property="og:description"]', 'content', metadata.description);
            updateMetadata('meta[property="og:image"]', 'content', 'https://venezuela-juega.s3.us-east-005.dream.io/brand/VenezuelaJuega_LogoColor.png');
            updateMetadata('meta[name="twitter:card"]', 'content', 'summary');

            // Limpiar esquema de juego si no estamos en /game
            const existingGameSchema = document.getElementById('game-schema');
            if (existingGameSchema) existingGameSchema.remove();

            if (currentPath === '/gamejam') {
                trackEvent('view_gamejam');
            }
        }

        const pageUrl = window.location.href;
        updateMetadata('link[rel="canonical"]', 'href', pageUrl);
        updateMetadata('meta[property="og:url"]', 'content', pageUrl);

        return () => {
            const existingGameSchema = document.getElementById('game-schema');
            if (existingGameSchema) existingGameSchema.remove();
        };
    }, [currentPath, games]);
};

