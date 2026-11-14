"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import styles from "./Consent.module.css";

/**
 * Consent + analytics. Analytics only exists when a provider is configured,
 * and only loads after the visitor accepts. Rejecting is as easy as accepting.
 * Tracked events go through track(); with no consent or no provider it is a no-op.
 */

const KEY = "agm-consent-v1";
type Choice = "granted" | "denied" | null;

declare global {
  interface Window {
    plausible?: ((event: string, opts?: { props?: Record<string, string> }) => void) & { q?: unknown[] };
  }
}

function readChoice(): Choice {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}
function writeChoice(v: Exclude<Choice, null>) {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* storage blocked: the choice lasts for this page view only */
  }
  window.dispatchEvent(new CustomEvent("agm:consent", { detail: v }));
}

export function track(event: string, props?: Record<string, string>) {
  if (typeof window === "undefined") return;
  if (readChoice() !== "granted") return;
  window.plausible?.(event, props ? { props } : undefined);
}

export function Consent({ provider, domain }: { provider: "plausible" | null; domain: string }) {
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChoice(readChoice());
    setReady(true);
    const onChange = (e: Event) => setChoice((e as CustomEvent<Choice>).detail);
    const onOpen = () => setChoice(null);
    window.addEventListener("agm:consent", onChange);
    window.addEventListener("agm:open-consent", onOpen);
    return () => {
      window.removeEventListener("agm:consent", onChange);
      window.removeEventListener("agm:open-consent", onOpen);
    };
  }, []);

  // one listener for every element carrying data-track
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      const name = el?.dataset.track;
      if (name) track(name, { path: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const decide = useCallback((v: "granted" | "denied") => {
    writeChoice(v);
    setChoice(v);
  }, []);

  if (!provider) return null;

  return (
    <>
      {choice === "granted" && provider === "plausible" && (
        <>
          <Script id="plausible-queue" strategy="afterInteractive">
            {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
          </Script>
          <Script src="https://plausible.io/js/script.tagged-events.js" data-domain={domain} strategy="afterInteractive" />
        </>
      )}
      {ready && choice === null && (
        <div className={styles.banner} role="region" aria-label="Cookie choices">
          <p>
            We'd like to count visits with privacy-friendly analytics to see which pages help people. Nothing loads unless you
            say yes. <Link href="/cookies">Cookie details</Link>
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.btn} onClick={() => decide("denied")}>
              Reject
            </button>
            <button type="button" className={styles.btn} onClick={() => decide("granted")}>
              Accept analytics
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function CookieSettingsLink() {
  return (
    <Link href="/cookies#settings" prefetch={false}>
      Cookie settings
    </Link>
  );
}

/** Used on /cookies to show and change the current choice. */
export function ConsentControls({ enabled }: { enabled: boolean }) {
  const [choice, setChoice] = useState<Choice>(null);
  useEffect(() => {
    setChoice(readChoice());
    const onChange = (e: Event) => setChoice((e as CustomEvent<Choice>).detail);
    window.addEventListener("agm:consent", onChange);
    return () => window.removeEventListener("agm:consent", onChange);
  }, []);

  if (!enabled) {
    return (
      <p className={styles.state}>
        This site currently sets <strong>no optional cookies</strong> and runs no analytics, so there is nothing to switch
        off.
      </p>
    );
  }
  return (
    <div className={styles.controls}>
      <p className={styles.state} aria-live="polite">
        Analytics is currently <strong>{choice === "granted" ? "on" : choice === "denied" ? "off" : "not chosen yet (off)"}</strong>.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.btnDark} onClick={() => writeChoice("denied")} aria-pressed={choice === "denied"}>
          Turn analytics off
        </button>
        <button type="button" className={styles.btnDark} onClick={() => writeChoice("granted")} aria-pressed={choice === "granted"}>
          Allow analytics
        </button>
      </div>
    </div>
  );
}
