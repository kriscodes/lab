/** Provides the static not-found page and a route back to the Labs home. */
import Link from 'next/link';

/** Explains that the requested page is missing and links back to the Labs home. */
export default function NotFound() {
  return (
    <article className="lr-protocol lr-not-found">
      <p className="lr-mono">404 / OUTSIDE THE NOTEBOOK</p>
      <h1 className="lr-title">
        This page <em>isn’t here.</em>
      </h1>
      <p className="lr-lead">The research log has the current investigations and their status.</p>
      <Link className="lr-open" href="/">
        Return to Labs
      </Link>
    </article>
  );
}
