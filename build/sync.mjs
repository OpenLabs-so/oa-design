#!/usr/bin/env node
/**
 * The repo's one build step, in the spirit of transitions.dev's extract.mjs:
 * the consumer-facing MDs embed full component source, and this script is
 * what keeps them true. Source of truth is components/ (type-checked by
 * `npm run typecheck`); the MDs carry markers and this injects the code
 * between them. It also mirrors the publishable payload into cli/payload so
 * the npm package is self-contained.
 *
 *   node build/sync.mjs        # inject code into skills/oa-design/*.md
 *   node build/sync.mjs --cli  # also mirror skills+components into cli/payload
 */
import { cpSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILL_DIR = join(ROOT, "skills", "oa-design");

const MARKER = /<!-- oa:code (\S+) -->[\s\S]*?<!-- \/oa:code -->/g;

const fence = (path) => {
  const source = readFileSync(join(ROOT, path), "utf8").trimEnd();
  const lang = path.endsWith(".css") ? "css" : path.endsWith(".ts") ? "ts" : "tsx";
  return `<!-- oa:code ${path} -->\n\`\`\`${lang}\n${source}\n\`\`\`\n<!-- /oa:code -->`;
};

let injected = 0;
for (const name of readdirSync(SKILL_DIR)) {
  if (!name.endsWith(".md")) continue;
  const file = join(SKILL_DIR, name);
  const before = readFileSync(file, "utf8");
  const after = before.replace(MARKER, (_, path) => {
    injected += 1;
    return fence(path);
  });
  if (after !== before) writeFileSync(file, after);
}
console.log(`[sync] injected ${injected} code block(s)`);

if (process.argv.includes("--cli")) {
  const payload = join(ROOT, "cli", "payload");
  rmSync(payload, { recursive: true, force: true });
  cpSync(join(ROOT, "skills"), join(payload, "skills"), { recursive: true });
  cpSync(join(ROOT, "components"), join(payload, "components"), { recursive: true });
  console.log("[sync] mirrored payload into cli/payload");
}
