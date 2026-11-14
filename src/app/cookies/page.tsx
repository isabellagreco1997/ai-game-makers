import { ConsentControls } from "@/components/Consent";
import { LegalPage } from "@/components/Legal";
import { integrations } from "@/config/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("Cookie Policy | AI Game Makers", "Which cookies and similar technologies this website uses, and how to control them.", "/cookies");

export default function Cookies() {
  const analytics = integrations.analytics.provider === "plausible";
  return (
    <LegalPage title="Cookie Policy" updated="14 November 2026">
      <h2>The short version</h2>
      <p>
        {analytics
          ? "This site uses no advertising cookies. Analytics only runs if you accept it, and you can change your mind below at any time."
          : "This site uses no advertising or analytics cookies."}
      </p>

      <h2>What this site stores</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Purpose</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>
        <tbody>
          {analytics ? (
            <tr>
              <td>agm-consent-v1</td>
              <td>Local storage, strictly necessary</td>
              <td>Remembers your cookie choice so we don't ask again</td>
              <td>Until you clear it</td>
            </tr>
          ) : (
            <tr>
              <td colSpan={4}>Nothing. This site currently sets no cookies and stores nothing in your browser.</td>
            </tr>
          )}
          {analytics && (
            <tr>
              <td>Plausible Analytics</td>
              <td>Optional analytics (cookieless)</td>
              <td>Counts visits and clicks without identifying you. Loads only after you accept.</td>
              <td>No cookie set</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Third-party content</h2>
      <ul>
        <li>
          <strong>YouTube videos</strong> load only when you press play, using YouTube's privacy-enhanced mode. Once playing, YouTube may set
          its own cookies under Google's policy.
        </li>
        <li>
          <strong>Skool</strong>: links to the community open Skool's website, which uses its own cookies.
        </li>
      </ul>

      <h2 id="settings">Your settings</h2>
      <ConsentControls enabled={analytics} />
    </LegalPage>
  );
}
