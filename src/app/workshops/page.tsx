import { Band, FeatureCard, SectionHead } from "@/components/blocks";
import { ExternalCta } from "@/components/Button";
import { WorkshopForm } from "@/components/Forms";
import { Scene } from "@/components/Scene";
import { integrations, links } from "@/config/site";
import { pageMeta } from "@/lib/meta";
import styles from "../pages.module.css";

export const metadata = pageMeta(
  "Live AI Game Development Workshops Every Sunday | AI Game Makers Club",
  "Join a different live game-making workshop every Sunday. Build along with AI tools and ask questions as you go. Birmingham sessions are on the way.",
  "/workshops",
);

const PENDING = "The Skool link isn't set yet. Check back soon.";

export default function Workshops() {
  return (
    <>
      <Scene variant="workshops" compact>
        <span className="eyebrow">Live every Sunday</span>
        <h1 className="display display--lg">
          Learn practical game development skills <em>live every Sunday.</em>
        </h1>
        <p className="on-sky">
          Every Sunday I run a different live workshop inside the AI Game Makers Club. Build a small piece of a game with me and ask
          questions when you get stuck.
        </p>
        <div className="cta-row cta-row--center">
          <ExternalCta href={links.skoolCommunity} pendingNote={PENDING} size="lg" track="workshops_join">
            Join the Club to Attend
          </ExternalCta>
        </div>
        <p className="risk" style={{ justifyContent: "center" }}>
          <span>Live, online</span>
          <span>A new topic each week</span>
          <span>Dates in the club calendar</span>
        </p>
      </Scene>

      <Band tone="dusk" labelledBy="how">
        <SectionHead
          id="how"
          eyebrow="How it works"
          title={
            <>
              Build along, <em>live.</em>
            </>
          }
          intro="Each Sunday has its own theme, from a first playable game to pixel art, game feel and publishing."
        />
        <div className="grid grid--4">
          <FeatureCard icon="calendar" title="Every Sunday">
            <p>Find the weekly session in the club calendar and plan around your day job.</p>
          </FeatureCard>
          <FeatureCard icon="gamepad" title="Build something real">
            <p>Build one small, working piece of a game using Claude Code and Codex.</p>
          </FeatureCard>
          <FeatureCard icon="chat" title="Ask as you go">
            <p>Stuck on a step or a bug? Ask live and work through it with guidance.</p>
          </FeatureCard>
          <FeatureCard icon="share" title="Leave with progress">
            <p>Work towards something you can play and keep improving afterwards.</p>
          </FeatureCard>
        </div>
      </Band>

      <Band tone="cream" id="birmingham" labelledBy="form-title">
        <div className={["card", styles.formCard].join(" ")}>
          <span className="eyebrow">In person · Birmingham, England</span>
          <h2 id="form-title" className="title-ink" style={{ marginTop: 12 }}>
            Join us in the room.
          </h2>
          <p>
            In-person workshops in Birmingham are on the way. Leave your details and we&apos;ll email you as soon as a date is set.
          </p>
          <WorkshopForm endpoint={integrations.forms.endpoint} />
        </div>
      </Band>

      <Band tone="night" labelledBy="note">
        <div className={styles.values}>
          <h2 id="note" className="display display--sm">
            For parents and guardians
          </h2>
          <p>
            Sessions for young people only run with an age-appropriate safeguarding policy in place. The online club on Skool isn&apos;t
            designed for children.
          </p>
        </div>
      </Band>
    </>
  );
}
