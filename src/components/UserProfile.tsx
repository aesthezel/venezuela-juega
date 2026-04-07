import { useState, useEffect, useMemo } from 'preact/hooks';
import { route } from 'preact-router';
import { useSpacetimeDB } from '@/src/spacetimedb/connection';
import { useGamesData } from '@/src/hooks/useGamesData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar, faHistory, faClose, faExchangeAlt, faMagic, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';

const UserProfile = () => {
    const { connection, identity, isConnected } = useSpacetimeDB();
    const { games, jamGames } = useGamesData();
    const [profile, setProfile] = useState<{ xp: bigint, level: number } | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [favorites, setFavorites] = useState<any[]>([]);
    const [hasInteracted, setHasInteracted] = useState(() => {
        if (typeof window === 'undefined') return true;
        return localStorage.getItem('vj_profile_interacted') === 'true';
    });

    const allGamesMap = useMemo(() => {
        const map = new Map();
        [...games, ...jamGames].forEach(g => {
            map.set(g.slug, g);
        });
        return map;
    }, [games, jamGames]);

    useEffect(() => {
        if (!isConnected || !identity || !connection) return;

        const updateProfile = () => {
            const rows = Array.from(connection.db.profile.iter());
            const myProfile = rows.find(r => r.id.toHexString() === identity);
            if (myProfile) {
                setProfile({ xp: myProfile.xp, level: Number(myProfile.level) });
            }
        };

        const updateActivity = () => {
            const myFavorites = Array.from(connection.db.my_activity.iter())
                .filter(row => row.isFavorite === true);
            setFavorites(myFavorites);
        };

        updateProfile();
        updateActivity();

        connection.db.profile.onInsert(updateProfile);
        connection.db.profile.onUpdate(updateProfile);
        connection.db.my_activity.onInsert(updateActivity);
        connection.db.my_activity.onUpdate(updateActivity);

        return () => {
            if (connection) {
                connection.db.profile.removeOnInsert(updateProfile);
                connection.db.profile.removeOnUpdate(updateProfile);
                connection.db.my_activity.removeOnInsert(updateActivity);
                connection.db.my_activity.removeOnUpdate(updateActivity);
            }
        };
    }, [isConnected, identity, connection]);

    if (!isConnected) return null;

    const handleToggleHistory = () => {
        setShowHistory(!showHistory);
        if (!hasInteracted) {
            setHasInteracted(true);
            localStorage.setItem('vj_profile_interacted', 'true');
        }
    };

    const displayLevel = profile?.level.toString() || "0";
    const displayXP = profile?.xp.toString() || "0";
    const nextLevelXP = (Number(displayLevel) || 1) * 100;
    const progress = Math.min(100, (Number(displayXP) / nextLevelXP) * 100);

    return (
        <div className="relative flex items-center">
            {/* User Badge Trigger */}
            <div
                className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-md px-1.5 py-1.5 md:pl-4 md:pr-1.5 md:py-1.5 rounded-full md:rounded-2xl border border-white/10 hover:border-white/20 shadow-lg cursor-pointer transition-all group relative"
                onClick={handleToggleHistory}
            >
                {/* Notification Badge */}
                {!hasInteracted && (
                    <div className="absolute -top-0.5 -left-0.5 z-50">
                        <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse" />
                    </div>
                )}

                <div className="hidden md:flex flex-col items-end pr-1">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider leading-none">
                        Nivel {displayLevel}
                    </span>
                    <div className="w-16 h-1 bg-slate-950/50 rounded-full mt-1.5 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="relative">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 shadow-inner border border-white/10 transition-all group-hover:scale-95">
                        <FontAwesomeIcon icon={faUser} className="text-sm md:text-base" />
                    </div>
                </div>
            </div>

            {/* Dropdown Menu */}
            {showHistory && (
                <div className="fixed md:absolute top-[80px] md:top-full mt-8 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 w-[320px] max-w-[calc(100vw-32px)] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top md:origin-top-right">
                    {/* Header */}
                    <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-800/20">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                <FontAwesomeIcon icon={faMagicWandSparkles} />
                            </div>
                            <h3 className="text-xs font-bold text-white uppercase tracking-wide">Experiencia del visitante</h3>
                        </div>
                        <button onClick={() => setShowHistory(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </div>

                    {/* Stats Section */}
                    <div className="p-8 text-center bg-gradient-to-b from-slate-800/10 to-transparent">
                        <div className="inline-flex items-center justify-center p-1 rounded-full bg-slate-950/40 mb-4 border border-white/5">
                            <div className="px-4 py-1.5 rounded-full bg-cyan-500/30 text-cyan-100 text-[10px] font-black uppercase tracking-tighter">
                                Luciernaga
                            </div>
                        </div>
                        <div className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.2em] mb-1">Nivel {displayLevel}</div>
                        <div className="text-5xl font-black text-white mb-2 tracking-tighter">{displayXP}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-4">Puntos de Experiencia</div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-[220px] mx-auto">
                            Al descubrir juegos ganas puntos, estos puntos pronto podrás canjearlos por sorpresas.
                        </p>
                    </div>

                    {/* Favorites Section */}
                    <div className="px-4 pb-4">
                        <div className="bg-slate-950/40 rounded-2xl border border-white/5 p-4">
                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2 px-1">
                                <FontAwesomeIcon icon={faStar} /> Juegos Favoritos ({favorites.length})
                            </h4>

                            {favorites.length > 0 ? (
                                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                    {favorites.map(fav => {
                                        const game = allGamesMap.get(fav.gameSlug);
                                        return (
                                            <button
                                                key={fav.gameSlug}
                                                onClick={() => {
                                                    setShowHistory(false);
                                                    route(`/game/${fav.gameSlug}`);
                                                }}
                                                className="w-full flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] hover:translate-x-1 border border-white/5 transition-all text-left group/item"
                                            >
                                                {/* Game Thumbnail */}
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10">
                                                    {game?.imageUrl ? (
                                                        <img
                                                            src={game.imageUrl}
                                                            alt={game.title}
                                                            className="w-full h-full object-cover transition-transform group-hover/item:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                            <FontAwesomeIcon icon={faStar} size="xs" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="text-xs font-bold text-slate-200 group-hover/item:text-cyan-400 transition-colors capitalize truncate">
                                                        {game?.title || fav.gameSlug.replace(/-/g, ' ')}
                                                    </span>
                                                    <span className="text-[9px] text-slate-500">
                                                        {fav.visitCount} visitas
                                                    </span>
                                                </div>
                                                <FontAwesomeIcon icon={faStar} className="text-[10px] text-yellow-500/50 group-hover/item:text-yellow-500 transition-colors" />
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-8 flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-700">
                                        <FontAwesomeIcon icon={faStar} size="lg" />
                                    </div>
                                    <p className="text-[10px] text-slate-500 italic max-w-[120px] text-center">
                                        Explora el catálogo y guarda tus juegos preferidos.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Tip */}
                    <div className="p-4 bg-slate-950/20 flex justify-center">
                        <span className="text-[9px] text-slate-600 uppercase font-black tracking-tighter">Continúa explorando</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;