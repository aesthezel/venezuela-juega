import { useLayoutEffect, useRef } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import gsap from 'gsap';

interface PageTransitionProps {
    children: ComponentChildren;
    className?: string;
}

/**
 * PageTransition component
 * Applies a global standardized entry animation using GSAP.
 * Effect: Fade in + subtle Translate Y.
 */
const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (containerRef.current) {
            // Ensure initial state to avoid flash of content
            gsap.set(containerRef.current, { opacity: 0, y: 15 });

            gsap.to(containerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "cubic-bezier(0.4, 0, 0.2, 1)",
                force3D: true,
                onComplete: () => {
                    // Optional: clean up if needed, though usually not necessary for a page wrapper
                }
            });
        }
    }, []);

    return (
        <div ref={containerRef} className={`w-full ${className}`} style={{ opacity: 0 }}>
            {children}
        </div>
    );
};

export default PageTransition;
