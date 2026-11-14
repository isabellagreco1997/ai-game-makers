import Link from "next/link";
import { ContactLine, Controller, LegalPage } from "@/components/Legal";
import { integrations } from "@/config/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("Privacy Policy | AI Game Makers", "How AI Game Makers collects, uses and protects your personal information.", "/privacy");

export default function Privacy() {
  const analytics = integrations.analytics.provider === "plausible";
  return (
    <LegalPage title="Privacy Policy" updated="14 November 2026">
      <h2>Who we are</h2>
      <p>
        This website is run by <Controller />. We are the data controller for the personal information collected through this website.
      </p>

      <h2>What we collect and why</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">What</th>
            <th scope="col">Why</th>
            <th scope="col">Lawful basis (UK GDPR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Interest list: your email, optionally your first name, and what you're interested in</td>
            <td>To email you updates you asked for</td>
            <td>Consent (you tick a box). You can withdraw it at any time.</td>
          </tr>
          <tr>
            <td>Workshop form: your name, email, who the workshop is for, experience level, preferred format and any message</td>
            <td>To gauge interest in workshops and contact you if a suitable one is announced</td>
            <td>Legitimate interests (responding to your enquiry); consent for any general marketing you opt into</td>
          </tr>
          <tr>
            <td>Emails you send us</td>
            <td>To reply to you</td>
            <td>Legitimate interests</td>
          </tr>
          {analytics && (
            <tr>
              <td>Anonymous usage statistics (pages visited, buttons clicked)</td>
              <td>To understand which pages help people</td>
              <td>Consent, given through the cookie choices</td>
            </tr>
          )}
        </tbody>
      </table>
      <p>
        Please don't send us information about children. The workshop form asks parents and guardians not to include a child's name or
        contact details.
      </p>

      <h2>Who else handles your information</h2>
      <ul>
        <li>Our website hosting provider, which processes requests to this site.</li>
        <li>Our email and form provider, which stores interest list and workshop submissions on our behalf.</li>
        {analytics && <li>Plausible Analytics, a privacy-focused analytics service, only if you accept analytics.</li>}
        <li>
          YouTube (Google), only if you press play on a video. Videos use YouTube's privacy-enhanced mode and don't load until you click.
        </li>
        <li>itch.io and GitHub Pages, which serve the game screenshots on the Games page from the games' own public pages.</li>
      </ul>
      <p>
        <strong>Skool</strong>: the community, lessons and mentorship purchases are on Skool. When you join or buy there, Skool collects
        and processes your information under its own privacy policy.
      </p>
      <p>Some of these providers may process data outside the UK. Where they do, we rely on appropriate safeguards such as UK adequacy regulations or standard contractual clauses.</p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Interest list details: until you unsubscribe or ask us to delete them.</li>
        <li>Workshop enquiries: up to 24 months, or sooner if you ask us to delete them.</li>
        <li>Emails: as long as needed to deal with your enquiry.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        You have the right to access, correct or delete your personal information, to object to or restrict how we use it, to data
        portability, and to withdraw consent at any time. Every update email has an unsubscribe link. To use any of these rights, contact
        us at <ContactLine />.
      </p>
      <p>
        You can also complain to the Information Commissioner's Office (ico.org.uk), though we'd appreciate the chance to sort things out
        first.
      </p>

      <h2>Cookies</h2>
      <p>
        See our <Link href="/cookies">cookie policy</Link>.
      </p>

      <h2>Changes</h2>
      <p>If we change this policy, we'll update the date at the top of this page.</p>
    </LegalPage>
  );
}
