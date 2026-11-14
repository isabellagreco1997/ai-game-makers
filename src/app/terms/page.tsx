import Link from "next/link";
import { ContactLine, Controller, LegalPage } from "@/components/Legal";
import { mentorship } from "@/config/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("Terms of Use | AI Game Makers", "The terms for using the AI Game Makers website, and how the Skool community and mentorship are governed.", "/terms");

export default function Terms() {
  return (
    <LegalPage title="Terms of Use" updated="14 November 2026">
      <h2>About these terms</h2>
      <p>
        These terms cover your use of this website, which is run by <Controller />. By using the site you agree to them.
      </p>

      <h2>What this website is</h2>
      <p>
        This website describes AI Game Makers: a free community, a free course and a paid 1:1 mentorship. It does not host the lessons or
        take payments. The community, lessons and mentorship purchase all live on Skool.
      </p>

      <h2>Skool</h2>
      <p>
        When you join the community or buy the mentorship, you do so on Skool and Skool's own terms of service and privacy policy apply to
        your account and payment. Skool processes all payments.
      </p>

      <h2>The mentorship</h2>
      {mentorship.approved ? (
        <p>
          The mentorship costs {mentorship.price} {mentorship.currency} per month for three months, {mentorship.total} {mentorship.currency} in total, for 12 weeks of personal support as described on
          the <Link href="/mentorship">mentorship page</Link> and the Skool offer. Isabella&apos;s promise to mentorship students is: If you&apos;re not happy with what we created together, I will refund you completely, no questions asked. This applies in addition to your statutory rights as a consumer.
        </p>
      ) : (
        <div role="note">
          <p>Isabella&apos;s promise to mentorship students is: If you&apos;re not happy with what we created together, I will refund you completely, no questions asked. This applies in addition to your statutory rights as a consumer.</p>
          <p>
            The mentorship costs {mentorship.price} {mentorship.currency} per month for three months, {mentorship.total} {mentorship.currency} in total, for 12 weeks of personal support. Its final
            terms are being confirmed and will be published here and on Skool before it can be bought, covering:
          </p>
          <ul>
            <li>exactly what is included and how calls are booked;</li>
            <li>when the 12 weeks start and when the support ends;</li>
            <li>cancellation and the remaining refund details, including your statutory rights as a consumer.</li>
          </ul>
        </div>
      )}
      <p>
        No mentorship guarantees a finished game, a commercial release or any particular result. You remain responsible for your own project
        and for any AI tool subscriptions you choose to use.
      </p>

      <h2>Workshops</h2>
      <p>Registering interest in a workshop is not a booking or a payment. No workshop is confirmed until it is announced with its own terms.</p>

      <h2>Content on this site</h2>
      <p>
        The text, illustrations, logo and game images on this site belong to their creators. Please don't reuse them without permission.
        Game images are frames from our own games; their status (released, demo or in development) is shown next to each one.
      </p>

      <h2>Links to other sites</h2>
      <p>We link to Skool, itch.io, YouTube and other sites we don't control. Their own terms apply when you visit them.</p>

      <h2>Liability</h2>
      <p>
        We try to keep this site accurate and available, but we can't promise it will always be error-free or online. Nothing in these terms
        limits liability that cannot be limited by law.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <ContactLine />.
      </p>
      <p>These terms are governed by the law of England and Wales.</p>
    </LegalPage>
  );
}
