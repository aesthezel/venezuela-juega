import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { getDocCategoryMeta } from '../categories';
import type { DocCategory } from '../types';

interface DocBreadcrumbsProps {
    category?: DocCategory;
    title?: string;
}

const linkClass = 'text-xs font-semibold uppercase tracking-wider text-base-content/50 hover:text-accent-teal transition-colors';

const DocBreadcrumbs = ({ category, title }: DocBreadcrumbsProps) => {
    const meta = category ? getDocCategoryMeta(category) : null;

    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap">
            <a href="/" className={linkClass}>Inicio</a>
            <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-base-content/30" />
            <a href="/docs" className={linkClass}>Recursos</a>

            {meta && (
                <>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-base-content/30" />
                    <a
                        href={`/docs?category=${encodeURIComponent(String(category))}`}
                        className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:brightness-125`}
                        style={{ color: meta.color }}
                    >
                        {meta.label}
                    </a>
                </>
            )}

            {title && (
                <>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-base-content/30" />
                    <span
                        aria-current="page"
                        className="text-xs font-semibold uppercase tracking-wider text-base-content/70 max-w-[220px] sm:max-w-md truncate"
                    >
                        {title}
                    </span>
                </>
            )}
        </nav>
    );
};

export default DocBreadcrumbs;
