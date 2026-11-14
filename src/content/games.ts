/**
 * Isabella's real games. Every image in public/games is a real frame from the
 * game itself (itch.io screenshots, captures from the running build, or
 * frames of recorded gameplay), chosen 14 Nov 2026. Never concept art.
 * Status must be true today; links only to real public pages.
 */
export type GameStatus = "Released" | "Playable Demo" | "In Development";

export type Game = {
  title: string;
  status: GameStatus;
  genre: string;
  platform: string;
  summary: string;
  detail: string;
  shot: { src: string; alt: string; portrait?: boolean };
  links: { label: string; href: string }[];
};

export const GAMES: Game[] = [
  {
    title: "HAPPY DAY",
    status: "Released",
    genre: "Pixel art horror",
    platform: "itch.io",
    summary: "A short pixel art horror game with exploration, puzzles and story.",
    detail: "Built with AI-assisted workflows and released on itch.io, with a devlog showing how it was made.",
    shot: { src: "/games/happy-day.webp", alt: "HAPPY DAY: a birthday table with a cake under a HAPPY BIRTHDAY banner" },
    links: [{ label: "Play on itch.io", href: "https://isgstudio.itch.io/happy-day" }],
  },
  {
    title: "HELLPOP MAYHEM",
    status: "In Development",
    genre: "Rhythm platformer",
    platform: "Mobile",
    summary: "A rhythm platformer with a story set on a cursed cabaret stage.",
    detail: "Every jump lands on the beat while the audience reacts. Act I is in development.",
    shot: { src: "/games/hellpop-mayhem.webp", alt: "HELLPOP MAYHEM: a towering hell city glowing red, from the opening cutscene", portrait: true },
    links: [],
  },
  {
    title: "Midnight Cat",
    status: "In Development",
    genre: "Rooftop runner",
    platform: "iOS and Android",
    summary: "A one-finger rooftop jumper about a black cat chasing fish across a sleeping city.",
    detail: "Fifty cat skins, a flight mode beyond the moon gate and a living night sky. Coming to mobile.",
    shot: { src: "/games/midnight-cat.webp", alt: "Midnight Cat: the black cat flying past a full moon with a rainbow trail", portrait: true },
    links: [],
  },
  {
    title: "The Illusionist",
    status: "In Development",
    genre: "Pixel art horror",
    platform: "itch.io page",
    summary: "A pixel art horror game with strange stages, unsettling places and puzzles.",
    detail: "Currently in development. Follow its itch.io page for updates.",
    shot: { src: "/games/illusionist.webp", alt: "The Illusionist: puppets on a stage under a SMILE FOR ME sign" },
    links: [{ label: "See it on itch.io", href: "https://isgstudio.itch.io/the-illusionist" }],
  },
  {
    title: "The Last Ember",
    status: "In Development",
    genre: "Platformer",
    platform: "PC",
    summary: "A hooded runner carries the last flame through a moonlit world.",
    detail: "A pixel platformer with a boss chapter, built and documented on YouTube.",
    shot: { src: "/games/last-ember.webp", alt: "The Last Ember: the hooded runner leaping with a flame under a full moon" },
    links: [],
  },
  {
    title: "Bomb Bomb Hell!",
    status: "Playable Demo",
    genre: "Arcade action",
    platform: "Browser",
    summary: "A bomb-dropping arcade game you can play in your browser.",
    detail: "Built with AI tools and published on GitHub Pages.",
    shot: { src: "/games/bomb-bomb-hell.webp", alt: "Bomb Bomb Hell! title screen with its horned heroine" },
    links: [{ label: "Play in your browser", href: "https://isabellagreco1997.github.io/bomb-bomb-hell/" }],
  },
  {
    title: "Blue Steel",
    status: "Playable Demo",
    genre: "Sci-fi platformer",
    platform: "Browser",
    summary: "A moody sci-fi platformer set in a steel bunker.",
    detail: "A browser game built with AI coding tools, playable on GitHub Pages.",
    shot: { src: "/games/blue-steel.webp", alt: "Blue Steel title screen in a dark metal corridor" },
    links: [{ label: "Play in your browser", href: "https://isabellagreco1997.github.io/blue-steel/" }],
  },
];
