import { h } from 'preact';
import type { VNode } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faCircleInfo,
    faNoteSticky,
    faLightbulb,
    faTriangleExclamation,
    faCircleXmark,
    faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import type { DocCallout, DocCalloutKind } from '../types';
import { buildContentBlocks, renderRichText } from '@/common/markdown';
import type { ContentBlock } from '@/common/markdown';

interface DocInfoBoxProps {
    callout: DocCallout;
}

interface CalloutStyle {
    icon: IconDefinition;
    label: string;
    container: string;
    iconColor: string;
}

const CALLOUT_STYLES: Record<DocCalloutKind, CalloutStyle> = {
    info: {
        icon: faCircleInfo,
        label: 'Información',
        container: 'border-accent-indigo/40 bg-accent-indigo/10',
        iconColor: 'text-accent-indigo',
    },
    note: {
        icon: faNoteSticky,
        label: 'Nota',
        container: 'border-surface-400/40 bg-white/5',
        iconColor: 'text-base-content/60',
    },
    tip: {
        icon: faLightbulb,
        label: 'Consejo',
        container: 'border-accent-teal/40 bg-accent-teal/10',
        iconColor: 'text-accent-teal',
    },
    warning: {
        icon: faTriangleExclamation,
        label: 'Atención',
        container: 'border-brand-gold/40 bg-brand-gold/10',
        iconColor: 'text-brand-gold',
    },
    danger: {
        icon: faCircleXmark,
        label: 'Importante',
        container: 'border-secondary/40 bg-secondary/10',
        iconColor: 'text-secondary',
    },
    success: {
        icon: faCircleCheck,
        label: 'Recomendado',
        container: 'border-emerald-500/40 bg-emerald-500/10',
        iconColor: 'text-emerald-400',
    },
};

/** Compact renderer for callout inner content (no heading anchors). */
function renderCalloutBlocks(blocks: ContentBlock[]): VNode[] {
    return blocks.map((block, idx) => {
        switch (block.kind) {
            case 'header':
                return (
                    <h4 key={idx} className="font-black text-white text-sm">
                        {renderRichText(block.text)}
                    </h4>
                );
            case 'quote':
                return (
                    <blockquote key={idx} className="border-l-2 border-white/20 pl-3 italic opacity-90">
                        {renderRichText(block.lines.join('\n'))}
                    </blockquote>
                );
            case 'list':
                return (
                    <ul key={idx} className="list-disc list-inside space-y-1">
                        {block.items.map((item, i) => (
                            <li key={i}>{renderRichText(item)}</li>
                        ))}
                    </ul>
                );
            case 'ordered-list':
                return (
                    <ol key={idx} className="list-decimal list-inside space-y-1">
                        {block.items.map((item, i) => (
                            <li key={i}>{renderRichText(item)}</li>
                        ))}
                    </ol>
                );
            case 'code':
                return (
                    <pre key={idx} className="bg-base-300/70 border border-base-300 rounded-xl p-3 overflow-x-auto text-xs">
                        <code className="font-mono">{block.code}</code>
                    </pre>
                );
            case 'directive':
                return (
                    <div key={idx} className="space-y-2">
                        {renderCalloutBlocks(buildContentBlocks(block.content))}
                    </div>
                );
            default:
                return <p key={idx}>{renderRichText(block.lines.join(' '))}</p>;
        }
    });
}

const DocInfoBox = ({ callout }: DocInfoBoxProps) => {
    const style = CALLOUT_STYLES[callout.kind] ?? CALLOUT_STYLES.note;
    const blocks = buildContentBlocks(callout.content);

    return (
        <aside
            id={callout.id}
            role="note"
            className={`scroll-mt-24 rounded-2xl border-l-4 border border-surface-700/40 px-5 py-4 my-2 ${style.container}`}
        >
            <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={style.icon} className={`mt-0.5 text-base ${style.iconColor}`} />
                <div className="flex flex-col gap-2 min-w-0 flex-1 text-sm leading-relaxed">
                    {callout.title && (
                        <p className="font-black text-white text-sm uppercase tracking-wide">{callout.title}</p>
                    )}
                    <div className="space-y-2 text-base-content/80">{renderCalloutBlocks(blocks)}</div>
                </div>
            </div>
        </aside>
    );
};

export default DocInfoBox;
