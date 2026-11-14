import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "dark" | "small";
type Size = "md" | "lg";

type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  play?: boolean;
  /** analytics event name, picked up by the global click tracker */
  track?: string;
  className?: string;
};

type AsLink = Common & { href: string; external?: boolean };
type AsButton = Common & {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
};

function inner(children: ReactNode, arrow?: boolean, play?: boolean, loading?: boolean) {
  return (
    <>
      {play && <span className={styles.play} aria-hidden="true" />}
      <span className={styles.label}>{children}</span>
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : arrow && <span className={styles.arrow} aria-hidden="true" />}
    </>
  );
}

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", arrow = true, play, track, className } = props;
  const cls = [styles.btn, styles[variant], size === "lg" ? styles.lg : "", className ?? ""].join(" ");

  if (props.href !== undefined) {
    const external = props.external ?? /^https?:\/\//.test(props.href);
    if (external) {
      return (
        <a className={cls} href={props.href} target="_blank" rel="noopener noreferrer" data-track={track}>
          {inner(props.children, arrow, play)}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link className={cls} href={props.href} data-track={track}>
        {inner(props.children, arrow, play)}
      </Link>
    );
  }

  const { type = "button", disabled, loading, onClick } = props;
  return (
    <button
      className={cls}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      data-track={track}
    >
      {inner(props.children, arrow, play, loading)}
    </button>
  );
}

/**
 * A call to action whose destination may not be configured yet. With no
 * href it renders a disabled button and an honest note instead of a dead link.
 */
export function ExternalCta({
  href,
  children,
  pendingNote,
  track,
  variant = "primary",
  size = "md",
}: {
  href: string;
  children: ReactNode;
  pendingNote: string;
  track?: string;
  variant?: Variant;
  size?: Size;
}) {
  if (href) {
    return (
      <Button href={href} external track={track} variant={variant} size={size}>
        {children}
      </Button>
    );
  }
  return (
    <span className={styles.pending}>
      <Button disabled variant={variant} size={size} arrow={false}>
        {children}
      </Button>
      <span className={styles.pendingNote}>{pendingNote}</span>
    </span>
  );
}
