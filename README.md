# oa-design

The design language of [Open Analytics](https://getopen.so), packaged as an
AI-agent skill. People kept asking how the dashboard looks and moves the way
it does; this repository is the answer, in a form an agent can execute: every
hex code, spring constant, radius and easing, extracted from the shipped
product, with the reasoning attached.

**Two editions, same content:**

- [`DESIGN-SKILL.md`](DESIGN-SKILL.md): everything in one file. Paste it into
  any agent's context, or drop it into your repo as a rule file. This is the
  one to grab if you just want the look.
- [`SKILL.md`](SKILL.md) + [`references/`](references/): the proper skill
  package for skill-aware agents (Claude Code and friends). The core stays
  small and the agent reads only the reference it needs (tokens, layout,
  components, motion, landing, copy).

## Install

**Claude Code** (project-scoped):

```sh
git clone https://github.com/OpenLabs-so/oa-design .claude/skills/oa-design
```

or user-scoped, available in every project:

```sh
git clone https://github.com/OpenLabs-so/oa-design ~/.claude/skills/oa-design
```

Then just build UI; the skill triggers itself. Or invoke it by name:
"use the oa-design skill".

**Cursor, Codex, and other agents**: add a line to your rules file
(`AGENTS.md`, `.cursorrules`) pointing at the single-file edition:

```
When building or styling UI, follow DESIGN-SKILL.md in full.
```

**No agent at all**: read `DESIGN-SKILL.md` yourself; it is written for
humans too.

## What's inside

- One ink, every neutral derived from it by `color-mix` percentages.
- The squircle surface system (CSS `shape()` clip-path, both layers, exact
  radii) behind the cards.
- A seven-spring motion vocabulary that covers the entire product, plus the
  signature moves: the measured-height dialog choreography, the tab bar's
  label mask, the landing header's glass morph, the blur skeleton reveal.
- Layout as plates, the fixed-height card grid, the notice/empty-state
  patterns, toast physics.
- The copy voice, because half the design is the words.
- The quality floor: focus rings, reduced motion, no sideways scroll.

## What this is not

Not a component library and not a theme package: there is no npm install and
no dependency on us. It is a description precise enough to rebuild the look
in any stack. The values were written against React + Tailwind v4 +
[`motion`](https://motion.dev), but they are plain CSS numbers and spring
constants; port them anywhere.

## Credits

- Built from the shipped UI of [Open Analytics](https://getopen.so), which is
  itself [open source](https://github.com/OpenLabs-so/openanalytics).
- The skeleton blur-reveal pattern is our implementation of an idea we first
  saw in [Transitions.dev](https://transitions.dev)'s loader. Thank you.

## License

MIT. Use it, ship it, sell what you build with it. A link back is appreciated
but not required.
