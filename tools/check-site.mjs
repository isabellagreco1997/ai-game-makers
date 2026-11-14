// Crawls the running site and checks the release gates that can be automated.
// Usage: node tools/check-site.mjs [baseUrl]   (default http://localhost:8900)
const BASE = (process.argv[2] || "http://localhost:8900").replace(/\/$/, "");
const ROUTES = ["/", "/free-course", "/community", "/mentorship", "/games", "/about", "/workshops", "/ai-and-games", "/interest", "/thank-you", "/privacy", "/cookies", "/terms"];

const problems = [];
const titles = new Map();
const internal = new Set();
const external = new Set();
const fail = (route, msg) => problems.push(`${route}: ${msg}`);

const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");

for (const r of ROUTES) {
  const res = await fetch(BASE + (r === "/" ? "/" : r + "/"));
  const html = await res.text();
  if (res.status !== 200) fail(r, `status ${res.status}`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  if (!title) fail(r, "no <title>");
  if (titles.has(title)) fail(r, `duplicate title with ${titles.get(title)}`);
  titles.set(title, r);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!desc) fail(r, "no meta description");
  if (!/rel="canonical"/.test(html)) fail(r, "no canonical");
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail(r, `${h1s} <h1> elements`);
  if (/href="#"/.test(html)) fail(r, 'dead href="#"');
  if (/href=""/.test(html)) fail(r, "empty href");
  const body = text(html);
  if (body.includes("—")) fail(r, "em dash in visible copy");
  for (const bad of [/limited (spots|seats|places)/i, /only \d+ (spots|seats|places)/i, /countdown/i, /sold out/i, /cohort/i, /waitlist/i, /\d+\+? (students|members) (enrolled|joined)/i]) {
    if (bad.test(body)) fail(r, `scarcity / proof wording: ${bad}`);
  }
  for (const m of html.matchAll(/<img [^>]*>/g)) {
    if (!/alt="/.test(m[0])) fail(r, `img without alt: ${m[0].slice(0, 80)}`);
  }
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const h = m[1].replace(/&amp;/g, "&");
    if (h.includes("/_next/") || h.includes("/art/") || h.startsWith("/icon") || h.startsWith("/apple") || h.endsWith(".css") || h.endsWith(".png")) continue;
    const basePath = new URL(BASE + "/").pathname.replace(/\/$/, "");
    if (h.startsWith("/")) internal.add((h.split("#")[0] || "/").slice(basePath.length) || "/");
    else if (h.startsWith("http")) external.add(h);
    else if (h.startsWith("#")) {
      const id = h.slice(1);
      if (id && !html.includes(`id="${id}"`)) fail(r, `in-page anchor #${id} has no target`);
    }
  }
}

for (const p of internal) {
  const res = await fetch(BASE + p, { redirect: "manual" });
  if (res.status !== 200) problems.push(`internal link ${p}: status ${res.status}`);
}

const nf = await fetch(BASE + "/404.html");
if (nf.status !== 200) problems.push(`404.html missing (${nf.status})`);
if (!(await nf.text()).includes("not found")) problems.push("404 page missing its copy");

for (const p of ["/sitemap.xml", "/robots.txt", "/og.png", "/icon.png"]) {
  const res = await fetch(BASE + p);
  if (res.status !== 200) problems.push(`${p}: status ${res.status}`);
}

console.log(`${ROUTES.length} routes, ${internal.size} internal links, ${external.size} external links checked.`);
console.log("External links:\n  " + [...external].sort().join("\n  "));
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n- ` + problems.join("\n- "));
  process.exit(1);
}
console.log("\nAll automated checks passed.");
