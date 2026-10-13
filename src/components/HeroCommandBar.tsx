"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactElement } from "react";
import {
  SearchGlyph,
  InvoiceIcon,
  ProposalIcon,
  MailIcon,
  ScopeIcon,
} from "@/components/OsGlyphs";
import { parseCommandQuery, workspaceHref } from "@/lib/parseCommand";
import type { CommandId } from "@/lib/commands";

const ROWS: {
  id: CommandId;
  label: string;
  arg: string;
  shortcut: string;
  Icon: () => ReactElement;
  seed: string;
}[] = [
  {
    id: "invoice",
    label: "Draft invoice",
    arg: "Acme · $2,400",
    shortcut: "⌘↵",
    Icon: InvoiceIcon,
    seed: "Client: Acme Studio. Project: marketing site redesign. Amount: $2,400. Net 14.",
  },
  {
    id: "proposal",
    label: "Write proposal",
    arg: "~/briefs/acme.md",
    shortcut: "⌘B",
    Icon: ProposalIcon,
    seed: "Local bakery wants online ordering. Budget ~$1,800. Menu photos, pickup slots, Stripe. 3 weeks.",
  },
  {
    id: "followup",
    label: "Follow-up email",
    arg: "polite · 7 days late",
    shortcut: "⌘O",
    Icon: MailIcon,
    seed: "Sent proposal to Jordan at Northwind 10 days ago for Shopify refresh ($3,200). No reply. Friendly but firm.",
  },
  {
    id: "scope",
    label: "Scope the brief",
    arg: "pnpm estimate",
    shortcut: "⌘K",
    Icon: ScopeIcon,
    seed: "HVAC company wants an app for techs to log jobs, photos, and invoices on iPads. Unknown budget.",
  },
];

export default function HeroCommandBar() {
  const router = useRouter();
  const [query, setQuery] = useState("invoice Acme $2,400 redesign");
  const [active, setActive] = useState(0);

  function go(command: CommandId, notes: string) {
    router.push(workspaceHref(command, notes));
  }

  function runQuery() {
    const parsed = parseCommandQuery(query);
    const row = ROWS.find((r) => r.id === parsed.command) ?? ROWS[0];
    go(parsed.command, parsed.notes || row.seed);
  }

  return (
    <div className="command-bar" aria-label="Command bar">
      <div className="cmd-input-row">
        <SearchGlyph />
        <input
          className="cmd-live-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              runQuery();
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, ROWS.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            }
          }}
          aria-label="Command query"
          placeholder="invoice Acme $2,400 redesign"
        />
        <span className="mode-pill">Command</span>
      </div>

      <ul className="cmd-results">
        {ROWS.map((row, i) => (
          <li key={row.id}>
            <button
              type="button"
              className={`cmd-row cmd-row-btn${i === active ? " active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(row.id, row.seed)}
            >
              <row.Icon />
              <span className="label">
                {row.label} <span className="mono-arg">{row.arg}</span>
              </span>
              <span className="shortcut-chip">{row.shortcut}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="cmd-footer">
        <span>↑↓ navigate · enter open · click a row</span>
        <button type="button" className="cmd-run-link" onClick={runQuery}>
          Run →
        </button>
      </div>
    </div>
  );
}
