import type { CSSProperties, ReactNode } from "react";
import { asset } from "@/lib/asset";
import { Sprite, type SpriteName } from "./Sprite";
import styles from "./Scene.module.css";

/**
 * Page hero (design v2). Copy on the left; on the right ONE pixel-art game
 * window shown at a whole-number scale, with Isabella's framed portrait laid
 * over its corner. Compact heroes are text only. The pixel world is the only
 * large illustration on a page (landing page study, rule 7).
 */

export type SceneVariant =
  | "home"
  | "course"
  | "community"
  | "mentorship"
  | "games"
  | "about"
  | "workshops"
  | "interest"
  | "small";

type Actor = { sprite: SpriteName; x: number; y: number; flip?: boolean; float?: boolean; fps?: number };

/** Actors placed in art pixels on the 160x120 world (tools/make_hero.py). */
const ACTORS: Actor[] = [
  { sprite: "bit", x: 57, y: 28, float: true, fps: 5 },
  { sprite: "clawd", x: 94, y: 82 },
  { sprite: "coin", x: 18, y: 28, float: true },
  { sprite: "coin", x: 34, y: 28, float: true },
  { sprite: "coin", x: 112, y: 40, float: true },
  { sprite: "flag", x: 140, y: 38 },
];

export function HeroWorld({ photo, photoAlt, caption }: { photo?: boolean; photoAlt?: string; caption?: ReactNode }) {
  return (
    <div className={[styles.art, photo ? styles.withPhoto : ""].join(" ")}>
      <div className={styles.window}>
        <div className={styles.titlebar} aria-hidden="true">
          <span />
          <span />
          <span />
          <b>level_01.png</b>
        </div>
        <div className={styles.world} role="img" aria-label="Pixel art game level at sunset with a hovering robot, the orange Claude Code mascot, coins and a goal flag">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/art/hero-world.png")} alt="" width={160} height={120} className={styles.worldImg} />
          {ACTORS.map((a, i) => (
            <span
              key={i}
              className={[styles.actor, a.float ? styles.float : ""].join(" ")}
              style={{ "--x": a.x, "--y": a.y } as CSSProperties}
              aria-hidden="true"
            >
              <Sprite name={a.sprite} flip={a.flip} fps={a.fps} />
            </span>
          ))}
        </div>
      </div>
      {photo && (
        <figure className={styles.portrait}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/founder/isabella-480.webp")}
            srcSet={`${asset("/founder/isabella-480.webp")} 480w, ${asset("/founder/isabella-800.webp")} 800w`}
            sizes="(max-width: 860px) 46vw, 240px"
            alt={photoAlt ?? "Isabella, founder of AI Game Makers Club"}
            width={480}
            height={600}
          />
          <figcaption>{caption ?? <><b>Isabella</b> Software engineer &amp; indie game maker</>}</figcaption>
        </figure>
      )}
    </div>
  );
}

export function Scene({
  variant,
  children,
  photo,
  photoAlt,
  compact,
  id,
}: {
  variant: SceneVariant;
  children: ReactNode;
  photo?: boolean;
  photoAlt?: string;
  compact?: boolean;
  id?: string;
}) {
  const showArt = !compact && variant !== "small";
  return (
    <section className={[styles.hero, showArt ? styles.split : styles.centered].join(" ")} id={id}>
      <div className={["wrap", styles.inner].join(" ")}>
        <div className={styles.copy}>{children}</div>
        {showArt && <HeroWorld photo={photo} photoAlt={photoAlt} />}
      </div>
    </section>
  );
}
