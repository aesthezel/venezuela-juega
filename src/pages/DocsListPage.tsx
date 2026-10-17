import { h } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { RoutableProps } from 'preact-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMagnifyingGlass,
    faXmark,
    faLayerGroup,
    faBookOpen,
    faClock,
    faTags,
    faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { PageLayout } from '@/components';
import { DocCard, getAllDocs, getDocCategories, getDocTags } from '@/features/docs';

interface DocsListPageProps extends RoutableProps {}

interface InitialFilters {
    q: string;
    category: string | null;
    tag: string | null;
}

function readFiltersFromUrl(): InitialFilters {
    if (typeof window === 'undefined') return { q: '', category: null, tag: null };
    const params = new URLSearchParams(window.location.search);
    return {
        q: params.get('q') ?? '',
        category: params.get('category'),
        tag: params.get('tag'),
    };
}

const DocsListPage = (_props: DocsListPageProps) => {
    const docs = useMemo(() => getAllDocs(), []);
    const categories = useMemo(() => getDocCategories(), []);
    const tags = useMemo(() => getDocTags(), []);

    const initial = useMemo(readFiltersFromUrl, []);
    const [searchTerm, setSearchTerm] = useState(initial.q);
    const [activeCategory, setActiveCategory] = useState<string | null>(initial.category);
    const [activeTag, setActiveTag] = useState<string | null>(initial.tag);

    // Mantiene la URL sincronizada con los filtros (compartible / recargable)
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set('q', searchTerm.trim());
        if (activeCategory) params.set('category', activeCategory);
        if (activeTag) params.set('tag', activeTag);
        const qs = params.toString();
        window.history.replaceState(null, '', qs ? `/docs?${qs}` : '/docs');
    }, [searchTerm, activeCategory, activeTag]);

    const filtered = useMemo(() => {
        let result = docs;

        if (activeCategory) {
            result = result.filter((doc) => doc.category === activeCategory);
        }

        if (activeTag) {
            const tag = activeTag.toLowerCase();
            result = result.filter((doc) => doc.tags.some((t) => t.toLowerCase() === tag));
        }

        const query = searchTerm.trim().toLowerCase();
        if (query.length >= 2) {
            result = result.filter(
                (doc) =>
                    doc.title.toLowerCase().includes(query) ||
                    doc.description.toLowerCase().includes(query) ||
                    doc.tags.some((tag) => tag.toLowerCase().includes(query))
            );
        }

        return result;
    }, [docs, activeCategory, activeTag, searchTerm]);

    const totalReadingTime = useMemo(
        () => docs.reduce((acc, doc) => acc + (doc.readingTime ?? 0), 0),
        [docs]
    );

    const hasActiveFilters = Boolean(searchTerm.trim() || activeCategory || activeTag);
    const clearFilters = () => {
        setSearchTerm('');
        setActiveCategory(null);
        setActiveTag(null);
    };

    return (
        <PageLayout backButton>
            {/* ─── Hero ─────────────────────────────────────────────────────── */}
            <header className="mb-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4">
                            Recursos
                            <span className="bg-gradient-to-r from-accent-indigo to-accent-mauve bg-clip-text text-transparent">
                                {' '}para creadores
                            </span>
                        </h1>
                        <p className="text-base-content/70 text-base md:text-lg leading-relaxed">
                            Documentos, guías y papers sobre la industria de videojuegos en Venezuela:
                            propiedad intelectual, negocio, técnica, financiamiento y más.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {[
                            { icon: faBookOpen, value: docs.length, label: 'Recursos', color: '#6366f1' },
                            { icon: faLayerGroup, value: categories.length, label: 'Categorías', color: '#00a185' },
                            { icon: faClock, value: totalReadingTime, label: 'Minutos', color: '#f2b63d' },
                        ].map(({ icon, value, label, color }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 bg-base-300/40 backdrop-blur-sm border border-surface-700 rounded-2xl px-5 py-3 shadow-lg"
                            >
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${color}15`, border: `1px solid ${color}33` }}
                                >
                                    <FontAwesomeIcon icon={icon} style={{ color }} className="text-xs" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-xl leading-none mb-0.5">{value}</p>
                                    <p className="text-base-content/70 text-[10px] font-bold uppercase tracking-widest">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Filtros ────────────────────────────────────────────── */}
                <div className="flex flex-col gap-5 rounded-[1.5rem] border border-surface-700 bg-base-200/50 backdrop-blur-xl p-5 md:p-6 shadow-2xl">
                    <div className="flex flex-col md:flex-row gap-3">
                        <label className="flex items-center gap-3 flex-1 rounded-xl border border-surface-700 bg-base-300/50 px-4 py-3">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-base-content/40 text-sm" />
                            <input
                                type="search"
                                value={searchTerm}
                                onInput={(event) => setSearchTerm((event.target as HTMLInputElement).value)}
                                placeholder="Buscar por título, descripción o tag..."
                                aria-label="Buscar recursos"
                                className="flex-1 bg-transparent outline-none text-sm text-base-content placeholder:text-base-content/40"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    aria-label="Limpiar búsqueda"
                                    className="text-base-content/40 hover:text-white transition-colors"
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            )}
                        </label>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="btn btn-neutral btn-sm h-auto rounded-xl font-bold gap-2"
                            >
                                <FontAwesomeIcon icon={faFilterCircleXmark} className="text-xs" />
                                Limpiar filtros
                            </button>
                        )}
                    </div>

                    {categories.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mr-1">
                                Categorías
                            </span>
                            <button
                                type="button"
                                onClick={() => setActiveCategory(null)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                                    !activeCategory
                                        ? 'bg-accent-teal/15 border-accent-teal/40 text-accent-teal'
                                        : 'border-surface-700 text-base-content/60 hover:text-white'
                                }`}
                            >
                                Todas
                            </button>
                            {categories.map((category) => {
                                const active = activeCategory === category.value;
                                return (
                                    <button
                                        key={category.value}
                                        type="button"
                                        onClick={() => setActiveCategory(active ? null : category.value)}
                                        className="text-xs font-bold px-3 py-1.5 rounded-full border transition-colors"
                                        style={{
                                            color: active ? category.color : undefined,
                                            background: active ? `${category.color}1a` : undefined,
                                            borderColor: active ? `${category.color}55` : undefined,
                                        }}
                                    >
                                        <span aria-hidden="true" className="mr-1">{category.icon}</span>
                                        <span className={active ? '' : 'text-base-content/60'}>{category.label}</span>
                                        <span className="ml-1.5 opacity-60">{category.count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mr-1 flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faTags} className="text-[9px]" />
                                Tags
                            </span>
                            {tags.slice(0, 16).map((tag) => {
                                const active = activeTag?.toLowerCase() === tag;
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => setActiveTag(active ? null : tag)}
                                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                                            active
                                                ? 'border-accent-indigo/50 bg-accent-indigo/15 text-accent-indigo'
                                                : 'border-surface-700 text-base-content/50 hover:text-base-content/80'
                                        }`}
                                    >
                                        #{tag}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </header>

            {/* ─── Resultados ───────────────────────────────────────────────── */}
            {docs.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-20 rounded-3xl border border-dashed border-surface-700 bg-base-200/30">
                    <span className="text-6xl" aria-hidden="true">📚</span>
                    <h2 className="text-2xl font-black text-white">Todavía no hay recursos publicados</h2>
                    <p className="text-base-content/60 max-w-md text-sm leading-relaxed">
                        Estamos preparando guías, documentos y papers para la comunidad.
                        Los borradores pueden previsualizarse entrando directo a su URL <code className="text-accent-teal">/docs/&lt;slug&gt;</code>.
                    </p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-20 rounded-3xl border border-dashed border-surface-700 bg-base-200/30">
                    <span className="text-5xl" aria-hidden="true">🔍</span>
                    <h2 className="text-xl font-black text-white">No encontramos recursos con esos filtros</h2>
                    <button type="button" onClick={clearFilters} className="btn btn-primary btn-sm rounded-xl font-bold">
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-xs text-base-content/40 font-bold uppercase tracking-widest mb-5">
                        {filtered.length} {filtered.length === 1 ? 'recurso' : 'recursos'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filtered.map((doc) => (
                            <DocCard key={doc.slug} article={doc} />
                        ))}
                    </div>
                </>
            )}
        </PageLayout>
    );
};

export default DocsListPage;
