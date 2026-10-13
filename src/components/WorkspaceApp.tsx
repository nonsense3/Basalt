"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Aurora from "@/components/Aurora";
import { COMMANDS, type CommandId } from "@/lib/commands";

export default function WorkspaceApp() {
  const [command, setCommand] = useState<CommandId>("invoice");
  const [notes, setNotes] = useState(COMMANDS[0].example);
  const [output, setOutput] = useState("");
  const [modelUsed, setModelUsed] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const active = COMMANDS.find((c) => c.id === command)!;

  function selectCommand(id: CommandId) {
    const next = COMMANDS.find((c) => c.id === id)!;
    setCommand(id);
    setNotes(next.example);
    setError("");
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
            <div className="ws-meta">Gemma · open-weight · Render-ready</div>
          </div>
        </header>

        <div className="live-command">
          <div className="live-input-row">
            <span className="mode-pill">{active.label}</span>
            <input
              className="live-input"
              value={`basalt ${command}`}
              readOnly
              aria-label="Active command"
            />
            <span className="shortcut-chip">⌘↵</span>
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
          </div>

          <textarea
            className="notes-area"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={active.placeholder}
            spellCheck
          />

          <div className="ws-actions">
            <button
              type="button"
              className="run-btn"
              onClick={run}
              disabled={isPending}
            >
              {isPending ? "Running Gemma…" : "Run with Gemma"}
            </button>
            <span className="hint">
              open-weight · swap models via GEMMA_MODEL
            </span>
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
              "Pick a command, tweak the notes, hit Run. Basalt calls Gemma and drops ready-to-send copy here."}
          </div>
        </section>
      </div>
    </div>
  );
}
