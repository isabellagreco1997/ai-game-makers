import { asset } from "@/lib/asset";
import type { CSSProperties } from "react";
import { Icon } from "./Icon";
import styles from "./Sprite.module.css";

export const SPRITES = {
  ninja: { w: 22, h: 21, frames: 2, label: "Hooded runner mascot" },
  bit: { w: 30, h: 40, frames: 2, label: "Bit, a small hover-bot" },
  clawd: { w: 28, h: 22, frames: 2, label: "The Claude Code mascot" },
  runner: { w: 22, h: 18, frames: 2, label: "Hooded runner mascot" },
  blockcat: { w: 17, h: 14, frames: 2, label: "Orange block-cat mascot" },
  cat: { w: 20, h: 15, frames: 2, label: "Orange block-cat mascot" },
  ghost: { w: 14, h: 14, frames: 2, label: "Little ghost mascot" },
  coin: { w: 8, h: 8, frames: 4, label: "Spinning coin" },
  flag: { w: 11, h: 18, frames: 2, label: "Goal flag" },
  spark: { w: 7, h: 7, frames: 1, label: "Sparkle" },
} as const;

export type SpriteName = keyof typeof SPRITES;

/**
 * A pixel sprite drawn from a horizontal frame strip in /public/art.
 * `scale` multiplies the site's art-pixel size (--px), so pixels stay square.
 */
export function Sprite({
  name,
  scale = 1,
  fps,
  flip,
  className,
  style,
  decorative = true,
}: {
  name: SpriteName;
  scale?: number;
  fps?: number;
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
  decorative?: boolean;
}) {
  const s = SPRITES[name];
  const rate = fps ?? (s.frames > 2 ? 8 : 2);
  const vars = {
    "--sw": s.w,
    "--sh": s.h,
    "--frames": s.frames,
    "--scale": scale,
    "--dur": `${s.frames / rate}s`,
    backgroundImage: `url(${asset(`/art/${name}.png`)})`,
    ...style,
  } as CSSProperties;
  return (
    <span
      className={[styles.sprite, s.frames > 1 ? styles.anim : "", flip ? styles.flip : "", className ?? ""].join(" ")}
      style={vars}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : s.label}
      aria-hidden={decorative ? true : undefined}
    />
  );
}

/** v4: the old pixel icons are retired; this keeps the API and renders a clean line icon. */
export function PixelIcon({ name, label, size = "md", className }: { name: string; label?: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const px = size === "sm" ? 20 : size === "md" ? 26 : 30;
  return <Icon name={name} size={px} label={label} className={[styles.lineIcon, className ?? ""].join(" ")} />;
}