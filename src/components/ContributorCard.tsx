import { h, ComponentChildren } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMeasure } from '@/hooks/useMeasure';
import { useTextLayout } from '@/hooks/useTextLayout';

export interface ContributorSocial {
    icon: any;
    url: string;
}

export interface Contributor {
    name: string;
    role: string;
    description: string;
    socials: ContributorSocial[];
    avatarUrl?: string;
}

const Card = ({ children, className = "" }: { children: ComponentChildren, className?: string }) => (
    <div className={`card bg-base-200/50 backdrop-blur-md shadow-xl border border-base-300 hover:border-primary/30 transition-all duration-300 ${className}`}>
        <div className="card-body p-5 flex flex-col justify-between">
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
        fontSize: 14,
        lineHeight: 20
    });

    return (
        <Card className="h-full hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 duration-300">
            <div className="flex gap-4 items-start">
                <div className="avatar placeholder flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-neutral text-neutral-content flex items-center justify-center text-2xl font-black shadow-lg overflow-hidden border border-base-300 ring-2 ring-primary/20 ring-offset-2 ring-offset-base-200 transition-all duration-300 hover:ring-primary">
                        {person.avatarUrl ? (
                            <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                        ) : (
                            <span className="text-primary font-mono">{person.name.charAt(0)}</span>
                        )}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-white leading-tight mb-0.5 truncate">{person.name}</h3>
                    <p className="text-xs font-semibold text-accent-teal uppercase tracking-wider mb-2">{person.role}</p>
                    <p
                        ref={descRef}
                        className={`text-xs md:text-sm text-base-content/80 mb-3 leading-relaxed ${lineCount > 3 ? 'line-clamp-3' : ''}`}
                    >
                        {person.description}
                    </p>
                    <div className="flex gap-2">
                        {person.socials.map((social: ContributorSocial, sIdx: number) => (
                            <a
                                key={sIdx}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-base-300/80 hover:bg-primary/20 text-base-content/80 hover:text-primary border border-base-300/30 hover:border-primary/30 transition-all duration-300"
                                aria-label={`Link a ${social.url}`}
                            >
                                <FontAwesomeIcon icon={social.icon} className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ContributorCard;
