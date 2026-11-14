import Link from "next/link";
import type { ReactNode } from "react";
import { Bars, BigStat, Blocks, ChartCard, Source, Trend } from "./Charts";
import { DO_IT_RIGHT, FAIR_OBJECTIONS, FURTHER_READING, GDC_TREND, JOB_BARS, SRC, STEAM_BARS } from "@/content/aihate";
import styles from "./AiHate.module.css";

/**
 * The "AI hate" story, shared by the home section and /ai-and-games.
 * Order matters: the uncomfortable numbers come first, on purpose.
 */

export function ChartGrid({ children }: { children: ReactNode }) {
  return <div className={styles.charts}>{children}</div>;
}

export function BacklashChart() {
  return (
    <ChartCard
      title="The backlash is growing"
      lede="Each year, more game developers tell GDC that generative AI is harming the industry."
      source={<Source href={SRC.gdc2026.href}>{SRC.gdc2026.label}</Source>}
    >
      <Trend series={GDC_TREND} yMax={60} />
    </ChartCard>
  );
}

export function PlayersChart() {
  return (
    <ChartCard
      title="Players feel it too"
      lede="This helps explain the comments. It reflects views on generative AI in games generally, rather than on your work."
      source={<Source href={SRC.quantic.href}>{SRC.quantic.label}</Source>}
    >
      <BigStat value={85} suffix="%">
        of 1,799 gamers surveyed felt negative about generative AI in video games.
      </BigStat>
    </ChartCard>
  );
}

export function SteamChart() {
  return (
    <ChartCard
      title="More games use it every year"
      lede="By July 2025, that was about 7% of all games on Steam, and roughly one in five released that year."
      source={<Source href={SRC.totallyHuman.href}>{SRC.totallyHuman.label}</Source>}
    >
      <Bars items={STEAM_BARS} />
    </ChartCard>
  );
}

export function JobsChart() {
  return (
    <ChartCard
      title="Jobs are changing more than disappearing"
      lede="The forecast to 2030 covers technology, the economy, demographics and the green transition together, not AI alone. Each square represents 10 million jobs."
      source={<Source href={SRC.wef.href}>{SRC.wef.label}</Source>}
    >
      <Blocks a={{ label: "new jobs expected by 2030", value: 170 }} b={{ label: "jobs expected to be displaced", value: 92 }} per={10} unit="m" />
    </ChartCard>
  );
}

export function SkillsChart() {
  return (
    <ChartCard
      title="The work is shifting towards AI skills"
      lede="Jobs asking for AI skills have grown almost eight times faster than jobs overall."
      source={<Source href={SRC.pwc.href}>{SRC.pwc.label}</Source>}
    >
      <Bars items={JOB_BARS} />
    </ChartCard>
  );
}

export function HiringChart() {
  return (
    <ChartCard
      title="Employers are already looking for it"
      lede="Based on a survey of 31,000 people in 31 countries, published in 2024."
      source={<Source href={SRC.wti.href}>{SRC.wti.label}</Source>}
    >
      <BigStat value={66} suffix="%">
        of business leaders said they would not hire someone without AI skills.
      </BigStat>
    </ChartCard>
  );
}

export function DevsChart() {
  return (
    <ChartCard title="Most developers are already using it" lede="Up from 76% the year before." source={<Source href={SRC.so2025.href}>{SRC.so2025.label}</Source>}>
      <BigStat value={84} suffix="%">
        of developers use AI tools or plan to.
      </BigStat>
    </ChartCard>
  );
}

/** Three short answers for the home page: the comments, the jobs, the art. */
export function Takes() {
  return (
    <ul className={styles.takes}>
      <li data-reveal="">
        <span className={styles.tag}>The comments</span>
        <b>You cannot control the comments. You can shape the game.</b>
        <span className={styles.takeText}>
          HAPPY DAY says on its itch.io page that AI assisted the code, graphics and sound. It is rated 5.0, and three YouTube creators recorded full playthroughs.
        </span>
        <Source href={SRC.happyDay.href}>{SRC.happyDay.label}</Source>
      </li>
      <li data-reveal="">
        <span className={styles.tag}>The jobs</span>
        <b>AI won&apos;t take your place. Someone skilled with it might.</b>
        <span className={styles.takeText}>
          The risk is falling behind if you never learn to direct the tool, check its work and finish something with it.
        </span>
        <Source href={SRC.hbr.href}>{SRC.hbr.label}</Source>
      </li>
      <li data-reveal="">
        <span className={styles.tag}>The art</span>
        <b>You can use AI for your game&apos;s art, and do it well.</b>
        <span className={styles.takeText}>
          Steam and itch.io accept it when you disclose it, and US copyright protects the creative choices you add. Direction and editing take craft.
        </span>
        <Source href={SRC.copyright.href}>{SRC.copyright.label}</Source>
      </li>
    </ul>
  );
}

export function ProofNote() {
  return (
    <div className={styles.proof} data-reveal="">
      <span className={styles.tag}>Our own example</span>
      <p>
        <b>HAPPY DAY says clearly on its store page that AI assisted the code, graphics and sound.</b> Players rated it 5.0 on itch.io, and three YouTube creators recorded full playthroughs. Being open about the tools did not stop people playing it, finishing it and recommending it.
      </p>
      <p className={styles.proofLinks}>
        <Source href={SRC.happyDay.href}>{SRC.happyDay.label}</Source>
        <Link href="/games">See all our games</Link>
      </p>
    </div>
  );
}

export function Caveat({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.caveat} data-reveal="">
      <span className={styles.tag}>{title}</span>
      {children}
    </div>
  );
}

export function DoItRight() {
  return (
    <ol className={styles.rules}>
      {DO_IT_RIGHT.map(([title, text], i) => (
        <li key={title} data-reveal="">
          <span className={styles.num} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <b>{title}</b>
            <span className={styles.ruleText}>{text}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Objections() {
  return (
    <ul className={styles.objections}>
      {FAIR_OBJECTIONS.map((o) => (
        <li key={o.text.slice(0, 24)} data-reveal="">
          <span>{o.text}</span>
          {"href" in o && o.href && <Source href={o.href}>{o.source}</Source>}
        </li>
      ))}
    </ul>
  );
}

export function Reading() {
  return (
    <ul className={styles.reading}>
      {FURTHER_READING.map((r) => (
        <li key={r.href}>
          <a href={r.href} target="_blank" rel="noopener noreferrer">
            <small>{r.by}</small>
            <b>{r.title}</b>
            <span className={styles.readNote}>{r.note}</span>
            <i aria-hidden="true">Read the source</i>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Subhead({ id, children, intro }: { id?: string; children: ReactNode; intro?: ReactNode }) {
  return (
    <div className={styles.subhead}>
      <h3 id={id} className="title-ink">
        {children}
      </h3>
      {intro && <p>{intro}</p>}
    </div>
  );
}

export function Fine({ children }: { children: ReactNode }) {
  return <p className={styles.fine}>{children}</p>;
}
