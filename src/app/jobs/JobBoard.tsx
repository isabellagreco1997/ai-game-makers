"use client";

import { useMemo, useState } from "react";
import listings from "@/content/jobs.json";
import Globe from "./Globe";
import styles from "./jobs.module.css";

type Job = { id:string; title:string; company:string; url:string; category:string; pay:string; payNote:string; location:string; countries:string[]; regions:string[]; posted:string; skills:string[]; summary:string; requirements:string; employment:string; checkedAt:string; sourceLabel?:string; workMode?:string; coordinates?:{city:string;lat:number;lon:number} };
const allJobs: Job[] = listings.jobs;
const priority = (job: Job) => (job.workMode === "Hybrid" ? 2 : 0) + (job.category.startsWith("Game industry -") ? 0 : 1);
const regions = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"];
const formatDate = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default function JobBoard() {
  const [region, setRegion] = useState("All regions");
  const [country, setCountry] = useState("All countries");
  const [category, setCategory] = useState("All work");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All cities");
  const [mode, setMode] = useState("All workplaces");
  const [limit, setLimit] = useState(20);
  const pins = useMemo(() => {
    const cities = new Map<string,{city:string;lat:number;lon:number;count:number}>();
    for (const job of allJobs) if (job.coordinates) { const c=job.coordinates; const existing=cities.get(c.city); if(existing) existing.count++; else cities.set(c.city,{...c,count:1}); }
    return [...cities.values()].sort((a,b)=>a.city.localeCompare(b.city));
  }, []);
  const countries = useMemo(() => [...new Set(allJobs.flatMap(job => job.countries))].sort(), []);
  const categories = useMemo(() => [...new Set(allJobs.map(job => job.category))].sort(), []);
  const jobs = allJobs.filter(job =>
    (region === "All regions" || job.regions.includes(region)) &&
    (country === "All countries" || job.countries.includes(country)) &&
    (category === "All work" || job.category === category) &&
    (city === "All cities" || job.coordinates?.city === city) &&
    (mode === "All workplaces" || (job.workMode || "Remote eligible") === mode) &&
    `${job.title} ${job.company} ${job.skills.join(" ")} ${job.summary}`.toLowerCase().includes(search.toLowerCase().trim())
  ).sort((a,b) => priority(b) - priority(a));
  function chooseRegion(value: string) { setRegion(value); setCountry("All countries"); setCity("All cities"); setLimit(20); }
  const cityJobs = city === "All cities" ? [] : allJobs.filter(job => job.coordinates?.city === city).sort((a,b) => priority(b) - priority(a));
  const selectCity = (selected:string) => {setCity(selected); setRegion("All regions"); setCountry("All countries"); setMode("All workplaces"); setCategory("All work"); setSearch(""); setLimit(20);};
  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.wrap}>
        <p className={styles.eyebrow}>THE AI GAME MAKERS JOB BOARD <span>✦</span> YOUR NEXT LEVEL</p>
        <h1>Find your place in <em>games + AI.</em></h1>
        <p className={styles.lead}>Real opportunities. Skills worth building. A world of ways to make games and work with AI.</p>
        <div className={styles.heroMeta}><span><i /> {allJobs.filter(j => j.workMode === "Hybrid").length} HYBRID OPPORTUNITIES</span><span>BOARD UPDATED {formatDate(listings.lastUpdated).toUpperCase()}</span></div>
        <a className={styles.heroButton} href="#board-heading" onClick={() => {setMode("Hybrid"); setCity("All cities"); setCountry("All countries"); setRegion("All regions"); setCategory("All work"); setSearch(""); setLimit(20);}}>Explore hybrid jobs ↓</a>
      </div>
    </section>
    <section className={styles.wrap} aria-labelledby="map-heading">
      <div className={styles.mapCard}>
        <div className={styles.mapIntro}><div><p className={styles.eyebrow}>EXPLORE THE MAP</p><h2 id="map-heading">Your next opportunity<br /><em>could be anywhere.</em></h2></div><p>Drag to spin the globe. Select a glowing point to see jobs in that city, without leaving the map.</p></div>
        <div className={styles.globeLayout}>
          <div><Globe pins={pins} selected={city} onSelect={selectCity} /><p className={styles.globeHint}>✦ DRAG TO ROTATE <span>•</span> TAP A POINT</p></div>
          <aside className={styles.cityPanel} aria-live="polite" aria-label="Selected city opportunities">
            {city === "All cities" ? <><p className={styles.eyebrow}>YOUR NEXT STOP</p><h3>Pick a point.<br /><em>See the jobs.</em></h3><p>Tap a glowing point on the globe or choose a city below. Hybrid opportunities are shown first.</p><span className={styles.hintArrow}>↖</span></> : <><p className={styles.eyebrow}>JOBS IN {city.toUpperCase()}</p><h3>{city}</h3><p>{cityJobs.length} {cityJobs.length === 1 ? "opportunity" : "opportunities"} · Hybrid first</p><div className={styles.cityJobs}>{cityJobs.slice(0,4).map(job => <a href={job.url} key={job.id} target="_blank" rel="noopener noreferrer"><span>{job.title}<small>{job.company} · {job.workMode}</small></span><b>↗</b></a>)}</div><a className={styles.viewCity} href="#board-heading">View all {cityJobs.length} jobs ↓</a></>}
          </aside>
        </div>
        <div className={styles.cityButtons} aria-label="Filter by city">
          <button aria-pressed={city === "All cities"} onClick={() => {setCity("All cities"); setLimit(20);}}>All cities</button>
          {pins.map(pin => <button key={pin.city} aria-pressed={city === pin.city} onClick={() => selectCity(pin.city)}>{pin.city} <span>{pin.count}</span></button>)}
        </div>
        <div className={styles.regions} aria-label="Filter by region">
          {["All regions", ...regions].map(r => <button key={r} type="button" onClick={() => chooseRegion(r)} aria-pressed={region === r} className={region === r ? styles.activeRegion : ""}>{r} <span>{r === "All regions" ? allJobs.length : allJobs.filter(j => j.regions.includes(r)).length}</span></button>)}
        </div>
        <p className={styles.mapNote}>Only roles with an identified city and a stated location-based, on-site or hybrid arrangement appear as points. Other roles remain on the board. Map data: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Natural Earth</a>.</p>
      </div>
    </section>
    <section className={`${styles.wrap} ${styles.board}`} aria-labelledby="board-heading">
      <div className={styles.boardHeading}><div><p className={styles.eyebrow}>THE OPPORTUNITY BOARD</p><h2 id="board-heading">Find work in <em>gaming.</em></h2></div><p>Explore roles across game development, AI training and evaluation. Requirements and availability vary.</p></div>
      <div className={styles.filters}>
        <label>Search skills or title<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Try Godot or Python" /></label>
        <label>Country<select value={country} onChange={e => { setCountry(e.target.value); setRegion("All regions"); setCity("All cities"); setLimit(20); }}><option>All countries</option>{countries.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>Workplace<select value={mode} onChange={e => {setMode(e.target.value);setLimit(20);}}><option>All workplaces</option><option>Hybrid</option><option>Remote eligible</option><option>On-site</option><option>Location based</option><option>Not specified</option></select></label>
        <label>Type of work<select value={category} onChange={e => setCategory(e.target.value)}><option>All work</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
      </div>
      <div className={styles.results}><strong aria-live="polite">{jobs.length} {jobs.length === 1 ? "opportunity" : "opportunities"}</strong><button onClick={() => {setSearch(""); setCountry("All countries"); setRegion("All regions"); setCategory("All work"); setCity("All cities"); setMode("All workplaces"); setLimit(20);}}>Clear filters ↗</button></div>
      <div className={styles.list}>
        {jobs.slice(0, limit).map(job => <article key={job.id} className={styles.job}>
          <div className={styles.jobTop}><span className={styles.category}>{job.category}</span><span className={styles.checked}>{job.checkedAt < listings.lastUpdated ? "NOT CONFIRMED IN LATEST UPDATE · " : ""}CHECKED {formatDate(job.checkedAt).toUpperCase()}</span></div>
          <div className={styles.jobMain}><div><h3>{job.title}</h3><p className={styles.company}>{job.company} · {job.sourceLabel || "recruiting platform"}</p></div><div className={styles.pay}>{job.pay}<small>{job.payNote}</small></div></div>
          <p className={styles.description}>{job.summary}</p>
          <div className={styles.tags}><span>⌁ {job.location}</span><span>◷ {job.employment}</span>{job.posted && <span>Posted {formatDate(job.posted)}</span>}<span>{job.workMode || "Remote eligible"}</span></div>
          <p className={styles.requirements}><strong>What they ask for</strong> {job.requirements}</p>
          {job.skills.length > 0 && <p className={styles.terms}>TERMS MENTIONED IN THE LISTING</p>}
          <div className={styles.skills} aria-label="Terms mentioned in the listing">{job.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
          <div className={styles.jobBottom}><span>Check the source for current details and eligibility.</span><a href={job.url} target="_blank" rel="noopener noreferrer">View listing <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></div>
        </article>)}
        {!jobs.length && <div className={styles.empty}><h3>No matches yet.</h3><p>Try another region, country or skill. New opportunities can appear as the board is refreshed.</p></div>}
      </div>
      {jobs.length > limit && <button className={styles.more} onClick={() => setLimit(limit + 20)}>Show more opportunities ↓</button>}
      <p className={styles.disclaimer}>Listings are curated from external sources and can close or change at any time. Pay is the advertised amount, not a promise of earnings. Check eligibility, terms and the application destination on the source page.</p>
    </section>
    <section className={`${styles.wrap} ${styles.cta}`}><div><p className={styles.eyebrow}>BUILD YOUR NEXT LEVEL</p><h2>Make games. Build skills.<br /><em>Open new doors.</em></h2><p>Learn alongside other makers and start building work you can share.</p></div><a href="https://www.skool.com/build-pixel-art-games-with-ai-7131/about" target="_blank" rel="noopener noreferrer">Join the community free ↗</a></section>
  </div>;
}

