import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSteam,
    faItchIo,
    faPlaystation,
    faXbox,
    faGooglePlay,
    faApple,
    faMeta,
} from '@fortawesome/free-brands-svg-icons';
import { faGamepad, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { LinkIcon } from './icons';
import { trackExternalStore } from '@/src/utils/analytics';

interface StoreButtonProps {
    store: { name: string; url: string };
    gameSlug?: string;
    gameTitle?: string;
}

const storeStyles: Record<string, { icon: any; className: string }> = {
    'Steam': {
        icon: faSteam,
        className: 'bg-store-steam hover:bg-store-steam-hover text-white',
    },
    'Itch': {
        icon: faItchIo,
        className: 'bg-store-itch hover:bg-store-itch-hover text-white',
    },
    'Nintendo Shop': {
        icon: faGamepad,
        className: 'bg-store-nintendo hover:bg-store-nintendo-hover text-white',
    },
    'PlayStation Store': {
        icon: faPlaystation,
        className: 'bg-store-playstation hover:bg-store-playstation-hover text-white',
    },
    'Microsoft Store': {
        icon: faXbox,
        className: 'bg-store-xbox hover:bg-store-xbox-hover text-white',
    },
    'Play Store': {
        icon: faGooglePlay,
        className: 'bg-store-google-play hover:bg-store-google-play-hover text-white',
    },
    'App Store': {
        icon: faApple,
        className: 'bg-store-apple hover:bg-store-apple-hover text-white',
    },
    'Meta': {
        icon: faMeta,
        className: 'bg-store-meta hover:bg-store-meta-hover text-white',
    },
    'GOG': {
        icon: faGamepad,
        className: 'bg-store-gog hover:bg-store-gog-hover text-white',
    },
    'Default': {
        icon: faGlobe,
        className: 'bg-accent-teal-dark hover:bg-accent-teal-deep text-white',
    },
};

const StoreButton = ({ store }: StoreButtonProps) => {
    const style = storeStyles[store.name] || storeStyles['Default'];

    return (
        <a
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg text-sm transition-colors ${style.className}`}
            onClick={() => {
                if (gameSlug && gameTitle) {
                    trackExternalStore({ slug: gameSlug, title: gameTitle }, store.name, store.url);
                }
            }}
        >
            <FontAwesomeIcon icon={style.icon} />
            <span>{store.name}</span>
            <LinkIcon />
        </a>
    );
};

export default StoreButton;