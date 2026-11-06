import { h } from 'preact';
import { useEffect, useState, useMemo } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronRight,
    faListUl,
} from '@fortawesome/free-solid-svg-icons';
import type { TocItem } from '@/common/markdown';

interface DocTableOfContentsProps {
    items: TocItem[];
    /** 'mobile' renderiza el colapsable, 'desktop' el sidebar sticky, 'both' ambos. */
    variant?: 'mobile' | 'desktop' | 'both';
    className?: string;
    accentColor?: string;
}

interface TocGroup {
    parent: TocItem;
    children: TocItem[];
}

/**
 * Agrupa los ítems del TOC en secciones principales (H1/H2) con sus respectivos
 * sub-ítems hijos (H3/H4) para permitir un sistema de acordeón colapsable.
 */
function groupTocItems(items: TocItem[]): TocGroup[] {
    if (!items.length) return [];

    const minLevel = Math.min(...items.map((i) => i.level));
    const groups: TocGroup[] = [];
    let currentGroup: TocGroup | null = null;

    for (const item of items) {
        if (item.level === minLevel) {
            currentGroup = { parent: item, children: [] };
            groups.push(currentGroup);
        } else if (currentGroup) {
            currentGroup.children.push(item);
        } else {
            currentGroup = { parent: item, children: [] };
            groups.push(currentGroup);
        }
    }

    return groups;
}

const DocTableOfContents = ({
    items,
    variant = 'both',
    className = '',
    accentColor = '#6366f1',
}: DocTableOfContentsProps) => {
    const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

    const groups = useMemo(() => groupTocItems(items), [items]);

    // IDs de las secciones principales abiertas en el acordeón
    const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
        // Por defecto abrimos la primera sección para dar contexto inicial
        return new Set(groups.length > 0 ? [groups[0].parent.id] : []);
    });

    // Seguimiento del scroll activo mediante cálculo de posición
    useEffect(() => {
        if (!items.length) return;

        const headingElements = items
            .map((item) => document.getElementById(item.id))
            .filter((el): el is HTMLElement => Boolean(el));

        if (!headingElements.length) return;

        const updateActiveHeading = () => {
            const scrollY = window.scrollY;
            // Punto de lectura (~140px debajo del navbar sticky)
            const targetOffset = scrollY + 140;

            let currentHeadingId = items[0]?.id ?? null;

            for (let i = 0; i < headingElements.length; i++) {
                const el = headingElements[i];
                if (el.offsetTop <= targetOffset) {
                    currentHeadingId = el.id;
                } else {
                    break;
                }
            }

            if (currentHeadingId) {
                setActiveId(currentHeadingId);
            }
        };

        window.addEventListener('scroll', updateActiveHeading, { passive: true });
        updateActiveHeading();

        return () => window.removeEventListener('scroll', updateActiveHeading);
    }, [items]);

    // Auto-desplegar la sección activa y autocontraer las anteriores/posteriores al salir de su rango
    useEffect(() => {
        if (!activeId) return;

        const matchingGroup = groups.find(
            (g) => g.parent.id === activeId || g.children.some((c) => c.id === activeId)
        );

        if (matchingGroup) {
            setExpandedIds((prev) => {
                // Si la única sección abierta ya es la activa, evitamos re-render
                if (prev.size === 1 && prev.has(matchingGroup.parent.id)) {
                    return prev;
                }
                // Autocontrae las demás y mantiene solo la sección activa actual
                return new Set([matchingGroup.parent.id]);
            });
        }
    }, [activeId, groups]);

    if (!items.length) return null;

    const handleClick = (event: MouseEvent, id: string, parentId?: string) => {
        const heading = document.getElementById(id);
        if (!heading) return;
        event.preventDefault();

        if (parentId) {
            // Al hacer clic, enfocamos únicamente la sección correspondiente
            setExpandedIds(new Set([parentId]));
        }

        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `#${id}`);
        setActiveId(id);
    };

    const toggleGroup = (groupId: string, e: MouseEvent) => {
        e.stopPropagation();
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(groupId)) {
                next.delete(groupId);
            } else {
                next.add(groupId);
            }
            return next;
        });
    };

    const toggleAll = () => {
        if (expandedIds.size === groups.length) {
            // Colapsar todo
            setExpandedIds(new Set());
        } else {
            // Expandir todo
            setExpandedIds(new Set(groups.map((g) => g.parent.id)));
        }
    };

    const isAllExpanded = groups.length > 0 && expandedIds.size === groups.length;

    const renderList = (isMobile = false) => (
        <ul className="flex flex-col gap-1 text-sm">
            {groups.map((group) => {
                const isParentActive = activeId === group.parent.id;
                const hasActiveChild = group.children.some((c) => c.id === activeId);
                const isExpanded = expandedIds.has(group.parent.id);
                const hasChildren = group.children.length > 0;

                return (
                    <li key={group.parent.id} className="flex flex-col">
                        {/* Cabecera de la sección principal (H2 / H1) */}
                        <div
                            className={`group flex items-center justify-between rounded-xl transition-all duration-150 ${
                                isParentActive
                                    ? 'bg-base-300/80 font-bold text-white'
                                    : hasActiveChild
                                      ? 'bg-base-300/40 text-white font-semibold'
                                      : 'text-base-content/70 hover:text-white hover:bg-base-300/30'
                            }`}
                        >
                            <a
                                href={`#${group.parent.id}`}
                                onClick={(e) => handleClick(e as unknown as MouseEvent, group.parent.id, group.parent.id)}
                                className="flex-1 py-1.5 px-2.5 text-xs sm:text-[13px] leading-snug line-clamp-2"
                                style={isParentActive ? { color: accentColor } : {}}
                            >
                                <span className="inline-block mr-1 opacity-50">#</span>
                                {group.parent.text}
                            </a>

                            {/* Botón acordeón para colapsar / desplegar sub-ítems */}
                            {hasChildren && (
                                <button
                                    type="button"
                                    onClick={(e) => toggleGroup(group.parent.id, e as unknown as MouseEvent)}
                                    aria-expanded={isExpanded}
                                    aria-label={isExpanded ? `Colapsar subsecciones de ${group.parent.text}` : `Expandir subsecciones de ${group.parent.text}`}
                                    className="p-1.5 mr-1 rounded-lg text-base-content/40 hover:text-white hover:bg-base-200/80 transition-colors focus:outline-none"
                                >
                                    <FontAwesomeIcon
                                        icon={isExpanded ? faChevronDown : faChevronRight}
                                        className="text-[10px] transition-transform duration-200"
                                    />
                                </button>
                            )}
                        </div>

                        {/* Sub-ítems (H3 / H4) desplegables */}
                        {hasChildren && isExpanded && (
                            <ul className="flex flex-col ml-3 pl-2.5 my-1 border-l border-surface-700/60 gap-1 animate-fade-in">
                                {group.children.map((child) => {
                                    const isChildActive = activeId === child.id;

                                    return (
                                        <li key={child.id}>
                                            <a
                                                href={`#${child.id}`}
                                                onClick={(e) =>
                                                    handleClick(e as unknown as MouseEvent, child.id, group.parent.id)
                                                }
                                                className={`block py-1 pr-2 text-xs leading-snug rounded-lg transition-colors ${
                                                    isChildActive
                                                        ? 'font-bold text-accent-teal pl-1.5 bg-accent-teal/10 border-l-2 border-accent-teal -ml-[11px]'
                                                        : 'text-base-content/50 hover:text-base-content/90 hover:pl-0.5'
                                                }`}
                                            >
                                                {child.text}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                );
            })}
        </ul>
    );

    const showMobile = variant === 'mobile' || variant === 'both';
    const showDesktop = variant === 'desktop' || variant === 'both';

    return (
        <>
            {/* Versión Mobile: Menú desplegable tipo acordeón encima del contenido */}
            {showMobile && (
                <details
                    className={`lg:hidden rounded-2xl border border-surface-700 bg-base-200/70 backdrop-blur-sm p-4 ${className}`}
                >
                    <summary className="cursor-pointer select-none text-xs font-black uppercase tracking-wider text-base-content/80 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faListUl} className="text-accent-teal" />
                            Índice de contenido ({items.length})
                        </span>
                        <span className="text-[10px] text-base-content/40 font-normal">Toca para abrir</span>
                    </summary>
                    <nav aria-label="Tabla de contenidos móvil" className="mt-3 pt-3 border-t border-surface-700/60">
                        {renderList(true)}
                    </nav>
                </details>
            )}

            {/* Versión Desktop: Columna lateral Sticky que sigue el scroll y se auto-despliega */}
            {showDesktop && (
                <nav
                    aria-label="Tabla de contenidos del artículo"
                    className={`hidden lg:flex flex-col gap-3 rounded-2xl border border-surface-700/80 bg-base-200/40 backdrop-blur-sm p-4 shadow-sm ${className}`}
                >
                    {/* Cabecera del TOC */}
                    <div className="flex items-center justify-between border-b border-surface-700/60 pb-2.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-accent-teal flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faListUl} className="text-[11px]" />
                            En este artículo
                        </p>

                        {groups.some((g) => g.children.length > 0) && (
                            <button
                                type="button"
                                onClick={toggleAll}
                                className="text-[10px] font-semibold text-base-content/40 hover:text-white transition-colors"
                                title={isAllExpanded ? 'Colapsar todas las secciones' : 'Expandir todas las secciones'}
                            >
                                {isAllExpanded ? 'Plegar' : 'Desplegar'}
                            </button>
                        )}
                    </div>

                    {/* Lista con acordeón de secciones */}
                    <div className="max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar pr-1">
                        {renderList(false)}
                    </div>
                </nav>
            )}
        </>
    );
};

export default DocTableOfContents;
