/**
 * Data for the "AI hate, jobs and art" section and page. Collected 14 Nov 2026.
 * Every figure was read at the linked page (by me or by the research pass that day).
 * The evidence cuts both ways and the page says so: do not trim the uncomfortable numbers.
 */
export const SRC = {
  totallyHuman: {
    label: "Totally Human Media, July 2025",
    href: "https://www.totallyhuman.io/blog/the-surprising-new-number-of-genai-games-on-steam",
  },
  gdc2026: {
    label: "GDC State of the Game Industry 2026",
    href: "https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/",
  },
  quantic: {
    label: "Quantic Foundry survey of 1,799 gamers, late 2025",
    href: "https://www.gamesmarket.global/quantic-foundry-most-gamers-are-negative-about-the-use-of-gen-ai-in-video-games",
  },
  so2025: { label: "Stack Overflow Developer Survey 2025", href: "https://survey.stackoverflow.co/2025/ai" },
  steam: {
    label: "Valve, AI Content on Steam, January 2024",
    href: "https://store.steampowered.com/news/group/4145017/view/3862463747997849618",
  },
  itch: { label: "itch.io AI disclosure and filters, November 2026", href: "https://www.gaming.net/itch-io-expands-ai-disclosure-filters-to-search-results/" },
  wef: {
    label: "World Economic Forum, Future of Jobs Report 2025",
    href: "https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/",
  },
  pwc: {
    label: "PwC Global AI Jobs Barometer 2026, reported by Euronews",
    href: "https://www.euronews.com/business/2026/06/16/human-skills-increasingly-in-demand-as-ai-reshapes-labour-market-pwc-finds",
  },
  wti: {
    label: "Microsoft and LinkedIn Work Trend Index 2024",
    href: "https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part",
  },
  stanford: {
    label: "Stanford Digital Economy Lab, Canaries in the Coal Mine",
    href: "https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/",
  },
  hbr: {
    label: "Harvard Business Review, August 2023",
    href: "https://hbr.org/2023/08/ai-wont-replace-humans-but-humans-with-ai-will-replace-humans-without-ai",
  },
  copyright: {
    label: "US Copyright Office, Copyright and AI, Part 2, January 2025",
    href: "https://www.copyright.gov/newsnet/2025/1060.html",
  },
  getty: {
    label: "Mishcon de Reya on Getty Images v Stability AI",
    href: "https://www.mishcon.com/news/getty-images-v-stability-ai-unpacking-the-high-courts-judgment?publication=7570",
  },
  clair: {
    label: "Engadget, December 2025",
    href: "https://www.engadget.com/gaming/the-indie-game-awards-snatches-back-two-trophies-from-clair-obscur-over-its-use-of-generative-ai-164730842.html",
  },
  tron: { label: "Film Stories on Tron and the 1982 Oscars", href: "https://filmstories.co.uk/news/why-tron-didnt-get-a-vfx-oscar-nomination-in-1982/" },
  baudelaire: { label: "Charles Baudelaire, Salon of 1859", href: "https://en.wikipedia.org/wiki/Charles_Baudelaire" },
  happyDay: { label: "HAPPY DAY on itch.io", href: "https://isgstudio.itch.io/happy-day" },
} as const;

export const STEAM_BARS = [
  { label: "Steam games disclosing generative AI in 2024", value: 1000, display: "1,000", tone: "mute" as const },
  { label: "By July 2025", value: 7818, display: "7,818", tone: "hot" as const },
];

export const GDC_TREND = [
  {
    name: "Game developers who say generative AI is harming the industry",
    tone: "hot" as const,
    points: [
      { x: "2024", y: 18 },
      { x: "2025", y: 30 },
      { x: "2026", y: 52 },
    ],
  },
];

export const JOB_BARS = [
  { label: "Jobs asking for AI skills, growth since 2019", value: 69, display: "+69%", tone: "hot" as const },
  { label: "All jobs, same period", value: 9, display: "+9%", tone: "mute" as const },
];

export const ART_TIMELINE = [
  {
    year: "1859",
    title: "Photography is not art",
    text: "The poet Charles Baudelaire attacked photography as an art form and wanted it kept as a servant of science and the arts. It became one of the great arts of the next century.",
    href: SRC.baudelaire.href,
    source: SRC.baudelaire.label,
  },
  {
    year: "1982",
    title: "Computers are cheating",
    text: "Tron, the first film built around computer imagery, was not even nominated for a visual effects Oscar. Its makers say the Academy saw computer use as cheating. Today, almost every film uses computers.",
    href: SRC.tron.href,
    source: SRC.tron.label,
  },
  {
    year: "2024",
    title: "Steam opens the door",
    text: "After months of caution, Valve changed its rules so most games made with AI can be released on Steam, provided developers disclose how they used it.",
    href: SRC.steam.href,
    source: SRC.steam.label,
  },
  {
    year: "2025",
    title: "The law draws a line",
    text: "The US Copyright Office said a prompt alone does not make you an author, but work with real human creative choices, arrangement or editing can be protected.",
    href: SRC.copyright.href,
    source: SRC.copyright.label,
  },
];

export const DO_IT_RIGHT = [
  ["Disclose it.", "Steam and itch.io both ask you to explain how you used AI. Say it clearly and up front."],
  ["Direct it, do not just prompt it.", "Choose the style, palette and characters yourself. Your choices make the work yours, creatively and legally."],
  ["Edit everything.", "Redraw, repaint, clean up and animate. Unedited generations are what people often call “slop”."],
  ["Never request a living artist's style by name.", "Develop your own look from your own references."],
  ["Check the tool's commercial terms.", "Check that you are allowed to sell what you make with it."],
  ["Playtest and polish.", "People may accept the tools. A game that feels careless is harder to forgive."],
] as const;

export const FAIR_OBJECTIONS = [
  {
    text: "Many artists object to models trained on their work without consent. Lawsuits such as Andersen v. Stability AI are still before the US courts.",
  },
  {
    text: "In the UK, the High Court mostly sided with Stability AI against Getty Images in November 2025. Getty is appealing, so the question remains open.",
    href: SRC.getty.href,
    source: SRC.getty.label,
  },
  {
    text: "The worry is strongest among game artists: 64% of visual and technical artists told GDC that generative AI is harming the industry.",
    href: SRC.gdc2026.href,
    source: SRC.gdc2026.label,
  },
  {
    text: "Hiding AI use can backfire. Clair Obscur: Expedition 33 lost two Indie Game Awards after placeholder AI textures were found in the released game.",
    href: SRC.clair.href,
    source: SRC.clair.label,
  },
];

export const FURTHER_READING = [
  { title: "The surprising new number of GenAI games on Steam", by: "Totally Human Media", href: SRC.totallyHuman.href, note: "How quickly AI disclosure is growing on Steam." },
  { title: "State of the Game Industry 2026", by: "GDC", href: SRC.gdc2026.href, note: "Developers' views: use is steady, while opposition is rising." },
  { title: "Most gamers are negative about gen AI in games", by: "Quantic Foundry, via GamesMarket", href: SRC.quantic.href, note: "What players think, including the negative views." },
  { title: "AI Content on Steam", by: "Valve", href: SRC.steam.href, note: "The rule itself: AI is allowed with disclosure." },
  { title: "Copyright and Artificial Intelligence, Part 2", by: "US Copyright Office", href: SRC.copyright.href, note: "What qualifies as human authorship." },
  { title: "Getty Images v Stability AI", by: "Mishcon de Reya", href: SRC.getty.href, note: "A plain-English account of the UK judgment." },
  { title: "Canaries in the Coal Mine", by: "Stanford Digital Economy Lab", href: SRC.stanford.href, note: "Who is losing work to AI first: people early in their careers." },
  { title: "Future of Jobs Report 2025", by: "World Economic Forum", href: SRC.wef.href, note: "Jobs created and displaced by 2030, and changing skills." },
  { title: "AI won't replace humans, but humans with AI will replace humans without AI", by: "Harvard Business Review", href: SRC.hbr.href, note: "Karim Lakhani on why skills make the difference." },
];
