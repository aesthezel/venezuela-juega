import { h } from 'preact';
import { ComponentChildren } from 'preact';

interface PromoHeaderProps {
    title: string;
    subtitle: string;
    subtitleMobile?: string;
    logoSrc?: string;
    gradientClass?: string;
    children: ComponentChildren;
}

// Valores por defecto para mantener el estilo de GameJam+
const DEFAULT_LOGO = "https://venezuela-juega.s3.us-east-005.dream.io/gamejamplus/gj%2B_white.png";
const DEFAULT_GRADIENT = "bg-gradient-to-r from-yellow-500 via-red-600 to-yellow-500";

const PromoHeader = ({
                           title,
                           subtitle,
                           subtitleMobile,
                           children,
                           logoSrc,
                           gradientClass
                       }: PromoHeaderProps) => {

    const mobileSub = subtitleMobile || subtitle;
    const logo = logoSrc || DEFAULT_LOGO;
    const gradient = gradientClass || DEFAULT_GRADIENT;

    return (
        <header
            // Usamos la prop 'gradient'
            className={`w-full ${gradient} text-white py-8 px-6 md:px-12 shadow-lg`}
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center space-y-4 md:hidden">
                    <img
                        src={logo}
                        alt="Logo del evento"
                        className="w-16 h-16 object-contain"
                    />
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-base opacity-90">{mobileSub}</p>
                    </div>
                </div>

                <div className="hidden md:flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <img
                                src={logo}
                                alt="Logo del evento"
                                className="w-12 h-12 object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{title}</h1>
                            <p className="text-lg opacity-90">{subtitle}</p>
                        </div>
                    </div>

                    <nav className="flex space-x-4">
                        {children}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default PromoHeader;