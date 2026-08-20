# Motion

The app moves like one hand because it owns a tiny vocabulary and refuses to
grow it. Everything is springs (via the `motion` package) or sub-200ms eased
fades; the landing page adds one slower CSS family of its own (see
`landing.md`).

## The spring vocabulary

| Name | Value | Used for |
| --- | --- | --- |
| PANEL | `stiffness 550, damping 38` | dropdowns, menus, boards, toggles, anything that opens in place |
| LAYOUT | `stiffness 550, damping 40` | measured height/width animation, sliding pills, marker moves |
| POP | `stiffness 400, damping 26` | modal/dialog entrance |
| POP_EXIT | `stiffness 380, damping 28` | modal exit (slightly softer, gets out of the way) |
| BANNER | `stiffness 400, damping 30` | the floating pill, page-level banners |
| FLICK | `stiffness 900, damping 50` | icon micro-moves (a chevron turning, a glyph swap) |
| CHART | `stiffness 300, damping 25-30` | chart tooltips and crosshair followers |

Micro fades that accompany these run 0.1s to 0.18s `easeOut`. Nothing in the
app chrome uses a duration-based tween longer than 0.2s; if it feels slow,
lower the damping before you reach for a longer duration.

Do not add an eighth spring. When a new component appears, it borrows from
this table, and that inheritance is why a menu, a modal and a tab bar built
months apart feel like siblings.

## Signature moves

**Measured-height choreography** (multi-step dialogs, swapping faces):
one constant panel, content steps sliding through it.

```tsx
const SPRING = { type: "spring", stiffness: 550, damping: 40 } as const;
// ResizeObserver reports the step's border-box height into a motion value;
// the panel animates height with SPRING while AnimatePresence (popLayout)
// slides steps horizontally: enter x: dir * 12, exit x: dir * -12,
// opacity 0 ↔ 1, duration 0.16, easeOut.
```

The exiting step pops out of layout flow (`mode="popLayout"`) so the incoming
one is what the panel measures. Direction is derived from the navigation
(forward = 1, back = -1), so Back slides the opposite way.

**The sliding highlight** (menus, segmented controls, tab bars): the active
state is one shared element that travels between items (a `layoutId` pill or a
width/height spring pair at LAYOUT), never a per-item background flip. The eye
follows the object; repainting reads as flicker.

**The label mask** (tab bar): the pill is a fixed window and labels slide
behind it, entering from the travel direction at 110% of their own width,
exiting a fixed 130px the other way, both on LAYOUT, clipped by the pill.
Full opacity throughout; the mask does the work, not a fade.

**Enter/exit asymmetry**: exits are always faster than entrances (0.1s vs
0.16s fades; POP vs POP_EXIT). Things arrive with presence and leave without
ceremony.

**Hover**: color transitions only (`transition-colors`, default duration),
plus at most one 2px translate on an inline arrow
(`transition-transform duration-200`). Cards do not lift, scale or glow on
hover; the press effect on buttons (`translate-y-px + scale 0.98`) is the
only geometry change the pointer causes.

**Continuous ambients** are rare and tiny: the scroll chevron bobbing 2.5px
(1.4s easeInOut loop), a pulsing status dot, a shimmer sweeping a primary CTA
every 3.5s (sweep spans the first 75% of the cycle, then rests). One ambient
per screen at most.

## Rules

- **AnimatePresence for everything that unmounts.** Nothing blinks out; it
  exits. Keyed swaps (`key={face}`) crossfade with the directional slide.
- **Respect `prefers-reduced-motion`.** Reveals collapse to visible, ambient
  loops stop, springs may snap. The information must never live only in the
  motion.
- **Never animate layout you did not measure.** Height "auto" animations are
  the measured-height choreography, not `height: auto` tweens.
- **The wall clock is not a render input.** Anything time-driven (countdowns,
  clocks) subscribes to a ticking store in minute buckets rather than reading
  `Date.now()` in render.
