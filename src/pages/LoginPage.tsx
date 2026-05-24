import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import type { RoutableProps } from 'preact-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faSpinner, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { PageTransition } from '@/components';
import { useAuth } from '@/hooks/AuthContext';

const LoginPage = (_: RoutableProps) => {
    const { user, loading, signInGoogle, signInGithub } = useAuth();
    const [busy, setBusy] = useState<'google' | 'github' | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Redirect home once authenticated. `replace` so Back doesn't return to /login.
    useEffect(() => {
        if (!loading && user) route('/', true);
    }, [user, loading]);

    const handleSignIn = async (provider: 'google' | 'github', fn: () => Promise<void>) => {
        setError(null);
        setBusy(provider);
        try {
            await fn();
            // onIdTokenChanged → user set → effect routes home.
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'No se pudo iniciar sesión.';
            setError(msg);
            setBusy(null);
        }
    };

    return (
        <PageTransition>
            <main className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
                <div className="w-full max-w-md">
                    <div className="bg-base-200/60 backdrop-blur-xl border border-surface-700 rounded-[2rem] shadow-2xl p-8 lg:p-10 relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 blur-[80px] pointer-events-none" />

                        <div className="text-center mb-8 relative">
                            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                                <FontAwesomeIcon icon={faRightToBracket} className="text-xl" />
                            </div>
                            <h1 className="text-2xl font-black text-base-content tracking-tight">Iniciar sesión</h1>
                            <p className="text-sm text-base-content/60 mt-2 leading-relaxed">
                                Accede con tu cuenta para guardar tu actividad en Venezuela Juega.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-5 text-sm text-secondary bg-secondary/10 border border-secondary/20 rounded-xl px-4 py-3">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 relative">
                            <button
                                type="button"
                                onClick={() => handleSignIn('google', signInGoogle)}
                                disabled={busy !== null}
                                className="btn btn-block bg-base-100 hover:bg-base-300 border border-surface-700 text-base-content font-bold gap-3 rounded-2xl h-12 disabled:opacity-60"
                            >
                                <FontAwesomeIcon icon={busy === 'google' ? faSpinner : faGoogle} className={busy === 'google' ? 'animate-spin' : 'text-[#ea4335]'} />
                                Continuar con Google
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSignIn('github', signInGithub)}
                                disabled={busy !== null}
                                className="btn btn-block bg-base-100 hover:bg-base-300 border border-surface-700 text-base-content font-bold gap-3 rounded-2xl h-12 disabled:opacity-60"
                            >
                                <FontAwesomeIcon icon={busy === 'github' ? faSpinner : faGithub} className={busy === 'github' ? 'animate-spin' : ''} />
                                Continuar con GitHub
                            </button>
                        </div>

                        <p className="text-[11px] text-base-content/40 text-center mt-8 leading-relaxed">
                            Al continuar aceptas que tu actividad quede asociada a tu cuenta.
                        </p>
                    </div>
                </div>
            </main>
        </PageTransition>
    );
};

export default LoginPage;
