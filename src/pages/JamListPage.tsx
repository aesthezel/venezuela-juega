import { h } from 'preact';
import { useMemo, useState, useEffect } from 'preact/hooks';
import { RoutableProps, route } from 'preact-router';
import { Game } from '@/types';
import { SearchBar, AlphaFilter, CoverImage, PageLayout } from '@/components';
import { getActiveJams } from '@/features/jam/registry';
import type { JamEvent } from '@/features/jam/types';
import { getTrailerInfo } from '@/utils';
import { useMeasure } from '@/hooks/useMeasure';
import { useTextLayout } from '@/hooks/useTextLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrophy, faMapMarkerAlt, faCalendarAlt, faUsers,
    faChevronDown, faChevronUp, faGamepad, faGlobe,
    faFire, faLocationDot, faLayerGroup, faArrowRight,
    faExternalLinkAlt, faHeart, faClock, faRocket
} from '@fortawesome/free-solid-svg-icons';
import {
    faDiscord, faInstagram, faTwitter, faYoutube,
    faTiktok, faFacebook, faTwitch, faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface VenueSocialLink {
    red: string;
    link: string;
}

export interface JamSettingRow {
    Organization: string;
    Venue: string;
    Venue_City: string;
    Venue_Logo_URL?: string;
    Venue_Logo?: string;
    Venue_Socials?: string;
    Order_Priority: string;
    UID: string;
}

export interface JamGame extends Game {
    Jam_Org_UID?: string;
    Jam_Edition?: string;
}

interface JamListPageProps extends RoutableProps {
    games?: JamGame[];
    settings?: JamSettingRow[];
    onGameClick?: (game: Game) => void;
}

interface ProcessedEdition {
    id: string;
    year: string;
    orgName: string;
    venues: ProcessedVenue[];
}

interface ProcessedVenue {
    id: string;
    uid: string;
    name: string;
    city: string;
    accentColor: string;
    accentColorSolid: string;
    logo?: string;
    logoTheme: 'day' | 'night';
    socials: VenueSocialLink[];
    games: JamGame[];
    orderPriority: number;
}

// ─── Social & Palette Utilities ───────────────────────────────────────────────

const getSocialIcon = (redName: string): IconDefinition => {
    const iconMap: Record<string, IconDefinition> = {
        discord: faDiscord, instagram: faInstagram, twitter: faTwitter,
        x: faTwitter, youtube: faYoutube, tiktok: faTiktok,
        facebook: faFacebook, twitch: faTwitch, linkedin: faLinkedin,
    };
    return iconMap[redName.toLowerCase()] || faGlobe;
};

const getSocialHoverColor = (redName: string): string => {
    const colorMap: Record<string, string> = {
        discord: 'hover:text-accent-indigo hover:border-accent-indigo/40',
        instagram: 'hover:text-pink-400 hover:border-pink-400/40',
        twitter: 'hover:text-sky-400 hover:border-sky-400/40',
        x: 'hover:text-base-content hover:border-surface-700',
        youtube: 'hover:text-secondary hover:border-secondary/40',
        tiktok: 'hover:text-pink-500 hover:border-pink-500/40',
        facebook: 'hover:text-primary hover:border-primary/40',
        twitch: 'hover:text-accent-mauve hover:border-accent-mauve/40',
        linkedin: 'hover:text-primary hover:border-primary/40',
    };
    return colorMap[redName.toLowerCase()] || 'hover:text-accent-teal hover:border-accent-teal/40';
};

const parseSocials = (socialsString?: string): VenueSocialLink[] => {
    if (!socialsString?.trim()) return [];
    try {
        if (socialsString.trim().startsWith('[')) {
            const parsed = JSON.parse(socialsString);
            if (Array.isArray(parsed)) {
                return parsed.filter(
                    (item): item is VenueSocialLink =>
                        typeof item === 'object' &&
                        item !== null &&
                        'red' in item && typeof item.red === 'string' &&
                        'link' in item && typeof item.link === 'string'
                );
            }
        }

        const links = socialsString.split(',').map((s) => s.trim()).filter(Boolean);
        const parsedLinks: VenueSocialLink[] = [];
        for (const link of links) {
            const idx = link.indexOf(':');
            if (idx > -1) {
                const redTrim = link.substring(0, idx).trim().toLowerCase();
                const urlTrim = link.substring(idx + 1).trim();
                if (redTrim && urlTrim) {
                    parsedLinks.push({ red: redTrim, link: urlTrim });
                }
            }
        }
        if (parsedLinks.length > 0) return parsedLinks;
    } catch (e) {
        console.warn('Error parsing venue socials:', e);
    }
    return [];
};

const processImageUrl = (rawUrl?: string): { url?: string; theme: 'day' | 'night' } => {
    if (!rawUrl) return { url: undefined, theme: 'day' };

    let url = rawUrl.trim();
    let theme: 'day' | 'night' = 'day';

    if (url.toLowerCase().startsWith('night:')) {
        theme = 'night';
        url = url.substring(6).trim();
    } else if (url.toLowerCase().startsWith('day:')) {
        theme = 'day';
        url = url.substring(4).trim();
    }

    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch && driveMatch[1]) {
        return { url: `https://drive.google.com/uc?id=${driveMatch[1]}`, theme };
    }

    return { url, theme };
};

const VENUE_PALETTES = [
    { grad: 'from-accent-orange to-amber-400', solid: '#f97316' },
    { grad: 'from-accent-teal-dark to-brand-blue', solid: '#06b6d4' },
    { grad: 'from-accent-mauve-dark to-fuchsia-500', solid: '#a855f7' },
    { grad: 'from-accent-lime-dark to-teal-500', solid: '#10b981' },
    { grad: 'from-rose-500 to-pink-500', solid: '#f43f5e' },
    { grad: 'from-accent-indigo to-violet-500', solid: '#6366f1' },
    { grad: 'from-brand-gold to-accent-orange', solid: '#eab308' },
    { grad: 'from-teal-500 to-accent-teal', solid: '#14b8a6' },
];

const getVenuePalette = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return VENUE_PALETTES[Math.abs(hash) % VENUE_PALETTES.length];
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

const VenueSocialLinks = ({ socials, limitInHeader }: { socials: VenueSocialLink[]; limitInHeader?: boolean }) => {
    if (socials.length === 0) return null;

    if (!limitInHeader) {
        return (
            <div className="flex items-center gap-1.5 flex-wrap">
                {socials.map((social, index) => (
                    <a
                        key={`${social.red}-${index}`}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg bg-base-300/60 border border-surface-700 text-base-content/70 transition-all duration-200 hover:scale-110 hover:bg-base-300 ${getSocialHoverColor(social.red)}`}
                        title={social.red.charAt(0).toUpperCase() + social.red.slice(1)}
                    >
                        <FontAwesomeIcon icon={getSocialIcon(social.red)} className="text-xs" />
                    </a>
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 flex-nowrap">
            {socials.map((social, index) => {
                let displayClass = 'flex';
                if (index > 2) displayClass = 'hidden';
                else if (index > 0) displayClass = 'hidden sm:flex';

                return (
                    <a
                        key={`${social.red}-${index}`}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`w-8 h-8 items-center justify-center rounded-lg bg-base-300/60 border border-surface-700 text-base-content/70 transition-all duration-200 hover:scale-110 hover:bg-base-300 flex-shrink-0 ${getSocialHoverColor(social.red)} ${displayClass}`}
                        title={social.red.charAt(0).toUpperCase() + social.red.slice(1)}
                    >
                        <FontAwesomeIcon icon={getSocialIcon(social.red)} className="text-xs" />
                    </a>
                );
            })}

            {socials.length > 1 && (
                <div className="w-8 h-8 flex sm:hidden items-center justify-center rounded-lg bg-base-300/80 border border-surface-700 text-base-content/70 text-[10px] font-bold flex-shrink-0 cursor-default" title="Más redes">
                    +{socials.length - 1}
                </div>
            )}

            {socials.length > 3 && (
                <div className="w-8 h-8 hidden sm:flex items-center justify-center rounded-lg bg-base-300/80 border border-surface-700 text-base-content/70 text-[10px] font-bold flex-shrink-0 cursor-default" title="Más redes">
                    +{socials.length - 3}
                </div>
            )}
        </div>
    );
};

const GameCard = ({
    game,
    onGameClick,
    accentColor,
}: {
    game: JamGame;
    onGameClick?: (game: Game) => void;
    accentColor: string;
}) => {
    const [hovered, setHovered] = useState(false);
    const trailerInfo = useMemo(() => getTrailerInfo(game.trailerUrl), [game.trailerUrl]);
    const { ref: containerRef, width: containerWidth } = useMeasure<HTMLElement>();

    const { lineCount: titleLineCount } = useTextLayout(game.title, containerWidth - 32, {
        fontSize: 14,
        lineHeight: 18,
    });

    const descriptionText = game.pitch || game.description;
    const { lineCount: descLineCount } = useTextLayout(descriptionText, containerWidth - 32, {
        fontSize: 12,
        lineHeight: 16,
    });

    return (
        <article
            ref={containerRef}
            onClick={() => onGameClick?.(game)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative bg-base-300/60 rounded-xl overflow-hidden border border-surface-700 hover:border-surface-700 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 flex flex-col"
        >
            <div className="relative aspect-video overflow-hidden bg-base-200/80 flex-shrink-0">
                <CoverImage
                    src={game.imageHero || game.imageCover || game.imageUrl}
                    alt={game.title}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {hovered && trailerInfo && (
                    trailerInfo.type === 'youtube' ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerInfo.id}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&loop=1&playlist=${trailerInfo.id}&rel=0`}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] pointer-events-none opacity-0 transition-opacity duration-700 z-5 max-w-none"
                            allow="autoplay; encrypted-media"
                            title={`${game.title} trailer`}
                            onLoad={(e) => {
                                if (e.target instanceof HTMLIFrameElement) {
                                    e.target.classList.remove('opacity-0');
                                    e.target.classList.add('opacity-100');
                                }
                            }}
                        />
                    ) : (
                        <video
                            src={trailerInfo.url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 transition-opacity duration-700 z-5"
                            onCanPlay={(e) => {
                                if (e.target instanceof HTMLVideoElement) {
                                    e.target.classList.remove('opacity-0');
                                    e.target.classList.add('opacity-100');
                                }
                            }}
                        />
                    )
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-surface-800/80 via-transparent to-transparent z-10 pointer-events-none" />

                {game.isHighlighted && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-white shadow-lg z-10">
                        <FontAwesomeIcon icon={faTrophy} className="text-[10px]" />
                        Destacado
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1">
                <h3
                    className={`text-sm font-bold leading-tight transition-colors duration-200 ${titleLineCount > 2 ? 'line-clamp-2' : ''}`}
                    style={{ color: hovered ? accentColor : '#ffffff' }}
                >
                    {game.title}
                </h3>

                {game.developers?.length > 0 && (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <FontAwesomeIcon icon={faUsers} className="text-base-content/70 text-[10px] flex-shrink-0" />
                        <p className="text-xs text-base-content/70 truncate">
                            {Array.isArray(game.developers) ? game.developers.join(', ') : game.developers}
                        </p>
                    </div>
                )}

                {descriptionText ? (
                    <p className={`text-xs text-base-content/70 leading-relaxed flex-1 ${descLineCount > 2 ? 'line-clamp-2' : ''}`}>
                        {descriptionText}
                    </p>
                ) : (
                    <div className="flex-1" />
                )}

                {game.genre?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {game.genre.slice(0, 3).map((genre) => (
                            <span key={genre} className="text-[10px] px-1.5 py-0.5 bg-base-300/50 text-base-content/70 rounded border border-surface-700">
                                {genre}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div
                className="h-0.5 transition-all duration-500 ease-out"
                style={{
                    width: hovered ? '100%' : '0%',
                    background: `linear-gradient(to right, ${accentColor}, transparent)`,
                }}
            />
        </article>
    );
};

const VenueSection = ({
    venue,
    onGameClick,
    isExpanded,
    onToggle,
}: {
    venue: ProcessedVenue;
    onGameClick?: (game: Game) => void;
    isExpanded: boolean;
    onToggle: () => void;
}) => {
    const [btnHovered, setBtnHovered] = useState(false);
    const c = venue.accentColorSolid;

    return (
        <div
            className="rounded-2xl overflow-hidden border border-surface-700 bg-base-300/30 backdrop-blur-sm transition-all duration-300"
            style={isExpanded ? { boxShadow: `0 0 0 1px ${c}30, 0 8px 32px -4px ${c}20` } : {}}
        >
            <button
                onClick={onToggle}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                className="w-full flex items-center gap-4 p-5 text-left transition-colors duration-200"
                style={{ backgroundColor: btnHovered ? 'rgba(255,255,255,0.04)' : 'transparent' }}
            >
                <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ background: `linear-gradient(to bottom, ${c}, ${c}55)` }}
                />

                {venue.logo ? (
                    <div
                        className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center p-1.5 overflow-hidden transition-transform duration-300 hover:scale-105 ${venue.logoTheme === 'night'
                            ? 'bg-base-200 border border-surface-700 shadow-[0_0_12px_rgba(0,0,0,0.3)]'
                            : 'bg-white border border-surface-700 shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                            }`}
                    >
                        <img src={venue.logo} alt={`Logo ${venue.name}`} className="w-full h-full object-contain drop-shadow-sm" />
                    </div>
                ) : (
                    <div
                        className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                        style={{ background: `${c}22`, border: `1px solid ${c}44` }}
                    >
                        <FontAwesomeIcon icon={faLocationDot} style={{ color: c }} className="text-lg" />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="text-base font-bold transition-colors truncate" style={{ color: btnHovered ? c : '#ffffff' }}>
                            {venue.name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-base-content/70">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-base-content/70 text-[10px]" />
                            {venue.city}
                        </span>
                        <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ color: c, background: `${c}1a`, border: `1px solid ${c}35` }}
                        >
                            {venue.games.length} {venue.games.length === 1 ? 'juego' : 'juegos'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <VenueSocialLinks socials={venue.socials} limitInHeader />
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200" style={{ background: `${c}1a`, color: c }}>
                        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="text-xs" />
                    </div>
                </div>
            </button>

            {isExpanded && (
                <div className="px-5 pb-6 pt-1 animate-[jam-fade-in_0.3s_ease-out]">
                    <div className="mb-6 flex flex-col md:flex-row gap-6 items-center md:items-start bg-base-200/40 p-5 rounded-2xl border border-surface-700 shadow-inner">
                        {venue.logo ? (
                            <div
                                className={`w-32 h-32 rounded-2xl flex-shrink-0 flex items-center justify-center p-3 overflow-hidden ${venue.logoTheme === 'night'
                                    ? 'bg-base-200 border border-surface-700 shadow-[0_0_20px_rgba(0,0,0,0.4)]'
                                    : 'bg-white border border-surface-700 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                    }`}
                            >
                                <img src={venue.logo} alt={`Logo ${venue.name}`} className="w-full h-full object-contain drop-shadow-md" />
                            </div>
                        ) : (
                            <div className="w-32 h-32 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: `${c}22`, border: `1px solid ${c}44` }}>
                                <FontAwesomeIcon icon={faLocationDot} style={{ color: c }} className="text-4xl" />
                            </div>
                        )}

                        <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full">
                            <h3 className="text-2xl font-black text-white mb-2">{venue.name}</h3>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                <span className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full text-base-content/70 bg-base-300 border border-surface-700">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-base-content/70" />
                                    {venue.city}
                                </span>
                            </div>
                            <p className="text-base-content/70 text-sm leading-relaxed max-w-2xl mb-4">
                                Esta sede oficial fue el punto de encuentro en {venue.city} para organizar equipos y darle vida a {venue.games.length} {venue.games.length === 1 ? 'juego asombroso' : 'juegos asombrosos'}.
                            </p>

                            {venue.socials.length > 0 && (
                                <div className="flex items-center justify-center md:justify-start gap-3 pt-3 border-t border-surface-700">
                                    <span className="text-xs text-base-content/70 font-semibold uppercase tracking-wider">Redes:</span>
                                    <VenueSocialLinks socials={venue.socials} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <FontAwesomeIcon icon={faGamepad} className="text-lg" style={{ color: c }} />
                        <h4 className="text-white font-bold text-lg">Juegos desarrollados</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {venue.games.map((game) => (
                            <GameCard
                                key={game.id || game.title}
                                game={game}
                                onGameClick={onGameClick}
                                accentColor={c}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const EditionSection = ({
    edition,
    onGameClick,
}: {
    edition: ProcessedEdition;
    onGameClick?: (game: Game) => void;
}) => {
    const [expandedVenues, setExpandedVenues] = useState<Set<string>>(new Set());

    const toggleVenue = (venueId: string) => {
        setExpandedVenues((prev) => {
            const newSet = new Set(prev);
            newSet.has(venueId) ? newSet.delete(venueId) : newSet.add(venueId);
            return newSet;
        });
    };

    const expandAll = () => setExpandedVenues(new Set(edition.venues.map((v) => v.id)));
    const collapseAll = () => setExpandedVenues(new Set());

    const totalGamesInEdition = edition.venues.reduce((acc, v) => acc + v.games.length, 0);
    const allExpanded = expandedVenues.size === edition.venues.length;

    return (
        <section className="mb-16">
            <div className="flex items-start gap-5 mb-6">
                <div className="hidden md:flex flex-col items-center justify-center bg-base-300 border border-surface-700 rounded-2xl px-4 py-3 shadow-lg flex-shrink-0">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-accent-orange text-xl mb-1" />
                    <span className="text-accent-orange font-black text-lg leading-none">{edition.year}</span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl md:text-3xl font-black text-white">
                            Edición <span className="text-accent-orange">{edition.year}</span>
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-xs font-bold px-3 py-1 rounded-full">
                                <FontAwesomeIcon icon={faGamepad} className="text-[10px]" />
                                {totalGamesInEdition} juegos
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-base-300/50 border border-surface-700 text-base-content/70 text-xs font-medium px-3 py-1 rounded-full">
                                <FontAwesomeIcon icon={faLayerGroup} className="text-[10px]" />
                                {edition.venues.length} {edition.venues.length === 1 ? 'sede' : 'sedes'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {edition.venues.map((v) => (
                            <span
                                key={v.id}
                                className="text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1"
                                style={{
                                    color: v.accentColorSolid,
                                    background: `${v.accentColorSolid}20`,
                                    border: `1px solid ${v.accentColorSolid}35`,
                                }}
                            >
                                <FontAwesomeIcon icon={faLocationDot} className="text-[9px]" />
                                {v.city}
                            </span>
                        ))}
                    </div>
                </div>

                {edition.venues.length > 1 && (
                    <button
                        onClick={allExpanded ? collapseAll : expandAll}
                        className="hidden sm:flex items-center gap-2 text-xs text-base-content/70 hover:text-base-content transition-colors bg-base-300/60 border border-surface-700 px-3 py-2 rounded-lg flex-shrink-0 mt-1"
                    >
                        <FontAwesomeIcon icon={allExpanded ? faChevronUp : faChevronDown} className="text-[10px]" />
                        {allExpanded ? 'Colapsar todo' : 'Expandir todo'}
                    </button>
                )}
            </div>

            <div className="h-px bg-gradient-to-r from-accent-orange/30 via-surface-700/50 to-transparent mb-6" />

            <div className="flex flex-col gap-3">
                {edition.venues.map((venue) => (
                    <VenueSection
                        key={venue.id}
                        venue={venue}
                        onGameClick={onGameClick}
                        isExpanded={expandedVenues.has(venue.id)}
                        onToggle={() => toggleVenue(venue.id)}
                    />
                ))}
            </div>
        </section>
    );
};

// ─── Live In-Progress / Upcoming Jam Card ──────────────────────────────────────

const LiveJamCard = ({ jam }: { jam: JamEvent }) => {
    const isLive = jam.status === 'active' || jam.status === 'open';
    const accent = jam.accentColor || '#f97316';

    const statusBadgeText: Record<string, string> = {
        active: 'EN CURSO',
        open: 'INSCRIPCIONES ABIERTAS',
        upcoming: 'PRÓXIMAMENTE',
        voting: 'VOTACIÓN',
        ended: 'FINALIZADA',
        draft: 'BORRADOR',
    };

    return (
        <div
            className="group relative rounded-3xl overflow-hidden border border-surface-700 bg-base-300/60 backdrop-blur-xl shadow-2xl hover:border-secondary/60 transition-all duration-500 flex flex-col justify-between"
            style={{
                boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5)`,
            }}
        >
            {/* Background Cover / Hero Image with blur and opacity */}
            {jam.heroImage ? (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                        src={jam.heroImage}
                        alt={jam.name}
                        className="w-full h-full object-cover filter blur-[3px] opacity-30 group-hover:opacity-45 scale-105 group-hover:scale-110 transition-all duration-700 ease-out"
                    />
                    {/* Layered dark gradients for maximum text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-base-300 via-base-300/80 to-base-300/50" />
                    <div className="absolute inset-0 bg-gradient-to-r from-base-300/90 via-base-300/40 to-base-300/90" />
                </div>
            ) : (
                <div
                    className="absolute inset-0 z-0 opacity-25 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                    style={{
                        background: jam.heroGradient
                            ? undefined
                            : `radial-gradient(ellipse 80% 80% at 50% 20%, ${accent}44 0%, transparent 80%)`,
                    }}
                />
            )}

            {/* Top Accent Strip */}
            <div
                className="relative z-10 h-1.5 w-full transition-all duration-300 group-hover:h-2"
            />

            {/* Card Body */}
            <div className="relative z-10 p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
                <div>
                    {/* Header Badges & Platform */}
                    <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                        <div className="flex items-center gap-2">
                            {isLive ? (
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                                    </span>
                                    {statusBadgeText[jam.status] || jam.status}
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                                    <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                                    {statusBadgeText[jam.status] || jam.status}
                                </span>
                            )}

                            {jam.isCharity && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md">
                                    <FontAwesomeIcon icon={faHeart} className="text-[10px]" />
                                    Benéfico
                                </span>
                            )}
                        </div>

                        <span className="text-xs font-mono font-bold text-base-content/60 bg-base-300/80 px-2.5 py-1 rounded-lg border border-surface-700 uppercase tracking-wider backdrop-blur-md">
                            Ed. {jam.edition.toUpperCase()} · {jam.platform ?? 'Itch.io'}
                        </span>
                    </div>

                    {/* Optional Jam Logo */}
                    {jam.logo && (
                        <div className="mb-3">
                            <img
                                src={jam.logo}
                                alt={`Logo ${jam.name}`}
                                className="h-10 sm:h-12 w-auto object-contain max-w-[160px] filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    )}

                    {/* Jam Title & Tagline */}
                    <h3
                        className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 group-hover:text-secondary transition-colors cursor-pointer"
                        onClick={() => route(`/jam/${jam.slug}`)}
                    >
                        {jam.name}
                    </h3>
                    {jam.tagline && (
                        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed mb-5 font-normal">
                            {jam.tagline}
                        </p>
                    )}

                    {/* Date / Time Details */}
                    {jam.startDate && (
                        <div className="flex items-center gap-2.5 text-xs font-bold text-secondary bg-secondary/15 px-4 py-2.5 rounded-xl border border-secondary/30 w-fit mb-2 backdrop-blur-md shadow-sm">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-[12px]" />
                            <span>
                                {new Date(jam.startDate).toLocaleDateString('es-VE', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="pt-5 border-t border-surface-700/80 flex items-center gap-3 flex-wrap">
                    <button
                        onClick={() => route(`/jam/${jam.slug}`)}
                        className="btn btn-secondary font-black flex-1 shadow-lg gap-2"
                    >
                        <span>Explorar Jam</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

type HubTab = 'all' | 'live' | 'ended' | 'history';

const JamListPage = ({ games = [], settings = [], onGameClick }: JamListPageProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeAlpha, setActiveAlpha] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<HubTab>('all');

    const cmsJams = useMemo(() => getActiveJams(), []);
    const inProgressOrUpcomingJams = useMemo(
        () => cmsJams.filter((j) => ['active', 'open', 'upcoming', 'voting'].includes(j.status)),
        [cmsJams]
    );
    const endedJams = useMemo(
        () => cmsJams.filter((j) => j.status === 'ended'),
        [cmsJams]
    );

    useEffect(() => {
        document.title = 'Game Jams realizadas en Venezuela';
        let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
        }
        meta.content =
            '¡Game Jams realizadas en Venezuela! Participa en jams en curso, hackathons activos y explora el catálogo histórico de videojuegos realizados en jams.';
    }, []);

    // Filter historical games
    const filteredGames = useMemo(() => {
        let result = games;

        if (activeAlpha) {
            const normalizeFirstChar = (title: string) => {
                const trimmed = (title || '').trim();
                if (!trimmed) return '';
                const first = trimmed[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return first.toUpperCase();
            };
            result = result.filter((g) => {
                const character = normalizeFirstChar(g.title);
                const isLetter = /^[A-Z]$/.test(character);
                if (activeAlpha === '#') return !isLetter;
                return character === activeAlpha;
            });
        }

        if (searchTerm.trim().length >= 2) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(
                (g) =>
                    g.title.toLowerCase().includes(searchLower) ||
                    g.developers.some((dev) => dev.toLowerCase().includes(searchLower))
            );
        }

        return result;
    }, [games, activeAlpha, searchTerm]);

    // Group historical games into editions & venues
    const processedEditions = useMemo(() => {
        if (!filteredGames?.length || !settings?.length) return [];

        const settingsByUID = new Map<string, JamSettingRow>();
        settings.forEach((s) => {
            if (s.UID) settingsByUID.set(s.UID, s);
        });

        const editionVenueGames = new Map<string, Map<string, JamGame[]>>();

        filteredGames.forEach((game) => {
            if (!game.Jam_Org_UID || !game.Jam_Edition) return;
            const setting = settingsByUID.get(game.Jam_Org_UID);
            if (!setting) return;

            const editionKey = game.Jam_Edition;
            if (!editionVenueGames.has(editionKey)) editionVenueGames.set(editionKey, new Map());
            const venueMap = editionVenueGames.get(editionKey)!;
            if (!venueMap.has(game.Jam_Org_UID)) venueMap.set(game.Jam_Org_UID, []);
            venueMap.get(game.Jam_Org_UID)!.push(game);
        });

        const editions: ProcessedEdition[] = [];

        editionVenueGames.forEach((venueMap, editionYear) => {
            const venues: ProcessedVenue[] = [];
            let orgName = '';

            venueMap.forEach((venueGames, venueUID) => {
                const setting = settingsByUID.get(venueUID);
                if (!setting) return;
                if (!orgName) orgName = setting.Organization;

                const palette = getVenuePalette(setting.Venue_City || setting.Venue);
                const logoData = processImageUrl(setting.Venue_Logo_URL || setting.Venue_Logo);

                venues.push({
                    id: `${editionYear}-${venueUID}`,
                    uid: venueUID,
                    name: setting.Venue,
                    city: setting.Venue_City || setting.Venue,
                    accentColor: palette.grad,
                    accentColorSolid: palette.solid,
                    logo: logoData.url,
                    logoTheme: logoData.theme,
                    socials: parseSocials(setting.Venue_Socials),
                    games: venueGames,
                    orderPriority: parseInt(setting.Order_Priority || '0', 10),
                });
            });

            venues.sort((a, b) => a.orderPriority - b.orderPriority);

            if (venues.length > 0) {
                editions.push({ id: `${orgName}-${editionYear}`, year: editionYear, orgName, venues });
            }
        });

        editions.sort((a, b) => {
            const yA = parseInt(a.year.replace(/\D/g, ''), 10) || 0;
            const yB = parseInt(b.year.replace(/\D/g, ''), 10) || 0;
            return yA !== yB ? yB - yA : b.year.localeCompare(a.year);
        });

        return editions;
    }, [filteredGames, settings]);

    // Statistics
    const totalStats = useMemo(() => {
        const totalGames = processedEditions.reduce(
            (acc, ed) => acc + ed.venues.reduce((vAcc, v) => vAcc + v.games.length, 0),
            0
        );
        const totalVenues = processedEditions.reduce((acc, ed) => acc + ed.venues.length, 0);
        const totalCities = new Set(processedEditions.flatMap((ed) => ed.venues.map((v) => v.city))).size;

        return {
            games: totalGames || games.length,
            editions: processedEditions.length,
            venues: totalVenues,
            cities: totalCities,
            liveJams: inProgressOrUpcomingJams.length,
            endedJams: endedJams.length,
        };
    }, [processedEditions, games.length, inProgressOrUpcomingJams.length, endedJams.length]);

    return (
        <PageLayout backButton>

            {/* ─── Hero Header & Stats ────────────────────────────────────────── */}
            <header className="mb-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4">
                            Game Jams
                            <span className="bg-gradient-to-r from-accent-orange to-amber-300 bg-clip-text text-transparent">
                                {' '}Venezuela
                            </span>
                        </h1>
                        <p className="text-base-content/70 text-base md:text-lg leading-relaxed">
                            Videojuegos desarrollados por la comunidad en maratones de 48 horas.
                            Participa en eventos en vivo, apoya causas benéficas y descubre todo el catálogo de juegos creados en Venezuela.
                        </p>
                    </div>

                    {/* Dashboard Stats */}
                    <div className="flex flex-wrap gap-3">
                        {[
                            { icon: faRocket, value: inProgressOrUpcomingJams.length, label: 'En Vivo / Próximas', color: '#10b981' },
                            { icon: faGamepad, value: totalStats.games, label: 'Juegos', color: '#a855f7' },
                            { icon: faCalendarAlt, value: totalStats.editions, label: 'Ediciones', color: '#f97316' },
                            { icon: faLocationDot, value: totalStats.cities || 1, label: 'Ciudades', color: '#06b6d4' },
                        ].map(({ icon, value, label, color }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 bg-base-300/40 backdrop-blur-sm border border-surface-700 rounded-2xl px-5 py-3 shadow-lg hover:border-surface-700 transition-colors"
                            >
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
                                    style={{ background: `${color}15`, border: `1px solid ${color}33` }}
                                >
                                    <FontAwesomeIcon icon={icon} style={{ color }} className="text-xs" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-xl leading-none mb-0.5">{value}</p>
                                    <p className="text-base-content/70 text-[10px] font-bold uppercase tracking-widest">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 mb-8 border-b border-surface-700 pb-4 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`btn btn-md font-black rounded-xl transition-all ${activeTab === 'all'
                            ? 'btn-primary text-white shadow-lg'
                            : 'btn-ghost text-base-content/70 hover:text-white'
                            }`}
                    >
                        <FontAwesomeIcon icon={faLayerGroup} className="text-xs" />
                        <span>Todos los eventos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`btn btn-md font-black rounded-xl transition-all ${activeTab === 'live'
                            ? 'btn-primary text-white shadow-lg'
                            : 'btn-ghost text-base-content/70 hover:text-white'
                            }`}
                    >
                        <FontAwesomeIcon icon={faFire} className="text-xs" />
                        <span>Próximamente ({inProgressOrUpcomingJams.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('ended')}
                        className={`btn btn-md font-black rounded-xl transition-all ${activeTab === 'ended'
                            ? 'btn-primary text-white shadow-lg'
                            : 'btn-ghost text-base-content/70 hover:text-white'
                            }`}
                    >
                        <FontAwesomeIcon icon={faTrophy} className="text-xs" />
                        <span>Finalizadas ({endedJams.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`btn btn-md font-black rounded-xl transition-all ${activeTab === 'history'
                            ? 'btn-primary text-white shadow-lg'
                            : 'btn-ghost text-base-content/70 hover:text-white'
                            }`}
                    >
                        <FontAwesomeIcon icon={faGamepad} className="text-xs" />
                        <span>Juegos realizados ({totalStats.games})</span>
                    </button>
                </div>
            </header>

            {/* ─── Section: Jams en Progreso & Próximas (CMS) ────────────────── */}
            {(activeTab === 'all' || activeTab === 'live') && inProgressOrUpcomingJams.length > 0 && (
                <section className="mb-20">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                                <FontAwesomeIcon icon={faRocket} className="text-lg" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    ¡Jams para participar!
                                </h2>
                                <p className="text-base-content/60 text-sm">
                                    Convocatorias abiertas listas para que participes
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {inProgressOrUpcomingJams.map((jam) => (
                            <LiveJamCard key={`${jam.slug}-${jam.edition}`} jam={jam} />
                        ))}
                    </div>
                </section>
            )}

            {/* ─── Section: Jams Finalizadas (CMS) ───────────────────────────── */}
            {activeTab === 'ended' && endedJams.length > 0 && (
                <section className="mb-20">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-base-300 border border-surface-700 flex items-center justify-center text-base-content/70">
                                <FontAwesomeIcon icon={faTrophy} className="text-lg" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    Jams y Eventos <span className="text-base-content/60">Finalizados</span>
                                </h2>
                                <p className="text-base-content/60 text-sm">
                                    Revive las ediciones concluidas, juegos entregados y causas apoyadas
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {endedJams.map((jam) => (
                            <LiveJamCard key={`${jam.slug}-${jam.edition}`} jam={jam} />
                        ))}
                    </div>
                </section>
            )}

            {/* ─── Section: Historial de Ediciones y Sedes (Games) ───────────── */}
            {(activeTab === 'all' || activeTab === 'history') && (

                <section>

                    <div className="relative group z-50 mb-12">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent-orange/10 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                        <div className="relative bg-base-200/50 backdrop-blur-xl border border-surface-700 rounded-[1.5rem] p-4 md:p-6 shadow-2xl">
                            <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center">
                                <div className="flex-1 lg:flex-[1.2]">
                                    <SearchBar
                                        searchTerm={searchTerm}
                                        onSearchChange={setSearchTerm}
                                        games={games}
                                        onSelectGame={onGameClick || (() => { })}
                                        renderSuggestionSubtitle={(game: JamGame) => {
                                            const setting = settings?.find((s) => s.UID === game.Jam_Org_UID);
                                            const venue = setting?.Venue || 'Sede';
                                            const org = setting?.Organization || 'Jam';
                                            return (
                                                <span className="flex items-center gap-1.5 text-[11px] mt-0.5">
                                                    <span className="text-accent-orange font-semibold">{venue}</span>
                                                    <span className="text-base-content/70">•</span>
                                                    <span className="text-base-content/70">
                                                        {org} {game.Jam_Edition}
                                                    </span>
                                                </span>
                                            );
                                        }}
                                    />
                                </div>

                                <div className="hidden lg:block w-px h-10 bg-base-300/50"></div>

                                <div className="flex-1 overflow-x-auto scrollbar-hide">
                                    <AlphaFilter
                                        activeAlpha={activeAlpha}
                                        onAlphaChange={setActiveAlpha}
                                        className="bg-transparent border-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center text-accent-orange">
                                <FontAwesomeIcon icon={faGamepad} className="text-lg" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    Catálogo Histórico por <span className="text-accent-orange">Edición y Sedes</span>
                                </h2>
                                <p className="text-base-content/60 text-sm">
                                    Todos los prototipos y videojuegos desarrollados en eventos anteriores
                                </p>
                            </div>
                        </div>
                    </div>

                    {processedEditions.length > 0 ? (
                        processedEditions.map((edition) => (
                            <EditionSection
                                key={edition.id}
                                edition={edition}
                                onGameClick={onGameClick}
                            />
                        ))
                    ) : games.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {filteredGames.map((game) => (
                                <GameCard
                                    key={game.id || game.title}
                                    game={game}
                                    onGameClick={onGameClick}
                                    accentColor="#f97316"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-base-300/30 border border-surface-700 rounded-3xl text-center">
                            <span className="text-6xl mb-4 opacity-40">🎮</span>
                            <h3 className="text-xl font-bold text-white mb-2">No se encontraron juegos</h3>
                            <p className="text-base-content/70 max-w-sm text-sm">
                                Prueba ajustando los filtros de búsqueda o la selección alfabética.
                            </p>
                        </div>
                    )}
                </section>
            )}
        </PageLayout>
    );
};

export default JamListPage;
