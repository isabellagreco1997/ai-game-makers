import { asset } from "@/lib/asset";
import Link from "next/link";
import { links, site } from "@/config/site";
import { NAV } from "@/config/nav";
import { CookieSettingsLink } from "./Consent";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.ground} aria-hidden="true" />
      <div className={["wrap", styles.inner].join(" ")}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brand/logo@2x.png")} alt="AI Game Makers Club" width={433} height={120} style={{ height: 52, width: "auto" }} />
          </Link>
          <p>{site.tagline} Find free lessons, feedback from other makers and personal mentorship for your own project.</p>
          <ul className={styles.social} aria-label="Elsewhere">
            {links.skoolCommunity && (
              <li>
                <a href={links.skoolCommunity} target="_blank" rel="noopener noreferrer" data-track="footer_skool">
                  Skool community
                </a>
              </li>
            )}
            <li>
              <a href="https://www.youtube.com/@itsisagreco" target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </li>
            <li>
              <a href="https://isgstudio.itch.io/" target="_blank" rel="noopener noreferrer">
                itch.io
              </a>
            </li>
          </ul>
        </div>

        <nav className={styles.col} aria-label="Footer: explore">
          <h2>Explore</h2>
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.col} aria-label="Footer: more">
          <h2>More</h2>
          <ul>
            <li>
              <Link href="/ai-and-games">AI, Hate and Your Game</Link>
            </li>
            <li>
              <Link href="/interest">Interest List</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/cookies">Cookies</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
            {links.contactEmail && (
              <li>
                <a href={`mailto:${links.contactEmail}`}>Contact</a>
              </li>
            )}
            <li>
              <CookieSettingsLink />
            </li>
          </ul>
        </nav>
      </div>
      <div className={["wrap", styles.base].join(" ")}>
        <p>
          © {year} {site.name}. Lessons, community and mentorship purchases are hosted on Skool. An independent community, not
          affiliated with or endorsed by Anthropic or OpenAI. Claude and Codex are trademarks of their owners.
        </p>
      </div>
    </footer>
  );
}
