/**
 * "Beyond the code": what the mentorship covers besides building.
 * Structure and wording drafted with ChatGPT (GPT-6-Sol) on 14 Nov 2026 from Isabella's brief:
 * game design that hooks, visual design rules, story, and marketing the game.
 * These are skills worked on in the calls and reviews, never promised results.
 */
export const TEACH = [
  {
    n: "01",
    icon: "gamepad",
    title: "Give players a reason to stay",
    promise: "Shape the experience around what players do, feel and want to discover next.",
    items: [
      ["Core loop", "Make the main action satisfying enough to repeat."],
      ["First 30 seconds", "Show players what is interesting before asking for patience."],
      ["Player motivation", "Give each action a clear purpose."],
      ["Difficulty curve", "Introduce challenge without losing beginners or boring confident players."],
      ["Stakes", "Make players understand why their choices matter."],
      ["Hero's journey", "Build anticipation, change and a satisfying ending."],
    ],
  },
  {
    n: "02",
    icon: "eye",
    title: "Give the game its own identity",
    promise: "Use visual decisions to make the game readable, coherent and recognisably yours.",
    items: [
      ["Colour theory", "Choose colours that support the mood and guide attention."],
      ["Contrast", "Make important objects and actions easy to spot."],
      ["Focal point", "Direct the eye to what matters in each scene."],
      ["Visual hierarchy", "Help players read screens in the right order."],
      ["Composition", "Place elements so scenes feel deliberate and clear."],
      ["Silhouette", "Make characters and objects recognisable at a glance."],
    ],
  },
  {
    n: "03",
    icon: "rocket",
    title: "Help the right players find it",
    promise: "Learn to show what makes the game worth someone's time.",
    items: [
      ["Audience", "Identify the players most likely to enjoy your game."],
      ["Positioning", "Explain what makes it distinct in one clear thought."],
      ["Capsule art", "Plan an image that communicates genre and mood at small sizes."],
      ["Trailer hook", "Open with the moment most likely to earn another few seconds."],
      ["Store page", "Show the experience clearly through words, images and gameplay."],
      ["Playtesting", "Use player reactions to improve the game and its presentation."],
    ],
  },
] as const;
