import type { DocAuthorLink } from './types';

export interface DocAuthorProfile {
    /** Identificador único para referenciar en frontmatter `authorId`. */
    id: string;
    /** Nombre completo del autor. */
    name: string;
    /** Rol, profesión o título resumido. */
    role?: string;
    /** Breve descripción / biografía profesional del autor. */
    bio: string;
    /** Avatar o foto de perfil (URL opcional). */
    avatar?: string;
    /** Enlace web principal del autor (portfolio, perfil público, etc.). */
    url?: string;
    /** Enlaces a redes sociales y perfiles públicos. */
    links: DocAuthorLink[];
}

/**
 * Registro configurable de autores y colaboradores de la documentación.
 *
 * Se puede referenciar en los documentos markdown mediante `authorId: "edgar-sakellariou"`
 * o automáticamente haciendo coincidir el nombre en `author: "Edgar E. Sakellariou"`.
 */
export const DOC_AUTHORS: Record<string, DocAuthorProfile> = {
    'edgar-sakellariou': {
        id: 'edgar-sakellariou',
        name: 'Edgar E. Sakellariou',
        avatar: 'https://venezuela-juega.s3.us-east-005.dream.io/collaborators/edgar-sakellariou.png',
        role: 'Ingeniero Mecánico & Desarrollador de Software',
        bio: 'Con trayectoria en la gestión de proyectos y producción industrial, y experiencia en el desarrollo de videojuegos con Unity, busco aportar información de utilidad para seguir impulsando el crecimiento de esta comunidad.',
        url: 'https://github.com/Eddiusccc',
        links: [
            { platform: 'Instagram', url: 'https://www.instagram.com/edobledd' },
            { platform: 'GitHub', url: 'https://github.com/Eddiusccc' },
            { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/edgaresakellariou/' },
        ],
    },
};

/**
 * Busca el perfil de autor por ID o por nombre normalizado.
 */
export function getDocAuthor(idOrName?: string): DocAuthorProfile | undefined {
    if (!idOrName) return undefined;
    const key = idOrName.toLowerCase().trim();
    if (DOC_AUTHORS[key]) return DOC_AUTHORS[key];
    return Object.values(DOC_AUTHORS).find(
        (a) => a.name.toLowerCase().trim() === key || a.id.toLowerCase().trim() === key
    );
}

/**
 * Devuelve la lista de todos los autores registrados.
 */
export function getAllDocAuthors(): DocAuthorProfile[] {
    return Object.values(DOC_AUTHORS);
}

