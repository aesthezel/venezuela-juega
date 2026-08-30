export type JamStatus = 'draft' | 'upcoming' | 'open' | 'active' | 'voting' | 'ended';

export interface JamSponsor {
    name: string;
    logo: string;
    url?: string;
}

export interface JamPrize {
    category: string;
    emoji: string;
    description?: string;
    color?: string;
}

export interface JamPhase {
    label: string;
    description?: string;
    startDate?: Date | null;
    endDate?: Date | null;
    icon?: string;
}

export interface JamFAQ {
    question: string;
    answer: string;
}

export interface JamObjective {
    title: string;
    description: string;
    icon?: string;
}

export interface JamCustomSection {
    id: string;
    type: 'markdown' | 'custom' | 'embed';
    title?: string;
    subtitle?: string;
    badge?: string;
    content?: string;
    embedUrl?: string;
    theme?: 'base-100' | 'base-200' | 'base-300' | 'neutral' | 'gradient';
}

export type JamSectionType =
    | 'hero'
    | 'countdown'
    | 'stats'
    | 'about'
    | 'prizes'
    | 'donation'
    | 'schedule'
    | 'faq'
    | 'cta'
    | string;

export interface JamEvent {
    slug: string;
    edition: string;
    name: string;
    shortName?: string;
    tagline?: string;
    status: JamStatus;
    startDate: Date | null;
    endDate: Date | null;
    submissionUrl: string | null;
    registrationUrl?: string;
    registrationLabel?: string;
    registrationOpenDate?: Date | null;
    registrationCloseDate?: Date | null;
    platform?: string;
    heroGradient?: string;
    heroImage?: string;
    accentColor?: string;
    accentTextColor?: string;
    logo?: string;
    objectives: JamObjective[];
    prizes?: JamPrize[];
    isCharity?: boolean;
    donationUrl?: string;
    donationGoal?: string | number;
    phases: JamPhase[];
    faqs: JamFAQ[];
    sponsors: JamSponsor[];
    stats?: {
        participants?: number;
        submissions?: number;
        countries?: number;
    };
    /**
     * Lista ordenada de identificadores de sección para renderizar en la página.
     * Si no se especifica, se utiliza el orden estándar inteligente.
     */
    layout?: JamSectionType[];
    /** Secciones de contenido personalizado adicionales o directivas libres */
    customSections?: Record<string, JamCustomSection>;
}
