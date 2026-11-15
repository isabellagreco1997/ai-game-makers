"use client";

import { useMemo, useState } from "react";
import listings from "@/content/jobs.json";
import world from "@/content/world-map.json";
import styles from "./jobs.module.css";

const regions = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"];
const formatDate = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default function JobBoard() {
  const [region, setRegion] = useState("All regions");
  const [country, setCountry] = useState("All countries");
  const [category, setCategory] = useState("All work");
  const [search, setSearch] = useState("");
  const countries = useMemo(() => [...new Set(listings.jobs.flatMap(job => job.countries))].sort(), []);
  const categories = useMemo(() => [...new Set(listings.jobs.map(job => job.category))].sort(), []);
  const jobs = listings.jobs.filter(job =>
    (region === "All regions" || job.regions.includes(region)) &&
    (country === "All countries" || job.countries.includes(country)) &&
    (category === "All work" || job.category === category) &&
    `${job.title} ${job.company} ${job.skills.join(" ")} ${job.summary}`.toLowerCase().includes(search.toLowerCase().trim())
  );
  function chooseRegion(value: string) { setRegion(value); setCountry("All countries"); }
  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.wrap}>
        <p className={styles.eyebrow}>THE AI GAME MAKERS JOB BOARD <span>✦</span> YOUR NEXT LEVEL</p>
        <h1>Find your place in <em>games + AI.</em></h1>
        <p className={styles.lead}>Real opportunities. Skills worth building. A world of ways to make games and work with AI.</p>
        <div className={styles.heroMeta}><span><i /> CURATED OPPORTUNITIES</span><span>LAST CHECKED {formatDate(listings.lastUpdated).toUpperCase()}</span></div>
      </div>
    </section>
    <section className={styles.wrap} aria-labelledby="map-heading">
      <div className={styles.mapCard}>
        <div className={styles.mapIntro}><div><p className={styles.eyebrow}>EXPLORE THE MAP</p><h2 id="map-heading">Your next opportunity<br /><em>could be anywhere.</em></h2></div><p>Choose a region to explore. Remote roles may still have country restrictions, so check the listing before applying.</p></div>
        <svg className={styles.map} viewBox="0 0 720 310" role="img" aria-label="World map. Use the region buttons below to filter opportunities.">
          <defs><linearGradient id="mapSunset" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#ffd43b"/><stop offset="1" stopColor="#ff5a57"/></linearGradient></defs>
          {world.map((shape, i) => <path key={`${shape.name}-${i}`} d={shape.d} className={region === "All regions" || shape.region === region ? styles.landActive : styles.land} />)}
        </svg>
        <div className={styles.regions} aria-label="Filter by region">
          {["All regions", ...regions].map(r => <button key={r} type="button" onClick={() => chooseRegion(r)} aria-pressed={region === r} className={region === r ? styles.activeRegion : ""}>{r} <span>{r === "All regions" ? listings.jobs.length : listings.jobs.filter(j => j.regions.includes(r)).length}</span></button>)}
        </div>
        <p className={styles.mapNote}>A role can appear in more than one region. Map data: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Natural Earth</a>.</p>
      </div>
    </section>
    <section className={`${styles.wrap} ${styles.board}`} aria-labelledby="board-heading">
      <div className={styles.boardHeading}><div><p className={styles.eyebrow}>THE OPPORTUNITY BOARD</p><h2 id="board-heading">Find work in <em>gaming.</em></h2></div><p>Explore roles across game development, AI training and evaluation. Requirements and availability vary.</p></div>
      <div className={styles.filters}>
        <label>Search skills or title<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Try Godot or Python" /></label>
        <label>Country<select value={country} onChange={e => { setCountry(e.target.value); setRegion("All regions"); }}><option>All countries</option>{countries.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>Type of work<select value={category} onChange={e => setCategory(e.target.value)}><option>All work</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
      </div>
      <div className={styles.results}><strong aria-live="polite">{jobs.length} {jobs.length === 1 ? "opportunity" : "opportunities"}</strong><button onClick={() => {setSearch(""); setCountry("All countries"); setRegion("All regions"); setCategory("All work");}}>Clear filters ↗</button></div>
      <div className={styles.list}>
        {jobs.map(job => <article key={job.id} className={styles.job}>
          <div className={styles.jobTop}><span className={styles.category}>{job.category}</span><span className={styles.checked}>CHECKED {formatDate(job.checkedAt).toUpperCase()}</span></div>
          <div className={styles.jobMain}><div><h3>{job.title}</h3><p className={styles.company}>{job.company} · recruiting platform</p></div><div className={styles.pay}>{job.pay}<small>{job.payNote}</small></div></div>
          <p className={styles.description}>{job.summary}</p>
          <div className={styles.tags}><span>⌁ {job.location}</span><span>◷ {job.employment}</span><span>Posted {formatDate(job.posted)}</span></div>
          <p className={styles.requirements}><strong>What they ask for</strong> {job.requirements}</p>
          <div className={styles.skills}>{job.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
          <div className={styles.jobBottom}><span>Check the source for current details and eligibility.</span><a href={job.url} target="_blank" rel="noopener noreferrer">View listing <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></div>
        </article>)}
        {!jobs.length && <div className={styles.empty}><h3>No matches yet.</h3><p>Try another region, country or skill. New opportunities can appear as the board is refreshed.</p></div>}
      </div>
      <p className={styles.disclaimer}>Listings are curated from external sources and can close or change at any time. Pay is the advertised amount, not a promise of earnings. Check eligibility, terms and the application destination on the source page.</p>
    </section>
    <section className={`${styles.wrap} ${styles.cta}`}><div><p className={styles.eyebrow}>BUILD YOUR NEXT LEVEL</p><h2>Make games. Build skills.<br /><em>Open new doors.</em></h2><p>Learn alongside other makers and start building work you can share.</p></div><a href="https://www.skool.com/build-pixel-art-games-with-ai-7131/about" target="_blank" rel="noopener noreferrer">Join the community free ↗</a></section>
  </div>;
}

