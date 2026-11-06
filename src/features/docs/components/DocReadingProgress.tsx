import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

interface DocReadingProgressProps {
    accentColor?: string;
}

const DocReadingProgress = ({ accentColor = '#6366f1' }: DocReadingProgressProps) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
        };
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);

    return (
        <div
            role="progressbar"
            aria-label="Progreso de lectura"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none"
        >
            <div
                className="h-full transition-[width] duration-100 ease-out"
                style={{ width: `${progress}%`, background: accentColor }}
            />
        </div>
    );
};

export default DocReadingProgress;
