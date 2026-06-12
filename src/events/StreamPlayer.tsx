import { useState, useMemo, useEffect } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faVideoSlash, faPlay, faRotate } from '@fortawesome/free-solid-svg-icons';

interface StreamPlayerProps {
    twitchChannel?: string;
    youtubeVideoId?: string;
    youtubePlaylistId?: string;
    /** Show Twitch chat sidebar when on the Twitch tab. */
    isLive: boolean;
}

type Tab = 'twitch' | 'youtube';

const getHost = (): string => {
    if (typeof window === 'undefined') return 'localhost';
    return window.location.hostname;
};

const StreamPlayer = ({ twitchChannel, youtubeVideoId, youtubePlaylistId, isLive }: StreamPlayerProps) => {
    const hasTwitch = !!twitchChannel;
    const hasYouTube = !!(youtubeVideoId || youtubePlaylistId);
    // Lazy: ningún embed se monta hasta que el usuario elija.
    const [tab, setTab] = useState<Tab | null>(null);
    const host = useMemo(getHost, []);

    // Theater mode: oculta Header/Footer/ScrollToTop cuando hay stream cargado.
    useEffect(() => {
        if (tab === null) return;
        document.body.classList.add('vj-theater');
        return () => document.body.classList.remove('vj-theater');
    }, [tab]);

    if (!hasTwitch && !hasYouTube) {
        return (
            <div className="aspect-video w-full max-w-4xl mx-auto bg-base-300 rounded-2xl border border-surface-700 flex flex-col items-center justify-center text-base-content/50 gap-3">
                <FontAwesomeIcon icon={faVideoSlash} className="text-3xl" />
                <p className="text-sm">Aún no hay transmisión configurada para este evento.</p>
            </div>
        );
    }

    const twitchSrc = hasTwitch
        ? `https://player.twitch.tv/?channel=${encodeURIComponent(twitchChannel!)}&parent=${host}&muted=false`
        : '';
    const twitchChatSrc = hasTwitch
        ? `https://www.twitch.tv/embed/${encodeURIComponent(twitchChannel!)}/chat?parent=${host}&darkpopout`
        : '';
    const youtubeSrc = hasYouTube
        ? (youtubeVideoId
            ? `https://www.youtube.com/embed/${encodeURIComponent(youtubeVideoId)}`
            : `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(youtubePlaylistId!)}`)
        : '';

    const showChat = tab === 'twitch' && hasTwitch && isLive;

    // ── Pre-load: nada montado, solo botones de elección. ──
    if (tab === null) {
        return (
            <div className="aspect-video w-full max-w-4xl mx-auto bg-base-300 rounded-2xl border border-surface-700 flex flex-col items-center justify-center gap-6 p-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <FontAwesomeIcon icon={faPlay} className="text-4xl text-base-content/40" />
                    <h3 className="text-lg font-bold text-white">Elige cómo ver el stream</h3>
                    <p className="text-sm text-base-content/60 max-w-md">
                        Selecciona una plataforma. Solo se carga la que elijas — sin reproducciones simultáneas en segundo plano.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    {hasTwitch && (
                        <button
                            type="button"
                            onClick={() => setTab('twitch')}
                            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold border bg-[#9146ff]/15 border-[#9146ff]/40 text-[#bf94ff] hover:bg-[#9146ff]/25 hover:scale-105 transition-all shadow-lg"
                            aria-label="Cargar transmisión Twitch"
                        >
                            <FontAwesomeIcon icon={faTwitch} className="text-base" />
                            Ver en Twitch
                        </button>
                    )}
                    {hasYouTube && (
                        <button
                            type="button"
                            onClick={() => setTab('youtube')}
                            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold border bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25 hover:scale-105 transition-all shadow-lg"
                            aria-label="Cargar transmisión YouTube"
                        >
                            <FontAwesomeIcon icon={faYoutube} className="text-base" />
                            Ver en YouTube
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── Player montado. ── (ancho completo del container — para que el chat lateral tenga espacio)
    return (
        <div>
            {/* Tabs siempre visibles cuando hay un tab activo (permiten cambiar) */}
            <div role="tablist" className="flex items-center gap-2 mb-3 flex-wrap">
                {hasTwitch && (
                    <button
                        role="tab"
                        aria-selected={tab === 'twitch'}
                        onClick={() => setTab('twitch')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${tab === 'twitch'
                            ? 'bg-[#9146ff]/15 border-[#9146ff]/40 text-[#bf94ff]'
                            : 'bg-white/5 border-surface-700 text-base-content/70 hover:text-white'}`}
                    >
                        <FontAwesomeIcon icon={faTwitch} /> Twitch
                    </button>
                )}
                {hasYouTube && (
                    <button
                        role="tab"
                        aria-selected={tab === 'youtube'}
                        onClick={() => setTab('youtube')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${tab === 'youtube'
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                            : 'bg-white/5 border-surface-700 text-base-content/70 hover:text-white'}`}
                    >
                        <FontAwesomeIcon icon={faYoutube} /> YouTube
                    </button>
                )}

                {/* Botón pausar / cerrar player → vuelve al pre-load (descarga el iframe). */}
                <button
                    type="button"
                    onClick={() => setTab(null)}
                    className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border bg-white/5 border-surface-700 text-base-content/60 hover:text-white transition-all"
                    aria-label="Detener stream y descargar embed"
                    title="Descarga el embed para liberar recursos"
                >
                    <FontAwesomeIcon icon={faRotate} /> Cerrar player
                </button>
            </div>

            <div className={`grid gap-4 ${showChat ? 'lg:grid-cols-[1fr_340px]' : 'grid-cols-1'}`}>
                <div className="aspect-video w-full bg-base-300 rounded-2xl overflow-hidden border border-surface-700">
                    {tab === 'twitch' && hasTwitch && (
                        <iframe
                            // key forza unmount/remount al cambiar de tab → mata el embed anterior.
                            key="twitch-player"
                            src={twitchSrc}
                            title="Twitch player"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    )}
                    {tab === 'youtube' && hasYouTube && (
                        <iframe
                            key="youtube-player"
                            src={youtubeSrc}
                            title="YouTube player"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            className="w-full h-full"
                        />
                    )}
                </div>

                {showChat && (
                    <div className="h-[60vh] lg:h-auto min-h-[420px] bg-base-300 rounded-2xl overflow-hidden border border-surface-700">
                        <iframe
                            key="twitch-chat"
                            src={twitchChatSrc}
                            title="Twitch chat"
                            className="w-full h-full"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StreamPlayer;
