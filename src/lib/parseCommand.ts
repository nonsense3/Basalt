import { COMMANDS, type CommandId } from "@/lib/commands";

const ALIASES: Record<string, CommandId> = {
  invoice: "invoice",
  inv: "invoice",
  bill: "invoice",
  proposal: "proposal",
  prop: "proposal",
  pitch: "proposal",
  followup: "followup",
  "follow-up": "followup",
  follow: "followup",
  email: "followup",
  chase: "followup",
  scope: "scope",
  estimate: "scope",
  brief: "scope",
};

/** Parse free-text like "invoice Acme $2400 redesign" into command + notes. */
export function parseCommandQuery(raw: string): {
  command: CommandId;
  notes: string;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { command: "invoice", notes: "" };
  }

  const parts = trimmed.split(/\s+/);
  // handle "basalt invoice ..." already split
  let idx = 0;
  let maybe = parts[0].toLowerCase();
  if (maybe === "basalt" && parts.length > 1) {
    idx = 1;
    maybe = parts[1].toLowerCase();
  }

  const command = ALIASES[maybe] ?? "invoice";
  const restStart = ALIASES[maybe] ? idx + 1 : 0;
  const notes = parts.slice(restStart).join(" ").trim();

  return { command, notes };
}

export function workspaceHref(command: CommandId, notes?: string): string {
  const params = new URLSearchParams({ command });
  if (notes?.trim()) params.set("notes", notes.trim());
  return `/workspace?${params.toString()}`;
}

export function commandLabel(id: CommandId): string {
  return COMMANDS.find((c) => c.id === id)?.label ?? id;
}
