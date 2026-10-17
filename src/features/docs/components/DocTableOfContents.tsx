import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import type { TocItem } from '@/common/markdown';

interface DocTableOfContentsProps {
    items: TocItem[];
    /** 'mobile' renderiza el colapsable, 'desktop' el sidebar sticky, 'both' ambos. */
    variant?: 'mobile' | 'desktop' | 'both';
    className?: string;
}

const DocTableOfContents = ({ items, variant = 'both', className = '' }: DocTableOfContentsProps) => {
    const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

    useEffect(() => {
        if (!items.length) return;
        setActiveId(items[0]?.id ?? null);

        const headings = items
            .map((item) => document.getElementById(item.id))
            .filter((el): el is HTMLElement => Boolean(el));

        if (!headings.length || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                }
            },
            { rootMargin: '-90px 0px -68% 0px', threshold: 0 }
        );

        headings.forEach((heading) => observer.observe(heading));
        return () => observer.disconnect();
    }, [items]);

    if (!items.length) return null;

    const handleClick = (event: MouseEvent, id: string) => {
        const heading = document.getElementById(id);
        if (!heading) return;
        event.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `#${id}`);
        setActiveId(id);
    };

    const list = (
        <ul className="flex flex-col border-l border-surface-700">
            {items.map((item) => {
                const active = item.id === activeId;
                return (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={(event) => handleClick(event as unknown as MouseEvent, item.id)}
                            className={`block border-l-2 -ml-px py-1.5 pr-3 text-sm leading-snug transition-colors ${
                                item.level >= 3 ? 'pl-7' : 'pl-4'
                            } ${
                                active
                                    ? 'border-accent-teal text-accent-teal font-semibold'
                                    : 'border-transparent text-base-content/50 hover:text-base-content/80 hover:border-surface-400'
                            }`}
                        >
                            {item.text}
                        </a>
                    </li>
                );
            })}
        </ul>
    );

    const showMobile = variant === 'mobile' || variant === 'both';
    const showDesktop = variant === 'desktop' || variant === 'both';

    return (
        <>
            {showMobile && (
                <details className={`lg:hidden rounded-2xl border border-surface-700 bg-base-200/60 ${className}`}>
                    <summary className="cursor-pointer select-none px-5 py-4 text-sm font-black uppercase tracking-wider text-base-content/70">
                        Contenido del artículo
                    </summary>
                    <nav aria-label="Tabla de contenidos" className="px-5 pb-4">
                        {list}
                    </nav>
                </details>
            )}

            {showDesktop && (
                <nav
                    aria-label="Tabla de contenidos"
                    className={`hidden lg:flex flex-col gap-3 sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto custom-scrollbar pr-2 ${className}`}
                >
                    <p className="text-[11px] font-black uppercase tracking-widest text-base-content/40">
                        En este artículo
                    </p>
                    {list}
                </nav>
            )}
        </>
    );
};

export default DocTableOfContents;
