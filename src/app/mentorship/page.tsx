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
  "Get 12 weekly one-to-one calls over three months for $299 USD per month as you build your own game with AI.",
  "/mentorship",
);

const PENDING = "The Skool checkout isn't connected yet. Join the interest list to hear when it opens.";

export default function Mentorship() {
  const ask = links.contactEmail ? `mailto:${links.contactEmail}?subject=${encodeURIComponent("Question about the mentorship")}` : "";

  const faq = [
    { q: "What is the total price?", a: <p>{mentorship.price} USD per month for three months. That is {mentorship.total} USD in total.</p> },
    { q: "Is it paid monthly?", a: <p>Yes. You pay {mentorship.price} USD each month through Skool for three months.</p> },
    {
      q: "How many calls are included?",
      a: mentorship.approved ? (
        <p>One 45-minute one-to-one call every week for 12 weeks, 12 calls in total. You work on your own game live while I guide you.</p>
      ) : (
        <p>The planned package is one 45-minute one-to-one call every week for 12 weeks, 12 calls in total. You work on your own game live while I guide you. The package will be confirmed on Skool before you pay.</p>
      ),
    },
    { q: "Can a complete beginner join?", a: <p>Yes. We&apos;ll start from what you know and work out a small, manageable scope together.</p> },
    {
      q: "What kind of game can I make?",
      a: <p>Most small 2D games work well: platformers, puzzle games, short story or horror adventures and simple simulations. We&apos;ll work out a scope that fits 12 weeks in the first call.</p>,
    },
    {
      q: "Will you code my game for me?",
      a: <p>No. You build the game and make the creative decisions. I teach, review your work and help you get unstuck so you can keep making games afterwards.</p>,
    },
    { q: "Is publishing guaranteed?", a: <p>No. You'll get guidance on preparing and sharing a playable build, but no one can honestly guarantee a release or its results.</p> },
    {
      q: "Which AI subscriptions will I need?",
      a: <p>That depends on your project. We'll look at it together in the first call, including free options, before you spend anything on tools. Tool costs are separate from the mentorship fee.</p>,
    },
    {
      q: "What happens after 12 weeks?",
      a: <p>After 12 weeks, our personal mentorship ends. You keep your roadmap and everything you built, and you can stay in the free community for as long as you like. If we both want to keep working together, you can continue with monthly mentoring on Skool. If your project clearly needs longer, raise it on our free concept call.</p>,
    },
    { q: "How is payment processed?", a: <p>The button opens the AI Game Makers Club&apos;s About page on Skool. Join the free community first, then upgrade to Premium on its plans page. Skool handles the monthly payment. I recommend booking a free 30-minute concept call before you pay.</p> },
    {
      q: "What is the refund and cancellation policy?",
      a: (
        <p>
          If you&apos;re not happy with what we created together, I will refund you completely, no questions asked. How to cancel the monthly
          payment and the full terms are still being finalised. They will be shown in the <Link href="/terms">terms</Link> and on Skool before
          anyone can buy.
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
          Let&apos;s turn your game idea into <em>something playable.</em>
        </h1>
        <p className={["lede on-sky", styles.heroCopy].join(" ")}>{mentorship.summary}</p>
        <div className={styles.priceHero}>
          <PriceTag big>
            {mentorship.price} <small>USD per month for three months</small>
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
          <Video videoId={videos.mentorship} title="How the 12-week mentorship works" slot="mentorship_explainer" />
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
            <p>Work on your own game with my guidance in a 45-minute call every week.</p>
          </FeatureCard>
          <FeatureCard icon="chat" title="Project Feedback">
            <p>Message me on Skool between calls for feedback. Replies are not instant; reply times will be confirmed before you pay.</p>
          </FeatureCard>
          <FeatureCard icon="chip" title="AI Development Workflows">
            <p>Learn to use AI tools more effectively while building.</p>
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
        <p className={styles.teachClose}>Learn to explain your choices, show your work and ask players for useful feedback.</p>
      </Band>

      <Band tone="dusk" labelledBy="package">
        <div className={["card", styles.package].join(" ")}>
          <div>
            <p>
              <span className="eyebrow">{mentorship.approved ? "What's in the package" : "The planned package"}</span>
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
            <p className={styles.packFoot}>12 Weeks | 1:1 Mentorship</p>
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
            {!mentorship.approved && (
              <p className={["notice", styles.draft].join(" ")}>
                These deliverables are being finalised. The confirmed package, start date and terms will be shown on Skool before you
                pay.
              </p>
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
                <strong>The personal mentorship</strong>: 12 weekly 1:1 calls, reviews and feedback on your own game. Your {mentorship.price}{" "}
                monthly payments cover three months of mentorship, {mentorship.total} in total.
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
              Your 12-week <em>development journey.</em>
            </>
          }
        />
        <ol className={["grid grid--3", styles.roadmap].join(" ")}>
          <li>
            <SceneCard scene="scene-mobile" level="Weeks 1–4" title="Plan & Prototype" icon="map" label="Midnight Cat, a game we made">
              Clarify the concept, prioritise the core mechanic and start a playable prototype.
            </SceneCard>
          </li>
          <li>
            <SceneCard scene="scene-rhythm" level="Weeks 5–8" title="Build & Improve" icon="gamepad" label="HELLPOP MAYHEM, a game we made">
              Develop the game, review its feel and work through technical and creative challenges.
            </SceneCard>
          </li>
          <li>
            <SceneCard scene="scene-horror" level="Weeks 9–12" title="Refine & Prepare to Share" icon="rocket" label="HAPPY DAY, a game we released">
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
            {mentorship.price} <small>USD per month for three months</small>
          </PriceTag>
          <h2 id="pricing" className="title-ink">
            One project. Twelve weekly calls. Your decisions.
          </h2>
          <p>{mentorship.price} USD per month for three months, paid monthly through Skool. {mentorship.total} USD in total.</p>
          <p>
            Your 12 weeks begin from your first weekly call, booked after purchase according to the onboarding terms shown on Skool. Enrolment
            is rolling and 1:1, subject to available call times.
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
            Your game deserves more than <em>an unfinished folder.</em>
          </h2>
          <p className="lede">Choose a small scope, work through the hard parts and get specific feedback on your game.</p>
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
