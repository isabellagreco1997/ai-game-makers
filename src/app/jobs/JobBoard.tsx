"use client";

import { useMemo, useState } from "react";
import listings from "@/content/jobs.json";
import Globe from "./Globe";
import styles from "./jobs.module.css";

type Job = { id:string; title:string; company:string; url:string; category:string; pay:string; payNote:string; location:string; countries:string[]; regions:string[]; posted:string; skills:string[]; summary:string; requirements:string; requirementsList?:{text:string;kind:string;tools?:string[]}[]; employment:string; checkedAt:string; sourceLabel?:string; workMode?:string; coordinates?:{city:string;lat:number;lon:number} };
const allJobs: Job[] = listings.jobs;
const priority = (job: Job) => ((job.workMode || "Remote eligible") === "Remote eligible" ? 4 : job.workMode === "Hybrid" ? 2 : 0) + (/\b(junior|jr\.?|intern|internship|graduate|new.grad|entry.level|associate)\b/i.test(job.title) ? 1 : 0);
const regions = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"];
const formatDate = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function FlagIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true" className={styles.flagIcon}><path fill="#ffe45c" d="M7 3h3v24H7zM10 5h12v3h4v8h-4v3H10z"/><path fill="#ff9a39" d="M4 27h18v3H4z"/><path fill="#ff6caa" d="M2 30h22v2H2z"/></svg>;
}

function JobIcon({kind}:{kind:"pin"|"game"|"calendar"|"layers"}) {
  const shapes = {
    pin: <><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></>,
    game: <><path d="M7 8h10c2 0 3 1.5 3.5 4l1 4.5c.3 1.8-1.5 2.8-2.8 1.7L16 16h-8l-2.7 2.2c-1.3 1.1-3.1.1-2.8-1.7l1-4.5C4 9.5 5 8 7 8Z"/><path d="M7 10.5v4M5 12.5h4M16 11.5h.01M18 13.5h.01"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/></>,
  };
  return <svg className={styles.jobIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[kind]}</svg>;
}

function PixelLandscape() {
  return <svg className={styles.pixelLandscape} viewBox="0 0 520 180" aria-hidden="true" shapeRendering="crispEdges">
    <path fill="#352039" d="M0 170h45v-14h34v-14h45v16h50v-21h42v-12h66v13h30v-20h51v-20h49V73h55V56h53v124H0z"/>
    <path fill="#522b40" d="M0 176h95v-8h35v-16h78v10h56v-21h57v-16h52v-21h44V82h48V66h55v114H0z"/>
    <path fill="#a95b69" d="M210 178v-12h70v-12h59v-14h48v-20h51v-16h41V87h41v8h-35v17h-45v16h-48v20h-49v14h-59v16z"/>
    <path fill="#ffc089" d="M210 175h70v-4h-70zm70-12h59v-4h-59zm59-14h48v-4h-48zm48-20h51v-4h-51zm51-16h41v-4h-41zm41-17h41v-4h-41z"/>
    <path fill="#768576" d="M270 151h7v-10h5v7h6v-11h5v13h7v-5h5v9h-35zm190-70h5v-9h5v5h5v-13h5v15h6v-8h5v13h-31z"/>
    <path fill="#ffd94a" d="M394 67h5v38h-5zm5 2h23v5h7v13h-7v4h-23z"/><path fill="#ffb132" d="M386 103h22v4h-22z"/><path fill="#fff0a1" d="M393 64h7v5h-7z"/>
    <path fill="#ffe99a" d="M122 118h4v4h4v4h-4v4h-4v-4h-4v-4h4zm332-63h3v3h3v3h-3v3h-3v-3h-3v-3h3z"/>
  </svg>;
}

export default function JobBoard() {
  const [region, setRegion] = useState("All regions");
  const [country, setCountry] = useState("All countries");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All cities");
  const [mode, setMode] = useState("Remote eligible");
  const [limit, setLimit] = useState(20);
  const pins = useMemo(() => {
    const cities = new Map<string,{city:string;lat:number;lon:number;count:number}>();
    for (const job of allJobs) if (job.coordinates) { const c=job.coordinates; const existing=cities.get(c.city); if(existing) existing.count++; else cities.set(c.city,{...c,count:1}); }
    return [...cities.values()].sort((a,b)=>a.city.localeCompare(b.city));
  }, []);
  const countries = useMemo(() => [...new Set(allJobs.flatMap(job => job.countries))].sort(), []);
  const jobs = allJobs.filter(job =>
    (region === "All regions" || job.regions.includes(region)) &&
    (country === "All countries" || job.countries.includes(country)) &&
    (city === "All cities" || job.coordinates?.city === city) &&
    (mode === "All workplaces" || (job.workMode || "Remote eligible") === mode) &&
    `${job.title} ${job.company} ${job.skills.join(" ")} ${(job.requirementsList || []).map(r => `${r.text} ${(r.tools || []).join(" ")}`).join(" ")}`.toLowerCase().includes(search.toLowerCase().trim())
  ).sort((a,b) => priority(b) - priority(a));
  function chooseRegion(value: string) { setRegion(value); setCountry("All countries"); setCity("All cities"); setLimit(20); }
  const cityJobs = city === "All cities" ? [] : allJobs.filter(job => job.coordinates?.city === city).sort((a,b) => priority(b) - priority(a));
  const selectCity = (selected:string) => {setCity(selected); setRegion("All regions"); setCountry("All countries"); setMode("All workplaces"); setSearch(""); setLimit(20);};
  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.wrap}>
        <p className={styles.eyebrow}>THE AI GAME MAKERS JOB BOARD <span>✦</span> YOUR NEXT LEVEL</p>
        <h1>Find your place in <em>games + AI.</em></h1>
        <p className={styles.lead}>Real opportunities. Skills worth building. A world of ways to make games and work with AI.</p>
        <div className={styles.heroMeta}><span><i /> {allJobs.filter(j => (j.workMode || "Remote eligible") === "Remote eligible").length} REMOTE OPPORTUNITIES</span><span>BOARD UPDATED {formatDate(listings.lastUpdated).toUpperCase()}</span></div>
        <a className={styles.heroButton} href="#board-heading" onClick={() => {setMode("Remote eligible"); setCity("All cities"); setCountry("All countries"); setRegion("All regions"); setSearch(""); setLimit(20);}}>Explore remote jobs ↓</a>
      </div>
    </section>
    <section className={styles.wrap} aria-labelledby="map-heading">
      <div className={styles.mapCard}>
        <div className={styles.mapIntro}><div><p className={styles.eyebrow}>EXPLORE THE MAP</p><h2 id="map-heading">Your next opportunity<br /><em>could be anywhere.</em></h2></div><p>Drag to spin the globe. Select a glowing point to see jobs in that city, without leaving the map.</p></div>
        <div className={styles.globeLayout}>
          <div><Globe pins={pins} selected={city} onSelect={selectCity} /><p className={styles.globeHint}>✦ DRAG TO ROTATE <span>•</span> TAP A POINT</p></div>
          <aside className={styles.cityPanel} aria-live="polite" aria-label="Selected city opportunities">
            {city === "All cities" ? <><p className={styles.eyebrow}>YOUR NEXT STOP</p><h3>Pick a point.<br /><em>See the jobs.</em></h3><p>Tap a glowing point on the globe or choose a city below to explore its local opportunities.</p><span className={styles.hintArrow}>↖</span></> : <><p className={styles.eyebrow}>JOBS IN {city.toUpperCase()}</p><h3>{city}</h3><p>{cityJobs.length} {cityJobs.length === 1 ? "opportunity" : "opportunities"}</p><div className={styles.cityJobs}>{cityJobs.slice(0,4).map(job => <a href={job.url} key={job.id} target="_blank" rel="noopener noreferrer"><span>{job.title}<small>{job.company} · {job.workMode}</small></span><b>↗</b></a>)}</div><a className={styles.viewCity} href="#board-heading">View all {cityJobs.length} jobs ↓</a></>}
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
      <div className={styles.boardHeading}><div><p className={styles.eyebrow}>THE OPPORTUNITY BOARD</p><h2 id="board-heading">Find work in <em>gaming.</em></h2></div><p>Explore remote and other non-senior opportunities in gaming. Check each listing for experience and location requirements.</p></div>
      <div className={styles.filters}>
        <label>Search skills or title<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Try Godot or Python" /></label>
        <label>Country<select value={country} onChange={e => { setCountry(e.target.value); setRegion("All regions"); setCity("All cities"); setLimit(20); }}><option>All countries</option>{countries.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>Workplace<select value={mode} onChange={e => {setMode(e.target.value);setLimit(20);}}><option>All workplaces</option><option>Remote eligible</option><option>Hybrid</option><option>On-site</option><option>Location based</option><option>Not specified</option></select></label>
      </div>
      <div className={styles.results}><strong aria-live="polite">{jobs.length} {jobs.length === 1 ? "opportunity" : "opportunities"}</strong><button onClick={() => {setSearch(""); setCountry("All countries"); setRegion("All regions"); setCity("All cities"); setMode("All workplaces"); setLimit(20);}}>Clear filters ↗</button></div>
      <div className={styles.list}>
        {jobs.slice(0, limit).map(job => <article key={job.id} className={styles.job}>
          <div className={styles.jobTop}><span className={styles.category}><FlagIcon />{job.workMode || "Remote eligible"}</span><span className={styles.checked}>{job.checkedAt < listings.lastUpdated ? "NOT CONFIRMED IN LATEST UPDATE · " : ""}CHECKED {formatDate(job.checkedAt).toUpperCase()}</span></div>
          <div className={styles.jobMain}><div><h3>{job.title}</h3><p className={styles.company}>{job.company} · {job.sourceLabel || "recruiting platform"}</p></div><div className={styles.pay}>{job.pay}<small>{job.payNote}</small></div></div>
          <div className={styles.tags}><span><JobIcon kind="pin" />{job.location}</span><span><JobIcon kind="game" />{job.employment}</span>{job.posted && <span><JobIcon kind="calendar" />Posted {formatDate(job.posted)}</span>}<span><JobIcon kind="layers" />{job.workMode || "Remote eligible"}</span></div>
          <div className={styles.requirementsBlock}>
            <div className={styles.requirementsHeading}><FlagIcon /><h4>Skills &amp; requirements</h4></div><PixelLandscape />
            {job.requirementsList?.length ? <><ul className={styles.requirementList}>{job.requirementsList.map((item,i) => <li key={`${i}-${item.text}`}><span>{item.text}</span>{item.kind === "preferred" && <small>Preferred</small>}{item.kind === "mixed" && <small>See details</small>}</li>)}</ul><p className={styles.requirementsNote}>Short excerpts · see the listing for full details and context.</p></> : <p className={styles.requirementsNote}>Requirements could not be extracted. See the original listing.</p>}
            {(() => {const tools = [...new Set((job.requirementsList || []).flatMap(item => item.tools || []))]; return tools.length ? <><p className={styles.terms}>TOOLS MENTIONED IN REQUIREMENTS</p><div className={styles.skills}>{tools.map(tool => <span key={tool}>{tool}</span>)}</div></> : null;})()}
          </div>
          <div className={styles.jobDivider} aria-hidden="true"><i /><i /><i /></div><div className={styles.jobBottom}><span>Check the source for current details and eligibility.</span><a href={job.url} target="_blank" rel="noopener noreferrer">View listing <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></div>
        </article>)}
        {!jobs.length && <div className={styles.empty}><h3>No matches yet.</h3><p>Try another region, country or skill. New opportunities can appear as the board is refreshed.</p></div>}
      </div>
      {jobs.length > limit && <button className={styles.more} onClick={() => setLimit(limit + 20)}>Show more opportunities ↓</button>}
      <p className={styles.disclaimer}>Listings are curated from external sources and can close or change at any time. Pay is the advertised amount, not a promise of earnings. Check eligibility, terms and the application destination on the source page.</p>
    </section>
    <section className={`${styles.wrap} ${styles.cta}`}><div><p className={styles.eyebrow}>BUILD YOUR NEXT LEVEL</p><h2>Make games. Build skills.<br /><em>Open new doors.</em></h2><p>Learn alongside other makers and start building work you can share.</p></div><a href="https://www.skool.com/build-pixel-art-games-with-ai-7131/about" target="_blank" rel="noopener noreferrer">Join the community free ↗</a></section>
  </div>;
}

