import type { CSSProperties, ReactNode } from "react";
import styles from "./Charts.module.css";

/**
 * Small animated charts. They draw themselves when scrolled into view: ScrollFx adds
 * the class "in" to every [data-chart]; without JS they simply render in their final state.
 */

export function Source({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className={styles.source} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function ChartCard({ title, lede, children, source, wide }: { title: string; lede?: ReactNode; children: ReactNode; source?: ReactNode; wide?: boolean }) {
  return (
    <figure className={[styles.card, wide ? styles.wide : ""].join(" ")} data-chart="">
      <figcaption>
        <h3>{title}</h3>
        {lede && <p>{lede}</p>}
      </figcaption>
      <div className={styles.body}>{children}</div>
      {source && <div className={styles.sources}>{source}</div>}
    </figure>
  );
}

export type Bar = { label: string; value: number; display: string; tone?: "hot" | "cool" | "mute" };

/** Horizontal bars that grow from zero. `max` sets the scale (defaults to the largest value). */
export function Bars({ items, max }: { items: Bar[]; max?: number }) {
  const top = max ?? Math.max(...items.map((i) => i.value));
  return (
    <ul className={styles.bars}>
      {items.map((b, i) => (
        <li key={b.label}>
          <span className={styles.barLabel}>{b.label}</span>
          <span className={styles.barTrack}>
            <span
              className={[styles.barFill, styles[b.tone ?? "hot"]].join(" ")}
              style={{ "--w": `${(b.value / top) * 100}%`, "--d": `${i * 140}ms` } as CSSProperties}
            />
          </span>
          <b className={styles.barValue}>{b.display}</b>
        </li>
      ))}
    </ul>
  );
}

export type Series = { name: string; tone: "hot" | "cool"; points: { x: string; y: number }[] };

/** A line chart that draws itself. Values are percentages on a 0..yMax scale. */
export function Trend({ series, yMax = 60, unit = "%" }: { series: Series[]; yMax?: number; unit?: string }) {
  const W = 420;
  const H = 230;
  const padL = 14;
  const padR = 44;
  const padT = 22;
  const padB = 34;
  const xs = series[0].points.map((p) => p.x);
  const X = (i: number) => padL + (i * (W - padL - padR)) / Math.max(1, xs.length - 1);
  const Y = (v: number) => padT + (1 - v / yMax) * (H - padT - padB);
  return (
    <div className={styles.trend}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={series.map((s) => `${s.name}: ${s.points.map((p) => `${p.x} ${p.y}${unit}`).join(", ")}`).join(". ")}>
        {[0, 0.5, 1].map((g) => (
          <line key={g} x1={padL} x2={W - padR} y1={Y(yMax * g)} y2={Y(yMax * g)} className={styles.grid} />
        ))}
        {xs.map((x, i) => (
          <text key={x} x={X(i)} y={H - 10} className={styles.axis} textAnchor="middle">
            {x}
          </text>
        ))}
        {series.map((s) => (
          <g key={s.name} className={styles[s.tone + "Line"]}>
            <polyline pathLength={1} points={s.points.map((p, i) => `${X(i)},${Y(p.y)}`).join(" ")} className={styles.line} />
            {s.points.map((p, i) => (
              <g key={p.x} className={styles.dot} style={{ "--d": `${300 + i * 320}ms` } as CSSProperties}>
                <circle cx={X(i)} cy={Y(p.y)} r={5} />
                <text x={X(i) + (i === s.points.length - 1 ? 9 : 0)} y={Y(p.y) - (i === s.points.length - 1 ? -4 : 11)} textAnchor={i === s.points.length - 1 ? "start" : "middle"}>
                  {p.y}
                  {unit}
                </text>
              </g>
            ))}
          </g>
        ))}
      </svg>
      <ul className={styles.legend}>
        {series.map((s) => (
          <li key={s.name} className={styles[s.tone + "Key"]}>
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One big number that counts up, with a line of meaning under it. */
export function BigStat({ value, prefix = "", suffix = "", children }: { value: number; prefix?: string; suffix?: string; children: ReactNode }) {
  return (
    <div className={styles.big}>
      <b data-count={value} data-prefix={prefix} data-suffix={suffix}>
        {prefix}
        {value}
        {suffix}
      </b>
      <span>{children}</span>
    </div>
  );
}

/** Two quantities side by side as blocks of squares (each square = `per`). */
export function Blocks({ a, b, per, unit }: { a: { label: string; value: number }; b: { label: string; value: number }; per: number; unit: string }) {
  const cells = (n: number) => Array.from({ length: Math.round(n / per) });
  return (
    <div className={styles.blocks}>
      {[a, b].map((s, k) => (
        <div key={s.label} className={k === 0 ? styles.blocksHot : styles.blocksMute}>
          <div className={styles.cells}>
            {cells(s.value).map((_, i) => (
              <i key={i} style={{ "--d": `${i * 45 + k * 200}ms` } as CSSProperties} />
            ))}
          </div>
          <b>
            {s.value}
            {unit}
          </b>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Timeline({ items }: { items: { year: string; title: string; text: string; href: string; source: string }[] }) {
  return (
    <ol className={styles.timeline}>
      {items.map((it) => (
        <li key={it.year + it.title} data-reveal="">
          <span className={styles.year}>{it.year}</span>
          <h4>{it.title}</h4>
          <p>{it.text}</p>
          <Source href={it.href}>{it.source}</Source>
        </li>
      ))}
    </ol>
  );
}
