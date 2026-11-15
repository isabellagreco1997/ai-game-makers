# AI Game Makers Academy: website

The marketing site for AI Game Makers, built from `AI_Game_Makers_Claude_Master_Brief.md` (14 Nov 2026).
Its job: send visitors to the free Skool community, explain the 1:1 mentorship ($299 a month for three months, bought on Skool),
and collect interest in future Birmingham workshops. It hosts no lessons and takes no payments.

Stack: Next.js 16 (App Router) · React 19 · TypeScript · plain CSS (tokens in `src/app/globals.css`, CSS modules per component).
All pixel art is drawn in code (`tools/make_art.py`), so it stays crisp at any size.

## Run it

```bash
npm install
npm run dev          # http://localhost:8900
npm run build        # production build
npm run typecheck
node tools/check-site.mjs http://localhost:8900   # automated release-gate checks (server must be running)
python tools/make_art.py && python tools/make_og.py # redraw pixel art and the share image
```

Settings live in environment variables. Copy `.env.example` to `.env.local` locally, or set them in the host's dashboard.

## Where things are

| Path | What |
|---|---|
| `src/config/site.ts` | Every link, provider, legal field and the mentorship package. Blank values show as "not connected yet", never faked. |
| `src/content/games.ts` | The real games on `/games` (checked against their public pages 14 Nov 2026). |
| `src/app/**/page.tsx` | One file per route; copy follows the brief. |
| `src/components/` | Scene (hero world), Button, Sprite, Video, Forms, Consent, Header, Footer, blocks. |
| `src/lib/forms.ts` | Form validation, honeypot + time-to-fill spam check, rate limit, provider adapter. |
| `tools/` | Art generator, share-image generator, site checker. |

Routes: `/` `/free-course` `/community` `/mentorship` `/games` `/about` `/workshops` `/interest` `/thank-you` `/privacy` `/cookies` `/terms`, custom 404, `sitemap.xml`, `robots.txt`.

## Launch checklist (blockers first)

| # | Item | Status | How |
|---|---|---|---|
| 1 | Skool mentorship purchase link | Set (About page) | `SKOOL_MENTORSHIP_PURCHASE_URL`. Until set, every purchase button is disabled with a note. |
| 2 | Mentorship package approved | **Draft** | Confirm the 19 deliverables (her Game Design Accelerator card, 15 Nov) in `src/config/site.ts`, then set `mentorship.approved = true`. |
| 3 | Refund, cancellation and start-date terms | **Missing** | Write them; they go in `/terms` and the Skool offer. Required before promoting checkout. |
| 4 | Legal identity | **Missing** | `LEGAL_CONTROLLER_NAME`, `LEGAL_CONTROLLER_LOCATION`, `CONTACT_EMAIL`. Legal pages show "being finalised" until set. |
| 5 | Form backend | **Missing** | `FORM_ENDPOINT` (e.g. a free Formspree form URL). Until set, forms validate but answer "sign-ups aren't open yet, nothing was saved". |
| 6 | Skool group is free to join | **Check** | The link is the live group (`build-pixel-art-games-with-ai-7131`, 42 members on 14 Nov). Its settings show a premium tier; the site promises a free community. |
| 7 | Brand name | **Decide** | Brief says "AI Game Makers Academy"; the Skool group and logo say "AI Game Makers Club". One switch: `BRAND_NAME`. |
| 8 | Founder videos | Optional | `FOUNDER_VIDEO_ID`, `COMMUNITY_VIDEO_ID`, `MENTORSHIP_VIDEO_ID`, `INTEREST_VIDEO_ID` (YouTube IDs). Until set: an honest "video coming soon" frame. |
| 9 | Free course lessons match Skool | **Check** | The 4 levels on `/free-course` are the brief's proposed structure; align names with the real Classroom. |
| 10 | Game screenshots | Works | Loaded from the games' own public pages (itch.io, GitHub Pages). Better: save them into `public/games/` so the site doesn't depend on those hosts. |
| 11 | Analytics | Optional | `ANALYTICS_PROVIDER=plausible` + `PLAUSIBLE_DOMAIN`. Loads only after consent; a consent banner appears automatically. |
| 12 | Search Console | Optional | `GOOGLE_SITE_VERIFICATION`. Then submit `/sitemap.xml`. |
| 13 | `SITE_URL` | Set | https://aigamemakersclub.com (repo variable `SITE_URL`; custom domain set in Settings > Pages, DNS at Namecheap). |

## Analytics events

Sent only with consent and a configured provider: `header_join_free`, `home_*` / `course_*` CTA clicks, `community_join_click`
(free Skool link), `mentorship_purchase_click` (a click, never counted as a sale), `game_link_click`, `video_play`,
`interest_signup` and `workshop_interest` (only after the server confirms the save).

## Asset inventory

| Asset | Source | Real or illustration |
|---|---|---|
| `public/founder/isabella-*.webp` | Isabella's photo with the background removed by ChatGPT (14 Nov). ChatGPT redraws the whole image, so the face is close but not pixel-identical: needs her approval | Real photo, AI-edited |
| `public/art/logo-icon.png` | AI Game Makers Club logo icon | Real brand asset |
| `public/art/ninja.png`, `cat.png` | Redrawn by hand in code from the founder's reference thumbnail mascots | Brand mascots |
| `public/art/ghost.png`, coin, flag, spark, 22 icons | Drawn in code for this site | Original |
| `public/art/pines-*`, `bricks*`, `moon`, `cloud-*`, `stars` | Drawn in code; tileable | Original scenery |
| `public/art/scene-*.png` | Four genre illustrations drawn in code; labelled on the site as illustrations | Illustration |
| `public/og.png` | Share card composed from the above (`tools/make_og.py`) | Composite |
| Game screenshots | Hotlinked from itch.io / GitHub Pages | Real |

The mock-ups in the brief package contain invented testimonials, member counts and "student transformations".
None of that is on the site.

## Design rules (v2, 14 Nov 2026)

From a study of real landing pages (Maven, Linear, Brilliant, Playdate, Celeste, Stardew, master.dev) and NN/g and Unbounce research:
one goal per page; outcome headline under 10 words; the CTA, the word free and a risk line ("No card needed · Leave anytime") in
the first screen; coral is the only action colour; headlines in Bricolage Grotesque, pixel type (Silkscreen) only for small labels;
ONE pixel illustration per page, the hero game window, shown at whole-number scale; Isabella's photo in a rounded frame, never a
raw cutout; proof by artifacts (her real games), never invented testimonials; video sections appear only when a real video exists.

## Deploying (GitHub Pages)

The site is a static export (`output: "export"`). `.github/workflows/pages.yml` builds and deploys it on every push to `main`.
In the repo: Settings > Pages > Source = GitHub Actions. Settings for the build (Skool links, contact email, FORM_ENDPOINT…) go in
Settings > Secrets and variables > Actions > Variables, with the same names as `.env.example`. The workflow sets the base path
(`/<repo>`) and the site URL automatically; set `BASE_PATH` to empty and `SITE_URL` when a custom domain is added.

Test the Pages build locally:

```bash
set NEXT_PUBLIC_BASE_PATH=/ai-game-makers&& npx next build
```

Forms on a static host: set `FORM_ENDPOINT` to a Formspree (or similar) form URL; the browser posts to it directly.