import { route } from 'preact-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/AuthContext';

interface AuthButtonProps {
    variant?: 'desktop' | 'mobile';
    /** Called after navigating/logging out — used to close the mobile menu. */
    onAction?: () => void;
}

const AuthButton = ({ variant = 'desktop', onAction }: AuthButtonProps) => {
    const { user, loading, logout } = useAuth();

    // Avoid flashing the wrong state during the OIDC redirect round-trip.
    if (loading) return null;

    const profile = user?.profile as Record<string, unknown> | undefined;
    const displayName =
        (profile?.name as string) ||
        (profile?.preferred_username as string) ||
        (profile?.email as string) ||
        'Mi cuenta';
    const picture = profile?.picture as string | undefined;

    const goLogin = () => { route('/login'); onAction?.(); };
    const doLogout = async () => { await logout(); onAction?.(); };

    // ── Mobile (full-width rows in the sidebar) ──────────────────────────
    if (variant === 'mobile') {
        if (!user) {
            return (
                <button
                    onClick={goLogin}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-accent-teal-dark/20 border border-accent-teal-dark/40 text-white w-full cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-xl bg-accent-teal-dark text-base-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faRightToBracket} />
                    </div>
                    <span className="font-bold">Iniciar sesión</span>
                </button>
            );
        }
        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-surface-700">
                    <div className="w-9 h-9 rounded-full bg-base-300 overflow-hidden flex items-center justify-center text-accent-teal shrink-0">
                        {picture ? <img src={picture} alt="" className="w-full h-full object-cover" /> : <FontAwesomeIcon icon={faUser} />}
                    </div>
                    <span className="text-sm font-bold text-base-content truncate">{displayName}</span>
                </div>
                <button
                    onClick={doLogout}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-surface-700 text-base-content/70 hover:text-white cursor-pointer"
                >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <span className="font-bold text-sm">Cerrar sesión</span>
                </button>
            </div>
        );
    }

    // ── Desktop (compact) ────────────────────────────────────────────────
    if (!user) {
        return (
            <button
                onClick={goLogin}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white/5 hover:bg-white/10 border border-surface-700 text-base-content hover:text-white transition-all cursor-pointer"
                title="Iniciar sesión"
            >
                <FontAwesomeIcon icon={faRightToBracket} className="text-xs" />
                <span>Entrar</span>
            </button>
        );
    }
    return (
        <div className="hidden md:flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-2xl bg-white/5 border border-surface-700">
            <div className="w-8 h-8 rounded-full bg-base-300 overflow-hidden flex items-center justify-center text-accent-teal shrink-0">
                {picture ? <img src={picture} alt="" className="w-full h-full object-cover" /> : <FontAwesomeIcon icon={faUser} className="text-xs" />}
            </div>
            <span className="text-xs font-bold text-base-content max-w-[120px] truncate">{displayName}</span>
            <button
                onClick={doLogout}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-base-content/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
            >
                <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
            </button>
        </div>
    );
};

export default AuthButton;
