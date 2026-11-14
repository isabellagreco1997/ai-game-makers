import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Scene } from "@/components/Scene";
import styles from "./pages.module.css";

export const metadata: Metadata = {
  title: "Level not found | AI Game Makers",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Scene variant="small">
      <div className={styles.lost}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 className="display display--lg" style={{ marginBottom: 18 }}>
          Level <em>not found.</em>
        </h1>
        <p className="plate" style={{ marginBottom: 28 }}>
          This page doesn&apos;t seem to exist. Head back to the homepage.
        </p>
        <div className="cta-row cta-row--center">
          <Button href="/" size="lg">
            Back to the Homepage
          </Button>
        </div>
      </div>
    </Scene>
  );
}
