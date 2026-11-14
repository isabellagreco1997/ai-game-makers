import { asset } from "@/lib/asset";
import { Band, Faq, FeatureCard, Ledge, SectionHead, StepCard } from "@/components/blocks";
import { ExternalCta } from "@/components/Button";
import { MemberQuotes } from "@/components/Proof";
import { Scene } from "@/components/Scene";
import { PixelIcon } from "@/components/Sprite";
import { Video } from "@/components/Video";
import { links, videos } from "@/config/site";
import { pageMeta } from "@/lib/meta";
import styles from "../pages.module.css";

export const metadata = pageMeta(
  "Join the Free AI Game Makers Community on Skool",
  "Join a free community to learn AI game making, share your first playable builds and get feedback from other makers.",
  "/community",
);

const PENDING = "The Skool link isn't set yet. Check back soon.";

const faq = [
  { q: "Is it free?", a: <p>Yes. Joining the AI Game Makers community on Skool is free.</p> },
  {
    q: "Do I need to know how to code?",
    a: <p>No. The lessons start with the basics and don&apos;t assume a programming background. You make the decisions while learning to use AI tools.</p>,
  },
  {
    q: "Do the AI tools cost money?",
    a: (
      <p>
        Some do and some don't. Many AI tools have free tiers; others are paid subscriptions. Lessons say which tools they use so you can
        choose before you start. Joining the community itself costs nothing.
      </p>
    ),
  },
  { q: "Can I share the games I make?", a: <p>Yes. Share an early build, ask people to play it and use their feedback as you improve it.</p> },
  { q: "Is it beginner-friendly?", a: <p>Yes. If you have an idea and don't know where to start, you're exactly who it was made for.</p> },
  { q: "Is it a Discord server?", a: <p>No. The community, lessons and discussions are all on Skool, a platform built for courses and communities. You can use it in a browser or the Skool app.</p> },
  { q: "Where are the lessons?", a: <p>In the Classroom tab inside the community on Skool.</p> },
];

export default function Community() {
  return (
    <>
      <Scene variant="community" photo photoAlt="Isabella, who runs the AI Game Makers community">
        <span className="eyebrow">Free community + practical game development</span>
        <h1 className="display display--lg">
          Build games with AI. <em>You don&apos;t have to do it alone.</em>
        </h1>
        <p className="on-sky">Bring your first game idea to a free community of people learning to make games with AI.</p>
        <ul className={["check-list", styles.heroList].join(" ")}>
          <li>Practical lessons, from first idea to playable game</li>
          <li>Somewhere to share what you're building and get feedback</li>
          <li>Tools and workflows to help when a project gets stuck</li>
        </ul>
        <div className="cta-row">
          <ExternalCta href={links.skoolCommunity} pendingNote={PENDING} size="lg" track="community_join_click">
            Join the Free Skool Community
          </ExternalCta>
        </div>
        <p className="risk">
          <span>Free to join</span>
          <span>No card needed</span>
          <span>Lessons and discussions hosted on Skool</span>
        </p>
      </Scene>

      <Band tone="dusk" labelledBy="inside-video">
        {videos.community ? (
          <div className={styles.videoRow}>
            <Video videoId={videos.community} title="A look inside the AI Game Makers community" slot="community_tour" />
            <div>
              <h2 id="inside-video" className="display display--md">
                Take a look <em>inside.</em>
              </h2>
              <p className="lede">
                “I created this community for people who want to do more than experiment with AI. I want you to build things, learn from
                the process and have somewhere to share your progress.”
              </p>
              <p>Isabella, founder</p>
            </div>
          </div>
        ) : (
          <figure className={styles.quote}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/founder/isabella-480.webp")} alt="" width={480} height={600} loading="lazy" />
            <div>
              <h2 id="inside-video" className="sr-only">
                Why this community exists
              </h2>
              <blockquote>
                “I created this community for people who want to do more than experiment with AI. I want you to build things, learn from
                the process and have somewhere to share your progress.”
              </blockquote>
              <figcaption>
                <b>Isabella</b> Founder, software engineer and indie game maker
              </figcaption>
            </div>
          </figure>
        )}
      </Band>
      <Band tone="sunset" labelledBy="whats-inside">
        <SectionHead
          id="whats-inside"
          title={
            <>
              What's <em>inside?</em>
            </>
          }
        />
        <div className="grid grid--4">
          <FeatureCard icon="books" title="Free Lessons">
            <p>Start with a small idea and learn how to make it playable.</p>
          </FeatureCard>
          <FeatureCard icon="chip" title="Game Development Resources">
            <p>Find tools and workflows you can try in your own project.</p>
          </FeatureCard>
          <FeatureCard icon="rocket" title="Share Your Progress">
            <p>Post your projects, experiments and playable builds.</p>
          </FeatureCard>
          <FeatureCard icon="people" title="Learn With Other Makers">
            <p>Ask questions, exchange ideas and learn from other members.</p>
          </FeatureCard>
        </div>
      </Band>

      <Band tone="dusk" labelledBy="members-say">
        <SectionHead
          id="members-say"
          eyebrow="From inside the club"
          title={
            <>
              What members <em>say.</em>
            </>
          }
        />
        <MemberQuotes />
      </Band>

      <Band tone="cream" labelledBy="audience">
        <SectionHead
          id="audience"
          title={
            <>
              Made for people who <em>want to finish.</em>
            </>
          }
        />
        <div className="grid grid--2">
          {[
            ["bulb", "Complete Beginners", "You have an idea but don't know where to start."],
            ["star", "Creative Experimenters", "You have tried AI tools and want to make a game you can play."],
            ["gamepad", "Aspiring Game Developers", "You want a practical way to build and improve your first game."],
            ["people", "Builders Who Need Community", "You enjoy sharing progress and learning alongside others."],
          ].map(([icon, t, d]) => (
            <div key={t} className={["card", styles.audience].join(" ")}>
              <PixelIcon name={icon} size="md" />
              <div>
                <h3 className="title-ink">{t}</h3>
                <p>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </Band>

      <Band tone="sunset" labelledBy="steps">
        <SectionHead
          id="steps"
          title={
            <>
              Three steps to <em>get started.</em>
            </>
          }
        />
        <ol className={["grid grid--3", styles.stepsList].join(" ")}>
          <StepCard n="01" title="Join" icon="people">
            Open the free AI Game Makers community on Skool.
          </StepCard>
          <StepCard n="02" title="Explore" icon="books">
            Visit the Classroom and choose where to begin.
          </StepCard>
          <StepCard n="03" title="Build" icon="gamepad">
            Start a small project and share what you're making.
          </StepCard>
        </ol>
      </Band>

      <Band tone="night" labelledBy="values">
        <div className={styles.values}>
          <h2 id="values" className="display display--md">
            A community <em>of makers.</em>
          </h2>
          <p className="lede">Share what you are making, give thoughtful feedback and learn from the games other members build.</p>
        </div>
      </Band>

      <Band tone="dusk" labelledBy="faq">
        <Faq items={faq} />
      </Band>

      <Band tone="night" labelledBy="final">
        <div className="center stack" style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 id="final" className="display display--lg">
            Stop waiting for the perfect idea. <em>Start building.</em>
          </h2>
          <p className="lede">Join for free, choose a lesson and take one small step towards a playable game.</p>
          <div className="cta-row cta-row--center">
            <ExternalCta href={links.skoolCommunity} pendingNote={PENDING} size="lg" track="community_join_click">
              Join Free on Skool
            </ExternalCta>
          </div>
        </div>
        <Ledge sprite="ninja" side="left" />
        <Ledge sprite="cat" side="right" flip />
      </Band>
    </>
  );
}
