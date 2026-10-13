"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Aurora from "@/components/Aurora";
import { COMMANDS, type CommandId } from "@/lib/commands";
import { parseCommandQuery, workspaceHref } from "@/lib/parseCommand";

export default function WorkspaceApp() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCommand = (() => {
    const c = searchParams.get("command") as CommandId | null;
    return COMMANDS.some((x) => x.id === c) ? (c as CommandId) : "invoice";
  })();
  const initialNotes = searchParams.get("notes") ?? "";

  const [command, setCommand] = useState<CommandId>(initialCommand);
  const [query, setQuery] = useState(`basalt ${initialCommand}`);
  const [notes, setNotes] = useState(initialNotes);
  const [output, setOutput] = useState("");
  const [modelUsed, setModelUsed] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"checking" | "ready" | "missing">(
    "checking"
  );
  const [isPending, startTransition] = useTransition();

  const active = COMMANDS.find((c) => c.id === command)!;

  useEffect(() => {
    const c = searchParams.get("command") as CommandId | null;
    const n = searchParams.get("notes");
    if (c && COMMANDS.some((x) => x.id === c)) {
      setCommand(c);
      setQuery(`basalt ${c}`);
    }
    if (n !== null) setNotes(n);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d: { gemmaConfigured?: boolean }) => {
        setStatus(d.gemmaConfigured ? "ready" : "missing");
      })
      .catch(() => setStatus("missing"));
  }, []);

  function selectCommand(id: CommandId, keepNotes = true) {
    setCommand(id);
    setQuery(`basalt ${id}`);
    setError("");
    setOutput("");
    if (!keepNotes) setNotes("");
    router.replace(workspaceHref(id, keepNotes ? notes : undefined), {
      scroll: false,
    });
  }

  function loadExample() {
    const example = active.example;
    setNotes(example);
    router.replace(workspaceHref(command, example), { scroll: false });
  }

  function applyQuery() {
    const parsed = parseCommandQuery(query);
    setCommand(parsed.command);
    if (parsed.notes) setNotes(parsed.notes);
    setQuery(`basalt ${parsed.command}`);
    router.replace(
      workspaceHref(parsed.command, parsed.notes || notes),
      { scroll: false }
    );
  }

  function run() {
    setError("");
    startTransition(async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command, notes }),
        });
        const data = (await res.json()) as {
          text?: string;
          model?: string;
          error?: string;
        };
        if (!res.ok) {
          setError(data.error || "Request failed.");
          return;
        }
        setOutput(data.text || "");
        setModelUsed(data.model || "");
      } catch {
        setError("Network error — is the server running?");
      }
    });
  }

  async function copyOut() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  }

  return (
    <div className="workspace-shell">
      <Aurora />
      <div className="workspace">
        <header className="ws-header">
          <div className="nav-brand">
            <Link href="/" className="nav-brand" style={{ gap: 10 }}>
              <span className="logo-diamond" aria-hidden="true" />
              <span className="wordmark">Basalt</span>
            </Link>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="ws-title">Command workspace</div>
            <div className="ws-meta">
              {status === "checking" && "Checking Gemma…"}
              {status === "ready" && "Gemma connected · live"}
              {status === "missing" && "Add GOOGLE_AI_API_KEY to .env / Render"}
            </div>
          </div>
        </header>

        <div className="live-command">
          <div className="live-input-row">
            <span className="mode-pill">{active.label}</span>
            <input
              className="live-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyQuery();
                }
              }}
              aria-label="Active command"
              placeholder="basalt invoice …"
            />
            <button type="button" className="shortcut-chip" onClick={applyQuery}>
              Apply
            </button>
          </div>

          <div className="quick-cmds">
            {COMMANDS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`quick-cmd${command === c.id ? " active" : ""}`}
                onClick={() => selectCommand(c.id)}
              >
                {c.label}
              </button>
            ))}
            <button type="button" className="quick-cmd" onClick={loadExample}>
              Load example
            </button>
          </div>

          <textarea
            className="notes-area"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                run();
              }
            }}
            placeholder={active.placeholder}
            spellCheck
          />

          <div className="ws-actions">
            <button
              type="button"
              className="run-btn"
              onClick={run}
              disabled={isPending || !notes.trim()}
            >
              {isPending ? "Running Gemma…" : "Run with Gemma"}
            </button>
            <span className="hint">Ctrl/⌘ + Enter to run · open-weight Gemma 4</span>
          </div>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <section className="output-panel" aria-live="polite">
          <div className="output-label">
            <span>
              Output
              {modelUsed ? ` · ${modelUsed}` : ""}
            </span>
            {output ? (
              <button type="button" className="copy-btn" onClick={copyOut}>
                Copy
              </button>
            ) : null}
          </div>
          <div className={`output-body${output ? "" : " empty"}`}>
            {output ||
              "Type your notes (or Load example), then Run with Gemma. Live output appears here."}
          </div>
        </section>
      </div>
    </div>
  );
}
