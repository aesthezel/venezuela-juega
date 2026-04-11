import { h } from 'preact';
import type { CategoryPreset } from './categoryPresets';

/** Convert hex color to CSS rgb triplet string */
const hexToRgb = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

export interface CategoryCardProps {
    preset: CategoryPreset;
    gameCount: number;
    backgroundSrc?: string;
    /** Optional URL to override the background image entirely */
    overrideImageUrl?: string;
    onClick: () => void;
    index: number;
}

const CategoryCard = ({ preset, gameCount, backgroundSrc, overrideImageUrl, onClick, index }: CategoryCardProps) => {
    const tintRgb = hexToRgb(preset.accentFrom);
    const bgUrl = overrideImageUrl || backgroundSrc;

    return (
        <button
            onClick={onClick}
            className={`
                category-card group relative overflow-hidden rounded-lg cursor-pointer
                flex-shrink-0 w-[280px] sm:w-[220px] md:w-[240px]
                aspect-[1/1.6] sm:aspect-[1/1.85]
                border border-white/[0.06]
                transition-all duration-500 ease-out
                hover:scale-[1.04] hover:border-white/[0.2]
                hover:shadow-2xl hover:shadow-black/60
                focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/50
                text-left
            `}
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Background Image — blurs on hover for readability */}
            {bgUrl ? (
                <img
                    src={bgUrl}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover
                               transition-all duration-500 ease-out
                               group-hover:scale-110 group-hover:blur-sm"
                />
            ) : (
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(180deg, ${preset.accentFrom}55 0%, ${preset.accentTo}22 100%)`
                    }}
                />
            )}

            {/* GOG-style colored inset overlay */}
            <div
                className="absolute inset-0 transition-all duration-500
                           group-hover:opacity-60"
                style={{
                    boxShadow: `rgba(${tintRgb}, 0.55) 0px 0px 0px 1000px inset`,
                }}
            />

            {/* Bottom gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

            {/* Content — full card, centered vertically */}
            <div className="relative z-10 h-full flex flex-col items-center justify-between p-5 md:p-6 text-center">

                {/* Top: Title only — uppercase, larger */}
                <div className="flex flex-col items-center pt-3">
                    <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-white uppercase tracking-wide
                                   drop-shadow-lg leading-tight max-w-[200px]">
                        {preset.label}
                    </h3>
                </div>

                {/* Center: Game count — big number like GOG's discount */}
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em]
                                     text-white/60">
                        Catálogo
                    </span>
                    <span
                        className="text-4xl sm:text-5xl md:text-6xl font-black drop-shadow-2xl
                                   leading-none transition-transform duration-300
                                   group-hover:scale-110"
                        style={{ color: preset.accentFrom }}
                    >
                        {gameCount}
                    </span>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest
                                     text-white/50">
                        juegos
                    </span>
                </div>

                {/* Bottom: Description + CTA */}
                <div className="flex flex-col items-center gap-3 pb-1">
                    <p className="text-[10px] md:text-xs text-white/50
                                  group-hover:text-white/70 transition-colors duration-300
                                  line-clamp-2 leading-relaxed max-w-[180px]">
                        {preset.description}
                    </p>
                    <span
                        className="inline-flex items-center gap-1.5
                                   px-4 py-1.5 rounded-md text-[10px] md:text-xs
                                   font-bold uppercase tracking-wider
                                   border border-white/30
                                   bg-white/5 backdrop-blur-sm
                                   text-white
                                   group-hover:bg-white/15 group-hover:border-white/50
                                   transition-all duration-300"
                    >
                        Explorar
                    </span>
                </div>
            </div>

            {/* Hover glow ring */}
            <div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                           transition-opacity duration-500 pointer-events-none"
                style={{
                    boxShadow: `inset 0 0 0 2px ${preset.accentFrom}66, 0 0 40px -10px ${preset.accentFrom}44`
                }}
            />
        </button>
    );
};

export default CategoryCard;
