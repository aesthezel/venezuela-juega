export enum GameStatus {
  RELEASED = "Lanzado",
  RELEASED_DEMO = "Demo",
  PROTOTYPE = "Prototipo",
  IN_DEVELOPMENT = "En desarrollo",
  ON_HOLD = "Pausado",
  CANCELED = "Cancelado",
  LOST_MEDIA = "Perdido",
  EARLY_ACCESS = "Acceso anticipado",
  RECOVERED = "Recuperado",
  UNKNOWN = "Desconocido",
}

export type Page = 'catalog' | 'charts' | 'add-game' | 'about' | 'calendar';

export interface Game {
  id: number;
  title: string;
  platform: string[];
  genre: string[];
  developers: string[];
  publishers: string[];
  releaseDate: string;
  lastUpdateDate?: string;
  status: GameStatus;
  stores: { name: string; url: string }[];
  links: { name: string; url: string }[];
  pressKitUrl?: string;
  pitch?: string;
  funding?: string;
  engine: string;
  languages: string[];
  imageUrl: string;
  description: string;
  isHighlighted?: boolean;
}