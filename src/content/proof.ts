/**
 * Real, public reactions to our games, collected 14 Nov 2026.
 * Every quote links to where it was said. Japanese comments are translated
 * and marked as such. Do not add anything here that is not public and real.
 * Quotes from inside the Skool community need the member's permission first.
 */
export type Quote = { text: string; who: string; where: string; href: string; translated?: boolean; game: string };
export type CreatorVideo = { id: string; title: string; channel: string; channelUrl: string; views?: string; lang: string };

export const QUOTES: Quote[] = [
  {
    text: "What an incredible game! The pixel art is absolutely beautiful, and the story was so touching that I couldn't hold back my tears at the ending.",
    who: "Aramaki_Aramaki",
    where: "itch.io comment",
    href: "https://isgstudio.itch.io/happy-day",
    game: "HAPPY DAY",
  },
  {
    text: "The pixel-art world, the horror staging and the sad story: a really charming, wonderful game.",
    who: "@Mr96848",
    where: "YouTube comment",
    href: "https://www.youtube.com/watch?v=IKyV_hvd0sw",
    translated: true,
    game: "HAPPY DAY",
  },
  {
    text: "An awfully sad game, nevertheless loved it. Nice work!",
    who: "SabrinaVampirschi",
    where: "itch.io comment",
    href: "https://isgstudio.itch.io/happy-day",
    game: "HAPPY DAY",
  },
  {
    text: "I thought it was going to be a story about a creepy brother, and instead it moved me.",
    who: "@毒島ちゃんネル",
    where: "YouTube comment",
    href: "https://www.youtube.com/watch?v=IKyV_hvd0sw",
    translated: true,
    game: "HAPPY DAY",
  },
  {
    text: "The game itself is, of course, extremely polished.",
    who: "@渡り烏",
    where: "YouTube comment",
    href: "https://www.youtube.com/watch?v=IKyV_hvd0sw",
    translated: true,
    game: "HAPPY DAY",
  },
  {
    text: "This one is worth checking out.",
    who: "Gavengelthegrim",
    where: "itch.io comment",
    href: "https://isgstudio.itch.io/happy-day",
    game: "HAPPY DAY",
  },
];

export const CREATOR_VIDEOS: CreatorVideo[] = [
  {
    id: "IKyV_hvd0sw",
    title: "A horror game where a mysterious man insists on celebrating my birthday",
    channel: "Aramaki",
    channelUrl: "https://www.youtube.com/@aramaki_aramakigames",
    views: "7.5k views",
    lang: "Japanese, English subtitles",
  },
  {
    id: "8RiI_Yz2PjM",
    title: "Happy Day: full playthrough",
    channel: "Vampirschi Gaming",
    channelUrl: "https://www.youtube.com/@VampirschiGaming",
    lang: "English",
  },
  {
    id: "hMSlLVf887I",
    title: "Happy Day: He found the funny hats!",
    channel: "Spudcats",
    channelUrl: "https://www.youtube.com/@Spudcats",
    lang: "English",
  },
];

/** A real feedback loop from the HAPPY DAY comments (2 to 3 Oct 2026). */
export const FEEDBACK_STORY = {
  report: "The clock does not work quite as a player would expect.",
  who: "SpriteForge.tech",
  fixed: "Fixed the same day.",
  href: "https://isgstudio.itch.io/happy-day",
};

/** Hard facts for "Why now". Each was read at its source on 14 Nov 2026. */
export const FACTS = [
  {
    big: "73%",
    text: "of developers who use AI coding tools now use them every day.",
    source: "Stack Overflow Developer Survey 2026",
    href: "https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/",
  },
  {
    big: "66%",
    text: "Claude Code is developers' most used AI coding agent: 66% of them choose it.",
    source: "Stack Overflow Developer Survey 2026",
    href: "https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/",
  },
  {
    big: "32%",
    text: "of organisations skipped buying some software because they could build it with agentic coding tools.",
    source: "McKinsey, The State of AI 2026",
    href: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
  },
  {
    big: "66%",
    text: "faster: how quickly the skills employers want are changing in the jobs most exposed to AI.",
    source: "PwC Global AI Jobs Barometer 2025",
    href: "https://www.pwc.com/gx/en/news-room/press-releases/2025/ai-linked-to-a-fourfold-increase-in-productivity-growth.html",
  },
  {
    big: "16%",
    text: "of AI users are 'frontier' users. Half say checking what the AI produces is now the key skill.",
    source: "Microsoft Work Trend Index 2026",
    href: "https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization",
  },
  {
    big: "$201.6bn",
    text: "earned by games in 2025, the first year the industry passed $200 billion.",
    source: "Newzoo, via PocketGamer.biz",
    href: "https://www.pocketgamer.biz/global-games-revenue-surpasses-200bn-for-the-first-time-mobile-generates-113bn/",
  },
];

/**
 * Words from members inside the Skool club. Isabella asked the members for
 * permission before these went on the site (14 Nov 2026). Quoted verbatim,
 * trimmed only where marked with an ellipsis.
 */
export const MEMBER_QUOTES = [
  {
    text: "I'm just glad I had something to help motivate me to get started on something for real. So thanks to you, Isa, for the event!",
    who: "Nathan C.",
    context: "after the Worst Game Ever Challenge",
  },
];