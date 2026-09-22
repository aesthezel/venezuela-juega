import { useEffect } from 'preact/hooks';
import { RoutableProps } from 'preact-router';
import { getJamBySlug } from '@/features/jam/registry';
import { JamSectionRenderer } from '@/features/jam/components';

interface JamDetailPageProps extends RoutableProps {
    jamName?: string;
    edition?: string;
}

const SITE_ORIGIN = 'https://venezuelajuega.com';
const FALLBACK_IMAGE = 'https://venezuela-juega.s3.us-east-005.dream.io/brand/VenezuelaJuega_LogoColor.png';

function setMeta(selector: string, attr: string, value: string, createTag?: () => HTMLElement) {
    let el = document.querySelector(selector);
    if (!el && createTag) {
        el = createTag();
        document.head.appendChild(el);
    }
    if (el) {
        el.setAttribute(attr, value);
    }
}

const JamDetailPage = ({ jamName, edition }: JamDetailPageProps) => {
    const jam = jamName ? getJamBySlug(jamName, edition) : undefined;

    useEffect(() => {
        if (!jam) return;
        const editionStr = jam.edition ? ` (Edición ${jam.edition.toUpperCase()})` : '';
        const pageTitle = `${jam.name}${editionStr} | Venezuela Juega`;
        document.title = pageTitle;

        const rawDescription = jam.tagline
            ? `${jam.tagline} — ${jam.name} en Venezuela Juega.`
            : `${jam.name}: participa en nuestras jams de desarrollo de videojuegos en Venezuela Juega.`;
        const description = rawDescription.length > 155 ? rawDescription.slice(0, 152) + '...' : rawDescription;
        const imageUrl = jam.heroImage || jam.logo || FALLBACK_IMAGE;
        const canonicalUrl = edition
            ? `${SITE_ORIGIN}/jam/${jam.slug}/${jam.edition}`
            : `${SITE_ORIGIN}/jam/${jam.slug}`;

        // Standard Meta
        setMeta('meta[name="description"]', 'content', description, () => {
            const m = document.createElement('meta');
            m.name = 'description';
            return m;
        });

        // Canonical
        setMeta('link[rel="canonical"]', 'href', canonicalUrl, () => {
            const l = document.createElement('link');
            l.rel = 'canonical';
            return l;
        });

        // Open Graph
        setMeta('meta[property="og:title"]', 'content', pageTitle, () => {
            const m = document.createElement('meta');
            m.setAttribute('property', 'og:title');
            return m;
        });
        setMeta('meta[property="og:description"]', 'content', description, () => {
            const m = document.createElement('meta');
            m.setAttribute('property', 'og:description');
            return m;
        });
        setMeta('meta[property="og:image"]', 'content', imageUrl, () => {
            const m = document.createElement('meta');
            m.setAttribute('property', 'og:image');
            return m;
        });
        setMeta('meta[property="og:url"]', 'content', canonicalUrl, () => {
            const m = document.createElement('meta');
            m.setAttribute('property', 'og:url');
            return m;
        });
        setMeta('meta[property="og:type"]', 'content', 'website', () => {
            const m = document.createElement('meta');
            m.setAttribute('property', 'og:type');
            return m;
        });

        // Twitter Cards
        setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image', () => {
            const m = document.createElement('meta');
            m.name = 'twitter:card';
            return m;
        });
        setMeta('meta[name="twitter:title"]', 'content', pageTitle, () => {
            const m = document.createElement('meta');
            m.name = 'twitter:title';
            return m;
        });
        setMeta('meta[name="twitter:description"]', 'content', description, () => {
            const m = document.createElement('meta');
            m.name = 'twitter:description';
            return m;
        });
        setMeta('meta[name="twitter:image"]', 'content', imageUrl, () => {
            const m = document.createElement('meta');
            m.name = 'twitter:image';
            return m;
        });

        // Schema.org Event JSON-LD
        const mode = (jam.attendanceMode || '').toLowerCase();
        let attendanceMode = 'https://schema.org/OnlineEventAttendanceMode';
        if (mode === 'hybrid') {
            attendanceMode = 'https://schema.org/MixedEventAttendanceMode';
        } else if (mode === 'offline') {
            attendanceMode = 'https://schema.org/OfflineEventAttendanceMode';
        }

        const locations: any[] = [];
        if (mode === 'online' || mode === 'hybrid' || !mode) {
            locations.push({
                '@type': 'VirtualLocation',
                url: jam.onlineUrl || jam.submissionUrl || jam.registrationUrl || canonicalUrl,
            });
        }
        if (mode === 'offline' || mode === 'hybrid') {
            locations.push({
                '@type': 'Place',
                name: jam.locationVenue || 'Sede Presencial',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: jam.locationAddress || undefined,
                    addressLocality: jam.locationCity || 'Valencia',
                    addressRegion: jam.locationState || undefined,
                    addressCountry: jam.locationCountry || 'VE',
                },
            });
        }

        const schema: Record<string, any> = {
            '@context': 'https://schema.org',
            '@type': ['Event', 'Hackathon'],
            name: jam.name,
            description,
            image: [imageUrl],
            url: canonicalUrl,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: attendanceMode,
            location: locations.length === 1 ? locations[0] : locations,
            organizer: {
                '@type': 'Organization',
                name: jam.organizerName || 'Venezuela Juega',
                url: SITE_ORIGIN,
            },
        };

        if (jam.startDate) {
            schema.startDate = new Date(jam.startDate).toISOString();
        }
        if (jam.endDate) {
            schema.endDate = new Date(jam.endDate).toISOString();
        }
        if (jam.registrationUrl || jam.submissionUrl) {
            const offer: Record<string, any> = {
                '@type': 'Offer',
                url: jam.registrationUrl || jam.submissionUrl,
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
            };
            if (jam.registrationOpenDate) {
                offer.validFrom = new Date(jam.registrationOpenDate).toISOString();
            }
            schema.offers = offer;
        }

        let scriptEl = document.getElementById('jam-event-ld') as HTMLScriptElement | null;
        if (!scriptEl) {
            scriptEl = document.createElement('script');
            scriptEl.id = 'jam-event-ld';
            scriptEl.type = 'application/ld+json';
            document.head.appendChild(scriptEl);
        }
        scriptEl.textContent = JSON.stringify(schema, null, 2);

        return () => {
            const existing = document.getElementById('jam-event-ld');
            if (existing) {
                existing.remove();
            }
        };
    }, [jam, edition]);

    if (!jam) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-center px-6 gap-6 pt-24">
                <span className="text-6xl">🎮</span>
                <h1 className="text-3xl font-black text-white">Jam no encontrada</h1>
                <p className="text-base-content/60">
                    La jam <code className="text-secondary">{jamName}</code> no existe o aún no está publicada.
                </p>
                <a href="/jam" className="btn btn-secondary">Ver todas las jams</a>
            </div>
        );
    }

    return <JamSectionRenderer jam={jam} />;
};

export default JamDetailPage;
