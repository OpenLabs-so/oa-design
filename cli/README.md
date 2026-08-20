# getopen-design

The design language of [Open Analytics](https://getopen.so), installable.
People kept asking how the dashboard looks and moves the way it does; this
CLI puts the answer into your project, in a form an AI agent can build from:
every hex code, spring constant, radius and easing, lifted from the shipped
product.

The look in one sentence: **white surfaces with continuous-curvature corners,
resting on a quiet grey stage, drawn in a single ink, moved by a single
spring.**

## Use

```sh
npx getopen-design
```

Run bare in a terminal it walks you through it: install the agent skill
(Claude Code reads it automatically), drop component recipes into your
project, or just take the token CSS.

For scripts and agents, the subcommands:

```sh
npx getopen-design list                  # what's available
npx getopen-design add tab-bar toast     # recipes into ./oa-design
npx getopen-design add --all --code      # everything, .tsx source included
npx getopen-design tokens                # just _root.css
npx getopen-design skill                 # agent skill into .claude/skills
npx getopen-design add --all --dir kit   # somewhere else
```

## What you get

- **Recipes**: one markdown file per component: when to use it, the
  load-bearing details, and the full type-checked React source embedded.
  Squircle card, button, dropdown, tab bar, modal, multi-step dialog,
  skeleton, notice strip, floating pill, toast, header morph, scroll reveal.
- **The agent skill**: the recipes plus six guides (tokens, layout, motion,
  landing pages, copy voice) under `.claude/skills/oa-design`, triggering by
  itself whenever you build UI.
- **`_root.css`**: the token block everything reads from. One ink, every
  neutral derived from it; import it once in your global stylesheet.

The recipes are never written by hand: the repository generates them from
compiled source, so the code in the markdown is exactly the code that passes
`tsc`.

Written against React + Tailwind v4 + [`motion`](https://motion.dev), but the
values are plain CSS numbers and spring constants; port them anywhere. If
your project already has a design system, yours wins; use this to fill gaps.

## Links

- Repository: [OpenLabs-so/oa-design](https://github.com/OpenLabs-so/oa-design)
- The product it comes from: [getopen.so](https://getopen.so), itself
  [open source](https://github.com/OpenLabs-so/openanalytics)
- Everything as one pasteable file:
  [DESIGN-SKILL.md](https://github.com/OpenLabs-so/oa-design/blob/main/DESIGN-SKILL.md)

MIT. Use it, ship it, sell what you build with it.
