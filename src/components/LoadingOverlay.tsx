// TODO: tweak and create a mask!

import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { gsap } from 'gsap';

interface LoadingOverlayProps {
    isLoading: boolean;
    logoSrc?: string;
    onAnimationComplete?: () => void;
}

const DEFAULT_LOGO_SRC = "https://venezuela-juega.s3.us-east-005.dream.io/brand/VenezuelaJuega_White.png";

const LoadingOverlay = ({
                            isLoading,
                            logoSrc = DEFAULT_LOGO_SRC,
                            onAnimationComplete
                        }: LoadingOverlayProps) => {

    const overlayRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const [isVisible, setIsVisible] = useState(true); // Controla la visibilidad real del elemento

    useEffect(() => {
        if (!isLoading && isVisible) {
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                onComplete: () => {
                    setIsVisible(false);
                    if (onAnimationComplete) {
                        onAnimationComplete();
                    }
                }
            });

            gsap.to(logoRef.current, {
                scale: 100,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        } else if (isLoading && !isVisible) {
            setIsVisible(true);
            gsap.set(overlayRef.current, { opacity: 1 });
            gsap.set(logoRef.current, { scale: 1, opacity: 1 });
        }
    }, [isLoading, isVisible, onAnimationComplete]);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 overflow-hidden"
            style={{ opacity: 1 }}
        >
            <img
                ref={logoRef}
                src={logoSrc}
                alt="Venezuela Juega Logo"
                className="w-32 h-32 object-contain"
                style={{ transform: 'scale(1)', opacity: 1 }}
            />
        </div>
    );
};

export default LoadingOverlay;