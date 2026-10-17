import type { DocCategory } from './types';

export interface DocCategoryMeta {
    label: string;
    icon: string;
    color: string;
    description: string;
}

export const DOC_CATEGORIES: Record<string, DocCategoryMeta> = {
    legal: {
        label: 'Legal',
        icon: '⚖️',
        color: '#6366f1',
        description: 'Propiedad intelectual, registros, contratos y cumplimiento.',
    },
    business: {
        label: 'Negocio',
        icon: '💼',
        color: '#f2b63d',
        description: 'Modelos de negocio, monetización, publisher y pitch.',
    },
    technical: {
        label: 'Técnico',
        icon: '🛠️',
        color: '#00a185',
        description: 'Herramientas, engines, pipelines y buenas prácticas.',
    },
    academic: {
        label: 'Académico',
        icon: '🎓',
        color: '#d946ef',
        description: 'Papers, investigaciones, tesis y estudios de la industria.',
    },
    community: {
        label: 'Comunidad',
        icon: '🤝',
        color: '#457cd6',
        description: 'Guías de comunidad, eventos, networking y colaboración.',
    },
    funding: {
        label: 'Financiamiento',
        icon: '💰',
        color: '#f97316',
        description: 'Grants, fondos, inversión y oportunidades económicas.',
    },
};

export const DEFAULT_DOC_ACCENT = '#6366f1';

export function getDocCategoryMeta(category?: DocCategory): DocCategoryMeta {
    if (category && DOC_CATEGORIES[category]) return DOC_CATEGORIES[category];
    return {
        label: category ? String(category) : 'General',
        icon: '📚',
        color: DEFAULT_DOC_ACCENT,
        description: 'Recursos para la comunidad de videojuegos venezolana.',
    };
}
