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
import { LinkIcon } from '@/common/components/icons';
import { trackExternalStore } from '@/utils/analytics';

interface StoreButtonProps {
    store: { name: string; url: string };
    gameSlug?: string;
    gameTitle?: string;
}

// Colores custom de tienda migrados a utilidades de Tailwind arbitrarias
const storeStyles: Record<string, { icon: any; className: string }> = {
    'Steam': {
        icon: faSteam,
        className: 'bg-[#172337] hover:bg-[#2a475e] text-white border-transparent',
    },
    'Itch': {
        icon: faItchIo,
        className: 'bg-[#fa5c5c] hover:bg-[#ff7f7f] text-white border-transparent',
    },
    'Nintendo Shop': {
        icon: faGamepad,
        className: 'bg-[#e60012] hover:bg-[#ff334f] text-white border-transparent',
    },
    'PlayStation Store': {
        icon: faPlaystation,
        className: 'bg-[#0070d1] hover:bg-[#0084f7] text-white border-transparent',
    },
    'Microsoft Store': {
        icon: faXbox,
        className: 'bg-[#107b10] hover:bg-[#00bfff] text-white border-transparent',
    },
    'Play Store': {
        icon: faGooglePlay,
        className: 'bg-[#00a185] hover:bg-[#00c9a6] text-white border-transparent',
    },
    'App Store': {
        icon: faApple,
        className: 'bg-[#000000] hover:bg-[#333333] text-white border-transparent',
    },
    'Meta': {
        icon: faMeta,
        className: 'bg-[#0078ff] hover:bg-[#3391ff] text-white border-transparent',
    },
    'GOG': {
        icon: faGamepad,
        className: 'bg-[#c99aff] hover:bg-[#3391ff] text-white border-transparent',
    },
    'Default': {
        icon: faGlobe,
        className: 'bg-primary hover:bg-primary/80 text-white border-transparent',
    },
};

const StoreButton = ({ store, gameSlug, gameTitle }: StoreButtonProps) => {
    const style = storeStyles[store.name] || storeStyles['Default'];

    return (
        <a
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-sm gap-2 no-animation ${style.className}`}
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