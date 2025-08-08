/**
 * Represents the current status of a game in its development lifecycle.
 * 
 * This enum is used to categorize games based on their release and development status,
 * allowing for filtering and display of status information in the UI.
 */
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