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
        className: 'bg-[#172337] hover:bg-[#2a475e] text-white',
    },
    'Itch': {
        icon: faItchIo,
        className: 'bg-[#fa5c5c] hover:bg-[#ff7f7f] text-white',
    },
    'Nintendo Shop': {
        icon: faGamepad,
        className: 'bg-[#e60012] hover:bg-[#ff334f] text-white',
    },
    'PlayStation Store': {
        icon: faPlaystation,
        className: 'bg-[#0070d1] hover:bg-[#0084f7] text-white',
    },
    'Microsoft Store': {
        icon: faXbox,
        className: 'bg-[#107b10] hover:bg-[#00bfff] text-white',
    },
    'Play Store': {
        icon: faGooglePlay,
        className: 'bg-[#00a185] hover:bg-[#00c9a6] text-white',
    },
    'App Store': {
        icon: faApple,
        className: 'bg-[#000000] hover:bg-[#333333] text-white',
    },
    'Meta': {
        icon: faMeta,
        className: 'bg-[#0078ff] hover:bg-[#3391ff] text-white',
    },
    'GOG': {
        icon: faGamepad,
        className: 'bg-[#c99aff] hover:bg-[#3391ff] text-white',
    },
    'Default': {
        icon: faGlobe,
        className: 'bg-cyan-500 hover:bg-cyan-600 text-white',
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