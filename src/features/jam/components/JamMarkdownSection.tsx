import { h } from 'preact';
import type { JamCustomSection } from '../types';
import { renderRichText } from '../renderRichText';

interface JamMarkdownSectionProps {
    section: JamCustomSection;
    accentColor?: string;
}

const JamMarkdownSection = ({ section, accentColor = '#e34262' }: JamMarkdownSectionProps) => {
    const bgClass =
        section.theme === 'base-200'
            ? 'bg-base-200'
            : section.theme === 'base-300'
            ? 'bg-base-300'
            : section.theme === 'neutral'
            ? 'bg-neutral text-neutral-content'
            : 'bg-base-100';

    if (section.type === 'embed' && section.embedUrl) {
        return (
            <section className={`py-16 px-6 ${bgClass}`}>
                <div className="max-w-4xl mx-auto">
                    {section.title && (
                        <div className="text-center mb-8">
                            {section.badge && (
                                <span className="badge badge-secondary badge-outline text-xs font-bold mb-2 uppercase">
                                    {section.badge}
                                </span>
                            )}
                            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                                {section.title}
                            </h2>
                            {section.subtitle && (
                                <p className="text-base-content/50 text-sm uppercase tracking-widest mt-2">
                                    {section.subtitle}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-base-300 bg-base-300">
                        <iframe
                            src={section.embedUrl}
                            title={section.title || 'Embed'}
                            className="w-full h-full border-0"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>
        );
    }

    // Parse block lines into paragraphs, lists, and headers
    const rawContent = section.content || '';
    const paragraphs = rawContent.split(/\n\n+/);

    return (
        <section className={`py-20 px-6 ${bgClass}`}>
            <div className="max-w-4xl mx-auto">
                {(section.title || section.badge) && (
                    <div className="text-center mb-12">
                        {section.badge && (
                            <span
                                className="badge text-xs font-bold mb-3 uppercase tracking-wider px-3 py-2"
                                style={{
                                    borderColor: accentColor,
                                    color: accentColor,
                                }}
                            >
                                {section.badge}
                            </span>
                        )}
                        {section.title && (
                            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                                {section.title}
                            </h2>
                        )}
                        {section.subtitle && (
                            <p className="text-base-content/50 text-sm uppercase tracking-widest mt-2">
                                {section.subtitle}
                            </p>
                        )}
                    </div>
                )}

                <div className="space-y-6 text-base-content/80 text-base sm:text-lg leading-relaxed">
                    {paragraphs.map((para, pIdx) => {
                        const trimmed = para.trim();
                        if (!trimmed) return null;

                        // H3 / H4 Header
                        if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
                            const headerText = trimmed.replace(/^#+\s*/, '');
                            return (
                                <h3 key={pIdx} className="text-2xl font-black text-white pt-4 pb-1">
                                    {renderRichText(headerText)}
                                </h3>
                            );
                        }

                        // Blockquote
                        if (trimmed.startsWith('>')) {
                            const quoteText = trimmed.replace(/^>\s*/gm, '');
                            return (
                                <div
                                    key={pIdx}
                                    className="border-l-4 pl-4 py-2 italic bg-base-200/60 rounded-r-xl border-secondary"
                                >
                                    {renderRichText(quoteText)}
                                </div>
                            );
                        }

                        // Bullet list
                        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                            const listItems = trimmed
                                .split(/\n/)
                                .filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '))
                                .map((l) => l.trim().slice(2));

                            return (
                                <ul key={pIdx} className="space-y-2 list-disc list-inside bg-base-200/40 p-5 rounded-2xl border border-base-300">
                                    {listItems.map((item, itemIdx) => (
                                        <li key={itemIdx} className="leading-normal">
                                            {renderRichText(item)}
                                        </li>
                                    ))}
                                </ul>
                            );
                        }

                        // Regular paragraph
                        return <p key={pIdx}>{renderRichText(trimmed)}</p>;
                    })}
                </div>
            </div>
        </section>
    );
};

export default JamMarkdownSection;
