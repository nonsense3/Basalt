import Link from "next/link";
import Aurora from "@/components/Aurora";
import {
  SearchGlyph,
  InvoiceIcon,
  ProposalIcon,
  MailIcon,
  ScopeIcon,
  ProductHuntMark,
} from "@/components/OsGlyphs";

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
              <a href="#how">Docs</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <a href="#changelog">Changelog</a>
            </li>
            <li>
              <a href="#blog">Blog</a>
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
          Works in the browser — no install required
        </p>

        <div className="command-bar" aria-label="Command bar preview">
          <div className="cmd-input-row">
            <SearchGlyph />
            <div className="cmd-query">
              invoice Acme $2,400 redesign
              <span className="cmd-caret" />
            </div>
            <span className="mode-pill">Command</span>
          </div>

          <ul className="cmd-results">
            <li className="cmd-row active">
              <InvoiceIcon />
              <span className="label">
                Draft invoice{" "}
                <span className="mono-arg">Acme · $2,400</span>
              </span>
              <span className="shortcut-chip">⌘↵</span>
            </li>
            <li className="cmd-row">
              <ProposalIcon />
              <span className="label">
                Write proposal{" "}
                <span className="mono-arg">~/briefs/acme.md</span>
              </span>
              <span className="shortcut-chip">⌘B</span>
            </li>
            <li className="cmd-row">
              <MailIcon />
              <span className="label">
                Follow-up email{" "}
                <span className="mono-arg">polite · 7 days late</span>
              </span>
              <span className="shortcut-chip">⌘O</span>
            </li>
            <li className="cmd-row">
              <ScopeIcon />
              <span className="label">
                Scope the brief{" "}
                <span className="mono-arg">pnpm estimate</span>
              </span>
              <span className="shortcut-chip">⌘K</span>
            </li>
          </ul>

          <div className="cmd-footer">
            <span>↑↓ navigate · enter open · esc dismiss</span>
            <span>Basalt</span>
          </div>
        </div>

        <Link href="/workspace" className="ghost-pill">
          Learn more →
        </Link>

        <aside className="ph-badge">
          <ProductHuntMark />
          <div>
            <div className="rank">Featured on Product Hunt</div>
            <div className="sub">#1 Product of the Day</div>
          </div>
        </aside>
      </div>
    </main>
  );
}
