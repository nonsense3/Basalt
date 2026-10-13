import { Suspense } from "react";
import WorkspaceApp from "@/components/WorkspaceApp";

export const metadata = {
  title: "Workspace — Basalt",
  description: "Run Basalt commands with open-weight Gemma.",
};

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="workspace-shell">
          <div className="workspace">
            <p className="ws-meta">Loading workspace…</p>
          </div>
        </div>
      }
    >
      <WorkspaceApp />
    </Suspense>
  );
}
