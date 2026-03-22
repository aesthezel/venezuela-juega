import { useEffect } from 'preact/hooks';
import { Game } from '@/src/types';
import { updateMetadata } from '@/src/utils';
import { trackPageView, trackGameView, trackEvent } from '@/src/utils/analytics';

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
    '/gamejam-gallery': {
        title: 'GameJam+ 25/26 — Venezuela Juega',
        description: 'Todos los juegos que fueron realizados en menos de 48 horas.'
    },
    '/game-jams': {
        title: 'Game Jams Venezuela — Venezuela Juega',
        description: 'Descubre los increíbles juegos creados en menos de 48 horas por desarrolladores venezolanos en eventos Game Jam.'
    },
};

export const useMetadata = (currentPath: string, games: Game[]) => {
    useEffect(() => {
        // GA4 page view
        trackPageView(currentPath, document.title);

        const gameSlugMatch = currentPath.match(/^\/games?\/([^/]+)/);

        if (gameSlugMatch && gameSlugMatch[1]) {
            const gameSlug = decodeURIComponent(gameSlugMatch[1]);
            const foundGame = games.find(g => g.slug.toLowerCase() === gameSlug.toLowerCase());

            if (foundGame) {
                document.title = `${foundGame.title} — Venezuela Juega`;
                const description = foundGame.description.substring(0, 155).trim() + '...';
                const imageUrl = foundGame.imageCover || foundGame.imageHero || foundGame.imageUrl;

                updateMetadata('meta[name="description"]', 'content', description);
                updateMetadata('meta[property="og:title"]', 'content', foundGame.title);
                updateMetadata('meta[property="og:description"]', 'content', description);
                updateMetadata('meta[property="og:image"]', 'content', imageUrl);
                updateMetadata('meta[name="twitter:card"]', 'content', 'summary_large_image');

                trackGameView({ slug: foundGame.slug, title: foundGame.title });
            }
        } else {
            const metadata = pageMetadata[currentPath as keyof typeof pageMetadata] || pageMetadata['/'];

            document.title = metadata.title;
            updateMetadata('meta[name="description"]', 'content', metadata.description);
            updateMetadata('meta[property="og:title"]', 'content', metadata.title);
            updateMetadata('meta[property="og:description"]', 'content', metadata.description);
            updateMetadata('meta[property="og:image"]', 'content', 'https://venezuela-juega.s3.us-east-005.dream.io/brand/VenezuelaJuega_LogoColor.png');
            updateMetadata('meta[name="twitter:card"]', 'content', 'summary');

            if (currentPath === '/gamejam') {
                trackEvent('view_gamejam');
            }
        }

        const pageUrl = window.location.href;
        updateMetadata('link[rel="canonical"]', 'href', pageUrl);
        updateMetadata('meta[property="og:url"]', 'content', pageUrl);
    }, [currentPath, games]);
};
