import { h, ComponentChildren } from 'preact';
import { route } from 'preact-router';
import { PageTransition, BackButton } from '@/common/components/ui';

export interface PageLayoutBackButtonProps {
    onClick?: () => void;
    label?: string;
    className?: string;
}

export interface PageLayoutProps {
    children: ComponentChildren;
    /**
     * Muestra el botón de volver.
     * `true` usa la navegación por defecto (home). También acepta configuración
     * (onClick, label, className) para casos particulares.
     */
    backButton?: PageLayoutBackButtonProps | boolean;
    /** Clases extra para el <main> (ej. `relative z-10` para fondos animados). */
    className?: string;
    id?: string;
}

const DEFAULT_BACK_CLASSES = 'mb-6';

/**
 * PageLayout
 * Layout canónico de página del sitio: animación de entrada (PageTransition),
 * contenedor con ancho estándar (`container mx-auto px-4 py-8`) y botón de
 * volver opcional. Todas las páginas deben depender de este componente para
 * garantizar el mismo diseño y anchos.
 */
const PageLayout = ({ children, backButton, className = '', id }: PageLayoutProps) => {
    const backProps = typeof backButton === 'object' ? backButton : {};

    return (
        <PageTransition>
            <main id={id} className={`container mx-auto px-4 py-8 ${className}`}>
                {backButton && (
                    <BackButton
                        onClick={backProps.onClick ?? (() => route('/'))}
                        className={`${DEFAULT_BACK_CLASSES} ${backProps.className ?? ''}`}
                    >
                        {backProps.label}
                    </BackButton>
                )}
                {children}
            </main>
        </PageTransition>
    );
};

export default PageLayout;
