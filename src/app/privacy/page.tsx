import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Privacy & analytics',
  'How first-party audience measurement works across Portfolio, Lab, and Toolbox, and how to opt out.',
  '/privacy/',
);

/** Explain audience measurement separately from any future research experiment. */
export default function PrivacyPage() {
  return (
    <article className="lr-protocol">
      <p className="lr-mono">YOUR BROWSER, YOUR CHOICE</p>
      <h1 className="lr-title">
        Privacy & <em>analytics.</em>
      </h1>
      <p className="lr-lead">
        Studio Insights is Kristian’s first-party audience measurement for Portfolio, Lab, and
        Toolbox. It helps explain which pages are useful. It does not identify individual people.
      </p>
      <div className="lr-standards">
        <section className="lr-policy">
          <h2>Choose whether to participate</h2>
          <p>
            <a href="/privacy/?analytics_opt_out=1">Exclude this browser from analytics</a>
            {' · '}
            <a href="/privacy/?analytics_opt_out=0">Allow analytics in this browser</a>
          </p>
          <p>
            The preference is shared across participating kristiansalmeron.com subdomains when
            cookies are available, using a nonidentifying preference cookie lasting up to a year.
            Global Privacy Control and Do Not Track take precedence over allowing analytics. Use
            these controls separately in each browser or device. With cookies blocked, preferences
            and visits may remain separate on each site. JavaScript must run to save this
            preference; when analytics is blocked or JavaScript is off, no analytics events are
            sent.
          </p>
        </section>
        <section className="lr-policy">
          <h2>A small set of observations</h2>
          <p>
            We record approved page paths, coarse device category, recognized referral or campaign
            source, page opens, relevant link clicks, and fixed tool actions. Page paths exclude
            query strings and fragments; only approved campaign labels are retained. Unknown sources
            remain unknown. Lab protocol opens are reading activity, not benchmark runs.
          </p>
          <p>
            Active time estimates visible browsing until 60 seconds after recent activity, including
            initial reading time. It pauses while a tab is hidden or idle; it cannot tell whether
            someone is actually reading. Scroll depth records only 25%, 50%, 75%, and 100%
            milestones, not a continuous trail. Last observed pages and page sequences are
            estimates; an observed exit does not prove that a browser was closed. New measurements
            begin after this tracking version is deployed and cannot reconstruct earlier activity.
          </p>
        </section>
        <section className="lr-policy">
          <h2>Short-lived identifiers, limited scope</h2>
          <p>
            Random daily browser identifiers and short-lived visit identifiers can connect visits
            among Portfolio, Lab, and Toolbox on this domain. Visits expire after 30 minutes of
            inactivity; identifiers also rotate at midnight in America/Los_Angeles. Identifiers are
            hashed before database storage. Cookie or storage restrictions can leave visits
            unmatched; different browsers, devices, and days may count again. We do not report
            returning people or follow activity on unrelated sites.
          </p>
          <p>
            There are no advertising trackers, fingerprinting, session replay, precise location, or
            collection of names, email addresses, form values, prompts, or tool content in
            analytics. A GitHub, contact, or email link click is only a click.
          </p>
        </section>
        <section className="lr-policy">
          <h2>Storage and reliability</h2>
          <p>
            Events go to analytics.kristiansalmeron.com and are stored in a private PostgreSQL
            database for up to 180 days. Reporting requires the owner’s authentication. Database
            backup retention follows the hosting provider’s policy. Hosting infrastructure processes
            ordinary request metadata to serve these websites.
          </p>
          <p>
            A browser queue of at most 100 events can retain pending events for up to 24 hours for
            retry. Opting out clears this site’s queue and identifiers; other participating tabs
            clear their own queues when they next check the shared preference. Blocked requests,
            closed tabs, offline use, and delayed events make counts and durations estimates. The
            analytics service’s availability does not prevent reading this site.
          </p>
        </section>
      </div>
      <p className="lr-mono">Notice updated November 16, 2026</p>
    </article>
  );
}
