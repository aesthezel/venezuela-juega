/**
 * Configuración del repositorio y enlaces para aportes comunitarios a la documentación.
 */
export const DOCS_REPO = {
    owner: 'aesthezel',
    name: 'venezuela-juega',
    branch: 'main',
    url: 'https://github.com/aesthezel/venezuela-juega',
    contentDir: 'src/features/docs/content',
} as const;

/**
 * Devuelve la URL directa en GitHub para sugerir una edición mediante Pull Request.
 */
export function getDocEditUrl(sourcePath?: string, defaultSlug?: string): string {
    const path = sourcePath || `${DOCS_REPO.contentDir}/${defaultSlug || 'documento'}.md`;
    return `${DOCS_REPO.url}/edit/${DOCS_REPO.branch}/${path}`;
}

/**
 * Devuelve la URL para ver el archivo fuente original en GitHub.
 */
export function getDocSourceUrl(sourcePath?: string, defaultSlug?: string): string {
    const path = sourcePath || `${DOCS_REPO.contentDir}/${defaultSlug || 'documento'}.md`;
    return `${DOCS_REPO.url}/blob/${DOCS_REPO.branch}/${path}`;
}

/**
 * Devuelve la URL del historial de commits de este documento en GitHub.
 */
export function getDocHistoryUrl(sourcePath?: string, defaultSlug?: string): string {
    const path = sourcePath || `${DOCS_REPO.contentDir}/${defaultSlug || 'documento'}.md`;
    return `${DOCS_REPO.url}/commits/${DOCS_REPO.branch}/${path}`;
}

/**
 * Genera un enlace a GitHub Issues con una plantilla pre-llenada para reportar
 * una errata, sugerencia o actualización sobre el documento.
 */
export function getDocIssueUrl(article: {
    title: string;
    slug: string;
    sourcePath?: string;
}): string {
    const filePath = article.sourcePath || `${DOCS_REPO.contentDir}/${article.slug}.md`;
    const issueTitle = encodeURIComponent(`[Errata / Aporte]: ${article.title}`);

    const bodyTemplate = `### 📄 Documento afectado
- **Título:** ${article.title}
- **Archivo en repo:** [\`${filePath}\`](${DOCS_REPO.url}/blob/${DOCS_REPO.branch}/${filePath})
- **Ruta web:** \`/docs/${article.slug}\`

---

### ⚠️ Errata encontrada o mejora sugerida
<!-- Describe claramente el error, dato desactualizado o información que consideras debe corregirse -->


### 💡 Propuesta de corrección
<!-- ¿Cómo debería redactarse o corregirse el contenido? -->


### 🔗 Fuentes oficiales o referencias (opcional)
<!-- Gaceta oficial, página del SAPI, enlaces normativos, etc. -->
`;

    const issueBody = encodeURIComponent(bodyTemplate);
    return `${DOCS_REPO.url}/issues/new?title=${issueTitle}&body=${issueBody}&labels=documentacion,erratas`;
}

