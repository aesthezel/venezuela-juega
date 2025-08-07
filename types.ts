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