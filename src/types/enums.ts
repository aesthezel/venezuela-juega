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

/**
 * Enumeration of possible game origins.
 *
 * Represents the context or initiative under which the game was developed.
 */
export enum GameOrigin {
    /** Game developed at home as a personal project */
    FROM_HOME = 'Desde casa',

    /** Game developed during a game jam event */
    GAME_JAM = 'Gamejam',

    /** Game developed as a graduation project */
    DEGREE_PROJECT = 'Proyecto de grado',

    /** Game developed under a commercial contract */
    CONTRACT = 'Contratación',

    /** Game is a mod of another game */
    MODDING = 'Modding',

    /** Game developed during GameJam+ 25/26 event */
    GAME_JAM_PLUS_25_26 = 'GameJam+ 25/26',
}