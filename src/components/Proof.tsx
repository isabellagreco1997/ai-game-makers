import { CREATOR_VIDEOS, FACTS, FEEDBACK_STORY, MEMBER_QUOTES, QUOTES } from "@/content/proof";
import { Video } from "./Video";
import styles from "./Proof.module.css";

/** Real players, real creators, real comments (src/content/proof.ts). */
export function PlayerProof() {
  return (
    <div className={styles.proof}>
      <div className={styles.videos}>
        {CREATOR_VIDEOS.map((v, i) => (
          <figure key={v.id} className={[styles.video, i === 0 ? styles.videoMain : ""].join(" ")}>
            <Video videoId={v.id} title={v.title} slot={`creator_${v.id}`} thumb={`/proof/yt-${v.id}.webp`} />
            <figcaption>
              <a href={v.channelUrl} target="_blank" rel="noopener noreferrer">
                {v.channel}
              </a>
              <span>
                {v.views ? `${v.views} · ` : ""}
                {v.lang}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ul className={styles.quotes}>
        {QUOTES.map((q) => (
          <li key={q.who + q.text.slice(0, 12)}>
            <blockquote>“{q.text}”</blockquote>
            <p>
              <b>{q.who}</b>
              <a href={q.href} target="_blank" rel="noopener noreferrer">
                {q.where} on {q.game}
              </a>
              {q.translated && <em>translated from Japanese</em>}
            </p>
          </li>
        ))}
      </ul>
      <p className={styles.loop}>
        <b>A real playtest led to a fix.</b> A player reported “{FEEDBACK_STORY.report}” {FEEDBACK_STORY.fixed} Learning from players is part of making a game.
      </p>
    </div>
  );
}

export function FactsGrid() {
  return (
    <ul className={styles.facts}>
      {FACTS.map((f) => (
        <li key={f.text}>
          <b className={styles.big}>{f.big}</b>
          <span>{f.text}</span>
          <a href={f.href} target="_blank" rel="noopener noreferrer">
            {f.source}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Member words from inside the club (shared with their permission). */
export function MemberQuotes() {
  return (
    <ul className={styles.members}>
      {MEMBER_QUOTES.map((q) => (
        <li key={q.text.slice(0, 20)}>
          <blockquote>“{q.text}”</blockquote>
          <p>
            <b>{q.who}</b> <span>{q.context}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
