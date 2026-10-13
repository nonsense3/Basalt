export type CommandId = "invoice" | "proposal" | "followup" | "scope";

export const COMMANDS: {
  id: CommandId;
  label: string;
  placeholder: string;
  example: string;
}[] = [
  {
    id: "invoice",
    label: "Invoice",
    placeholder:
      "Client name, amount, what you delivered, payment terms…",
    example:
      "Client: Acme Studio. Project: marketing site redesign. Hours: 32 @ $75. Delivered Oct 1. Net 14. Include line items for discovery, design, and build.",
  },
  {
    id: "proposal",
    label: "Proposal",
    placeholder: "Paste the rough client brief or your notes…",
    example:
      "Local bakery wants a simple online ordering page. Budget ~$1,800. Needs menu photos, pickup slots, and Stripe. Timeline: 3 weeks. They already have Instagram.",
  },
  {
    id: "followup",
    label: "Follow-up",
    placeholder: "Who, what you sent, how late, tone…",
    example:
      "Sent proposal to Jordan at Northwind on Sept 28 for a Shopify theme refresh ($3,200). No reply in 10 days. Friendly but firm — I have a slot opening next Monday.",
  },
  {
    id: "scope",
    label: "Scope",
    placeholder: "Messy brief — Basalt will carve it into deliverables…",
    example:
      "Friend's uncle runs a HVAC company. Wants 'an app' so techs can log jobs, upload before/after photos, and generate invoices on site. They have iPads. No idea what it should cost.",
  },
];

export function systemPromptFor(command: CommandId): string {
  const shared = `You are Basalt, a concise freelance business assistant.
Write polished, ready-to-send text. No fluff, no markdown fences unless useful.
Prefer clear structure freelancers can copy into email or docs.
Assume the user is an independent freelancer or small studio.`;

  switch (command) {
    case "invoice":
      return `${shared}
Produce a professional invoice draft: header, bill-to, line items with amounts, subtotal/tax/total placeholders, payment terms, and a short thank-you line.`;
    case "proposal":
      return `${shared}
Produce a short client proposal: problem, proposed approach, deliverables, timeline, investment (pricing), and next steps. Keep it under ~400 words.`;
    case "followup":
      return `${shared}
Write a polite, professional follow-up email. Subject line first, then body. Short. Make it easy to say yes.`;
    case "scope":
      return `${shared}
Turn the messy brief into a scoped outline: goals, out-of-scope, deliverables, assumptions, risks, and a rough effort/price band. Be direct.`;
  }
}
