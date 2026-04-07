import { h } from 'preact';
import { useMemo, useState, useEffect } from 'preact/hooks';
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';
import { Game } from '@/src/types';
import { RoutableProps, route } from 'preact-router';
import { SearchBar, AlphaFilter, CoverImage, BackButton } from '@/src/components';
import { getTrailerInfo } from '@/src/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrophy, faMapMarkerAlt, faCalendarAlt, faUsers,
    faChevronDown, faChevronUp, faGamepad, faGlobe,
    faFire, faLocationDot, faLayerGroup, faArrowRight,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import {
    faDiscord, faInstagram, faTwitter, faYoutube,
    faTiktok, faFacebook, faTwitch, faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

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

interface JamGame extends Game {
    Jam_Org_UID?: string;
    Jam_Edition?: string;
}

interface GameJamsPageProps extends RoutableProps {
    games: JamGame[];
    settings?: JamSettingRow[];
    onGameClick: (game: Game) => void;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
        discord: 'hover:text-indigo-400 hover:border-indigo-400/40',
        instagram: 'hover:text-pink-400 hover:border-pink-400/40',
        twitter: 'hover:text-sky-400 hover:border-sky-400/40',
        x: 'hover:text-slate-200 hover:border-slate-400/40',
        youtube: 'hover:text-red-500 hover:border-red-500/40',
        tiktok: 'hover:text-pink-500 hover:border-pink-500/40',
        facebook: 'hover:text-blue-500 hover:border-blue-500/40',
        twitch: 'hover:text-purple-400 hover:border-purple-400/40',
        linkedin: 'hover:text-blue-400 hover:border-blue-400/40',
    };
    return colorMap[redName.toLowerCase()] || 'hover:text-cyan-400 hover:border-cyan-400/40';
};

const parseSocials = (socialsString?: string): VenueSocialLink[] => {
    if (!socialsString?.trim()) return [];
    try {
        // Intento 1: Parsear como JSON (Ej. [{"red": "twitter", "link": "https://..."}])
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

        // Intento 2: Parsear formato legible en Excel (Ej. "instagram:https://..., x:https://...")
        const links = socialsString.split(',').map(s => s.trim()).filter(Boolean);
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

    // Convertir links de Google Drive a links directos
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch && driveMatch[1]) {
        return { url: `https://drive.google.com/uc?id=${driveMatch[1]}`, theme };
    }

    return { url, theme };
};

// Each city/venue gets a unique accent color pair (gradient + solid)
const VENUE_PALETTES = [
    { grad: 'from-orange-500 to-amber-400', solid: '#f97316' },
    { grad: 'from-cyan-500 to-blue-500', solid: '#06b6d4' },
    { grad: 'from-purple-500 to-fuchsia-500', solid: '#a855f7' },
    { grad: 'from-emerald-500 to-teal-500', solid: '#10b981' },
    { grad: 'from-rose-500 to-pink-500', solid: '#f43f5e' },
    { grad: 'from-indigo-500 to-violet-500', solid: '#6366f1' },
    { grad: 'from-yellow-500 to-orange-400', solid: '#eab308' },
    { grad: 'from-teal-500 to-cyan-400', solid: '#14b8a6' },
];

const getVenuePalette = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return VENUE_PALETTES[Math.abs(hash) % VENUE_PALETTES.length];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const VenueSocialLinks = ({ socials, limitInHeader }: { socials: VenueSocialLink[], limitInHeader?: boolean }) => {
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
                        className={`w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/60 border border-slate-600/50 text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-slate-700 ${getSocialHoverColor(social.red)}`}
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
                        className={`w-8 h-8 items-center justify-center rounded-lg bg-slate-700/60 border border-slate-600/50 text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-slate-700 flex-shrink-0 ${getSocialHoverColor(social.red)} ${displayClass}`}
                        title={social.red.charAt(0).toUpperCase() + social.red.slice(1)}
                    >
                        <FontAwesomeIcon icon={getSocialIcon(social.red)} className="text-xs" />
                    </a>
                );
            })}

            {socials.length > 1 && (
                <div className="w-8 h-8 flex sm:hidden items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 text-[10px] font-bold flex-shrink-0 cursor-default" title="Más redes disponibles al expandir">
                    +{socials.length - 1}
                </div>
            )}

            {socials.length > 3 && (
                <div className="w-8 h-8 hidden sm:flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 text-[10px] font-bold flex-shrink-0 cursor-default" title="Más redes disponibles al expandir">
                    +{socials.length - 3}
                </div>
            )}
        </div>
    );
};

const GameCard = ({ game, onGameClick, accentColor }: {
    game: JamGame;
    onGameClick: (game: Game) => void;
    accentColor: string;
}) => {
    const [hovered, setHovered] = useState(false);
    const trailerInfo = useMemo(() => getTrailerInfo(game.trailerUrl), [game.trailerUrl]);
    const { ref: containerRef, width: containerWidth } = useMeasure<HTMLElement>();

    // Medición del título (tamaño 14px, interlineado ajustado)
    const { lineCount: titleLineCount } = useTextLayout(game.title, containerWidth - 32, {
        fontSize: 14,
        lineHeight: 18
    });

    // Medición de la descripción (tamaño 12px, interlineado ajustado)
    const descriptionText = game.pitch || game.description;
    const { lineCount: descLineCount } = useTextLayout(descriptionText, containerWidth - 32, {
        fontSize: 12,
        lineHeight: 16
    });

    return (
        <article
            ref={containerRef}
            onClick={() => onGameClick(game)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 flex flex-col"
        >
            {/* Cover image */}
            <div className="relative aspect-video overflow-hidden bg-slate-900/80 flex-shrink-0">
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
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] pointer-events-none opacity-0 transition-opacity duration-700"
                            style={{ zIndex: 5, maxWidth: 'none' }}
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
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 transition-opacity duration-700"
                            style={{ zIndex: 5 }}
                            onCanPlay={(e) => {
                                if (e.target instanceof HTMLVideoElement) {
                                    e.target.classList.remove('opacity-0');
                                    e.target.classList.add('opacity-100');
                                }
                            }}
                        />
                    )
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-800/80 via-transparent to-transparent" style={{ zIndex: 10, pointerEvents: 'none' }} />

                {game.isHighlighted && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-white shadow-lg" style={{ zIndex: 10 }}>
                        <FontAwesomeIcon icon={faTrophy} className="text-[10px]" />
                        Destacado
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <h3
                    className={`text-sm font-bold leading-tight transition-colors duration-200 ${titleLineCount > 2 ? 'line-clamp-2' : ''}`}
                    style={{ color: hovered ? accentColor : '#ffffff' }}
                >
                    {game.title}
                </h3>

                {game.developers?.length > 0 && (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <FontAwesomeIcon icon={faUsers} className="text-slate-500 text-[10px] flex-shrink-0" />
                        <p className="text-xs text-slate-400 truncate">
                            {Array.isArray(game.developers) ? game.developers.join(', ') : game.developers}
                        </p>
                    </div>
                )}

                {descriptionText ? (
                    <p className={`text-xs text-slate-500 leading-relaxed flex-1 ${descLineCount > 2 ? 'line-clamp-2' : ''}`}>
                        {descriptionText}
                    </p>
                ) : <div className="flex-1" />}

                {game.genre?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {game.genre.slice(0, 3).map((genre) => (
                            <span key={genre} className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-slate-400 rounded border border-slate-600/30">
                                {genre}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Accent bar at bottom */}
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

const VenueSection = ({ venue, onGameClick, isExpanded, onToggle }: {
    venue: ProcessedVenue;
    onGameClick: (game: Game) => void;
    isExpanded: boolean;
    onToggle: () => void;
}) => {
    const [btnHovered, setBtnHovered] = useState(false);
    const c = venue.accentColorSolid;

    return (
        <div
            className="rounded-2xl overflow-hidden border border-slate-700/40 bg-slate-800/30 backdrop-blur-sm transition-all duration-300"
            style={isExpanded ? {
                boxShadow: `0 0 0 1px ${c}30, 0 8px 32px -4px ${c}20`,
            } : {}}
        >
            {/* Venue header / toggle button */}
            <button
                onClick={onToggle}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                className="w-full flex items-center gap-4 p-5 text-left transition-colors duration-200"
                style={{ backgroundColor: btnHovered ? 'rgba(255,255,255,0.04)' : 'transparent' }}
            >
                {/* Left accent strip */}
                <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ background: `linear-gradient(to bottom, ${c}, ${c}55)` }}
                />

                {/* Logo or icon */}
                {venue.logo ? (
                    <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center p-1.5 overflow-hidden transition-transform duration-300 hover:scale-105 ${venue.logoTheme === 'night'
                        ? 'bg-slate-900 border border-slate-700/50 shadow-[0_0_12px_rgba(0,0,0,0.3)] group-hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                        : 'bg-white border border-slate-200/50 shadow-[0_0_12px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                        }`}>
                        <img
                            src={venue.logo}
                            alt={`Logo ${venue.name}`}
                            className="w-full h-full object-contain drop-shadow-sm"
                        />
                    </div>
                ) : (
                    <div
                        className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                        style={{ background: `${c}22`, border: `1px solid ${c}44` }}
                    >
                        <FontAwesomeIcon icon={faLocationDot} style={{ color: c }} className="text-lg" />
                    </div>
                )}

                {/* Venue info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3
                            className="text-base font-bold transition-colors truncate"
                            style={{ color: btnHovered ? c : '#ffffff' }}
                        >
                            {venue.name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-slate-500 text-[10px]" />
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

                {/* Socials + chevron */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <VenueSocialLinks socials={venue.socials} limitInHeader />
                    <div
                        className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200"
                        style={{ background: `${c}1a`, color: c }}
                    >
                        <FontAwesomeIcon
                            icon={isExpanded ? faChevronUp : faChevronDown}
                            className="text-xs"
                        />
                    </div>
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-5 pb-6 pt-1 animate-[jam-fade-in_0.3s_ease-out]">
                    {/* Resumen de la sede */}
                    <div className="mb-6 flex flex-col md:flex-row gap-6 items-center md:items-start bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50 shadow-inner">
                        {venue.logo ? (
                            <div className={`w-32 h-32 rounded-2xl flex-shrink-0 flex items-center justify-center p-3 overflow-hidden ${venue.logoTheme === 'night'
                                ? 'bg-slate-900 border border-slate-700/50 shadow-[0_0_20px_rgba(0,0,0,0.4)]'
                                : 'bg-white border border-slate-200/50 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                }`}>
                                <img
                                    src={venue.logo}
                                    alt={`Logo ${venue.name}`}
                                    className="w-full h-full object-contain drop-shadow-md"
                                />
                            </div>
                        ) : (
                            <div className="w-32 h-32 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: `${c}22`, border: `1px solid ${c}44` }}>
                                <FontAwesomeIcon icon={faLocationDot} style={{ color: c }} className="text-4xl" />
                            </div>
                        )}

                        <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full">
                            <h3 className="text-2xl font-black text-white mb-2">{venue.name}</h3>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                <span className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full text-slate-300 bg-slate-800 border border-slate-700">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-slate-400" />
                                    {venue.city}
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mb-4">
                                Esta sede oficial fue el punto de encuentro en {venue.city} para organizar equipos y darle vida a {venue.games.length} {venue.games.length === 1 ? 'juego asombroso' : 'juegos asombrosos'} durante la maratón de desarrollo.
                            </p>

                            {venue.socials.length > 0 && (
                                <div className="flex items-center justify-center md:justify-start gap-3 pt-3 border-t border-slate-700/50">
                                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Redes:</span>
                                    <VenueSocialLinks socials={venue.socials} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Games grid */}
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

const EditionSection = ({ edition, onGameClick }: {
    edition: ProcessedEdition;
    onGameClick: (game: Game) => void;
}) => {
    const [expandedVenues, setExpandedVenues] = useState<Set<string>>(new Set());

    const toggleVenue = (venueId: string) => {
        setExpandedVenues(prev => {
            const newSet = new Set(prev);
            newSet.has(venueId) ? newSet.delete(venueId) : newSet.add(venueId);
            return newSet;
        });
    };

    const expandAll = () => setExpandedVenues(new Set(edition.venues.map(v => v.id)));
    const collapseAll = () => setExpandedVenues(new Set());

    const totalGamesInEdition = edition.venues.reduce((acc, v) => acc + v.games.length, 0);
    const allExpanded = expandedVenues.size === edition.venues.length;

    return (
        <section className="mb-16">
            {/* Edition header */}
            <div className="flex items-start gap-5 mb-6">
                {/* Year accent block */}
                <div className="hidden md:flex flex-col items-center justify-center bg-slate-800 border border-slate-700/60 rounded-2xl px-4 py-3 shadow-lg flex-shrink-0">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-orange-500 text-xl mb-1" />
                    <span className="text-orange-400 font-black text-lg leading-none">{edition.year}</span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl md:text-3xl font-black text-white">
                            Edición <span className="text-orange-400">{edition.year}</span>
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
                                <FontAwesomeIcon icon={faGamepad} className="text-[10px]" />
                                {totalGamesInEdition} juegos
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-slate-700/50 border border-slate-600/40 text-slate-400 text-xs font-medium px-3 py-1 rounded-full">
                                <FontAwesomeIcon icon={faLayerGroup} className="text-[10px]" />
                                {edition.venues.length} {edition.venues.length === 1 ? 'sede' : 'sedes'}
                            </span>
                        </div>
                    </div>

                    {/* Venue city pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {edition.venues.map(v => (
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

                {/* Expand/Collapse all */}
                {edition.venues.length > 1 && (
                    <button
                        onClick={allExpanded ? collapseAll : expandAll}
                        className="hidden sm:flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors bg-slate-800/60 border border-slate-700/50 px-3 py-2 rounded-lg flex-shrink-0 mt-1"
                    >
                        <FontAwesomeIcon icon={allExpanded ? faChevronUp : faChevronDown} className="text-[10px]" />
                        {allExpanded ? 'Colapsar todo' : 'Expandir todo'}
                    </button>
                )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-orange-500/30 via-slate-700/50 to-transparent mb-6" />

            {/* Venues list */}
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

// ─── Page ─────────────────────────────────────────────────────────────────────

const GameJamsPage = ({ games, settings, onGameClick }: GameJamsPageProps) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [activeAlpha, setActiveAlpha] = useState<string | null>(null);

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
            result = result.filter(g =>
                g.title.toLowerCase().includes(searchLower) ||
                g.developers.some(dev => dev.toLowerCase().includes(searchLower))
            );
        }

        return result;
    }, [games, activeAlpha, searchTerm]);

    const processedData = useMemo(() => {
        if (!filteredGames?.length || !settings?.length) return [];

        const settingsByUID = new Map<string, JamSettingRow>();
        settings.forEach(s => { if (s.UID) settingsByUID.set(s.UID, s); });

        const editionVenueGames = new Map<string, Map<string, JamGame[]>>();

        filteredGames.forEach(game => {
            if (!game.Jam_Org_UID || !game.Jam_Edition) return;
            const setting = settingsByUID.get(game.Jam_Org_UID);
            if (!setting) {
                console.warn(`"${game.title}" tiene Jam_Org_UID="${game.Jam_Org_UID}" sin venue registrado`);
                return;
            }
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

    const totalStats = useMemo(() => {
        const totalGames = processedData.reduce((acc, ed) =>
            acc + ed.venues.reduce((vAcc, v) => vAcc + v.games.length, 0), 0);
        const totalVenues = processedData.reduce((acc, ed) => acc + ed.venues.length, 0);
        const totalCities = new Set(
            processedData.flatMap(ed => ed.venues.map(v => v.city))
        ).size;
        return { games: totalGames, editions: processedData.length, venues: totalVenues, cities: totalCities };
    }, [processedData]);

    return (
        <main className="container mx-auto px-4 py-8">
            <BackButton onClick={() => route('/')} className="mb-6" />

            {/* Page header */}
            <header className="mb-12">
                {/* Hero Section: Title & Stats */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4">
                            Game Jams
                            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent"> Venezuela</span>
                        </h1>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                            Videojuegos creados por desarrolladores venezolanos en eventos de 48 horas.
                            Explora ediciones, sedes y el talento detrás de cada juego.
                        </p>
                    </div>

                    {/* Stats bar - Dashboard style */}
                    <div className="flex flex-wrap gap-3">
                        {[
                            { icon: faGamepad, value: totalStats.games, label: 'Juegos', color: '#a855f7' },
                            { icon: faCalendarAlt, value: totalStats.editions, label: 'Ediciones', color: '#f97316' },
                            { icon: faLayerGroup, value: totalStats.venues, label: 'Sedes', color: '#06b6d4' },
                            { icon: faLocationDot, value: totalStats.cities, label: 'Ciudades', color: '#10b981' },
                        ].map(({ icon, value, label, color }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl px-5 py-3 shadow-lg hover:border-slate-600/50 transition-colors"
                            >
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
                                    style={{ background: `${color}15`, border: `1px solid ${color}33` }}
                                >
                                    <FontAwesomeIcon icon={icon} style={{ color }} className="text-xs" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-xl leading-none mb-0.5">{value}</p>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Discovery Toolbar: Search & Filter */}
                <div className="relative group z-50">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-[1.5rem] p-4 md:p-6 shadow-2xl">
                        <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center">
                            {/* Search area */}
                            <div className="flex-1 lg:flex-[1.2]">
                                <SearchBar
                                    searchTerm={searchTerm}
                                    onSearchChange={setSearchTerm}
                                    games={games}
                                    onSelectGame={onGameClick}
                                    renderSuggestionSubtitle={(game: JamGame) => {
                                        const setting = settings?.find(s => s.UID === game.Jam_Org_UID);
                                        const venue = setting?.Venue || 'Sede desconocida';
                                        const org = setting?.Organization || 'Jam';
                                        return (
                                            <span className="flex items-center gap-1.5 text-[11px] mt-0.5">
                                                <span className="text-orange-400 font-semibold">{venue}</span>
                                                <span className="text-slate-500">•</span>
                                                <span className="text-slate-400">{org} {game.Jam_Edition}</span>
                                            </span>
                                        );
                                    }}
                                />
                            </div>

                            {/* Separator for desktop */}
                            <div className="hidden lg:block w-px h-10 bg-slate-700/50"></div>

                            {/* Alpha Filter area */}
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
            </header>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-orange-500/20 via-slate-700/30 to-transparent mb-12" />

            {/* Editions */}
            {processedData.length > 0 ? (
                processedData.map(edition => (
                    <EditionSection
                        key={edition.id}
                        edition={edition}
                        onGameClick={onGameClick}
                    />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-slate-800/30 border border-slate-700/40 rounded-2xl text-center">
                    <div className="text-6xl mb-6 opacity-40">👾</div>
                    <h3 className="text-xl font-bold text-white mb-2">Sin datos de Game Jams</h3>
                    <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                        No se encontraron juegos o aún estamos cargando los datos de las jams.
                    </p>
                </div>
            )}

            <style>{`
                @keyframes jam-fade-in {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .jam-page { animation: jam-fade-in 0.4s ease-out forwards; }
            `}</style>
        </main>
    );
};

export default GameJamsPage;