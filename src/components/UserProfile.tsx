import { useState, useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { useSpacetimeDB } from '@/src/spacetimedb/connection';
import { tables } from '@/src/spacetimedb/module_bindings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar, faHistory, faClose } from '@fortawesome/free-solid-svg-icons';

export const UserProfile = () => {
    const { connection, identity, isConnected } = useSpacetimeDB();
    const [profile, setProfile] = useState<{ xp: bigint, level: number } | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [favorites, setFavorites] = useState<any[]>([]);

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

    if (!isConnected || !profile) return null;

    const nextLevelXP = Number(profile.level) * 100;
    const progress = Math.min(100, (Number(profile.xp) / nextLevelXP) * 100);

    return (
        <div className="relative flex items-center gap-4">
            <div
                className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg cursor-pointer hover:bg-slate-800 transition-all group"
                onClick={() => setShowHistory(!showHistory)}
            >
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.1em]">Nivel {profile.level.toString()}</span>
                    <div className="w-20 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-cyan-400 shadow-xl border border-cyan-500/20 group-hover:border-cyan-500/50 transition-all">
                        <FontAwesomeIcon icon={faUser} className="text-sm" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 border-2 border-slate-950 flex items-center justify-center text-[10px] font-black text-slate-950 shadow-lg">
                        {profile.level.toString()}
                    </div>
                </div>
            </div>

            {showHistory && (
                <div className="absolute top-full mt-4 right-0 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                            Tu Progresión
                        </h3>
                        <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </div>
                    <div className="p-6 text-center">
                        <div className="text-3xl font-black text-white mb-1">{profile.xp.toString()}</div>
                        <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest mb-4">XP Total Acumulada</div>
                        <p className="text-xs text-slate-400 leading-relaxed italic">
                            Continúa visitando juegos para ganar más experiencia y subir de nivel.
                        </p>
                    </div>

                    <div className="p-4 border-t border-white/5">
                        <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} className="text-[8px] opacity-0" /> {/* Placeholder spacing */}
                            Juegos Favoritos ({favorites.length})
                        </h4>
                        {favorites.length > 0 ? (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {favorites.map(fav => (
                                    <button
                                        key={fav.gameSlug}
                                        onClick={() => {
                                            setShowHistory(false);
                                            route(`/game/${fav.gameSlug}`);
                                        }}
                                        className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group/item text-left"
                                    >
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-xs font-bold text-slate-200 group-hover/item:text-cyan-400 transition-colors uppercase truncate">
                                                {fav.gameSlug.replace(/-/g, ' ')}
                                            </span>
                                            <span className="text-[9px] text-slate-500 font-medium">
                                                {fav.visitCount} visitas personales
                                            </span>
                                        </div>
                                        <FontAwesomeIcon icon={faStar} className="text-[10px] text-yellow-500/80 ml-2 flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[10px] text-slate-500 italic text-center py-4">
                                No tienes juegos marcados como favoritos.
                            </p>
                        )}
                    </div>

                    <div className="p-3 bg-slate-950/50 border-t border-white/5 flex justify-center">
                        <span className="text-[9px] text-slate-500 uppercase font-black">Cada visita suma 10 puntos de experiencia</span>
                    </div>
                </div>
            )}
        </div>
    );
};
