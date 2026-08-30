import { h } from 'preact';
import type { JamEvent } from '../types';
import JamHero from './JamHero';
import JamStatBar from './JamStatBar';
import JamAbout from './JamAbout';
import JamPrizes from './JamPrizes';
import JamDonation from './JamDonation';
import JamSchedule from './JamSchedule';
import JamFAQ from './JamFAQ';
import JamCTA from './JamCTA';
import JamCountdown from './JamCountdown';
import JamMarkdownSection from './JamMarkdownSection';

interface JamSectionRendererProps {
    jam: JamEvent;
}

const JamSectionRenderer = ({ jam }: JamSectionRendererProps) => {
    const layout = jam.layout && jam.layout.length > 0
        ? jam.layout
        : [
              'hero',
              'stats',
              'about',
              jam.isCharity ? 'donation' : 'prizes',
              'schedule',
              ...Object.keys(jam.customSections || {}),
              'faq',
              'cta',
          ];

    return (
        <div className="relative min-h-screen bg-base-100 text-base-content">
            {layout.map((sectionName, index) => {
                switch (sectionName) {
                    case 'hero':
                        return <JamHero key={`section-hero-${index}`} jam={jam} />;

                    case 'stats':
                    case 'statbar':
                        return <JamStatBar key={`section-stats-${index}`} jam={jam} />;

                    case 'countdown':
                        return jam.startDate ? (
                            <section key={`section-countdown-${index}`} className="py-12 bg-base-200/50 flex justify-center border-y border-base-300">
                                <JamCountdown targetDate={jam.startDate} label="para el inicio" />
                            </section>
                        ) : null;

                    case 'about':
                    case 'objectives':
                        return <JamAbout key={`section-about-${index}`} jam={jam} />;

                    case 'donation':
                        return jam.isCharity || jam.donationUrl ? (
                            <JamDonation key={`section-donation-${index}`} jam={jam} />
                        ) : null;

                    case 'prizes':
                    case 'premios':
                        return jam.prizes && jam.prizes.length > 0 ? (
                            <JamPrizes key={`section-prizes-${index}`} jam={jam} />
                        ) : null;

                    case 'schedule':
                    case 'phases':
                    case 'timeline':
                        return <JamSchedule key={`section-schedule-${index}`} jam={jam} />;

                    case 'faq':
                    case 'faqs':
                        return <JamFAQ key={`section-faq-${index}`} jam={jam} />;

                    case 'cta':
                        return <JamCTA key={`section-cta-${index}`} jam={jam} />;

                    default: {
                        // Check if it's a custom section registered in customSections
                        const customSection = jam.customSections?.[sectionName];
                        if (customSection) {
                            return (
                                <JamMarkdownSection
                                    key={`section-custom-${sectionName}-${index}`}
                                    section={customSection}
                                    accentColor={jam.accentColor}
                                />
                            );
                        }
                        return null;
                    }
                }
            })}
        </div>
    );
};

export default JamSectionRenderer;
