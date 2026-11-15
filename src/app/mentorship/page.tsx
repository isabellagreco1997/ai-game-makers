import Link from "next/link";
import { Band, Faq, FeatureCard, Ledge, PriceTag, SceneCard, SectionHead } from "@/components/blocks";
import { Button, ExternalCta } from "@/components/Button";
import { Scene } from "@/components/Scene";
import { PixelIcon } from "@/components/Sprite";
import { Video } from "@/components/Video";
import { links, mentorship, videos } from "@/config/site";
import { TEACH } from "@/content/teach";
import { pageMeta } from "@/lib/meta";
import styles from "../pages.module.css";

export const metadata = pageMeta(
  "1:1 AI Game Development Mentorship | $299/month | AI Game Makers",
  "Build games with Claude Code and Codex in four private sessions per month for $299. Cancel anytime.",
  "/mentorship",
);

const PENDING = "The Skool checkout isn't connected yet. Join the interest list to hear when it opens.";

export default function Mentorship() {
  const ask = links.contactEmail ? `mailto:${links.contactEmail}?subject=${encodeURIComponent("Question about the mentorship")}` : "";

  const faq = [
    { q: "How much does mentorship cost?", a: <p>{mentorship.price} USD per month. The subscription renews automatically and you can cancel anytime.</p> },
    {
      q: "How many calls are included?",
      a: <p>Each monthly payment includes four private 45-minute 1:1 sessions. Book them within that billing month; unused sessions do not roll over.</p>,
    },
    { q: "Can a complete beginner join?", a: <p>Yes. We&apos;ll start from what you know and work out a small, manageable scope together.</p> },
    {
      q: "What kind of game can I make?",
      a: <p>Most small 2D games work well: platformers, puzzle games, short story or horror adventures and simple simulations. We&apos;ll work out a manageable scope together.</p>,
    },
    {
      q: "Will you code my game for me?",
      a: <p>No. You build the game and make the creative decisions. I teach, review your work and help you get unstuck so you can keep making games afterwards.</p>,
    },
    { q: "Is publishing guaranteed?", a: <p>No. You'll get guidance on preparing and sharing a playable build, but no one can honestly guarantee a release or its results.</p> },
    { q: "Will this guarantee a job or income?", a: <p>No. The mentorship focuses on building your game and developing your skills. Employment, freelance work and earnings depend on your experience, location and opportunities.</p> },
    {
      q: "Which AI subscriptions will I need?",
      a: <p>That depends on your project. We'll look at it together in the first call, including free options, before you spend anything on tools. Tool costs are separate from the mentorship fee.</p>,
    },
    {
      q: "How long can I continue?",
      a: <p>You can continue for as many months as you need and cancel anytime. You can also remain in the free community.</p>,
    },
    { q: "How do I get started?", a: <p>Visit the community&apos;s About page on Skool and book a free introductory call to discuss your project before joining the mentorship.</p> },
    {
      q: "What is the refund and cancellation policy?",
      a: (
        <p>
          You can cancel anytime. If you&apos;re not happy with what we created together, I will refund you completely, no questions asked. See the <Link href="/terms">terms</Link> for more information.
        </p>
      ),
    },
  ];

  return (
    <>
      <Scene variant="mentorship" photo photoAlt="Isabella, who leads the 1:1 mentorship">
        <p>
          <span className="eyebrow">{mentorship.name}</span>
        </p>
        <h1 className={["display display--lg", styles.h1].join(" ")}>
          Build a game. <em>Grow the skills behind it.</em>
        </h1>
        <p className={["lede on-sky", styles.heroCopy].join(" ")}>{mentorship.summary}</p>
        <div className={styles.priceHero}>
          <PriceTag big>
            {mentorship.price} <small>USD per month · cancel anytime</small>
          </PriceTag>
        </div>
        <p className={styles.priceLine}>Personal guidance, focused feedback and a clear development plan.</p>
        <div className="cta-row">
          <ExternalCta href={links.skoolMentorship} pendingNote={PENDING} size="lg" track="mentorship_purchase_click">
            Get Mentorship in Skool
          </ExternalCta>
          <Button href="#included" variant="secondary" size="lg">
            See What's Included
          </Button>
        </div>
        {ask && (
          <p className={["on-sky", styles.reassure].join(" ")}>
            Not sure yet? <a href={ask}>Ask a question</a> before you buy.
          </p>
        )}
      </Scene>

      {videos.mentorship && (
<Band tone="dusk" labelledBy="sales-video">
        <div className={styles.videoRow}>
          <Video videoId={videos.mentorship} title="How the mentorship works" slot="mentorship_explainer" />
          <div>
            <h2 id="sales-video" className="display display--md">
              Here&apos;s how I can <em>guide your game.</em>
            </h2>
            <p className="lede">
              Bring the game you want to make. We&apos;ll use the calls and reviews to work through decisions, problems and your next steps.
            </p>
          </div>
        </div>
      </Band>
      )}

      <Band tone="sunset" id="included" labelledBy="features">
        <SectionHead
          id="features"
          title={
            <>
              Real guidance for <em>a real project.</em>
            </>
          }
        />
        <div className="grid grid--3">
          <FeatureCard icon="map" title="Personal Game Plan">
            <p>We&apos;ll work out a manageable scope and a development roadmap for your project.</p>
          </FeatureCard>
          <FeatureCard icon="calendar" title="Private Sessions">
            <p>Work on your game with my guidance in four private 45-minute sessions each billing month.</p>
          </FeatureCard>
          <FeatureCard icon="chat" title="Project Feedback">
            <p>Get personalised project reviews and feedback during your mentoring.</p>
          </FeatureCard>
          <FeatureCard icon="chip" title="AI Development Workflows">
            <p>Build and debug with Claude Code and Codex while developing practical AI skills.</p>
          </FeatureCard>
          <FeatureCard icon="rocket" title="Publishing Direction">
            <p>Understand the next steps for preparing and sharing a playable game.</p>
          </FeatureCard>
        </div>
      </Band>

      <Band tone="night" id="beyond-code" labelledBy="teach">
        <SectionHead
          id="teach"
          eyebrow="Beyond the code"
          title={
            <>
              Make a game people <em>want to play.</em>
            </>
          }
          intro="A working prototype is only the beginning. In calls and written reviews, you&apos;ll learn to make choices about design, visuals, story and marketing that fit your game."
        />
        <div className={styles.teach}>
          {TEACH.map((g) => (
            <article key={g.n} className={["card", styles.teachCard].join(" ")}>
              <div className={styles.teachTop}>
                <span className={styles.teachNum} aria-hidden="true">
                  {g.n}
                </span>
                <PixelIcon name={g.icon} size="md" />
              </div>
              <h3 className="title-ink">{g.title}</h3>
              <p className={styles.teachPromise}>{g.promise}</p>
              <ul className={styles.teachList}>
                {g.items.map(([term, text]) => (
                  <li key={term}>
                    <b>{term}</b>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className={styles.teachClose}>Learn to explain your choices, build a portfolio and show your work for future opportunities.</p>
      </Band>

      <Band tone="dusk" labelledBy="package">
        <div className={["card", styles.package].join(" ")}>
          <div>
            <p>
              <span className="eyebrow">What&apos;s included</span>
            </p>
            <h2 id="package" className="title-ink">
              {mentorship.name}
            </h2>
            <p className={styles.packTagline}>{mentorship.tagline}</p>
            <p className={styles.packSummary}>{mentorship.summary}</p>
            <ul className={["check-list", styles.packList].join(" ")}>
              {mentorship.package.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className={styles.packFoot}>Monthly 1:1 Mentorship | Cancel anytime</p>
            {links.conceptCall && (
              <div className={styles.callBox}>
                <h3 className="title-ink">Talk through your game idea</h3>
                <p>
                  Tell me about the game you want to make on a free 30-minute call. We can see whether mentoring is right for both of us,
                  with no obligation.
                </p>
                <Button href={links.conceptCall} variant="secondary" track="mentorship_concept_call">
                  Book a free call
                </Button>
              </div>
            )}
          </div>
          <div>
            <h3 className="title-ink">What each offer includes</h3>
            <ul className={styles.entitlements}>
              <li>
                <strong>The free community</strong>: lessons, resources and discussions on Skool. Free, and yours to keep using.
              </li>
              <li>
                <strong>Course materials</strong>: the lessons in the Skool Classroom, available to community members.
              </li>
              <li>
                <strong>The personal mentorship</strong>: four private 45-minute sessions per billing month, reviews and feedback on your own game for {mentorship.price} per month. Cancel anytime.
              </li>
            </ul>
            <h3 className="title-ink">What it isn't</h3>
            <ul className={styles.entitlements}>
              <li>Not unlimited access or instant replies.</li>
              <li>Not me writing your game for you.</li>
              <li>Not a guaranteed commercial release.</li>
            </ul>
          </div>
        </div>
      </Band>

      <Band tone="sunset" labelledBy="roadmap">
        <SectionHead
          id="roadmap"
          title={
            <>
              Your personalised <em>development journey.</em>
            </>
          }
        />
        <ol className={["grid grid--3", styles.roadmap].join(" ")}>
          <li>
            <SceneCard scene="scene-mobile" level="01" title="Plan & Prototype" icon="map" label="Midnight Cat, a game we made">
              Clarify the concept, prioritise the core mechanic and start a playable prototype.
            </SceneCard>
          </li>
          <li>
            <SceneCard scene="scene-rhythm" level="02" title="Build & Improve" icon="gamepad" label="HELLPOP MAYHEM, a game we made">
              Develop the game, review its feel and work through technical and creative challenges.
            </SceneCard>
          </li>
          <li>
            <SceneCard scene="scene-horror" level="03" title="Refine & Prepare to Share" icon="rocket" label="HAPPY DAY, a game we released">
              Polish, test and plan the next steps towards release.
            </SceneCard>
          </li>
        </ol>
      </Band>

      <Band tone="dusk" labelledBy="who">
        <SectionHead
          id="who"
          title={
            <>
              You have the idea. <em>Let&apos;s plan the work.</em>
            </>
          }
        />
        <div className="grid grid--4">
          {[
            ["bulb", "First-time game creators", "You've never finished a game and want a clear path to your first one."],
            ["chip", "AI prototypes that never finish", "You've generated plenty of starts. Now you want one that ends."],
            ["star", "Hobbyists with unfinished ideas", "You've been carrying an idea around for a while and want to see it playable."],
            ["gamepad", "Aspiring indie developers", "You want honest, specific feedback on your game from someone who makes them."],
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

      <Band tone="night" labelledBy="evidence">
        <div className={styles.values}>
          <h2 id="evidence" className="display display--md">
            See the games <em>I make.</em>
          </h2>
          <p className="lede">
            The best evidence of how I work is my own work: released games, games in development and the experiments behind them.
          </p>
          <div className="cta-row cta-row--center">
            <Button href="/games" variant="secondary">
              Our Games
            </Button>
          </div>
        </div>
      </Band>

      <Band tone="sunset" labelledBy="pricing">
        <div className={["card", styles.pricing].join(" ")}>
          <PriceTag big>
            {mentorship.price} <small>USD per month · cancel anytime</small>
          </PriceTag>
          <h2 id="pricing" className="title-ink">
            Four private sessions. Your game. Your pace.
          </h2>
          <p>{mentorship.price} USD per month, automatically renewed. Cancel anytime and continue for as many months as you need.</p>
          <p>
            Each payment includes four private 45-minute sessions to book within that billing month. Unused sessions do not roll over. Booking is subject to available call times.
          </p>
          <p><strong>My promise:</strong> If you&apos;re not happy with what we created together, I will refund you completely, no questions asked.</p>
          <div className={styles.ctaWrap}>
            <ExternalCta href={links.skoolMentorship} pendingNote={PENDING} size="lg" track="mentorship_purchase_click">
              Purchase Through Skool
            </ExternalCta>
          </div>
        </div>
      </Band>

      <Band tone="dusk" labelledBy="faq">
        <Faq items={faq} />
      </Band>

      <Band tone="night" labelledBy="final">
        <div className="center stack" style={{ maxWidth: 820, margin: "0 auto" }}>
          <h2 id="final" className="display display--lg">
            Build something you&apos;re proud <em>to share.</em>
          </h2>
          <p className="lede">Choose a small scope, work through the hard parts and develop a playable project with personal feedback.</p>
          <div className="cta-row cta-row--center">
            <ExternalCta href={links.skoolMentorship} pendingNote={PENDING} size="lg" track="mentorship_purchase_click">
              Start Your Mentorship: {mentorship.price}/month
            </ExternalCta>
          </div>
          {!links.skoolMentorship && (
            <p>
              <Link href="/interest">Join the interest list</Link> to hear when mentorship opens.
            </p>
          )}
        </div>
        <Ledge sprite="ninja" side="right" flip />
      </Band>
    </>
  );
}
