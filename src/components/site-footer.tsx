import { ThemeToggle } from './theme-toggle';

export function SiteFooter() {
  return (
    <footer className="lr-footer">
      <span>Questions first. Evidence next.</span>
      <div className="lr-footer-links">
        <a href="https://kristiansalmeron.com/">
          Portfolio <span aria-hidden="true">↗</span>
        </a>
        <ThemeToggle />
      </div>
    </footer>
  );
}
