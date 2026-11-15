import { Band, Faq, FeatureCard, Ledge, SceneCard, SectionHead } from "@/components/blocks";
import { Button } from "@/components/Button";
import { Scene } from "@/components/Scene";
import { pageMeta } from "@/lib/meta";
import styles from "../pages.module.css";

export const metadata = pageMeta(
  "Free AI Game Development Course | AI Game Makers",
  "Build practical AI game development skills and a playable project through free lessons for beginners.",
  "/free-course",
);

const faq = [
  {
    q: "Do I need to know how to code?",
    a: <p>No. You&apos;ll work with AI tools that write and explain code. The lessons help you understand what the code does and judge whether it works in your game.</p>,
  },
  {
    q: "Is the course really free?",
    a: <p>Yes. The free course lives inside the free AI Game Makers community on Skool. Joining the community costs nothing.</p>,
  },
  {
    q: "Which AI tools will I need?",
    a: (
      <p>
        The lessons show the tools used to build each example and explain what each one does. Some AI tools have free tiers and some are
        paid; each lesson says what it uses so you can decide before you start. You don't need to buy anything to join or to follow the
        lessons.
      </p>
    ),
  },
  {
    q: "What kind of computer do I need?",
    a: <p>A laptop or desktop computer with a modern web browser and an internet connection. A phone is fine for watching, but building is much easier on a computer.</p>,
  },
  {
    q: "How long does the course take?",
    a: <p>It's self-paced, so it depends on how much time you give it. You can work through the lessons whenever it suits you.</p>,
  },
  {
    q: "Where do the lessons live?",
    a: <p>In the Classroom of the AI Game Makers community on Skool. This website explains the course; the lessons themselves are on Skool.</p>,
  },
];

export default function FreeCourse() {
  return (
    <>
      <Scene variant="course" photo photoAlt="Isabella, who teaches the free course">
        <p>
          <span className="eyebrow">Free course</span>
        </p>
        <h1 className={["display display--xl", styles.h1].join(" ")}>
          Start building skills for your future in games. <em>For free.</em>
        </h1>
        <p className={["lede on-sky", styles.heroCopy].join(" ")}>
          Learn to guide AI tools and turn a small idea into a playable project you can share as you grow your skills.
        </p>
        <div className="cta-row">
          <Button href="/community" size="lg" track="course_hero_access">
            Access the Free Course
          </Button>
          <Button href="#curriculum" variant="secondary" size="lg">
            See What You'll Learn
          </Button>
        </div>
      </Scene>

      <Band tone="dusk" labelledBy="benefits">
        <SectionHead
          id="benefits"
          title={
            <>
              Learn by making <em>something real.</em>
            </>
          }
        />
        <div className="grid grid--4">
          <FeatureCard icon="chip" title="Learn the Tools">
            <p>Use Claude Code and Codex to build, test and fix one step at a time.</p>
          </FeatureCard>
          <FeatureCard icon="star" title="Create Game Assets">
            <p>Make characters and backgrounds that fit the game you want to make.</p>
          </FeatureCard>
          <FeatureCard icon="gamepad" title="Build Playable Mechanics">
            <p>Turn ideas into interactions and gameplay you can test.</p>
          </FeatureCard>
          <FeatureCard icon="calendar" title="Learn at Your Own Pace">
            <p>Follow the available lessons whenever it works for you.</p>
          </FeatureCard>
        </div>
      </Band>

      <Band tone="sunset" id="curriculum" labelledBy="curriculum-h">
        <SectionHead
          id="curriculum-h"
          title={
            <>
              Your first playable project <em>starts here.</em>
            </>
          }
          intro="Four levels, from a small idea to a build you can share."
        />
        <ol className={["grid grid--4", styles.levels].join(" ")}>
          <li>
            <SceneCard scene="scene-platformer" level="Level 01" title="The Idea" icon="bulb" label="The Last Ember, a game we made">
              Choose a small idea, decide what the player does and plan a first playable version.
            </SceneCard>
          </li>
          <li>
            <SceneCard scene="scene-cozy" level="Level 02" title="The Visuals" icon="star" label="Bomb Bomb Hell!, a game we made">
              Try AI-assisted ways to create sprites and backgrounds with a consistent look.
            </SceneCard>
          </li>
          <li>
            <SceneCard scene="scene-puzzle" level="Level 03" title="The Gameplay" icon="puzzle" label="The Illusionist, a game we are making">
              Build and test interactions, controls and core game systems.
            </SceneCard>
          </li>
          <li>
            <SceneCard scene="scene-horror" level="Level 04" title="The Playable Build" icon="rocket" label="HAPPY DAY, a game we released">
              Improve your prototype, test it and learn how to share your work.
            </SceneCard>
          </li>
        </ol>
        <p className={styles.smallNote}>Images are real frames from games we made. Lessons are added to the Skool Classroom over time.</p>
      </Band>

      <Band tone="night" labelledBy="philosophy">
        <div className={styles.quoteBlock}>
          <h2 id="philosophy" className="display display--md">
            You don&apos;t need to know everything <em>before you start.</em>
          </h2>
          <p className="lede">
            A small game gives you a reason to learn each skill. Build a mechanic, see how it plays and work out what needs changing.
          </p>
        </div>
        <Ledge sprite="ghost" side="right" />
      </Band>

      <Band tone="sunset" labelledBy="delivery">
        <div className={["card", styles.cta].join(" ")}>
          <h2 id="delivery" className="title-ink">
            Everything starts inside Skool.
          </h2>
          <p>
            The free course lives in the AI Game Makers community. Join once to access the available lessons, resources and
            discussions.
          </p>
          <Button href="/community" track="course_delivery_join">
            Join Free and Start Learning
          </Button>
        </div>
      </Band>

      <Band tone="dusk" labelledBy="faq">
        <Faq items={faq} />
      </Band>

      <Band tone="night" labelledBy="final">
        <div className="center stack" style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 id="final" className="display display--lg">
            Start building work <em>you can share.</em>
          </h2>
          <p className="lede">Take the first step towards a playable project and skills you can keep developing.</p>
          <div className="cta-row cta-row--center">
            <Button href="/community" size="lg" track="course_final_access">
              Access the Free Course
            </Button>
          </div>
        </div>
        <Ledge sprite="cat" side="left" />
      </Band>
    </>
  );
}
