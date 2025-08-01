import { Game, GameStatus } from '../types';

export const highlightedGameIds = [1, 3, 4];

export const gamesData: Game[] = [
  {
    id: 1,
    title: "VA-11 Hall-A: Cyberpunk Bartender Action",
    platform: ["PC", "PS4", "PS Vita", "Nintendo Switch"],
    genre: ["Visual Novel", "Simulation"],
    developers: ["Sukeban Games"],
    publishers: ["Ysbryd Games", "Wolfgame"],
    releaseDate: "21 de Junio, 2016",
    status: GameStatus.RELEASED,
    stores: [
      { name: "Steam", url: "https://store.steampowered.com/app/447530/VA11_HallA_Cyberpunk_Bartender_Action/" },
      { name: "GOG", url: "https://www.gog.com/game/va11_halla_cyberpunk_bartender_action" },
      { name: "Nintendo eShop", url: "https://www.nintendo.com/store/products/va-11-hall-a-cyberpunk-bartender-action-switch/" }
    ],
    links: [{ name: "Official Site", url: "http://waifubartending.com/" }],
    engine: "GameMaker Studio",
    languages: ["Inglés", "Japonés", "Chino Simplificado"],
    imageUrl: "https://picsum.photos/seed/va11halla/500/300",
    description: "En un mundo cyberpunk, eres una bartender en el bar VA-11 Hall-A. Mezcla bebidas y cambia la vida de tus fascinantes clientes.",
    pitch: "Una experiencia narrativa sobre bebidas, tecnología y vida en un futuro distópico.",
    funding: "Autofinanciado"
  },
  {
    id: 2,
    title: "Night Reverie",
    platform: ["PC"],
    genre: ["Aventura", "Puzzle"],
    developers: ["Somber Pixel"],
    publishers: ["Somber Pixel"],
    releaseDate: "27 de Octubre, 2021",
    status: GameStatus.RELEASED,
    stores: [
      { name: "Steam", url: "https://store.steampowered.com/app/1254670/Night_Reverie/" }
    ],
    links: [{ name: "Twitter", url: "https://twitter.com/somberpixel" }],
    engine: "Construct 3",
    languages: ["Inglés", "Español"],
    imageUrl: "https://picsum.photos/seed/nightreverie/500/300",
    description: "Ayuda a un niño a resolver el misterio de la distorsión de su casa en una aventura de puzzle con una estética de pixel art encantadora.",
    pitch: "Un juego de aventura y puzzles sobre la inocencia y los misterios de la niñez."
  },
  {
    id: 3,
    title: "Neon City Riders",
    platform: ["PC", "PS4", "Xbox One", "Nintendo Switch"],
    genre: ["Acción", "Aventura"],
    developers: ["Mecha Studios"],
    publishers: ["Bromio"],
    releaseDate: "12 de Marzo, 2020",
    status: GameStatus.RELEASED,
    stores: [
      { name: "Steam", url: "https://store.steampowered.com/app/1093490/Neon_City_Riders/" }
    ],
    links: [{ name: "Official Site", url: "https://www.neoncityriders.com/" }],
    engine: "Unity",
    languages: ["Inglés", "Español", "Francés", "Italiano", "Alemán"],
    imageUrl: "https://picsum.photos/seed/neoncity/500/300",
    description: "Explora una metrópolis cyberpunk en busca de superpoderes para derrotar a las pandillas que controlan la ciudad."
  },
  {
    id: 4,
    title: "Hazbin Hotel: Journey to Hell",
    platform: ["PC", "Mobile"],
    genre: ["RPG", "Aventura"],
    developers: ["Teravision Games"],
    publishers: ["A24"],
    releaseDate: "TBA",
    status: GameStatus.IN_DEVELOPMENT,
    stores: [],
    links: [{ name: "Studio Site", url: "https://www.teravisiongames.com/" }],
    engine: "Unreal Engine 5",
    languages: ["Inglés", "Español"],
    imageUrl: "https://picsum.photos/seed/hazbin/500/300",
    description: "Una aventura RPG basada en la popular serie animada. Ayuda a Charlie en su misión de rehabilitar demonios.",
    pitch: "El primer juego oficial del universo de Hazbin Hotel.",
    funding: "Inversión privada"
  },
  {
    id: 5,
    title: "Blocky Castle",
    platform: ["iOS", "Android"],
    genre: ["Arcade", "Plataformas"],
    developers: ["isTom Games"],
    publishers: ["Fugo Games"],
    releaseDate: "18 de Enero, 2017",
    status: GameStatus.RELEASED,
    stores: [
        { name: "Google Play", url: "#" },
        { name: "App Store", url: "#" }
    ],
    links: [],
    engine: "Unity",
    languages: ["Múltiples"],
    imageUrl: "https://picsum.photos/seed/blocky/500/300",
    description: "Sube por torres infinitas evitando obstáculos y enemigos en este adictivo juego de plataformas arcade.",
  },
  {
    id: 6,
    title: "The Guppy Special",
    platform: ["PC"],
    genre: ["Carreras", "Acción"],
    developers: ["Team Guppy"],
    publishers: ["Team Guppy"],
    releaseDate: "2025 (Estimado)",
    status: GameStatus.IN_DEVELOPMENT,
    stores: [],
    links: [{ name: "Itch.io", url: "#" }],
    engine: "Godot",
    languages: ["Inglés", "Español"],
    imageUrl: "https://picsum.photos/seed/guppy/500/300",
    description: "Un juego de carreras futurista de alta velocidad con combate vehicular. Personaliza tu nave y compite por la gloria."
  },
  {
    id: 7,
    title: "Proyecto Cancelado X",
    platform: ["PC"],
    genre: ["Estrategia"],
    developers: ["Estudio Fantasma"],
    publishers: [],
    releaseDate: "N/A",
    lastUpdateDate: "15 de Mayo, 2022",
    status: GameStatus.CANCELED,
    stores: [],
    links: [],
    engine: "Propio",
    languages: ["Español"],
    imageUrl: "https://picsum.photos/seed/cancelado/500/300",
    description: "Un ambicioso juego de estrategia en tiempo real que fue cancelado en las primeras etapas de desarrollo."
  }
];