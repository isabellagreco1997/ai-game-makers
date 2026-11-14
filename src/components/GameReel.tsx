import { GAMES } from "@/content/games";
import { asset } from "@/lib/asset";
import styles from "./GameReel.module.css";

/**
 * A slow, endless strip of Isabella's real games (proof by artifacts).
 * The list is rendered twice so the loop is seamless; the copy is hidden
 * from assistive tech. Pauses on hover and stops for reduced motion.
 */
export function GameReel({ title = "Games we made and you can explore" }: { title?: string }) {
  const card = (g: (typeof GAMES)[number], dup: boolean) => (
    <li key={(dup ? "d-" : "") + g.title} className={[styles.card, g.shot.portrait ? styles.portrait : ""].join(" ")} aria-hidden={dup || undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(g.shot.src)} alt={dup ? "" : g.shot.alt} loading="lazy" decoding="async" />
      <span className={styles.meta}>
        <b>{g.title}</b>
        <span className={styles.status} data-status={g.status}>
          {g.status}
        </span>
      </span>
    </li>
  );
  return (
    <section className={styles.reel} aria-labelledby="reel-title">
      <p id="reel-title" className={styles.title}>
        {title}
      </p>
      <div className={styles.viewport}>
        <ul className={styles.track}>
          {GAMES.map((g) => card(g, false))}
          {GAMES.map((g) => card(g, true))}
        </ul>
      </div>
    </section>
  );
}
