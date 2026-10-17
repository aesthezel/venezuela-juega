import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faBookmark } from '@fortawesome/free-solid-svg-icons';
import type { DocSource } from '../types';

interface DocSourcesProps {
    sources: DocSource[];
}

const DocSources = ({ sources }: DocSourcesProps) => {
    if (!sources.length) return null;

    return (
        <section className="mt-14 pt-8 border-t border-surface-700">
            <h2 className="text-xl font-black text-white flex items-center gap-3 mb-5">
                <span className="w-9 h-9 rounded-xl bg-base-300/70 border border-surface-700 flex items-center justify-center text-accent-teal text-sm">
                    <FontAwesomeIcon icon={faBookmark} />
                </span>
                Fuentes y referencias
            </h2>
            <ul className="flex flex-col gap-2">
                {sources.map((source) => (
                    <li key={source.url}>
                        <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 rounded-xl border border-surface-700 bg-base-200/50 px-4 py-3 text-sm text-base-content/70 hover:text-white hover:border-accent-teal/40 transition-colors"
                        >
                            <FontAwesomeIcon
                                icon={faArrowUpRightFromSquare}
                                className="text-xs text-base-content/40 group-hover:text-accent-teal transition-colors"
                            />
                            <span className="flex-1 min-w-0">{source.label}</span>
                            <span className="hidden sm:block text-[11px] font-mono text-base-content/30 truncate max-w-[240px]">
                                {source.url}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default DocSources;
