#!/usr/bin/env node
/**
 * getopen-design: install the Open Analytics design language into a project.
 *
 *   npx getopen-design list                 what's available
 *   npx getopen-design add tab-bar toast    write recipe MDs into ./oa-design
 *   npx getopen-design add --all            all recipes
 *   npx getopen-design add tab-bar --code   also copy the .tsx source
 *   npx getopen-design tokens               write _root.css into ./oa-design
 *   npx getopen-design skill                install the agent skill into
 *                                           .claude/skills/oa-design
 *
 * Flags: --dir <path> to change the output directory (default "oa-design").
 *
 * The package is self-contained: recipes embed their full type-checked
 * source, so `add` alone is enough for an agent to build from. `--code` is
 * for humans who want the .tsx files in their tree directly.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PKG = join(dirname(fileURLToPath(import.meta.url)), "..");
// Published package carries payload/; a repo checkout uses the repo dirs.
const SOURCE = existsSync(join(PKG, "payload")) ? join(PKG, "payload") : join(PKG, "..");
const SKILL_SRC = join(SOURCE, "skills", "oa-design");
const COMPONENTS_SRC = join(SOURCE, "components");

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const dirFlagIndex = args.indexOf("--dir");
const OUT = dirFlagIndex >= 0 ? args[dirFlagIndex + 1] : "oa-design";
const positional = args.filter(
  (a, i) => !a.startsWith("--") && (dirFlagIndex < 0 || i !== dirFlagIndex + 1)
);
const command = positional[0];

const manifest = JSON.parse(readFileSync(join(PKG, "manifest.json"), "utf8"));
const ok = (msg) => console.log(`✓ ${msg}`);
const die = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

function writeRecipe(entry) {
  mkdirSync(OUT, { recursive: true });
  const text = readFileSync(join(SKILL_SRC, entry.recipe), "utf8");
  const target = join(OUT, `${entry.slug}.md`);
  writeFileSync(target, text);
  ok(`${entry.name} → ${target}`);
}

function copyCode(entry) {
  const src = join(COMPONENTS_SRC, entry.slug);
  if (!existsSync(src)) return;
  cpSync(src, join(OUT, "components", entry.slug), { recursive: true });
  cpSync(join(COMPONENTS_SRC, "_lib"), join(OUT, "components", "_lib"), {
    recursive: true,
  });
  ok(`${entry.slug} source → ${join(OUT, "components", entry.slug)}`);
}

function writeTokens() {
  mkdirSync(OUT, { recursive: true });
  const target = join(OUT, "_root.css");
  writeFileSync(target, readFileSync(join(SKILL_SRC, "_root.css"), "utf8"));
  ok(`tokens → ${target} (import this once in your global stylesheet)`);
}

switch (command) {
  case "list": {
    for (const entry of manifest) console.log(`${entry.slug.padEnd(20)} ${entry.name}`);
    break;
  }
  case "add": {
    const wanted = flags.has("--all")
      ? manifest
      : manifest.filter((entry) => positional.slice(1).includes(entry.slug));
    if (wanted.length === 0)
      die(`nothing matched. Try: getopen-design list`);
    for (const entry of wanted) {
      writeRecipe(entry);
      if (flags.has("--code")) copyCode(entry);
    }
    writeTokens();
    break;
  }
  case "tokens": {
    writeTokens();
    break;
  }
  case "skill": {
    const target = join(".claude", "skills", "oa-design");
    mkdirSync(dirname(target), { recursive: true });
    cpSync(SKILL_SRC, target, { recursive: true });
    ok(`agent skill → ${target}`);
    console.log("Claude Code picks it up on the next session in this project.");
    break;
  }
  default: {
    console.log(
      [
        "getopen-design: the Open Analytics design language",
        "",
        "  list                     what's available",
        "  add <slug...> [--code]   write recipes (and source) into ./oa-design",
        "  add --all [--code]       everything",
        "  tokens                   write _root.css",
        "  skill                    install the agent skill into .claude/skills",
        "",
        "  --dir <path>             change the output directory",
      ].join("\n")
    );
  }
}
