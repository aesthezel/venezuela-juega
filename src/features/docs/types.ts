import type { TocItem } from '@/common/markdown';

export type DocStatus = 'draft' | 'published' | 'archived';

export type DocCategory =
    | 'legal'          // Propiedad intelectual, registros, contratos
    | 'business'       // Modelos de negocio, monetización, pitch
    | 'technical'      // Herramientas, engines, pipelines
    | 'academic'       // Papers, investigaciones, tesis
    | 'community'      // Guías de comunidad, eventos, networking
    | 'funding'        // Grants, financiamiento, inversión
    | (string & {});   // Extensible

export type DocCalloutKind = 'info' | 'note' | 'tip' | 'warning' | 'danger' | 'success';

/** Bloque destacado `:::info`, `:::warning`, `:::tip`, etc. */
export interface DocCallout {
    id: string;
    kind: DocCalloutKind;
    title?: string;
    content: string;
    /** Posición ordinal dentro del body (orden de aparición) */
    index: number;
}

/** Sección libre `:::custom`, `:::markdown`, `:::section` o `:::embed`. */
export interface DocSection {
    id: string;
    type: 'markdown' | 'custom' | 'embed';
    title?: string;
    subtitle?: string;
    badge?: string;
    content?: string;
    embedUrl?: string;
    theme?: 'base-100' | 'base-200' | 'base-300' | 'neutral' | 'gradient';
}

/** Fuente o referencia externa (`:::sources` o frontmatter `sources`). */
export interface DocSource {
    label: string;
    url: string;
}

export interface DocArticle {
    slug: string;
    title: string;
    subtitle?: string;
    /** Para SEO y cards */
    description: string;
    category: DocCategory;
    tags: string[];
    status: DocStatus;
    author?: string;
    authorUrl?: string;
    publishedDate: Date | null;
    updatedDate?: Date | null;
    /** Minutos estimados (auto-calculado) */
    readingTime?: number;
    coverImage?: string;
    accentColor?: string;
    /** Emoji/icono para la card */
    icon?: string;
    /** Contenido markdown procesado (body sin frontmatter) */
    body: string;
    /** Tabla de contenidos auto-generada */
    toc: TocItem[];
    /** Slugs de artículos relacionados (manual o auto) */
    relatedSlugs?: string[];
    /** Layout personalizable igual que las jams */
    layout?: string[];
    /** Bloques `:::info`, `:::warning`, `:::tip`, ... en orden de aparición */
    callouts: DocCallout[];
    /** Secciones custom con directivas `:::` */
    customSections?: Record<string, DocSection>;
    /** Fuentes/referencias externas */
    sources?: DocSource[];
    /** Destacar en el listado */
    featured?: boolean;
    /** Orden manual dentro de su categoría (menor = primero) */
    order?: number;
}
