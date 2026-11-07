import { ComponentChildren } from 'preact';

interface PageTransitionProps {
    children: ComponentChildren;
    className?: string;
}

/**
 * Standard page entry animation. Implemented with CSS so it does not pull the
 * GSAP runtime into the initial bundle.
 */
const PageTransition = ({ children, className = '' }: PageTransitionProps) => (
    <div className={`w-full animate-fade-in-up ${className}`}>
        {children}
    </div>
);

export default PageTransition;
