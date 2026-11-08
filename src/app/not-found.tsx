import Link from 'next/link';

/** Provides a useful static fallback without inventing an experiment for an unknown route. */
export default function NotFound() {
  return (
    <section className="document-hero not-found">
      <p className="eyebrow mono">404 / Outside the notebook</p>
      <h1>This page isn’t here.</h1>
      <p className="document-intro">
        The research log has the current investigations and their status.
      </p>
      <Link className="text-link" href="/experiments/">
        Return to the research log <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
