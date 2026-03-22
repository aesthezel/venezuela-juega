import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { Game } from '@/src/types';
import { RoutableProps, route } from 'preact-router';
import { CoverImage, BackButton } from '@/src/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrophy, faMapMarkerAlt, faCalendarAlt, faUsers,
    faChevronDown, faChevronUp, faGamepad, faGlobe,
    faFire, faLocationDot, faLayerGroup, faArrowRight
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
        const parsed = JSON.parse(socialsString);
        if (Array.isArray(parsed)) {
            return parsed.filter(
                (item): item is VenueSocialLink =>
                    typeof item === 'object' &&
                    typeof item.red === 'string' &&
                    typeof item.link === 'string'
            );
        }
    } catch (e) {
        console.warn('Error parsing venue socials:', e);
    }
    return [];
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

const VenueSocialLinks = ({ socials }: { socials: VenueSocialLink[] }) => {
    if (socials.length === 0) return null;
    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {socials.map((social, index) => (
                <a
                    key={`${social.red}-${index}`}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    class={`w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/60 border border-slate-600/50 text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-slate-700 ${getSocialHoverColor(social.red)}`}
                    title={social.red.charAt(0).toUpperCase() + social.red.slice(1)}
                >
                    <FontAwesomeIcon icon={getSocialIcon(social.red)} className="text-xs" />
                </a>
            ))}
        </div>
    );
};

const GameCard = ({ game, onGameClick, accentColor }: {
    game: JamGame;
    onGameClick: (game: Game) => void;
    accentColor: string;
}) => {
    const [hovered, setHovered] = useState(false);
    return (
        <article
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800/80 via-transparent to-transparent" />

                {game.isHighlighted && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-white shadow-lg">
                        <FontAwesomeIcon icon={faTrophy} className="text-[10px]" />
                        Destacado
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <h3
                    className="text-sm font-bold leading-tight line-clamp-2 transition-colors duration-200"
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

                {game.pitch || game.description ? (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
                        {game.pitch || game.description}
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
                    <div className="w-12 h-12 rounded-xl bg-slate-700/50 border border-slate-600/50 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                        <img
                            src={venue.logo}
                            alt={`Logo ${venue.name}`}
                            className="w-full h-full object-contain"
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
                    <VenueSocialLinks socials={venue.socials} />
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

            {/* Games grid */}
            {isExpanded && (
                <div className="px-5 pb-6 pt-1">
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
                    <p className="text-orange-500 font-semibold text-xs uppercase tracking-widest mb-1">
                        {edition.orgName}
                    </p>
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

    const processedData = useMemo(() => {
        if (!games?.length || !settings?.length) return [];

        const settingsByUID = new Map<string, JamSettingRow>();
        settings.forEach(s => { if (s.UID) settingsByUID.set(s.UID, s); });

        const editionVenueGames = new Map<string, Map<string, JamGame[]>>();

        games.forEach(game => {
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

                venues.push({
                    id: `${editionYear}-${venueUID}`,
                    uid: venueUID,
                    name: setting.Venue,
                    city: setting.Venue_City || setting.Venue,
                    accentColor: palette.grad,
                    accentColorSolid: palette.solid,
                    logo: setting.Venue_Logo?.trim() || undefined,
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
    }, [games, settings]);

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
            <header className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">
                            Game Jams
                            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent"> Venezuela</span>
                        </h1>
                        <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
                            Videojuegos creados por desarrolladores venezolanos en eventos de 48 horas.
                            Explora ediciones, sedes y el talento detrás de cada juego.
                        </p>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="flex flex-wrap gap-3 mt-6">
                    {[
                        { icon: faGamepad, value: totalStats.games, label: 'Juegos', color: '#f97316' },
                        { icon: faCalendarAlt, value: totalStats.editions, label: 'Ediciones', color: '#a855f7' },
                        { icon: faLayerGroup, value: totalStats.venues, label: 'Sedes', color: '#06b6d4' },
                        { icon: faLocationDot, value: totalStats.cities, label: 'Ciudades', color: '#10b981' },
                    ].map(({ icon, value, label, color }) => (
                        <div
                            key={label}
                            className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/40 rounded-xl px-4 py-2.5"
                        >
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: `${color}1a` }}
                            >
                                <FontAwesomeIcon icon={icon} style={{ color }} className="text-xs" />
                            </div>
                            <div>
                                <p className="text-white font-black text-lg leading-none">{value}</p>
                                <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wide">{label}</p>
                            </div>
                        </div>
                    ))}
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