import { asset } from "@/lib/asset";
import Image from "next/image";
import type { ReactNode } from "react";
import { PixelIcon, Sprite, type SpriteName } from "./Sprite";
import styles from "./blocks.module.css";

/** A full-width section in one of the world's tones. */
export function Band({
  tone,
  children,
  id,
  pines = tone !== "cream",
  stars = tone === "dusk" || tone === "night",
  className,
  labelledBy,
}: {
  tone: "sunset" | "dusk" | "night" | "cream";
  children: ReactNode;
  id?: string;
  pines?: boolean;
  stars?: boolean;
  className?: string;
  labelledBy?: string;
}) {
  const pineImg = tone === "sunset" ? "pines-far" : tone === "dusk" ? "pines-near" : "pines-mid";
  const pineW = tone === "sunset" ? 160 : tone === "dusk" ? 128 : 144;
  const pineH = tone === "sunset" ? 44 : tone === "dusk" ? 40 : 52;
  return (
    <section id={id} className={["band", `band--${tone}`, className ?? ""].join(" ")} aria-labelledby={labelledBy}>
      {stars && <div className="band__stars" aria-hidden="true" />}
      {pines && (
        <div
          className={["band__pines", styles.pines].join(" ")}
          aria-hidden="true"
          style={{
            backgroundImage: `url(${asset(`/art/${pineImg}.png`)})`,
            height: `calc(${pineH} * var(--px))`,
            backgroundSize: `calc(${pineW} * var(--px)) calc(${pineH} * var(--px))`,
            opacity: tone === "sunset" ? 0.6 : 0.9,
          }}
        />
      )}
      <div className="wrap">{children}</div>
    </section>
  );
}

export function SectionHead({ title, intro, id, eyebrow }: { title: ReactNode; intro?: ReactNode; id?: string; eyebrow?: string }) {
  return (
    <div className="section-head section-head--center">
      {eyebrow && (
        <span className="eyebrow">{eyebrow}</span>
      )}
      <h2 id={id} className="display display--lg">
        {title}
      </h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

export function FeatureCard({ icon, title, children, badge }: { icon?: string; title: ReactNode; children: ReactNode; badge?: ReactNode }) {
  return (
    <article className={["card", styles.feature].join(" ")}>
      {icon && (
        <span className={styles.iconTile} aria-hidden="true">
          <PixelIcon name={icon} size="sm" />
        </span>
      )}
      {badge}
      <h3 className="title-ink">{title}</h3>
      <div className={styles.featureBody}>{children}</div>
    </article>
  );
}

export function StepCard({ n, title, children, icon }: { n: string; title: string; children: ReactNode; icon?: string }) {
  return (
    <li className={["card", styles.step].join(" ")}>
      <div className={styles.stepTop}>
        <span className={styles.stepNum} aria-hidden="true">
          {n}
        </span>
        {icon && <PixelIcon name={icon} size="md" />}
      </div>
      <h3 className="title-ink">
        <span className="sr-only">Step {n}: </span>
        {title}
      </h3>
      <p>{children}</p>
    </li>
  );
}

/** v4: example cards show real game frames, never drawn illustrations. */
const SCENE_TO_GAME: Record<string, string> = {
  "scene-platformer": "/games/last-ember.webp",
  "scene-puzzle": "/games/illusionist.webp",
  "scene-horror": "/games/happy-day.webp",
  "scene-cozy": "/games/bomb-bomb-hell.webp",
  "scene-rhythm": "/games/hellpop-mayhem.webp",
  "scene-mobile": "/games/midnight-cat.webp",
};

export function SceneCard({
  scene,
  level,
  title,
  icon,
  children,
  label,
}: {
  scene: string;
  level?: string;
  title: string;
  icon?: string;
  children: ReactNode;
  label: string;
}) {
  return (
    <article className={["card", styles.sceneCard].join(" ")}>
      <div className={styles.sceneImg}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(SCENE_TO_GAME[scene] ?? scene)} alt={label} loading="lazy" decoding="async" />
        {level && <span className={["badge", styles.level].join(" ")}>{level}</span>}
      </div>
      <div className={styles.sceneBody}>
        <h3 className="title-ink">
          {icon && <PixelIcon name={icon} size="sm" />}
          {title}
        </h3>
        <p>{children}</p>
      </div>
    </article>
  );
}

export function Faq({ items, id = "faq", title = "Questions, answered" }: { items: { q: string; a: ReactNode }[]; id?: string; title?: string }) {
  return (
    <div className={styles.faq}>
      <h2 id={id} className="display display--md center" style={{ marginBottom: 28 }}>
        {title}
      </h2>
      <div className={styles.faqList}>
        {items.map((it) => (
          <details key={it.q} className={styles.faqItem}>
            <summary>
              <span>{it.q}</span>
              <span className={styles.chev} aria-hidden="true" />
            </summary>
            <div className={styles.faqA}>{it.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

/** Small mascot standing on a strip of bricks, used to punctuate sections. */
export function Ledge(_props: { sprite: SpriteName; side?: "left" | "right"; flip?: boolean }) {
  // v2: mascots are no longer scattered on ledges (one accent per page, in the hero)
  return null;
}

export function LedgeV1({ sprite, side = "left", flip }: { sprite: SpriteName; side?: "left" | "right"; flip?: boolean }) {
  return (
    <div className={[styles.ledge, side === "right" ? styles.ledgeRight : ""].join(" ")} aria-hidden="true">
      <Sprite name={sprite} flip={flip} />
      <span className={styles.ledgeBricks} />
    </div>
  );
}

export function PriceTag({ big, children }: { big?: boolean; children: ReactNode }) {
  return <span className={[styles.price, big ? styles.priceBig : ""].join(" ")}>{children}</span>;
}
