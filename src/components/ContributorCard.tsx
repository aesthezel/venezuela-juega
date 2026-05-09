import { h, ComponentChildren } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';

export interface ContributorSocial {
    icon: any;
    url: string;
}

export interface Contributor {
    name: string;
    role: string;
    description: string;
    socials: ContributorSocial[];
}

const Card = ({ children, className = "" }: { children: ComponentChildren, className?: string }) => (
    <div className={`card bg-base-200 shadow-xl border border-base-300 hover:border-surface-700 transition-all duration-300 ${className}`}>
        <div className="card-body p-6 flex flex-col justify-between">
            {children}
        </div>
    </div>
);

interface ContributorCardProps {
    person: Contributor;
}

const ContributorCard = ({ person }: ContributorCardProps) => {
    const { ref: descRef, width: descWidth } = useMeasure<HTMLParagraphElement>();
    const { lineCount } = useTextLayout(person.description, descWidth, {
        fontSize: 16,
        lineHeight: 24
    });

    return (
        <Card className="h-full flex flex-col justify-between hover:-translate-y-1 duration-300">
            <div>
                <div className="flex items-center gap-4 mb-3">
                    <div className="avatar placeholder">
                        <div className="w-12 h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-xl font-bold shadow-inner">
                            <span>{person.name.charAt(0)}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{person.name}</h3>
                        <p className="text-accent-teal text-sm font-medium">{person.role}</p>
                    </div>
                </div>
                <p 
                    ref={descRef}
                    className={`text-base-content/70 mb-6 leading-relaxed ${lineCount > 4 ? 'line-clamp-4' : ''}`}
                >
                    {person.description}
                </p>
            </div>

            <div className="card-actions pt-4 border-t border-base-300 flex gap-2">
                {person.socials.map((social: ContributorSocial, sIdx: number) => (
                    <a
                        key={sIdx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-base-content transition-all"
                        aria-label={`Link a ${social.url}`}
                    >
                        <FontAwesomeIcon icon={social.icon} size="lg" />
                    </a>
                ))}
            </div>
        </Card>
    );
};

export default ContributorCard;
