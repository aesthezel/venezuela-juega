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
            className="modal modal-open z-[9999] bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                className="modal-box max-w-5xl w-[90vw] h-[85vh] bg-transparent shadow-none p-0 flex items-center justify-center overflow-visible"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-circle btn-ghost absolute -top-4 sm:-top-12 -right-4 sm:-right-12 text-white/70 hover:text-white bg-black/50 hover:bg-white/20 z-[10001] shadow-xl border border-surface-700"
                    aria-label="Cerrar"
                >
                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>

                {/* Navigation Arrows */}
                {screenshots.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); showPrev(); }}
                            className="btn btn-circle btn-ghost absolute left-0 sm:-left-16 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-white/20 z-[10001] shadow-xl border border-surface-700"
                            aria-label="Anterior"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
                        </button>

                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); showNext(); }}
                            className="btn btn-circle btn-ghost absolute right-0 sm:-right-16 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-white/20 z-[10001] shadow-xl border border-surface-700"
                            aria-label="Siguiente"
                        >
                            <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
                        </button>
                    </>
                )}

                {/* Image Container */}
                <div
                    className="w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-500 pointer-events-none"
                >
                    <img
                        src={screenshots[currentIndex]}
                        alt={`Screenshot ampliada ${currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-surface-700 pointer-events-auto"
                    />
                </div>
            </div>

            {/* Counter */}
            <div className="fixed bottom-8 left-0 right-0 text-center pointer-events-none">
                <span className="badge badge-lg bg-black/50 text-white/80 border border-surface-700 backdrop-blur-md px-6 py-4 uppercase tracking-[0.2em] font-black">
                    {currentIndex + 1} / {screenshots.length}
                </span>
            </div>
        </div>
    );

    return createPortal(lightboxContent, document.body);
};

export default ScreenshotLightbox;
