import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Native fetch is available in Node 18+, but papaparse might need it globally if we use Papa.parse(url)
// Actually we can just fetch the CSV text manually and then parse it synchronously.

const SPREADSHEET_ID = process.env.VITE_SPREADSHEET_ID;
const SHEET_NAME = process.env.VITE_SHEET_NAME;
const JAM_SPREADSHEET_ID = process.env.VITE_GAMEJAMSHEET_ID;
const JAM_GAMES_SHEET = process.env.VITE_GAMEJAMSHEET_NAME_GAMES;

const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
const JAM_GAMES_URL = `https://docs.google.com/spreadsheets/d/${JAM_SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${JAM_GAMES_SHEET}`;

// Slug functions matching src/utils/gameUtils.ts
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

// Process HTML template
const processHtml = (template, game) => {
    let html = template;
    
    // Fallback logo
    const fallbackImage = 'https://venezuela-juega.s3.us-east-005.dream.io/brand/VenezuelaJuega_LogoColor.png';
    const imageUrl = game.imageCover || game.imageHero || game.imageUrl || fallbackImage;
    const description = (game.description || '').substring(0, 155).trim() + '...';
    const title = `${game.title} — Venezuela Juega`;

    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${description}" />`);
    html = html.replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta property="og:image" content=".*?"\s*\/>/, `<meta property="og:image" content="${imageUrl}" />`);
    html = html.replace(/<meta name="twitter:title" content=".*?"\s*\/>/, `<meta name="twitter:title" content="${title}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?"\s*\/>/, `<meta name="twitter:description" content="${description}" />`);
    html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/>/, `<meta name="twitter:image" content="${imageUrl}" />`);
    html = html.replace(/<meta name="twitter:card" content=".*?"\s*\/>/, `<meta name="twitter:card" content="summary_large_image" />`);

    return html;
};

async function main() {
    console.log('Starting Metadata Pre-rendering for games...');

    const distPath = path.resolve(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
        console.error('Error: dist/index.html not found. Make sure to run the build first.');
        process.exit(1);
    }
    
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    // Load Main Games
    console.log(`Fetching main games from Google Sheets...`);
    const mainCsvRes = await fetch(SPREADSHEET_URL);
    const mainCsv = await mainCsvRes.text();
    const mainResults = Papa.parse(mainCsv, { header: false, skipEmptyLines: true });
    
    const mainData = mainResults.data;
    const headerIndex = mainData.findIndex(row => row[0] === 'Título del videojuego');
    const gameRows = mainData.slice(headerIndex + 1);
    
    const headers = mainData[headerIndex];
    const getIndex = (name) => headers.indexOf(name);
    
    const titleIdx = getIndex('Título del videojuego');
    const descIdx = getIndex('Descripción');
    const portId = getIndex('Portada');
    const heroId = getIndex('Hero');
    const miniId = getIndex('Mini Image');

    const existingSlugs = new Set();
    const games = [];

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

    // Load Jam Games
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
        
        const jamExistingSlugs = new Set();
        
        jamGameRows.forEach(row => {
            const title = row[jTitleIdx];
            if (!title) return;
            
            const baseSlug = generateSlug(title);
            const uniqueSlug = ensureUniqueSlug(baseSlug, jamExistingSlugs);
            
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

    console.log(`Found ${games.length} total games. Generating HTML files...`);

    let createdCount = 0;
    
    games.forEach(game => {
        const gameHtml = processHtml(indexHtml, game);
        const gameDir = path.join(distPath, 'game', game.slug); // Ensure this matches typical routes
        
        fs.mkdirSync(gameDir, { recursive: true });
        fs.writeFileSync(path.join(gameDir, 'index.html'), gameHtml);
        createdCount++;
    });

    console.log(`Successfully generated ${createdCount} pre-rendered game pages.`);
}

main().catch(console.error);
