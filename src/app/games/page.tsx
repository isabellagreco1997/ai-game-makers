import { asset } from "@/lib/asset";
import { Band, Ledge } from "@/components/blocks";
import { Button } from "@/components/Button";
import { Scene } from "@/components/Scene";
import { GAMES, type GameStatus } from "@/content/games";
import { pageMeta } from "@/lib/meta";
import styles from "../pages.module.css";

export const metadata = pageMeta(
  "Games and Projects | AI Game Makers Club",
  "See released games, playable demos and works in progress by the founder of AI Game Makers Club.",
  "/games",
);

const BADGE: Record<GameStatus, string> = {
  Released: "badge badge--green",
  "Playable Demo": "badge badge--green",
  "In Development": "badge",
};

export default function Games() {
  return (
    <>
      <Scene variant="games" compact>
        <p>
          <span className="eyebrow">Our games</span>
        </p>
        <h1 className={["display display--lg", styles.h1].join(" ")}>
          Games aren&apos;t just what we teach. <em>They&apos;re what we make.</em>
        </h1>
        <p className={["lede on-sky", styles.heroCopy].join(" ")} style={{ marginLeft: "auto", marginRight: "auto" }}>
          Play the released games and demos, and see what is still in development.
        </p>
      </Scene>

      <Band tone="dusk" labelledBy="games-list">
        <h2 id="games-list" className="sr-only">
          Games we made
        </h2>
        <div className={styles.games}>
          {GAMES.map((g) => (
            <article key={g.title} className={["card", styles.game].join(" ")}>
              <div className={[styles.gameShot, g.shot.portrait ? styles.gameShotPortrait : ""].join(" ")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(g.shot.src)} alt={g.shot.alt} loading="lazy" decoding="async" />
              </div>
              <div className={styles.gameBody}>
                <div className={styles.gameMeta}>
                  <span className={BADGE[g.status]}>{g.status}</span>
                  <span className="badge badge--cream">{g.genre}</span>
                  <span className="badge badge--cream">{g.platform}</span>
                </div>
                <h2 className="title-ink">{g.title}</h2>
                <p>
                  <strong>{g.summary}</strong>
                </p>
                <p>{g.detail}</p>
                {g.links.length > 0 && (
                <div className={styles.gameLinks}>
                  {g.links.map((l) => (
                    <Button key={l.href} href={l.href} variant="dark" track="game_link_click">
                      {l.label}
                    </Button>
                  ))}
                </div>
                )}
              </div>
            </article>
          ))}
        </div>
        <p className={styles.smallNote} style={{ color: "var(--cream)" }}>
          Games marked In Development are being built now; they get a link as soon as they have a public page.
        </p>
      </Band>

      <Band tone="sunset" labelledBy="philosophy">
        <div className={["card", styles.cta].join(" ")}>
          <h2 id="philosophy" className="title-ink">
            Good games need more than a good prompt.
          </h2>
          <p>
            AI can help with production. You still have to decide how the game plays, what it looks like and what needs improving.
          </p>
        </div>
      </Band>

      <Band tone="night" labelledBy="final">
        <div className="center stack" style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 id="final" className="display display--lg">
            Want to create <em>your own?</em>
          </h2>
          <p className="lede">Explore the free lessons and start with one playable idea.</p>
          <div className="cta-row cta-row--center">
            <Button href="/community" size="lg" track="games_final_join">
              Learn for Free
            </Button>
          </div>
        </div>
        <Ledge sprite="ghost" side="left" />
      </Band>
    </>
  );
}
