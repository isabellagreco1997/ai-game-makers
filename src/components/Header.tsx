"use client";
import { asset } from "@/lib/asset";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

import { NAV } from "@/config/nav";

function Logo({ name }: { name: string }) {
  return (
    <Link href="/" className={styles.logo} aria-label={`${name}, home`}>
      {/* her real community logo (icon + wordmark), not a recreation */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/brand/logo.png")}
        srcSet={`${asset("/brand/logo.png")} 1x, ${asset("/brand/logo@2x.png")} 2x`}
        alt=""
        width={433}
        height={120}
        className={styles.logoImg}
      />
    </Link>
  );
}
export function Header({
  brand,
  skoolUrl,
}: {
  brand: string;
  skoolUrl?: string;
}) {
  // trailingSlash export gives "/community/": compare without it
  const pathname = (usePathname() || "/").replace(/(.)\/$/, "$1");
  /** /community is a single-goal landing page: logo plus one join action */
  const minimal = pathname === "/community";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const first = panelRef.current?.querySelector<HTMLElement>("a");
    first?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (minimal) {
    return (
      <header className={[styles.header, scrolled ? styles.scrolled : ""].join(" ")}>
        <div className={styles.bar}>
          <Logo name={brand} />
          <div className={styles.right}>
            <Link href="/" className={styles.back}>
              Home
            </Link>
            {skoolUrl && (
              <a className={styles.join} href={skoolUrl} target="_blank" rel="noopener noreferrer" data-track="community_join_click">
                Join Free on Skool<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={[styles.header, scrolled ? styles.scrolled : ""].join(" ")}>
      <div className={styles.bar}>
        <Logo name={brand} />
        <nav className={styles.nav} aria-label="Main">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={pathname === n.href ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.right}>
          <Link href="/community" className={styles.join} data-track="header_join_free">
            Join Free
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.burger} aria-hidden="true" />
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        className={[styles.panel, open ? styles.panelOpen : ""].join(" ")}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={pathname === n.href ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/interest">Interest List</Link>
            </li>
          </ul>
          <Link href="/community" className={styles.panelJoin} data-track="header_join_free">
            Join Free
          </Link>
        </nav>
      </div>
    </header>
  );
}
