#!/usr/bin/env node
/**
 * getopen-design: install the Open Analytics design language into a project.
 *
 * Run bare in a terminal it opens a wizard: what to install, which
 * components, where. The subcommands stay for scripts and agents:
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
 *
 * Convention shared with the `getopen` CLI: stdout carries answers (the
 * `list` output), stderr carries everything a person reads while deciding.
 */
import * as clack from "@clack/prompts";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
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

/* ── colours (stderr only, honouring NO_COLOR) ─────────────────────────── */

const paint = (() => {
  const on = process.stderr.isTTY === true && process.env.NO_COLOR === undefined;
  const wrap = (open, close) => (text) => (on ? `${open}${text}${close}` : text);
  return {
    dim: wrap("\u001b[2m", "\u001b[22m"),
    bold: wrap("\u001b[1m", "\u001b[22m"),
    blue: wrap("\u001b[34m", "\u001b[39m"),
    green: wrap("\u001b[32m", "\u001b[39m"),
  };
})();

const say = (line) => process.stderr.write(`${line}\n`);
const ok = (msg) => say(`${paint.green("✓")} ${msg}`);
const die = (msg) => {
  process.stderr.write(`✗ ${msg}\n`);
  process.exit(1);
};

/* ── the four verbs ────────────────────────────────────────────────────── */

function writeRecipe(entry, quiet = false) {
  mkdirSync(OUT, { recursive: true });
  const text = readFileSync(join(SKILL_SRC, entry.recipe), "utf8");
  const target = join(OUT, `${entry.slug}.md`);
  writeFileSync(target, text);
  if (!quiet) ok(`${entry.name} → ${target}`);
  return target;
}

function copyCode(entry, quiet = false) {
  const src = join(COMPONENTS_SRC, entry.slug);
  if (!existsSync(src)) return;
  cpSync(src, join(OUT, "components", entry.slug), { recursive: true });
  cpSync(join(COMPONENTS_SRC, "_lib"), join(OUT, "components", "_lib"), {
    recursive: true,
  });
  if (!quiet) ok(`${entry.slug} source → ${join(OUT, "components", entry.slug)}`);
}

function writeTokens(quiet = false) {
  mkdirSync(OUT, { recursive: true });
  const target = join(OUT, "_root.css");
  writeFileSync(target, readFileSync(join(SKILL_SRC, "_root.css"), "utf8"));
  if (!quiet) ok(`tokens → ${target}`);
  return target;
}

/**
 * `scope`: "project" writes into the current project's `.claude/skills`,
 * "user" into `~/.claude/skills`, where Claude Code sees it in EVERY project
 * on this machine.
 */
function installSkill(scope = "project", quiet = false) {
  const target =
    scope === "user"
      ? join(homedir(), ".claude", "skills", "oa-design")
      : join(".claude", "skills", "oa-design");
  mkdirSync(dirname(target), { recursive: true });
  cpSync(SKILL_SRC, target, { recursive: true });
  if (!quiet) ok(`agent skill → ${target}`);
  return target;
}

/* ── the wizard ────────────────────────────────────────────────────────── */

async function runWizard() {
  const io = { input: process.stdin, output: process.stderr };
  const inHome = process.cwd() === homedir();

  say("");
  say(`  ${paint.bold("OPEN ANALYTICS")} ${paint.dim("· design")}`);
  say(`  ${paint.dim("the design language of getopen.so, installable")}`);
  say("");

  const what = await clack.select({
    message: "What should this set up?",
    options: [
      {
        value: "skill",
        label: "The agent skill",
        hint: "Claude Code reads it automatically next session",
      },
      {
        value: "recipes",
        label: "Component recipes into this project",
        hint: "markdown your agent builds from, code included",
      },
      { value: "both", label: "Both", hint: "the full treatment" },
      { value: "tokens", label: "Just the token CSS", hint: "_root.css" },
    ],
    initialValue: "skill",
    ...io,
  });
  if (clack.isCancel(what)) {
    clack.cancel("Cancelled. Nothing was written.", io);
    return 1;
  }

  /**
   * Where the skill lives. Asked, because both answers are right for
   * somebody: project-scoped travels with the repo, user-scoped follows the
   * person. From the home folder there is no project to scope to, so the
   * question answers itself.
   */
  let skillScope = "project";
  if (what === "skill" || what === "both") {
    if (inHome) {
      skillScope = "user";
    } else {
      const scope = await clack.select({
        message: "Where should the skill live?",
        options: [
          {
            value: "project",
            label: "This project",
            hint: ".claude/skills/oa-design, travels with the repo",
          },
          {
            value: "user",
            label: "Every project on this machine",
            hint: "~/.claude/skills/oa-design",
          },
        ],
        initialValue: "project",
        ...io,
      });
      if (clack.isCancel(scope)) {
        clack.cancel("Cancelled. Nothing was written.", io);
        return 1;
      }
      skillScope = scope;
    }
  }

  // Recipes are project material; in the home folder there is no project.
  // Saying so beats writing a stray ~/oa-design the person finds months later.
  if (inHome && what !== "skill") {
    const sure = await clack.confirm({
      message:
        "You're in your home folder. Recipes are meant to live inside a project. Write them here anyway?",
      initialValue: false,
      ...io,
    });
    if (clack.isCancel(sure) || sure !== true) {
      clack.cancel("Nothing was written. cd into your project and run npx getopen-design again.", io);
      return 1;
    }
  }

  let picked = [];
  let withCode = false;
  if (what === "recipes" || what === "both") {
    const selection = await clack.multiselect({
      message: "Which components? (space toggles, enter confirms)",
      options: manifest.map((entry) => ({ value: entry.slug, label: entry.name })),
      initialValues: manifest.map((entry) => entry.slug),
      required: true,
      ...io,
    });
    if (clack.isCancel(selection)) {
      clack.cancel("Cancelled. Nothing was written.", io);
      return 1;
    }
    picked = manifest.filter((entry) => selection.includes(entry.slug));

    const code = await clack.confirm({
      message: "Copy the .tsx source files too?",
      // The recipes already embed the full source; the raw files are for
      // humans who want them in the tree.
      initialValue: false,
      ...io,
    });
    if (clack.isCancel(code)) {
      clack.cancel("Cancelled. Nothing was written.", io);
      return 1;
    }
    withCode = code === true;
  }

  const done = [];
  if (what === "skill" || what === "both") {
    done.push(`${paint.dim("skill:")}    ${installSkill(skillScope, true)}`);
  }
  if (picked.length > 0) {
    for (const entry of picked) {
      writeRecipe(entry, true);
      if (withCode) copyCode(entry, true);
    }
    done.push(
      `${paint.dim("recipes:")}  ${picked.length} × ${join(OUT, "<slug>.md")}${withCode ? " + source" : ""}`
    );
  }
  if (what !== "skill") {
    done.push(`${paint.dim("tokens:")}   ${writeTokens(true)}`);
  }

  clack.note(done.join("\n"), "Written", io);

  const next = [];
  if (what !== "skill") {
    next.push(`${paint.dim("1.")} import ${paint.blue(`${OUT}/_root.css`)} once in your global stylesheet`);
    next.push(`${paint.dim("2.")} tell your agent: ${paint.blue(`follow the recipes in ${OUT}/`)}`);
  }
  if (what === "skill" || what === "both") {
    next.push(
      `${paint.dim(next.length > 0 ? "3." : "1.")} Claude Code picks the skill up on the next session${skillScope === "user" ? ", in every project" : " in this project"}`
    );
  }
  clack.note(next.join("\n"), "Next steps", io);

  clack.outro("Build something calm.", io);
  return 0;
}

/* ── dispatch ──────────────────────────────────────────────────────────── */

const HELP = [
  "getopen-design: the Open Analytics design language",
  "",
  "  (no command)             interactive setup, in a terminal",
  "  list                     what's available",
  "  add <slug...> [--code]   write recipes (and source) into ./oa-design",
  "  add --all [--code]       everything",
  "  tokens                   write _root.css",
  "  skill [--user]           install the agent skill into .claude/skills",
  "                           (--user: ~/.claude/skills, every project)",
  "",
  "  --dir <path>             change the output directory",
].join("\n");

switch (command) {
  case "list": {
    for (const entry of manifest)
      process.stdout.write(`${entry.slug.padEnd(20)} ${entry.name}\n`);
    break;
  }
  case "add": {
    const wanted = flags.has("--all")
      ? manifest
      : manifest.filter((entry) => positional.slice(1).includes(entry.slug));
    if (wanted.length === 0) die("nothing matched. Try: getopen-design list");
    for (const entry of wanted) {
      writeRecipe(entry);
      if (flags.has("--code")) copyCode(entry);
    }
    writeTokens();
    say(paint.dim("Import _root.css once in your global stylesheet."));
    break;
  }
  case "tokens": {
    writeTokens();
    break;
  }
  case "skill": {
    const scope = flags.has("--user") ? "user" : "project";
    installSkill(scope);
    say(
      paint.dim(
        scope === "user"
          ? "Claude Code picks it up on the next session, in every project."
          : "Claude Code picks it up on the next session in this project."
      )
    );
    break;
  }
  case undefined: {
    // Bare invocation: a person in a terminal gets the wizard; a pipe gets
    // the help instead of a hang, the same manners as `oa init`.
    if (process.stdin.isTTY === true || flags.has("--interactive")) {
      process.exitCode = await runWizard();
    } else {
      say(HELP);
    }
    break;
  }
  default: {
    if (flags.has("--help") || command === "help") {
      say(HELP);
      break;
    }
    die(`unknown command: ${command}\n\n${HELP}`);
  }
}
