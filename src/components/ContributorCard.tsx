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
    <div className={`bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 ${className}`}>
        {children}
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
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xl font-bold text-white shadow-inner">
                        {person.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{person.name}</h3>
                        <p className="text-cyan-400 text-sm font-medium">{person.role}</p>
                    </div>
                </div>
                <p 
                    ref={descRef}
                    className={`text-slate-300 mb-6 leading-relaxed ${lineCount > 4 ? 'line-clamp-4' : ''}`}
                >
                    {person.description}
                </p>
            </div>

            <div className="pt-4 border-t border-slate-700 flex gap-4">
                {person.socials.map((social: ContributorSocial, sIdx: number) => (
                    <a
                        key={sIdx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white hover:scale-110 transition-all"
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
