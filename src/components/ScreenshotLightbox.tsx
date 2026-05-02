import { useEffect, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface ScreenshotLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    screenshots: string[];
    initialIndex?: number;
}

/**
 * ScreenshotLightbox component
 * A reusable, premium lightbox for viewing screenshots in full size.
 * Uses Preact Portals to render outside the main component tree for perfect positioning.
 */
const ScreenshotLightbox = ({ isOpen, onClose, screenshots, initialIndex = 0 }: ScreenshotLightboxProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Sync currentIndex when initialIndex changes or lightbox opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [initialIndex, isOpen]);

    const showPrev = () => {
        setCurrentIndex(prev => (prev - 1 + screenshots.length) % screenshots.length);
    };

    const showNext = () => {
        setCurrentIndex(prev => (prev + 1) % screenshots.length);
    };

    useEffect(() => {
        if (!isOpen) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };
        window.addEventListener('keydown', onKey);

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen, screenshots.length, onClose]);

    if (!isOpen || !screenshots || screenshots.length === 0) return null;

    const lightboxContent = (
        <div
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                type="button"
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all duration-300 z-[10001] shadow-xl border border-white/5"
                aria-label="Cerrar"
            >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>

            {/* Navigation Arrows */}
            {screenshots.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); showPrev(); }}
                        className="absolute left-4 sm:left-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-4 transition-all duration-300 z-[10001] shadow-xl border border-white/5"
                        aria-label="Anterior"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="text-2xl" />
                    </button>

                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); showNext(); }}
                        className="absolute right-4 sm:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-4 transition-all duration-300 z-[10001] shadow-xl border border-white/5"
                        aria-label="Siguiente"
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="text-2xl" />
                    </button>
                </>
            )}

            {/* Image Container */}
            <div
                className="relative w-[85vw] h-[80vh] flex items-center justify-center animate-in zoom-in-95 duration-500 pointer-events-none"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={screenshots[currentIndex]}
                    alt={`Screenshot ampliada ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/10 pointer-events-auto"
                />
            </div>

            {/* Counter */}
            <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                <span className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full text-white/80 text-[10px] font-black tracking-[0.2em] uppercase border border-white/5">
                    {currentIndex + 1} / {screenshots.length}
                </span>
            </div>
        </div>
    );

    return createPortal(lightboxContent, document.body);
};

export default ScreenshotLightbox;
