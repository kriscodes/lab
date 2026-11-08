import { REPOSITORY_URL } from '@/lib/site';

/** Identifies the author and links to the public source without adding external services. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Engineering Lab by{' '}
        <a href="https://kristiansalmeron.com/">
          Kristian Salmeron <span aria-hidden="true">↗</span>
        </a>
      </p>
      <div>
        <a href={REPOSITORY_URL}>
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <span className="mono footer-note">Questions, methods, evidence.</span>
      </div>
    </footer>
  );
}
