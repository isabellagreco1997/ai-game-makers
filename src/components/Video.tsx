"use client";
import { asset } from "@/lib/asset";


import { useState } from "react";
import { track } from "./Consent";
import styles from "./Video.module.css";

/**
 * Founder video slot. With a YouTube id it shows a branded thumbnail and only
 * loads the privacy-enhanced player when clicked (no autoplay on page load).
 * Without one it shows an honest "coming soon" frame, never a fake player.
 */
export function Video({ videoId, title, slot, thumb }: { videoId: string; title: string; slot: string; thumb?: string }) {
  const [playing, setPlaying] = useState(false);

  if (!videoId) {
    return (
      <figure className={[styles.frame, styles.pending].join(" ")}>
        <div className={styles.thumb}>
          <div className={styles.thumbBg} aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/founder/isabella-480.webp")} alt="" width={480} height={600} className={styles.face} />
          <span className={styles.soon}>
            <span className="badge">Video coming soon</span>
          </span>
        </div>
        <figcaption className={styles.caption}>{title}: Isabella is recording this one.</figcaption>
      </figure>
    );
  }

  return (
    <figure className={styles.frame}>
      {playing ? (
        <div className={styles.player}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <button
          type="button"
          className={[styles.thumb, styles.playable].join(" ")}
          onClick={() => {
            setPlaying(true);
            track("video_play", { video: slot });
          }}
        >
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset(thumb)} alt="" className={styles.cover} loading="lazy" />
          ) : (
            <>
              <div className={styles.thumbBg} aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/founder/isabella-480.webp")} alt="" width={480} height={600} className={styles.face} />
            </>
          )}
          <span className={styles.playBtn} aria-hidden="true" />
          <span className="sr-only">Play video: {title}</span>
        </button>
      )}
      <figcaption className={styles.caption}>{title}</figcaption>
    </figure>
  );
}
