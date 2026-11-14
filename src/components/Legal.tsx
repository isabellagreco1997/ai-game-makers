import type { ReactNode } from "react";
import { legal, links } from "@/config/site";
import { Band } from "./blocks";
import { Scene } from "./Scene";
import styles from "../app/pages.module.css";

/** Shell for the legal pages, with an honest notice while identity details are missing. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <Scene variant="small" compact>
        <h1 className="display display--lg">{title}</h1>
      </Scene>
      <Band tone="cream" pines={false} className={styles.legalBand}>
        <article className={styles.legal}>
          {!legal.complete && (
            <div className={styles.pendingBox} role="note">
              <strong>This page is being finalised.</strong> Some details (who runs the site and how to contact us) are still being
              confirmed and will be added before launch.
            </div>
          )}
          <p className={styles.updated}>Last updated: {updated}</p>
          {children}
        </article>
      </Band>
    </>
  );
}

export function Controller() {
  if (!legal.complete) return <>the operator of AI Game Makers (details to be confirmed)</>;
  return (
    <>
      {legal.controllerName}, {legal.controllerLocation} (contact: <a href={`mailto:${links.contactEmail}`}>{links.contactEmail}</a>)
    </>
  );
}

export function ContactLine() {
  if (!links.contactEmail) return <>the contact address that will be published here before launch</>;
  return <a href={`mailto:${links.contactEmail}`}>{links.contactEmail}</a>;
}
