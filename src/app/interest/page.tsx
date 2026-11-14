import { Band, FeatureCard, Ledge, SectionHead } from "@/components/blocks";
import { InterestForm } from "@/components/Forms";
import { Scene } from "@/components/Scene";
import { Video } from "@/components/Video";
import { integrations, videos } from "@/config/site";
import { pageMeta } from "@/lib/meta";
import styles from "../pages.module.css";

export const metadata = pageMeta(
  "AI Game Makers Updates | Join the Interest List",
  "Hear about new game-making lessons, mentorship availability and in-person workshops in Birmingham.",
  "/interest",
);

export default function Interest() {
  return (
    <>
      <Scene variant="interest" compact>
        <p>
          <span className="eyebrow">Interest list</span>
        </p>
        <h1 className={["display display--lg", styles.h1].join(" ")}>
          Hear about <em>what&apos;s next.</em>
        </h1>
        <p className={["lede on-sky", styles.heroCopy].join(" ")} style={{ marginLeft: "auto", marginRight: "auto" }}>
          Get updates when new lessons, mentorship availability or in-person workshops in Birmingham are announced.
        </p>
      </Scene>

      <Band tone="sunset" id="signup" labelledBy="signup-title">
        <div className={["card", styles.formCard].join(" ")}>
          <h2 id="signup-title" className="title-ink">
            Join the list
          </h2>
          <p>One email address, one tick box. Unsubscribe whenever you like.</p>
          <InterestForm endpoint={integrations.forms.endpoint} />
        </div>
      </Band>

      {videos.interest && (
        <Band tone="dusk" labelledBy="hello">
          <div className={styles.videoRow}>
            <Video videoId={videos.interest} title="A quick hello from Isabella" slot="interest_hello" />
            <div>
              <h2 id="hello" className="display display--md">
                A quick hello <em>from Isabella.</em>
              </h2>
              <p className="lede">
                I&apos;m always trying new ways to teach game making. Join the list if you want to hear about new lessons and upcoming
                opportunities.
              </p>
            </div>
          </div>
        </Band>
      )}

      <Band tone="dusk" labelledBy="expect">
        <SectionHead
          id="expect"
          title={
            <>
              What to <em>expect</em>
            </>
          }
          intro="Emails when there is a new lesson or announcement, with no fixed schedule."
        />
        <div className="grid grid--4">
          <FeatureCard icon="books" title="New learning resources">
            <p>New lessons, guides and workflows as they're published.</p>
          </FeatureCard>
          <FeatureCard icon="gamepad" title="Projects and experiments">
            <p>See what we built, what worked and what needed another try.</p>
          </FeatureCard>
          <FeatureCard icon="calendar" title="Mentorship availability">
            <p>When 1:1 mentorship places can be scheduled.</p>
          </FeatureCard>
          <FeatureCard icon="pin" title="Workshop announcements">
            <p>If an in-person session in Birmingham is confirmed.</p>
          </FeatureCard>
        </div>
      </Band>

      <Band tone="night" labelledBy="final">
        <div className={["card", styles.formCard].join(" ")}>
          <h2 id="final" className="title-ink">
            Get the next update.
          </h2>
          <InterestForm endpoint={integrations.forms.endpoint} />
        </div>
        <Ledge sprite="cat" side="left" />
      </Band>
    </>
  );
}
