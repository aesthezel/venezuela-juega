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
}
