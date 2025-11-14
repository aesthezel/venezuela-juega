import {FunctionComponent, h} from 'preact';
import {useRef} from "preact/hooks";

const DEFAULT_LOGO_SRC = "https://venezuela-juega.s3.us-east-005.dream.io/brand/VenezuelaJuega_White.png";

interface LoadingSpinnerProps {
    logoSrc?: string;
}

const LoadingSpinner: FunctionComponent<LoadingSpinnerProps> = ({logoSrc = DEFAULT_LOGO_SRC} : LoadingSpinnerProps) => {

    const logoRef = useRef<HTMLImageElement>(null);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95"
            role="status"
            aria-live="polite"
            aria-label="Cargando la lista de Venezuela Juega"
        >
            <div className="flex flex-col items-center text-center px-6">
                <img
                    ref={logoRef}
                    src={logoSrc}
                    alt="Venezuela Juega Logo"
                    className="w-32 h-32 object-contain"
                    style={{transform: 'scale(1)', opacity: 1}}
                />

                <div
                    className="mt-5 md:mt-6 h-1 w-24 rounded-full bg-cyan-400/70 motion-reduce:animate-none animate-pulse"
                    aria-hidden="true"
                />

                <p className="mt-6 text-base md:text-lg text-cyan-400 bg-slate-800/50 px-4 py-2 rounded-full">
                    La lista de videojuegos está cargando...
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;