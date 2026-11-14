"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { Sprite } from "./Sprite";
import styles from "./ScrollFx.module.css";

/**
 * The scroll experience, in one place:
 *  - reveal: sections, cards and figures ease in as they enter the viewport
 *  - parallax: anything with data-parallax="0.2" drifts at its own speed
 *  - count-up: [data-count="73"] counts from 0 when it appears
 *  - a level progress bar across the top, and Bit flying alongside on wide screens
 * Everything is progressive: without JS, or with reduced motion, the page is simply static.
 */

const REVEAL = [
  "main .section-head",
  "main .card",
  "main [data-reveal]",
  "main .band figure",
  "main .band blockquote",
].join(",");

export function ScrollFx() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    let io: IntersectionObserver | null = null;

    if (!reduce) {
      root.classList.add("fx");
      const vh = window.innerHeight;
      const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL)).filter((el) => {
        if (el.closest("[data-no-reveal]")) return false;
        // leave anything already on screen alone, so nothing flickers on load
        return el.getBoundingClientRect().top > vh * 0.92;
      });
      const order = new Map<Element, number>();
      for (const el of targets) {
        const parent = el.parentElement as Element;
        const i = order.get(parent) ?? 0;
        order.set(parent, i + 1);
        el.style.setProperty("--d", `${Math.min(i, 6) * 80}ms`);
        el.setAttribute("data-fx", "");
      }
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const el = e.target as HTMLElement;
            el.classList.add("in");
            io?.unobserve(el);
            el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
            if (el.matches("[data-count]")) countUp(el);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      targets.forEach((t) => io?.observe(t));
      // charts and counters that sit outside a revealed block
      document.querySelectorAll<HTMLElement>("main [data-chart]").forEach((c) => io?.observe(c));
    } else {
      document.querySelectorAll<HTMLElement>("[data-chart]").forEach((c) => c.classList.add("in"));
    }

    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const onFrame = () => {
      raf.current = 0;
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, y / max));
      setPastHero(y > window.innerHeight * 0.7 && y < max - 260);
      if (reduce) return;
      root.style.setProperty("--scroll", String(Math.round(y)));
      const vh = window.innerHeight;
      for (const el of parallax) {
        const r = el.parentElement!.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const speed = Number(el.dataset.parallax) || 0.15;
        const offset = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      }
    };
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(onFrame);
    };
    onFrame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io?.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [pathname]);

  return (
    <>
      <div className={styles.bar} aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className={[styles.companion, pastHero ? styles.show : ""].join(" ")} aria-hidden="true">
        <span className={styles.track} />
        <span className={styles.bit} style={{ top: `${8 + progress * 78}%` }}>
          <Sprite name="bit" fps={5} />
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/art/flag.png")} alt="" className={styles.goal} />
      </div>
    </>
  );
}

function countUp(el: HTMLElement) {
  if (el.dataset.counted) return;
  el.dataset.counted = "1";
  const target = Number(el.dataset.count);
  const decimals = (el.dataset.count?.split(".")[1] ?? "").length;
  const prefix = el.dataset.prefix ?? "";
  const suffix = el.dataset.suffix ?? "";
  const start = performance.now();
  const dur = 1400;
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Small pixel props that drift at their own speed behind a section's content. */
export function Floaters({ set = "a" }: { set?: "a" | "b" | "c" }) {
  const items =
    set === "a"
      ? [
          { s: "coin", cls: styles.f1, p: 0.22 },
          { s: "spark", cls: styles.f2, p: -0.14 },
          { s: "coin", cls: styles.f3, p: 0.3 },
        ]
      : set === "b"
        ? [
            { s: "spark", cls: styles.f4, p: 0.2 },
            { s: "coin", cls: styles.f5, p: -0.18 },
          ]
        : [
            { s: "coin", cls: styles.f6, p: 0.26 },
            { s: "spark", cls: styles.f1, p: -0.2 },
            { s: "spark", cls: styles.f5, p: 0.16 },
          ];
  return (
    <div className={styles.floaters} aria-hidden="true">
      {items.map((it, i) => (
        <span key={i} className={[styles.floater, it.cls].join(" ")} data-parallax={it.p}>
          <Sprite name={it.s as "coin" | "spark"} />
        </span>
      ))}
    </div>
  );
}

/** Closing pixel landscape: stars, three pine layers at different speeds, and the two characters. */
export function EndScene() {
  return (
    <div className={styles.end} aria-hidden="true">
      <div className={[styles.layer, styles.far].join(" ")} data-parallax="-0.10" />
      <div className={[styles.layer, styles.mid].join(" ")} data-parallax="-0.05" />
      <div className={[styles.layer, styles.near].join(" ")} />
      <div className={styles.ground} />
      <span className={styles.endBit}>
        <Sprite name="bit" fps={5} />
      </span>
      <span className={styles.endClawd}>
        <Sprite name="clawd" />
      </span>
      <span className={styles.endFlag}>
        <Sprite name="flag" />
      </span>
    </div>
  );
}
