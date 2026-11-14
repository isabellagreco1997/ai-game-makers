"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { EXPERIENCE, FORMATS, INTERESTS, WORKSHOP_ROLES } from "@/lib/form-options";
import { Button } from "./Button";
import { track } from "./Consent";
import styles from "./Forms.module.css";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string } | { kind: "done" };

function useStarted() {
  const ref = useRef(0);
  useEffect(() => {
    ref.current = Date.now();
  }, []);
  return ref;
}

const NOT_OPEN = "Sign-ups aren't open yet: the mailing list is still being connected. Nothing was saved. Please try again soon.";
const FAILED = "We couldn't save that just now. Please try again in a minute.";

/**
 * The site is static, so the browser posts straight to the form provider
 * (e.g. Formspree). No endpoint configured = an honest "not open yet", never a fake success.
 */
async function submitTo(endpoint: string, kind: "interest" | "workshop", payload: Record<string, unknown>) {
  const { website, startedAt, ...data } = payload;
  if (!endpoint) return { ok: false, message: NOT_OPEN, errors: {} as Record<string, string> };
  if (website || Date.now() - Number(startedAt) < 2500) {
    return { ok: false, message: "That looked automated. Please wait a moment and submit again.", errors: {} as Record<string, string> };
  }
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ kind, _gotcha: website ?? "", ...data }),
    });
    return { ok: res.ok, message: res.ok ? undefined : FAILED, errors: {} as Record<string, string> };
  } catch {
    return { ok: false, message: FAILED, errors: {} as Record<string, string> };
  }
}
function Field({
  id,
  label,
  error,
  hint,
  children,
  optional,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <div className={[styles.field, error ? styles.invalid : ""].join(" ")}>
      <label htmlFor={id}>
        {label}
        {optional && <span className={styles.opt}> (optional)</span>}
      </label>
      {hint && (
        <p className={styles.hint} id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p className={styles.error} id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  );
}

function Honeypot() {
  return (
    <div className={styles.hp} aria-hidden="true">
      <label>
        Leave this empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** After a failed submit, move focus to the first field that needs fixing. */
function focusFirstInvalid(form: HTMLFormElement | null) {
  window.setTimeout(() => {
    const el = form?.querySelector<HTMLElement>("[aria-invalid='true'], fieldset[aria-describedby] input");
    el?.focus();
  }, 0);
}

function describedBy(id: string, error?: string, hint?: boolean) {
  return [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
}

/* ------------------------------------------------------------- interest list */
export function InterestForm({ endpoint, compact, defaultInterest }: { endpoint: string; compact?: boolean; defaultInterest?: string }) {
  const uid = useId();
  const router = useRouter();
  const started = useStarted();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const id = (k: string) => `${uid}-${k}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const payload = {
      name: f.get("name"),
      email: f.get("email"),
      interest: f.get("interest"),
      marketingConsent: f.get("marketingConsent") === "on",
      website: f.get("website"),
      startedAt: started.current,
    };
    const local: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email ?? "").trim())) local.email = "Please enter a valid email address.";
    if (!payload.interest) local.interest = "Please choose what you're most interested in.";
    if (!payload.marketingConsent) local.marketingConsent = "Please tick the box so we're allowed to email you updates.";
    setErrors(local);
    if (Object.keys(local).length) {
      setStatus({ kind: "error", message: "Please check the highlighted fields." });
      focusFirstInvalid(e.currentTarget);
      return;
    }
    setStatus({ kind: "sending" });
    const res = await submitTo(endpoint, "interest", payload);
    if (res.ok) {
      track("interest_signup");
      setStatus({ kind: "done" });
      router.push("/thank-you");
      return;
    }
    setErrors(res.errors);
    setStatus({ kind: "error", message: res.message ?? "Something went wrong. Please try again." });
    if (Object.keys(res.errors).length) focusFirstInvalid(form);
  }

  return (
    <form className={[styles.form, compact ? styles.compact : ""].join(" ")} onSubmit={onSubmit} noValidate>
      <Honeypot />
      <div className={styles.row}>
        <Field id={id("name")} label="Your name" optional>
          <input id={id("name")} name="name" type="text" autoComplete="given-name" maxLength={80} />
        </Field>
        <Field id={id("email")} label="Email address" error={errors.email}>
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={describedBy(id("email"), errors.email)}
          />
        </Field>
      </div>
      <Field id={id("interest")} label="What are you most interested in?" error={errors.interest}>
        <select
          id={id("interest")}
          name="interest"
          required
          defaultValue={defaultInterest ?? ""}
          aria-invalid={Boolean(errors.interest) || undefined}
          aria-describedby={describedBy(id("interest"), errors.interest)}
        >
          <option value="" disabled>
            Choose one
          </option>
          {INTERESTS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>
      <div className={[styles.check, errors.marketingConsent ? styles.invalid : ""].join(" ")}>
        <input
          id={id("consent")}
          name="marketingConsent"
          type="checkbox"
          aria-invalid={Boolean(errors.marketingConsent) || undefined}
          aria-describedby={describedBy(id("consent"), errors.marketingConsent)}
        />
        <label htmlFor={id("consent")}>
          Yes, email me updates from AI Game Makers. I can unsubscribe at any time. See the{" "}
          <Link href="/privacy">privacy policy</Link>.
        </label>
        {errors.marketingConsent && (
          <p className={styles.error} id={`${id("consent")}-err`}>
            {errors.marketingConsent}
          </p>
        )}
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={status.kind === "sending"} size="lg">
          {status.kind === "sending" ? "Sending" : "Keep me updated"}
        </Button>
      </div>
      <p className={styles.status} role="status" aria-live="polite">
        {status.kind === "error" && <span className={styles.statusError}>{status.message}</span>}
        {status.kind === "done" && <span>Thanks! Taking you to the confirmation page.</span>}
      </p>
    </form>
  );
}

/* ------------------------------------------------------------- workshops */
export function WorkshopForm({ endpoint }: { endpoint: string }) {
  const uid = useId();
  const started = useStarted();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [role, setRole] = useState("");
  const doneRef = useRef<HTMLDivElement>(null);
  const id = (k: string) => `${uid}-${k}`;

  useEffect(() => {
    if (status.kind === "done") doneRef.current?.focus();
  }, [status.kind]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const payload = {
      name: f.get("name"),
      email: f.get("email"),
      role: f.get("role"),
      experience: f.get("experience"),
      format: f.get("format"),
      message: f.get("message"),
      marketingConsent: f.get("marketingConsent") === "on",
      website: f.get("website"),
      startedAt: started.current,
    };
    const local: Record<string, string> = {};
    if (!String(payload.name ?? "").trim()) local.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email ?? "").trim())) local.email = "Please enter a valid email address.";
    if (!payload.role) local.role = "Please choose who the workshop would be for.";
    if (!payload.experience) local.experience = "Please choose an experience level.";
    if (!payload.format) local.format = "Please choose a format.";
    setErrors(local);
    if (Object.keys(local).length) {
      setStatus({ kind: "error", message: "Please check the highlighted fields." });
      focusFirstInvalid(e.currentTarget);
      return;
    }
    setStatus({ kind: "sending" });
    const res = await submitTo(endpoint, "workshop", payload);
    if (res.ok) {
      track("workshop_interest");
      setStatus({ kind: "done" });
      return;
    }
    setErrors(res.errors);
    setStatus({ kind: "error", message: res.message ?? "Something went wrong. Please try again." });
    if (Object.keys(res.errors).length) focusFirstInvalid(form);
  }

  if (status.kind === "done") {
    return (
      <div className={styles.done} ref={doneRef} tabIndex={-1}>
        <h3 className="title-ink">Your interest is registered.</h3>
        <p>Thanks for your interest. We&apos;ll email you if a suitable workshop is announced.</p>
      </div>
    );
  }

  const isParent = role === WORKSHOP_ROLES[1];

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Honeypot />
      <div className={styles.row}>
        <Field id={id("name")} label={isParent ? "Your name (the parent or guardian)" : "Your name"} error={errors.name}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            required
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={describedBy(id("name"), errors.name)}
          />
        </Field>
        <Field id={id("email")} label={isParent ? "Your email (not your child's)" : "Email address"} error={errors.email}>
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={describedBy(id("email"), errors.email)}
          />
        </Field>
      </div>

      <fieldset className={[styles.fieldset, errors.role ? styles.invalid : ""].join(" ")} aria-describedby={errors.role ? `${id("role")}-err` : undefined}>
        <legend>Who would the workshop be for?</legend>
        <div className={styles.radios}>
          {WORKSHOP_ROLES.map((r) => (
            <label key={r} className={styles.radio}>
              <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} />
              <span>{r}</span>
            </label>
          ))}
        </div>
        {errors.role && (
          <p className={styles.error} id={`${id("role")}-err`}>
            {errors.role}
          </p>
        )}
      </fieldset>
      {isParent && (
        <p className={styles.note}>
          Please don't include your child's name or contact details. Any sessions for young people would only run with an
          age-appropriate safeguarding policy in place, and children can't join the online community.
        </p>
      )}

      <div className={styles.row}>
        <Field id={id("experience")} label="Experience level" error={errors.experience}>
          <select
            id={id("experience")}
            name="experience"
            defaultValue=""
            required
            aria-invalid={Boolean(errors.experience) || undefined}
            aria-describedby={describedBy(id("experience"), errors.experience)}
          >
            <option value="" disabled>
              Choose one
            </option>
            {EXPERIENCE.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field id={id("format")} label="Preferred format" error={errors.format}>
          <select
            id={id("format")}
            name="format"
            defaultValue=""
            required
            aria-invalid={Boolean(errors.format) || undefined}
            aria-describedby={describedBy(id("format"), errors.format)}
          >
            <option value="" disabled>
              Choose one
            </option>
            {FORMATS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field id={id("message")} label="Anything you'd like to tell us?" optional>
        <textarea id={id("message")} name="message" rows={4} maxLength={1500} />
      </Field>

      <div className={styles.check}>
        <input id={id("consent")} name="marketingConsent" type="checkbox" />
        <label htmlFor={id("consent")}>
          Also send me general AI Game Makers updates by email (optional). See the <Link href="/privacy">privacy policy</Link>.
        </label>
      </div>

      <p className={styles.notice}>
        Signing up doesn&apos;t book a place or take a payment. We&apos;ll email you when dates are announced.
      </p>

      <div className={styles.actions}>
        <Button type="submit" loading={status.kind === "sending"} size="lg">
          {status.kind === "sending" ? "Sending" : "Register your interest"}
        </Button>
      </div>
      <p className={styles.status} role="status" aria-live="polite">
        {status.kind === "error" && <span className={styles.statusError}>{status.message}</span>}
      </p>
    </form>
  );
}
