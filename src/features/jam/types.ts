// Jam module — TypeScript interfaces

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
    color?: string; // tailwind accent color token e.g. 'primary', 'secondary', 'accent'
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
    slug: string;           // e.g. "jam-benefica"
    edition: string;        // e.g. "i", "ii", "2026-julio"
    name: string;           // display name
    shortName?: string;
    tagline?: string;
    status: JamStatus;
    startDate: Date | null;
    endDate: Date | null;
    submissionUrl: string | null;
    platform?: string;      // e.g. "Itch.io"
    heroGradient?: string;
    heroImage?: string;     // URL de imagen de fondo del hero (opcional, reemplaza el gradiente)
    accentColor?: string;
    accentTextColor?: string; // Text color to use on top of accentColor
    logo?: string;          // URL del logotipo del evento (opcional)
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
