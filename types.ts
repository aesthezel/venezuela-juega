
export enum GameStatus {
  RELEASED = "Lanzado",
  IN_DEVELOPMENT = "En Desarrollo",
  ON_HOLD = "En Pausa",
  CANCELED = "Cancelado",
}

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
  presskitUrl?: string;
  pitch?: string;
  funding?: string;
  engine: string;
  languages: string[];
  imageUrl: string;
  description: string;
}
