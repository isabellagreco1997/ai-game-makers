/**
 * Every external link, provider and identity field lives here, read from
 * environment variables (see .env.example). Nothing here is ever faked:
 * a blank value means the site shows that piece as "not connected yet".
 */

const env = (key: string): string => (process.env[key] ?? "").trim();

const isHttpUrl = (v: string) => /^https:\/\/[^\s]+$/i.test(v);

export const site = {
  name: env("BRAND_NAME") || "AI Game Makers Club",
  shortName: "AI Game Makers",
  /** Full public address including any base path, e.g. https://user.github.io/ai-game-makers */
  url: (env("SITE_URL") || "http://localhost:8900").replace(/\/$/, ""),
  locale: "en_GB",
  tagline: "Learn to make your own game with AI.",
  heroLine: "Make your game happen.",
  founder: "Isabella",
} as const;

export const links = {
  /** Free community on Skool. Default is the live group, checked 14 Nov 2026. */
  skoolCommunity: (() => {
    const v = env("SKOOL_COMMUNITY_URL") || "https://www.skool.com/build-pixel-art-games-with-ai-7131";
    return isHttpUrl(v) ? v : "";
  })(),
  /**
   * Where the mentorship buttons send people. Her decision, 14 Nov 2026: the community's About page on Skool,
   * so they read it and join first; the Premium upgrade is on the plans page inside.
   */
  skoolMentorship: (() => {
    const v = env("SKOOL_MENTORSHIP_PURCHASE_URL") || "https://www.skool.com/build-pixel-art-games-with-ai-7131/about";
    return isHttpUrl(v) ? v : "";
  })(),
  /** Isabella's booking page for the free 30-minute concept call (Google Calendar, checked 14 Nov 2026). */
  conceptCall: (() => {
    const v = env("CONCEPT_CALL_URL") || "https://calendar.app.google/DxMM1M9njsXCgSwW6";
    return isHttpUrl(v) ? v : "";
  })(),
  contactEmail: (() => {
    const v = env("CONTACT_EMAIL");
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : "";
  })(),
};

export const videos = {
  founder: env("FOUNDER_VIDEO_ID"),
  community: env("COMMUNITY_VIDEO_ID"),
  mentorship: env("MENTORSHIP_VIDEO_ID"),
  interest: env("INTEREST_VIDEO_ID"),
};

export const legal = {
  controllerName: env("LEGAL_CONTROLLER_NAME"),
  controllerLocation: env("LEGAL_CONTROLLER_LOCATION"),
  get complete() {
    return Boolean(this.controllerName && this.controllerLocation && links.contactEmail);
  },
};

export const integrations = {
  forms: {
    /** Public form endpoint (e.g. Formspree https://formspree.io/f/xxxx). Static site: the browser posts to it directly. */
    endpoint: isHttpUrl(env("FORM_ENDPOINT")) ? env("FORM_ENDPOINT") : "",
  },
  analytics: {
    provider: env("ANALYTICS_PROVIDER") === "plausible" && env("PLAUSIBLE_DOMAIN") ? ("plausible" as const) : null,
    plausibleDomain: env("PLAUSIBLE_DOMAIN"),
  },
  googleSiteVerification: env("GOOGLE_SITE_VERIFICATION"),
};

/**
 * What the mentoring includes: the Premium items from the Skool plans and about pages
 * (read 14 Nov 2026), unpacked into separate bullets by GPT-6-Sol. The 30-minute concept call is
 * not in the list on purpose: it happens before anyone pays (links.conceptCall). `approved` stays
 * false until Isabella confirms the deliverables; while false the page labels
 * the list as the planned package and the terms page says terms are pending.
 */
export const mentorship = {
  /** Pilot price agreed 14 Nov 2026: billed monthly on Skool for three months. */
  price: "$299",
  currency: "USD",
  months: 3,
  total: "$897",
  weeks: 12,
  approved: false,
  package: [
    "One 45-minute one-to-one call every week for 12 weeks, 12 calls in total",
    "Work on your own game live in each call with my guidance",
    "Messages on Skool between calls, with reply times confirmed there before payment",
    "A personal project plan for your first small game",
    "Game design guidance to help you make your own decisions",
    "Visual design guidance for your game",
    "Storytelling guidance for your game",
    "Game reviews with practical feedback",
    "Publishing guidance for your first itch.io release",
    "Marketing guidance to help you plan your own promotion",
    "Your finished game shown to my YouTube audience if it suits the channel and you agree, with no promised views or audience size",
    "Recordings, resources and everything in the free Standard community",
  ],
};

/** Launch blockers surfaced in README and in the dev-only status page. */
export function launchStatus() {
  return [
    { item: "Skool community link", ok: Boolean(links.skoolCommunity), note: "Confirm the group is set to free to join." },
    { item: "Skool mentorship purchase link", ok: Boolean(links.skoolMentorship), note: "SKOOL_MENTORSHIP_PURCHASE_URL" },
    { item: "Mentorship package approved", ok: mentorship.approved, note: "src/config/site.ts mentorship.approved" },
    { item: "Contact email", ok: Boolean(links.contactEmail), note: "CONTACT_EMAIL" },
    { item: "Legal identity (privacy policy)", ok: legal.complete, note: "LEGAL_CONTROLLER_NAME, LEGAL_CONTROLLER_LOCATION, CONTACT_EMAIL" },
    { item: "Form backend", ok: Boolean(integrations.forms.endpoint), note: "FORM_ENDPOINT" },
    { item: "Founder video", ok: Boolean(videos.founder), note: "FOUNDER_VIDEO_ID" },
    { item: "Community tour video", ok: Boolean(videos.community), note: "COMMUNITY_VIDEO_ID" },
    { item: "Mentorship video", ok: Boolean(videos.mentorship), note: "MENTORSHIP_VIDEO_ID" },
    { item: "Analytics (optional)", ok: Boolean(integrations.analytics.provider), note: "ANALYTICS_PROVIDER=plausible + PLAUSIBLE_DOMAIN" },
    { item: "Public site URL", ok: !site.url.includes("localhost"), note: "SITE_URL" },
  ];
}
