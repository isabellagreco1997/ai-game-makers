import { Button } from "@/components/Button";
import { Scene } from "@/components/Scene";
import { pageMeta } from "@/lib/meta";
import styles from "../pages.module.css";

export const metadata = pageMeta(
  "You're on the list | AI Game Makers",
  "Thanks for joining the AI Game Makers interest list.",
  "/thank-you",
  { noindex: true },
);

export default function ThankYou() {
  return (
    <Scene variant="small">
      <h1 className={["display display--xl", styles.h1].join(" ")}>
        You're on <em>the list.</em>
      </h1>
      <p className={["plate", styles.heroCopy].join(" ")}>
        Thanks for joining the AI Game Makers interest list. We&apos;ll email you when there is an update.
      </p>
      <div className="cta-row cta-row--center">
        <Button href="/community" size="lg" track="thankyou_join">
          Explore the Free Community
        </Button>
      </div>
    </Scene>
  );
}
