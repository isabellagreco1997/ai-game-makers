import Link from "next/link";
import { BacklashChart, ChartGrid, JobsChart, SkillsChart, SteamChart, Takes } from "@/components/AiHate";
import { Band, Faq, FeatureCard, PriceTag, SceneCard, SectionHead, StepCard } from "@/components/blocks";
import { Button } from "@/components/Button";
import { GameReel } from "@/components/GameReel";
import { Icon } from "@/components/Icon";
import { FactsGrid, MemberQuotes, PlayerProof } from "@/components/Proof";
import { WorldGap } from "@/components/WorldBg";
import { Scene } from "@/components/Scene";
import { Video } from "@/components/Video";
import { links, site, videos } from "@/config/site";
import { GAMES } from "@/content/games";
import { asset } from "@/lib/asset";
import { pageMeta } from "@/lib/meta";
import styles from "./home.module.css";

export const metadata = pageMeta(
  "AI Game Makers Club | Learn AI by Building Games",
  "Learn AI game development, build playable projects and grow skills you can show to employers or clients.",
  "/",
);

const faq = [
  { q: "Is it really free?", a: <p>Yes. The community and the free course are free to join on Skool. No card needed.</p> },
  {
    q: "Do I need to know how to code?",
    a: <p>No. The lessons start with the basics. You&apos;ll learn to guide AI tools, understand their output and make the creative decisions yourself.</p>,
  },
  {
    q: "Which AI tools will I use?",
    a: <p>Each lesson names the tools it uses. Some have free tiers and some are paid, so you can decide before you start.</p>,
  },
  { q: "What is Skool?", a: <p>Skool is the platform that hosts the community, the lessons and the discussions. You can use it in a browser or the Skool app.</p> },
  { q: "Will this guarantee me a job or income?", a: <p>No. The club helps you practise and build playable work you can share. Jobs and income depend on your skills, experience, location and the opportunities available.</p> },
  {
    q: "What's the difference between the free course and the mentorship?",
    a: (
      <p>
        The free course teaches the foundations at your own pace. The <Link href="/mentorship">$299 per month mentorship</Link> is 12 weeks of weekly 1:1
        guidance on your own game, paid over three months.
      </p>
    ),
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/apple-icon.png`,
    founder: { "@type": "Person", name: "Isabella" },
    sameAs: ["https://www.youtube.com/@itsisagreco", "https://isgstudio.itch.io/"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. Hero: outcome, offer, CTA and the word free in the first screen */}
      <Scene variant="home" photo photoAlt="Isabella, founder of AI Game Makers, smiling">
        <span className="eyebrow">AI Game Makers Club</span>
        <h1 className="display display--xl">
          Learn to build games with AI. <em>Build a future doing what you love.</em>
        </h1>
        <p className="plate">Build practical skills and playable projects, even if you&apos;re new to game development.</p>
        <p className="on-sky" style={{ marginTop: 14 }}>
          Learn with Claude Code and Codex, get feedback from other makers and create work you can show to employers or clients.
          Start for free and explore where your skills could take you.
        </p>
        <div className="cta-row">
          <Button href="/community" size="lg" track="home_hero_start_free">
            Start Learning for Free
          </Button>
          <Button href="#how-it-works" variant="secondary" size="lg" arrow={false}>
            Explore the Club
          </Button>
        </div>
        <p className="risk">
          <span>Free community on Skool</span>
          <span>No card needed</span>
          <span>Leave anytime</span>
        </p>
      </Scene>

      <section className={styles.opportunity} aria-labelledby="opportunity-title">
        <div className={styles.opportunityInner}>
          <div className={styles.opportunityIntro}>
            <span className="eyebrow">Real roles. Real potential.</span>
            <h2 id="opportunity-title">Your skills could take you <em>further.</em></h2>
            <p>Companies are looking for people who can build, test and create with AI. These examples show what some remote roles have offered.</p>
          </div>
          <div className={styles.opportunityGrid}>
            <article className={styles.opportunityCard}>
              <div className={styles.opportunityLabel}><span>AI GAME DEVELOPER</span><span>REMOTE · US</span></div>
              <p className={styles.opportunityNumber}>$169.6k<span>–</span>$253k <small>/ year</small></p>
              <div className={styles.rangeBar} aria-hidden="true"><span /></div>
              <p>Scopely advertised this full-time salary range for an AI-native game developer. The role required game development expertise and is no longer accepting applications.</p>
              <a href="https://jobs.revolution.com/companies/scopely/jobs/89109797-ai-game-developer-designer-artist-or-engineer" target="_blank" rel="noopener noreferrer">Source: Scopely job listing</a>
            </article>
            <article className={styles.opportunityCard}>
              <div className={styles.opportunityLabel}><span>GAME DEVELOPER · AI TRAINER</span><span>REMOTE · US</span></div>
              <p className={styles.opportunityNumber}>$125 <small>/ hour</small></p>
              <div className={styles.rangeBar} aria-hidden="true"><span /></div>
              <p>Handshake advertised this independent contractor rate for evaluating AI on game development tasks, with at least one year of relevant hands-on experience.</p>
              <a href="https://jobs.ashbyhq.com/handshake/7d4f5006-c35d-48ae-bebf-fd1dc7acc870" target="_blank" rel="noopener noreferrer">Source: Handshake job listing</a>
            </article>
          </div>
          <p className={styles.opportunityNote}>Examples, not typical or guaranteed earnings. Pay, eligibility and remote availability vary. Contract work depends on project availability; these roles require experience. Build skills and a portfolio one project at a time.</p>
        </div>
      </section>

      {/* 2. Proof by artifacts: real games, moving */}
      <GameReel />

      {/* 3. His pain, in his words (docs/AUDIENCE.md) */}
      <Band tone="cream" labelledBy="pain">
        <SectionHead
          id="pain"
          eyebrow="Sound familiar?"
          title={
            <>
              You want to work in games. <em>Where do you start?</em>
            </>
          }
        />
        <div className="grid grid--3">
          <FeatureCard icon="code" title="Start with the skills">
            <p>Learn to guide AI tools, solve problems and make creative decisions by working on a small game.</p>
          </FeatureCard>
          <FeatureCard icon="laptop" title="Build something playable">
            <p>Turn an idea into a project people can try, test and give you feedback on.</p>
          </FeatureCard>
          <FeatureCard icon="eye" title="Show what you can do">
            <p>Share your work and explain your choices as you develop a portfolio for future opportunities.</p>
          </FeatureCard>
        </div>
        <p className={styles.turn}>
          Start small, practise with purpose and <strong>build work you can share.</strong>
        </p>
      </Band>

      {/* 4. Real players: public reactions to our games */}
      <Band tone="dusk" labelledBy="players">
        <SectionHead
          id="players"
          eyebrow="People play what we make"
          title={
            <>
              Playable work. Real players. <em>Real feedback.</em>
            </>
          }
          intro="A playable game shows what you can make. HAPPY DAY is rated 5.0 on itch.io, and three YouTube creators recorded full playthroughs. Explore their public reactions below."
        />
        <PlayerProof />
      </Band>

      <WorldGap />

      <Band tone="cream" labelledBy="career-paths">
        <SectionHead id="career-paths" eyebrow="Your future in games" title={<>Where could these skills <em>take you?</em></>} intro="Build a foundation for different paths in and around game development." />
        <div className="grid grid--3">
          <FeatureCard icon="gamepad" title="Game studios"><p>Explore roles in game design, development, art and prototyping. Requirements vary by role and studio.</p></FeatureCard>
          <FeatureCard icon="laptop" title="Remote and contract work"><p>Look for remote jobs and freelance projects that match your skills, experience and location.</p></FeatureCard>
          <FeatureCard icon="rocket" title="Independent projects"><p>Make and share your own games while developing a portfolio and exploring ways to earn from your work.</p></FeatureCard>
        </div>
        <p className={styles.turn}>In <a href="https://www.skillsearch.com/assets/reports/skillsearch_games_and_immersive_salary_and_satisfaction_report_2026.pdf" target="_blank" rel="noopener noreferrer">Skillsearch&apos;s 2026 industry survey</a>, gameplay design respondents reported an average salary of <strong>£61,245 a year</strong>. This is an industry benchmark, not a starting salary or a guarantee. Pay and remote availability vary by role, experience and location.</p>
      </Band>

      {/* 5. Why now: the technical point of view, with sources */}
      <Band tone="cream" labelledBy="why-now">
        <div className={styles.whyHead}>
          <span className="eyebrow">Why now</span>
          <h2 id="why-now" className="display display--lg" style={{ margin: "14px 0 18px" }}>
            Making software just changed. <em>Learn to direct AI now.</em>
          </h2>
          <p className="lede">
            AI coding agents like Claude Code and Codex now write, run and fix code from plain-language instructions. Typing code is no
            longer the hard part. Knowing what to build, breaking it into steps and judging what comes back is, and that skill compounds
            the longer you practise it.
          </p>
        </div>
        <FactsGrid />
        <div className={styles.whyGames}>
          <h3 className="title-ink">Why learn it through games?</h3>
          <p>
            A game touches code, art, sound, design and testing in one small project, and you find out straight away whether it works,
            because you can play it. The skills travel: directing AI agents, scoping, debugging and shipping are useful far beyond games.
          </p>
          <Button href="/community" track="home_why_join">
            Start Free in Skool
          </Button>
        </div>
      </Band>

      {/* 5b. The AI hate: both sides, with sources */}
      <Band tone="dusk" id="ai-hate" labelledBy="ai-hate-title">
        <SectionHead
          id="ai-hate-title"
          eyebrow="About the AI backlash"
          title={
            <>
              The backlash is real. <em>So is the shift.</em>
            </>
          }
          intro="Post something made with AI and the comments can turn ugly. The backlash is real, and it is growing. So is the number of people building with these tools. Here is what the data shows on both sides."
        />
        <ChartGrid>
          <BacklashChart />
          <SteamChart />
          <JobsChart />
          <SkillsChart />
        </ChartGrid>
        <Takes />
        <div className="cta-row cta-row--center" style={{ marginTop: 36 }}>
          <Button href="/ai-and-games" variant="secondary" track="home_ai_hate_read">
            Read the full breakdown
          </Button>
        </div>
      </Band>

      {/* optional founder video: only when a real one exists */}
      {videos.founder && (
        <Band tone="cream" labelledBy="founder-video">
          <div className={styles.videoRow}>
            <Video videoId={videos.founder} title="Meet Isabella: what's possible with AI and games" slot="home_founder" />
            <div>
              <span className="eyebrow">Founder video</span>
              <h2 id="founder-video" className="display display--md" style={{ margin: "14px 0 16px" }}>
                Hi, I'm Isabella. <em>Let me show you what's possible.</em>
              </h2>
              <p className="lede">
                I'm a software engineer and independent game creator. I started AI Game Makers to help creative people turn their ideas
                into games they can actually play, share and publish.
              </p>
            </div>
          </div>
        </Band>
      )}

      <WorldGap />

      {/* 3. Two paths */}
      <Band tone="cream" labelledBy="paths">
        <SectionHead
          id="paths"
          eyebrow="Choose your path"
          title={
            <>
              Your first game <em>starts small.</em>
            </>
          }
          intro="Whether you have an idea or an unfinished prototype, start with a small game you can actually play."
        />
        <div className={styles.paths}>
          <article className={["card", styles.path, styles.pathFree].join(" ")}>
            <div className={styles.pathTop}>
              <span className="badge badge--green">Free</span>
              <h3 className="title-ink">Start free</h3>
            </div>
            <p>Learn the tools step by step, make a small game and share your progress with other makers.</p>
            <ul className="check-list">
              <li>Beginner lessons and AI tool guides</li>
              <li>Ready-to-use prompts and resources</li>
              <li>Live workshop every Sunday</li>
              <li>Job board for game-making opportunities</li>
              <li>Share your builds and get feedback</li>
              <li>Community playtests</li>
            </ul>
            <div className={styles.pathCta}>
              <Button href="/community" track="home_path_free">
                Join the Free Community
              </Button>
              <Link href="/free-course" className={styles.textLink}>
                See the course
              </Link>
            </div>
          </article>

          <article className={["card", styles.path].join(" ")}>
            <div className={styles.pathTop}>
              <span className="badge badge--cream">1:1 mentorship</span>
              <h3 className={styles.acceleratorLogo} aria-label="Game Design Accelerator">
                <span className={styles.acceleratorMark} aria-hidden="true">
                  <svg viewBox="0 0 48 48" fill="none"><path d="M11 33 24 10l13 23h-8l-5-9-5 9h-8Z" fill="currentColor"/><path d="M16 38h16" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/></svg>
                </span>
                <span className={styles.acceleratorWords} aria-hidden="true"><span>Game Design</span><strong>Accelerator</strong></span>
              </h3>
            </div>
            <p className={styles.pathTagline}>Learn the craft. Build your game.</p>
            <p>A personalised 12-week mentorship to master game design fundamentals while creating your own game with AI.</p>
            <ul className={["check-list", styles.pathList].join(" ")}>
              <li>12 weekly 45-minute 1:1 sessions</li>
              <li>Personalised game development roadmap</li>
              <li>Game design principles</li>
              <li>Gameplay mechanics and core loops</li>
              <li>Level design and progression</li>
              <li>Game feel and player feedback</li>
              <li>Colour theory and composition</li>
              <li>Visual hierarchy and art direction</li>
              <li>Animation principles</li>
              <li>Storytelling and narrative design</li>
              <li>Player experience and engagement</li>
              <li>AI tools and development workflows</li>
              <li>Creative problem-solving</li>
              <li>Game reviews and personalised feedback</li>
              <li>Skool messaging between sessions</li>
              <li>Publishing and marketing guidance</li>
              <li>Build and present your game portfolio</li>
              <li>Create a library of games to showcase your skills</li>
              <li>Potential YouTube game showcase</li>
              <li>Session recordings and learning resources</li>
              <li>Standard community access</li>
            </ul>
            <p className={styles.pathFoot}>12 Weeks | 1:1 Mentorship</p>
            {links.conceptCall && (
              <p className={styles.pathNote}>
                <a href={links.conceptCall} target="_blank" rel="noopener noreferrer" data-track="home_concept_call">
                  Unsure? Book a free call
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            )}
            <div className={styles.pathCta}>
              <PriceTag>
                $299 <small>USD per month · three months · $897 total</small>
              </PriceTag>
              <Button href="/mentorship" variant="secondary" track="home_path_mentorship">
                Explore Mentorship
              </Button>
            </div>
          </article>
        </div>
      </Band>

      {/* 4. How it works */}
      <Band tone="dusk" id="how-it-works" labelledBy="how">
        <SectionHead
          id="how"
          eyebrow="How it works"
          title={
            <>
              From first steps <em>to work you can show.</em>
            </>
          }
        />
        <ol className={["grid grid--3", styles.steps].join(" ")}>
          <StepCard n="01" title="Learn" icon="books">
            Understand the tools and techniques through practical, beginner-friendly lessons.
          </StepCard>
          <StepCard n="02" title="Build" icon="gamepad">
            Create characters, environments and gameplay mechanics with AI-assisted workflows.
          </StepCard>
          <StepCard n="03" title="Share" icon="share">
            Test your project, improve it and share a playable example of your skills.
          </StepCard>
        </ol>
        <div className="cta-row cta-row--center" style={{ marginTop: 40 }}>
          <Button href="/community" track="home_how_join">
            Start Free in Skool
          </Button>
        </div>
      </Band>

      {/* 5. What you can make */}
      <Band tone="cream" labelledBy="genres">
        <SectionHead
          id="genres"
          eyebrow="What you'll build"
          title={
            <>
              Your ideas. <em>Your games.</em>
            </>
          }
          intro="See how different kinds of games take shape, from their first mechanic to their visual style."
        />
        <div className="grid grid--4">
          <SceneCard scene="scene-platformer" title="Platformers" label="The Last Ember: the hooded runner leaping under a full moon">
            Movement, jumps and level design that feel good in the hands. Like The Last Ember.
          </SceneCard>
          <SceneCard scene="scene-horror" title="Story and horror" label="HAPPY DAY: the birthday table">
            Atmosphere, puzzles and the tension of the next room. Like HAPPY DAY.
          </SceneCard>
          <SceneCard scene="scene-rhythm" title="Rhythm and arcade" label="HELLPOP MAYHEM: the hell city from the opening cutscene">
            Timing, feedback and juice on every action. Like HELLPOP MAYHEM.
          </SceneCard>
          <SceneCard scene="scene-mobile" title="Mobile games" label="Midnight Cat: the black cat flying past the moon">
            One-finger games made for a phone screen. Like Midnight Cat.
          </SceneCard>
        </div>
        <p className={styles.illusNote}>
          Every image here is a real frame from a game we made. <Link href="/games">See all our games</Link>
        </p>
      </Band>

      {/* 6. Meet the founder */}
      <Band tone="dusk" labelledBy="founder">
        <div className={styles.founder}>
          <div className={styles.founderHead}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/founder/isabella-480.webp")}
              alt="Isabella, software engineer and game creator"
              width={480}
              height={600}
              loading="lazy"
              className={styles.avatar}
            />
            <div>
              <span className="eyebrow">Meet the founder</span>
              <p className={styles.founderName}>
                <b>Isabella</b> Software engineer and indie game maker
              </p>
            </div>
          </div>
          <h2 id="founder" className="display display--lg">
            Built by a developer who <em>loves making games.</em>
          </h2>
          <p className="lede">
            I&apos;m Isabella, a software engineer with years of professional development experience and a background in game development
            and design. I combine that experience with modern AI tools to create playable games and share the workflows behind them.
          </p>
          <div className="cta-row">
            <Button href="/about" variant="secondary">
              More About Me
            </Button>
            <Link href="/games" className={styles.textLink}>
              Play our games
            </Link>
            <a href="https://www.youtube.com/@itsisagreco" target="_blank" rel="noopener noreferrer" className={styles.textLink}>
              Watch the devlogs<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>      </Band>

      <WorldGap />

      {/* 7. Community */}
      <Band tone="cream" labelledBy="community-preview">
        <SectionHead
          id="community-preview"
          eyebrow="The community"
          title={
            <>
              Grow your skills <em>with other makers.</em>
            </>
          }
          intro="Share progress, ask for help and get feedback as you build projects and develop skills for your next opportunity."
        />
        <div className={styles.club}>
          <div className={styles.channels}>
            <p className={styles.clubLabel}>Inside the club on Skool</p>
            <ul>
              {[
                ["gamepad", "Build Along", "Post your project, step by step, from first idea to playable."],
                ["sparkles", "Art & Animation", "Characters, sprites and scenes that look intentional, not generic."],
                ["code", "Help & Fixes", "Stuck in the fix loop? Bring the bug, get unstuck."],
                ["eye", "Playtest & Showcase", "Other makers play your game and tell you what they found."],
                ["books", "Studio Notes", "How we build our own games, with the real files and decisions."],
              ].map(([icon, name, desc]) => (
                <li key={name}>
                  <span className={styles.chIcon} aria-hidden="true">
                    <Icon name={icon} size={20} />
                  </span>
                  <span className={styles.chText}>
                    <b>{name}</b>
                    <span>{desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.rhythm}>
            <div className={styles.rhythmItem}>
              <Icon name="calendar" size={28} />
              <div>
                <b>A live workshop every Sunday</b>
                <span>A different topic each week. We build it together, live, and you ask as you go.</span>
              </div>
            </div>
            <div className={styles.rhythmItem}>
              <Icon name="eye" size={28} />
              <div>
                <b>Playtests on your game</b>
                <span>Post a build and hear what other makers noticed while playing.</span>
              </div>
            </div>
            <div className={styles.rhythmItem}>
              <Icon name="star" size={28} />
              <div>
                <b>Build challenges</b>
                <span>Small, themed challenges that push you to finish something, like the Worst Game Ever Challenge.</span>
              </div>
            </div>
            <Button href="/community" track="home_community_join">
              Join the Free Community
            </Button>
          </div>
        </div>        <div style={{ marginTop: 28 }}>
          <MemberQuotes />
        </div>
      </Band>

      {/* 8. FAQ */}
      <Band tone="dusk" labelledBy="faq">
        <Faq items={faq} />
      </Band>

      {/* 9. Final CTA */}
      <Band tone="night" labelledBy="final">
        <div className="center" style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 id="final" className="display display--lg" style={{ marginBottom: 18 }}>
            Ready to build <em>your future in games?</em>
          </h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            Start small, make it playable and let other people try it.
          </p>
          <div className="cta-row cta-row--center">
            <Button href="/community" size="lg" track="home_final_join">
              Start Free in Skool
            </Button>
          </div>
          <p className={styles.finalRisk}>Free to join · No card needed · Leave anytime</p>
        </div>
      </Band>
    </>
  );
}
