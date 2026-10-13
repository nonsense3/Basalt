import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "screenshots");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("http://localhost:3000/workspace", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

await page.getByRole("button", { name: "Proposal" }).click();
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(out, "03-workspace-proposal.png"),
});

await page.getByRole("button", { name: "Follow-up" }).click();
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(out, "04-workspace-followup.png"),
});

await page.getByRole("button", { name: "Scope" }).click();
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(out, "05-workspace-scope.png"),
});

await browser.close();
console.log("saved 03–05 to screenshots/");
