import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const SPREADSHEET_ID = process.env.VITE_SPREADSHEET_ID;
const SHEET_NAME = process.env.VITE_SHEET_NAME;
const JAM_SPREADSHEET_ID = process.env.VITE_GAMEJAMSHEET_ID;
const JAM_GAMES_SHEET = process.env.VITE_GAMEJAMSHEET_NAME_GAMES;

const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
const JAM_GAMES_URL = `https://docs.google.com/spreadsheets/d/${JAM_SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${JAM_GAMES_SHEET}`;

const SITE_ORIGIN = 'https://venezuelajuega.com';
const FALLBACK_IMAGE = 'https://venezuela-juega.s3.us-east-005.dream.io/brand/VenezuelaJuega_LogoColor.png';

// ─── Slug helpers matching src/utils/gameUtils.ts ────────────────────────────
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[áàâäã]/g, 'a')
        .replace(/[éèêë]/g, 'e')
        .replace(/[íìîï]/g, 'i')
        .replace(/[óòôöõ]/g, 'o')
        .replace(/[úùûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const ensureUniqueSlug = (baseSlug, existingSlugs) => {
    let slug = baseSlug;
    let counter = 1;
    while (existingSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    existingSlugs.add(slug);
    return slug;
};

// ─── Lightweight YAML Frontmatter Parser ─────────────────────────────────────
function parseScalar(val) {
    const trimmed = (val || '').trim();
    if (trimmed === '') return '';
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (trimmed === 'null') return null;

    if (!isNaN(Number(trimmed)) && !trimmed.startsWith('0x') && /^-?\d+(\.\d+)?$/.test(trimmed)) {
        return Number(trimmed);
    }

    if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
        return trimmed.slice(1, -1);
    }

    return trimmed;
}

function parseYamlFrontmatter(yamlStr) {
    const lines = yamlStr.split(/\r?\n/);
    const result = {};

    let currentKey = '';
    let currentList = null;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        if (trimmed.startsWith('- ')) {
            const itemVal = trimmed.slice(2).trim();
            if (!currentList) {
                currentList = [];
                if (currentKey) result[currentKey] = currentList;
            }
            currentList.push(parseScalar(itemVal));
            continue;
        }

        const colonIdx = trimmed.indexOf(':');
        if (colonIdx > -1) {
            const key = trimmed.slice(0, colonIdx).trim();
            const val = trimmed.slice(colonIdx + 1).trim();

            currentKey = key;
            currentList = null;

            if (val === '') {
                result[key] = null;
            } else {
                result[key] = parseScalar(val);
            }
        }
    }

    return result;
}

function extractFrontmatter(rawContent) {
    const trimmed = (rawContent || '').trim();
    const match = trimmed.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*([\s\S]*)$/);
    if (!match) return { attributes: {}, body: trimmed };

    const yamlStr = match[1];
    const bodyStr = match[2] || '';
    const attributes = parseYamlFrontmatter(yamlStr);
    return { attributes, body: bodyStr.trim() };
}

// ─── Read all Jam files from src/features/jam/content/*.md ────────────────────
function loadJams(contentDir) {
    if (!fs.existsSync(contentDir)) return [];

    const filenames = fs.readdirSync(contentDir);
    const jams = [];

    for (const file of filenames) {
        if (!file.endsWith('.md') || file === 'README.md') continue;

        const filePath = path.join(contentDir, file);
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        const stat = fs.statSync(filePath);
        const { attributes } = extractFrontmatter(rawContent);

        const defaultSlug = file.replace(/\.md$/, '');
        const slug = attributes.slug || defaultSlug;
        const edition = attributes.edition ? String(attributes.edition) : '';
        const name = attributes.name || 'Game Jam';
        const shortName = attributes.shortName || name;
        const tagline = attributes.tagline || '';
        const status = attributes.status || 'draft';
        const startDate = attributes.startDate ? String(attributes.startDate) : null;
        const endDate = attributes.endDate ? String(attributes.endDate) : null;
        const submissionUrl = attributes.submissionUrl || null;
        const registrationUrl = attributes.registrationUrl || null;
        const registrationLabel = attributes.registrationLabel || 'Inscríbete';
        const registrationOpenDate = attributes.registrationOpenDate ? String(attributes.registrationOpenDate) : null;
        const heroImage = attributes.heroImage || null;
        const logo = attributes.logo || null;
        const attendanceMode = attributes.attendanceMode || null;
        const locationVenue = attributes.locationVenue || null;
        const locationAddress = attributes.locationAddress || null;
        const locationCity = attributes.locationCity || null;
        const locationState = attributes.locationState || null;
        const locationCountry = attributes.locationCountry || 'VE';
        const onlineUrl = attributes.onlineUrl || null;
        const organizerName = attributes.organizerName || 'Venezuela Juega';

        jams.push({
            slug,
            edition,
            name,
            shortName,
            tagline,
            status,
            startDate,
            endDate,
            submissionUrl,
            registrationUrl,
            registrationLabel,
            registrationOpenDate,
            heroImage,
            logo,
            attendanceMode,
            locationVenue,
            locationAddress,
            locationCity,
            locationState,
            locationCountry,
            onlineUrl,
            organizerName,
            lastmod: stat.mtime.toISOString().split('T')[0],
        });
    }

    return jams;
}

// ─── Build Schema.org Event for a Jam ────────────────────────────────────────
function generateJamEventSchema(jam, canonicalUrl) {
    const imageUrl = jam.heroImage || jam.logo || FALLBACK_IMAGE;
    const description = jam.tagline || `${jam.name} en Venezuela Juega.`;

    const schema = {
        "@context": "https://schema.org",
        "@type": ["Event", "Hackathon"],
        "name": jam.name,
        "description": description,
        "image": [imageUrl],
        "url": canonicalUrl,
        "eventStatus": "https://schema.org/EventScheduled",
        "organizer": {
            "@type": "Organization",
            "name": jam.organizerName || "Venezuela Juega",
            "url": SITE_ORIGIN
        }
    };

    if (jam.startDate) {
        const d = new Date(jam.startDate);
        if (!isNaN(d.getTime())) schema.startDate = d.toISOString();
    }
    if (jam.endDate) {
        const d = new Date(jam.endDate);
        if (!isNaN(d.getTime())) schema.endDate = d.toISOString();
    }

    const mode = (jam.attendanceMode || '').toLowerCase();
    if (mode === 'hybrid') {
        schema.eventAttendanceMode = "https://schema.org/MixedEventAttendanceMode";
    } else if (mode === 'offline') {
        schema.eventAttendanceMode = "https://schema.org/OfflineEventAttendanceMode";
    } else {
        schema.eventAttendanceMode = "https://schema.org/OnlineEventAttendanceMode";
    }

    const locations = [];
    if (mode === 'online' || mode === 'hybrid' || !mode) {
        locations.push({
            "@type": "VirtualLocation",
            "url": jam.onlineUrl || jam.submissionUrl || jam.registrationUrl || canonicalUrl
        });
    }

    if (mode === 'offline' || mode === 'hybrid') {
        locations.push({
            "@type": "Place",
            "name": jam.locationVenue || "Sede Presencial",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": jam.locationAddress || undefined,
                "addressLocality": jam.locationCity || "Valencia",
                "addressRegion": jam.locationState || undefined,
                "addressCountry": jam.locationCountry || "VE"
            }
        });
    }

    schema.location = locations.length === 1 ? locations[0] : locations;

    if (jam.registrationUrl || jam.submissionUrl) {
        const offer = {
            "@type": "Offer",
            "url": jam.registrationUrl || jam.submissionUrl,
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        };
        if (jam.registrationOpenDate) {
            const d = new Date(jam.registrationOpenDate);
            if (!isNaN(d.getTime())) offer.validFrom = d.toISOString();
        }
        schema.offers = offer;
    }

    return schema;
}

// ─── Process HTML for Games ──────────────────────────────────────────────────
const processGameHtml = (template, game) => {
    let html = template;
    const canonicalUrl = `${SITE_ORIGIN}/game/${game.slug}`;
    const imageUrl = game.imageCover || game.imageHero || game.imageUrl || FALLBACK_IMAGE;
    const description = (game.description || '').substring(0, 155).trim() + '...';
    const title = `${game.title} — Venezuela Juega`;

    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${description}" />`);
    html = html.replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`);
    html = html.replace(/<meta property="og:url" content=".*?"\s*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`);
    html = html.replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta property="og:image" content=".*?"\s*\/>/, `<meta property="og:image" content="${imageUrl}" />`);
    html = html.replace(/<meta name="twitter:title" content=".*?"\s*\/>/, `<meta name="twitter:title" content="${title}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?"\s*\/>/, `<meta name="twitter:description" content="${description}" />`);
    html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/>/, `<meta name="twitter:image" content="${imageUrl}" />`);
    html = html.replace(/<meta name="twitter:card" content=".*?"\s*\/>/, `<meta name="twitter:card" content="summary_large_image" />`);

    return html;
};

// ─── Process HTML for Jams ───────────────────────────────────────────────────
const processJamHtml = (template, jam, canonicalUrl) => {
    let html = template;
    const editionStr = jam.edition ? ` (Edición ${jam.edition.toUpperCase()})` : '';
    const title = `${jam.name}${editionStr} | Venezuela Juega`;
    const description = jam.tagline
        ? `${jam.tagline} — ${jam.name} en Venezuela Juega.`
        : `${jam.name}: participa en nuestras jams de desarrollo de videojuegos en Venezuela Juega.`;
    const imageUrl = jam.heroImage || jam.logo || FALLBACK_IMAGE;

    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${description}" />`);
    html = html.replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`);
    html = html.replace(/<meta property="og:url" content=".*?"\s*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`);
    html = html.replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta property="og:image" content=".*?"\s*\/>/, `<meta property="og:image" content="${imageUrl}" />`);
    html = html.replace(/<meta name="twitter:title" content=".*?"\s*\/>/, `<meta name="twitter:title" content="${title}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?"\s*\/>/, `<meta name="twitter:description" content="${description}" />`);
    html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/>/, `<meta name="twitter:image" content="${imageUrl}" />`);
    html = html.replace(/<meta name="twitter:card" content=".*?"\s*\/>/, `<meta name="twitter:card" content="summary_large_image" />`);

    // Inyectar Schema.org Event JSON-LD
    const eventSchema = generateJamEventSchema(jam, canonicalUrl);
    const schemaScript = `    <script type="application/ld+json" id="event-schema">\n${JSON.stringify(eventSchema, null, 2)}\n    </script>\n</head>`;
    html = html.replace('</head>', schemaScript);

    return html;
};

// ─── Process HTML for General Catalog Pages ─────────────────────────────────
const processCatalogHtml = (template, { title, description, canonicalUrl, imageUrl }) => {
    let html = template;
    const img = imageUrl || FALLBACK_IMAGE;

    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${description}" />`);
    html = html.replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`);
    html = html.replace(/<meta property="og:url" content=".*?"\s*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`);
    html = html.replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta property="og:image" content=".*?"\s*\/>/, `<meta property="og:image" content="${img}" />`);
    html = html.replace(/<meta name="twitter:title" content=".*?"\s*\/>/, `<meta name="twitter:title" content="${title}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?"\s*\/>/, `<meta name="twitter:description" content="${description}" />`);
    html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/>/, `<meta name="twitter:image" content="${img}" />`);
    html = html.replace(/<meta name="twitter:card" content=".*?"\s*\/>/, `<meta name="twitter:card" content="summary_large_image" />`);

    return html;
};

// ─── Generate dynamic sitemap.xml ───────────────────────────────────────────
function buildSitemapXml({ staticRoutes, jams, games }) {
    const today = new Date().toISOString().split('T')[0];

    const urls = [];

    // Static routes
    for (const route of staticRoutes) {
        urls.push(`    <url>
        <loc>${SITE_ORIGIN}${route.path}</loc>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
        <lastmod>${route.lastmod || today}</lastmod>
    </url>`);
    }

    // Jams
    for (const jam of jams) {
        const jamPriority = jam.status === 'active' || jam.status === 'upcoming' || jam.status === 'open' ? '0.9' : '0.7';
        const changefreq = jam.status === 'active' ? 'daily' : 'weekly';

        urls.push(`    <url>
        <loc>${SITE_ORIGIN}/jam/${jam.slug}</loc>
        <changefreq>${changefreq}</changefreq>
        <priority>${jamPriority}</priority>
        <lastmod>${jam.lastmod || today}</lastmod>
    </url>`);

        if (jam.edition) {
            urls.push(`    <url>
        <loc>${SITE_ORIGIN}/jam/${jam.slug}/${jam.edition}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
        <lastmod>${jam.lastmod || today}</lastmod>
    </url>`);
        }
    }

    // Games
    for (const game of games) {
        urls.push(`    <url>
        <loc>${SITE_ORIGIN}/game/${game.slug}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
        <lastmod>${today}</lastmod>
    </url>`);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

// ─── Main Execution ─────────────────────────────────────────────────────────
async function main() {
    console.log('🚀 Starting Metadata & SEO Pre-rendering (Games + Game Jams + Sitemap)...');

    const distPath = path.resolve(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');

    if (!fs.existsSync(indexPath)) {
        console.error('Error: dist/index.html not found. Make sure to run vite build first.');
        process.exit(1);
    }

    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    // 1. Process Game Jams from Markdown
    const jamContentDir = path.resolve(process.cwd(), 'src/features/jam/content');
    const jams = loadJams(jamContentDir);
    console.log(`📦 Loaded ${jams.length} Game Jams from ${jamContentDir}`);

    let createdJamPages = 0;

    // Render Jams catalog page /jams
    const jamsCatalogDir = path.join(distPath, 'jams');
    fs.mkdirSync(jamsCatalogDir, { recursive: true });
    const jamsCatalogHtml = processCatalogHtml(indexHtml, {
        title: 'Game Jams — Venezuela Juega',
        description: 'Explora y participa en las Game Jams de la comunidad de videojuegos en Venezuela: crea prototipos en 48 horas, conecta con desarrolladores y compite.',
        canonicalUrl: `${SITE_ORIGIN}/jams`,
        imageUrl: FALLBACK_IMAGE
    });
    fs.writeFileSync(path.join(jamsCatalogDir, 'index.html'), jamsCatalogHtml);
    createdJamPages++;

    // Render each individual Jam page
    for (const jam of jams) {
        const canonicalUrl = `${SITE_ORIGIN}/jam/${jam.slug}`;
        const jamHtml = processJamHtml(indexHtml, jam, canonicalUrl);

        // /jam/:slug/index.html
        const jamDir = path.join(distPath, 'jam', jam.slug);
        fs.mkdirSync(jamDir, { recursive: true });
        fs.writeFileSync(path.join(jamDir, 'index.html'), jamHtml);
        createdJamPages++;

        // /jam/:slug/:edition/index.html (if edition exists)
        if (jam.edition) {
            const editionCanonicalUrl = `${SITE_ORIGIN}/jam/${jam.slug}/${jam.edition}`;
            const editionHtml = processJamHtml(indexHtml, jam, editionCanonicalUrl);
            const editionDir = path.join(distPath, 'jam', jam.slug, jam.edition);
            fs.mkdirSync(editionDir, { recursive: true });
            fs.writeFileSync(path.join(editionDir, 'index.html'), editionHtml);
            createdJamPages++;
        }
    }

    console.log(`✅ Successfully generated ${createdJamPages} pre-rendered Jam HTML pages with Event Schema.`);

    // 2. Process Games from Google Sheets
    console.log(`Fetching main games from Google Sheets...`);
    const games = [];
    const existingSlugs = new Set();

    try {
        const mainCsvRes = await fetch(SPREADSHEET_URL);
        const mainCsv = await mainCsvRes.text();
        const mainResults = Papa.parse(mainCsv, { header: false, skipEmptyLines: true });

        const mainData = mainResults.data;
        const headerIndex = mainData.findIndex(row => row[0] === 'Título del videojuego');
        if (headerIndex !== -1) {
            const gameRows = mainData.slice(headerIndex + 1);
            const headers = mainData[headerIndex];
            const getIndex = (name) => headers.indexOf(name);

            const titleIdx = getIndex('Título del videojuego');
            const descIdx = getIndex('Descripción');
            const portId = getIndex('Portada');
            const heroId = getIndex('Hero');
            const miniId = getIndex('Mini Image');

            gameRows.forEach(row => {
                const title = row[titleIdx];
                if (!title) return;

                const baseSlug = generateSlug(title);
                const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs);

                games.push({
                    slug: uniqueSlug,
                    title: title,
                    description: row[descIdx],
                    imageCover: row[portId],
                    imageHero: row[heroId],
                    imageUrl: row[miniId]
                });
            });
        }
    } catch (err) {
        console.warn('⚠️ Warning: Failed to fetch main games from Google Sheets:', err.message);
    }

    // Load Jam Games
    try {
        console.log(`Fetching Jam games from Google Sheets...`);
        const jamCsvRes = await fetch(JAM_GAMES_URL);
        const jamCsv = await jamCsvRes.text();
        const jamResults = Papa.parse(jamCsv, { header: false, skipEmptyLines: true });

        const jamData = jamResults.data;
        const jamHeaderIndex = jamData.findIndex(row => row[0] === 'Título del videojuego' && row[5] === 'Jam_Org_UID');

        if (jamHeaderIndex !== -1) {
            const jamGameRows = jamData.slice(jamHeaderIndex + 1);
            const jamHeaders = jamData[jamHeaderIndex];
            const jGetIndex = (name) => jamHeaders.indexOf(name);

            const jTitleIdx = jGetIndex('Título del videojuego');
            const jDescIdx = jGetIndex('Descripción');
            const jPortId = jGetIndex('Portada');
            const jHeroId = jGetIndex('Hero');
            const jMiniId = jGetIndex('Mini Image');

            jamGameRows.forEach(row => {
                const title = row[jTitleIdx];
                if (!title) return;

                const baseSlug = generateSlug(title);
                const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs);

                games.push({
                    slug: uniqueSlug,
                    title: title,
                    description: row[jDescIdx],
                    imageCover: row[jPortId],
                    imageHero: row[jHeroId],
                    imageUrl: row[jMiniId]
                });
            });
        }
    } catch (err) {
        console.warn('⚠️ Warning: Failed to fetch jam games from Google Sheets:', err.message);
    }

    console.log(`Found ${games.length} total games. Generating HTML files...`);

    let createdGameCount = 0;
    games.forEach(game => {
        const gameHtml = processGameHtml(indexHtml, game);
        const gameDir = path.join(distPath, 'game', game.slug);

        fs.mkdirSync(gameDir, { recursive: true });
        fs.writeFileSync(path.join(gameDir, 'index.html'), gameHtml);
        createdGameCount++;
    });

    console.log(`✅ Successfully generated ${createdGameCount} pre-rendered game pages.`);

    // 3. Generate dynamic sitemap.xml
    console.log('🗺️ Generating dynamic sitemap.xml...');
    const staticRoutes = [
        { path: '/', changefreq: 'daily', priority: '1.0' },
        { path: '/jams', changefreq: 'weekly', priority: '0.9' },
        { path: '/calendar', changefreq: 'weekly', priority: '0.8' },
        { path: '/charts', changefreq: 'weekly', priority: '0.7' },
        { path: '/about', changefreq: 'monthly', priority: '0.6' },
        { path: '/add-game', changefreq: 'monthly', priority: '0.5' },
        { path: '/credits', changefreq: 'monthly', priority: '0.4' },
    ];

    const sitemapContent = buildSitemapXml({ staticRoutes, jams, games });
    const distSitemapPath = path.join(distPath, 'sitemap.xml');
    const publicSitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');

    fs.writeFileSync(distSitemapPath, sitemapContent);
    fs.writeFileSync(publicSitemapPath, sitemapContent);
    console.log(`✅ Sitemap successfully written to ${distSitemapPath} and ${publicSitemapPath} (${staticRoutes.length + (jams.length * 2) + games.length} URLs registered).`);
}

main().catch(console.error);
