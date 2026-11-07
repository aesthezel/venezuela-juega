// TODO: tweak and create a mask!

import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

interface LoadingOverlayProps {
    isLoading: boolean;
    logoSrc?: string;
    onAnimationComplete?: () => void;
}

const DEFAULT_LOGO_SRC = "/brand/venezuela-juega-white.png";

/**
 * Full-screen loading overlay with a CSS-only fade-out.
 * (The previous GSAP timeline forced the 45 KB animation runtime into the
 * initial bundle for a component that is not even used on the home route.)
 */
const LoadingOverlay = ({
    isLoading,
    logoSrc = DEFAULT_LOGO_SRC,
    onAnimationComplete,
}: LoadingOverlayProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!isLoading && isVisible) {
            const timer = window.setTimeout(() => {
                setIsVisible(false);
                onAnimationComplete?.();
            }, 400);
            return () => window.clearTimeout(timer);
        }

        if (isLoading && !isVisible) {
            setIsVisible(true);
        }
    }, [isLoading, isVisible, onAnimationComplete]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-base-200 overflow-hidden transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-hidden={!isLoading}
        >
            <div
                className="vj-logo-shine w-32 h-32 transition-transform duration-300"
                style={{
                    transform: isLoading ? 'scale(1)' : 'scale(1.5)',
                    // Used as an alpha mask for the moving diagonal shine.
                    '--vj-logo': `url("${logoSrc}")`,
                } as Record<string, string>}
            >
                <img
                    src={logoSrc}
                    alt=""
                    width="128"
                    height="128"
                    className="w-full h-full object-contain"
                />
                <span className="vj-logo-sweep" aria-hidden="true" />
            </div>
        </div>
    );
};

export default LoadingOverlay;
