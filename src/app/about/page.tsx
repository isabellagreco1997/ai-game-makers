import { asset } from "@/lib/asset";
import { Band, Ledge } from "@/components/blocks";
import { Button } from "@/components/Button";
import { Scene } from "@/components/Scene";
import { GAMES } from "@/content/games";
import { Video } from "@/components/Video";
import { videos } from "@/config/site";
import { pageMeta } from "@/lib/meta";
import styles from "../pages.module.css";

export const metadata = pageMeta(
  "About Isabella | AI Game Makers Club",
  "Meet Isabella, a software engineer and game creator teaching beginners how to make their own games with AI.",
  "/about",
);

export default function About() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Isabella",
    jobTitle: "Software engineer and game creator",
    sameAs: ["https://www.youtube.com/@itsisagreco", "https://isgstudio.itch.io/"],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <Scene variant="about" photo photoAlt="Isabella, founder of AI Game Makers">
        <h1 className={["display display--xl", styles.h1].join(" ")}>
          Hi, I&apos;m <em>Isabella.</em>
        </h1>
        <p className="plate" style={{ marginBottom: 18 }}>
          Software engineer. Game creator. Curious about what AI makes possible.
        </p>
        <p className={["lede on-sky", styles.heroCopy].join(" ")}>
          I&apos;ve spent years building software and making games. I teach people how to use AI tools while making their own choices about
          gameplay, visuals and story.
        </p>
      </Scene>

      <Band tone="dusk" labelledBy="experience">
        <div className={styles.aboutGrid}>
          <section className="card" aria-labelledby="experience">
            <h2 id="experience" className="title-ink">
              From software development to game creation.
            </h2>
            <p>
              My background combines professional software engineering with an interest in design and videogames. I care about the details
              that make an experience feel intentional, from how a character moves to how a player discovers something new.
            </p>
          </section>
          <section className="card" aria-labelledby="mission">
            <h2 id="mission" className="title-ink">
              Learning should lead to making.
            </h2>
            <p>
              A game gives you a reason to learn each skill. You can test an idea, see how it plays and decide what to improve next.
            </p>
          </section>
          <section className="card" aria-labelledby="method">
            <h2 id="method" className="title-ink">
              AI is a tool. Creative direction is the skill.
            </h2>
            <p>
              The goal isn&apos;t to let AI make every decision. You learn to guide it, check the result and decide what belongs in your game.
            </p>
          </section>
        </div>
      </Band>

      <Band tone="sunset" labelledBy="intro-video">
        <div className={styles.videoRow}>
          {videos.founder ? (
            <Video videoId={videos.founder} title="An introduction from Isabella" slot="about_intro" />
          ) : (
            <ul className={styles.shots}>
              {GAMES.filter((g) => !g.shot.portrait).slice(0, 3).map((g) => (
                <li key={g.title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(g.shot.src)} alt={g.shot.alt} loading="lazy" />
                  <span>{g.title}</span>
                </li>
              ))}
            </ul>
          )}
          <div>
            <h2 id="intro-video" className="display display--md">
              See what I <em>make.</em>
            </h2>
            <p className="lede on-sky">Released games, games in development and the experiments behind them.</p>
            <div className="cta-row">
              <Button href="/games" variant="dark">
                Our Games
              </Button>
              <Button href="https://www.youtube.com/@itsisagreco" variant="secondary">
                YouTube devlogs
              </Button>
            </div>
          </div>
        </div>
      </Band>

      <Band tone="night" labelledBy="final">
        <div className="center stack" style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 id="final" className="display display--lg">
            Let&apos;s make <em>your game.</em>
          </h2>
          <div className="cta-row cta-row--center">
            <Button href="/community" size="lg" track="about_join">
              Join the Free Community
            </Button>
            <Button href="/mentorship" variant="secondary" size="lg">
              Explore Mentorship
            </Button>
          </div>
        </div>
        <Ledge sprite="cat" side="right" flip />
      </Band>
    </>
  );
}
