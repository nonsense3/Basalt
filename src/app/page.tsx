import Link from "next/link";
import Aurora from "@/components/Aurora";
import HeroCommandBar from "@/components/HeroCommandBar";
import { ProductHuntMark } from "@/components/OsGlyphs";

export default function HomePage() {
  return (
    <main className="hero-viewport">
      <Aurora />

      <div className="hero-content">
        <nav className="pill-nav" aria-label="Primary">
          <div className="nav-brand">
            <span className="logo-diamond" aria-hidden="true" />
            <span className="wordmark">Basalt</span>
          </div>

          <ul className="nav-links">
            <li>
              <Link href="/workspace">Product</Link>
            </li>
            <li>
              <Link href="/workspace">Workspace</Link>
            </li>
            <li>
              <a
                href="https://github.com/nonsense3/Basalt"
                target="_blank"
                rel="noreferrer"
              >
                Docs
              </a>
            </li>
            <li>
              <a
                href="https://github.com/nonsense3/Basalt#readme"
                target="_blank"
                rel="noreferrer"
              >
                Changelog
              </a>
            </li>
            <li>
              <a
                href="https://dev.to/challenges/hacktoberfest-week2-2026-10-12"
                target="_blank"
                rel="noreferrer"
              >
                Challenge
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            <Link href="/workspace" className="nav-login">
              Log in
            </Link>
            <Link href="/workspace" className="nav-download">
              Open app
            </Link>
            <button className="nav-toggle" type="button" aria-label="Menu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </nav>

        <div className="eyebrow">v2.0 — now with an AI command bar</div>

        <h1 className="hero-headline">
          Client work, one{" "}
          <span className="accent-word">keystroke</span>
          <br />
          away.
        </h1>

        <p className="hero-subtitle">
          Basalt turns messy freelancing notes into invoices, proposals, and
          follow-ups — powered by open-weight Gemma, so your client data stays
          yours and your costs stay cheap.
        </p>

        <div className="keycap-row">
          <Link href="/workspace" className="keycap">
            Open workspace
          </Link>
        </div>

        <p className="install-caption">
          Type a command below or click a row — opens the live Gemma workspace
        </p>

        <HeroCommandBar />

        <Link href="/workspace" className="ghost-pill">
          Learn more →
        </Link>

        <aside className="ph-badge">
          <ProductHuntMark />
          <div>
            <div className="rank">Hacktoberfest Week 2</div>
            <div className="sub">Side Hustle · Gemma + Render</div>
          </div>
        </aside>
      </div>
    </main>
  );
}
