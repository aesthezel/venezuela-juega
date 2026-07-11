import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { RoutableProps } from 'preact-router';
import { getJamBySlug } from '@/jam/registry';
import {
    JamHero,
    JamStatBar,
    JamAbout,
    JamPrizes,
    JamSchedule,
    JamFAQ,
    JamCTA,
} from '@/jam/components';

interface JamDetailPageProps extends RoutableProps {
    jamName?: string;
    edition?: string;
}

const JamDetailPage = ({ jamName, edition }: JamDetailPageProps) => {
    const jam = jamName ? getJamBySlug(jamName, edition) : undefined;

    useEffect(() => {
        if (!jam) return;
        const editionStr = jam.edition ? ` (Edición ${jam.edition.toUpperCase()})` : '';
        document.title = `${jam.name}${editionStr} | Venezuela Juega`;

        let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
        }
        const rawDescription = jam.tagline
            ? `${jam.tagline} — ${jam.name} en Venezuela Juega.`
            : `${jam.name}: participa en nuestra jam benéfica en Venezuela Juega.`;
        meta.content = rawDescription.length > 155 ? rawDescription.slice(0, 152) + '...' : rawDescription;

    }, [jam]);

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

    return (
        <div className="relative min-h-screen bg-base-100 text-base-content">
            <JamHero jam={jam} />
            <JamStatBar jam={jam} />
            <JamAbout jam={jam} />
            <JamPrizes jam={jam} />
            <JamSchedule jam={jam} />
            <JamFAQ jam={jam} />
            <JamCTA jam={jam} />
        </div>
    );
};

export default JamDetailPage;
