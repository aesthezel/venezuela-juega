import {
    faInstagram,
    faGithub,
    faLinkedin,
    faXTwitter,
    faYoutube,
    faTwitch,
    faItchIo,
} from '@fortawesome/free-brands-svg-icons';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

/**
 * Mapeo de iconos oficiales de marcas y redes sociales.
 */
export function getPlatformIcon(platform: string): IconDefinition {
    const key = platform.toLowerCase();
    if (key.includes('instagram') || key === 'ig') return faInstagram;
    if (key.includes('github')) return faGithub;
    if (key.includes('linkedin')) return faLinkedin;
    if (key.includes('twitter') || key === 'x') return faXTwitter;
    if (key.includes('youtube')) return faYoutube;
    if (key.includes('twitch')) return faTwitch;
    if (key.includes('itch')) return faItchIo;
    return faArrowUpRightFromSquare;
}

/**
 * Color de acento característico de cada plataforma.
 */
export function getPlatformColor(platform: string): string {
    const key = platform.toLowerCase();
    if (key.includes('instagram') || key === 'ig') return '#E1306C';
    if (key.includes('github')) return '#f0f6fc';
    if (key.includes('linkedin')) return '#0A66C2';
    if (key.includes('twitter') || key === 'x') return '#1DA1F2';
    if (key.includes('youtube')) return '#FF0000';
    if (key.includes('twitch')) return '#9146FF';
    if (key.includes('itch')) return '#FA5C5C';
    return '#6366f1';
}

