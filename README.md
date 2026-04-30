# Midi Take-Home

## What I built

- **Selectable Pill** - toggle component rendered as a semantic `<button>` with `aria-pressed`
- **Card layout** - symptom-selection UI using `Pill` with a primary CTA
- **Button component** - all hierarchies, sizes, states, icon slots, and icon-only variant from the Figma spec
- **Token layer** - three-layer architecture (primitive → alias → mapped) wired into both components

## Key decisions

**`Pill` as a separate component, not a `Button` variant.** They have different jobs - `Pill` is a toggle, `Button` is an action. Shared visual primitives (layout, focus, transitions) live in `shared/_selectable-blueprint.scss`, a SCSS partial that both components `@extend` as sibling consumers. The APIs stay independent without duplicating styles.

**Selected pills use a dark neutral** - avoids competing with the CTA for visual weight.

**One pill size (28px)** - compact enough to stay secondary to the CTA. Passes WCAG 2.2 AA (24px min).

**No leading check icon on selected pills** - an icon would cause layout shift on toggle and the fill change is enough differentiation.

**BEM** - makes component anatomy readable in the DOM and pairs naturally with the component-scoped CSS variable layer (modifiers reassign vars, never override properties directly).

## How I used AI

- **Conversationally** - pressure-testing decisions like `Pill` vs. `Button` variant, color hierarchy, and card layout
- **Figma MCP + Claude Code** - imported variables to scaffold the token layer instead of hand-transcribing hex values
- **Claude Code** - component scaffolding. I pushed back on the initial output to get a component-scoped CSS variable approach instead of hardcoded colors

Most of the adjustments went into system-level choices (token architecture, state logic, a11y) rather than implementation details.

## Accessibility

- `Pill` uses `aria-pressed` for toggle state (not `aria-selected`, which is for listbox/tab patterns)
- `Button` uses `aria-busy` during loading and blocks interaction rather than just dimming
- `:focus-visible` for keyboard-only focus rings
- Selected state uses fill-level shift, not color alone

## Token architecture

The provided Figma file uses a flat structure with no alias layer. I wired up a three-layer architecture instead:

**Primitive → Semantic alias → Mapped** (consumed by components)

Plus a 4th component-scoped layer: vars like `--button-bg` that modifiers override, so no modifier ever touches a CSS property directly.

## System observations (flagged not fixed)

- `Button` colors are raw styles - a semantic variables layer exists but isn't wired
- Hover/focus behavior is inconsistent across hierarchies. Primary hovers _lighter_ (400 → 200) and focus shifts fill to Primary 600; Secondary hovers _darker_ and focus leaves the fill unchanged in Figma. In code, implemented Primary as unchanged fill for focused state.
- Primary 600 only appears on focus - mouse users never see the saturated brand blue
- The focus-ring token (pale green) fails contrast requirements
- `link-color` and `link-gray` are visually identical across all states in Figma despite their distinct names. I implemented them as separate hierarchies - `link-color` with the action color, `link-gray` with neutral text - treating the distinction as intended
- Colors are in Figma styles, not variables - styles don't alias or support modes, and come through the MCP as raw hex with no semantic reference chain. Migrating to variables would enable dark mode and clean MCP-to-code handoff

I did fix one: typography tokens existed but weren't applied to `Button` so I wired them in for both components.

## What I'd do with more time

**In code:**

- Prove the token architecture with a dark-mode override at the alias layer
- Add a `disabled` state to `Pill`
- Propose the flagged observations as system-level PRs
- Add a regression testing strategy: visual snapshots (e.g. Chromatic/Percy) to catch unintended style changes across all hierarchy × size × state combinations, plus a written spec so reviewers have a baseline to diff against rather than relying on eyeballing

**In Figma:**

- Rebuild the token layer in the same three-tier architecture (primitive → alias → mapped) so the Figma source mirrors the code
- Add text styles for the type scale so typography consumes tokens end-to-end, not just in code
- Add responsive behavior to the card and component specs

For a working example of this token architecture, color system, and responsive approach, see my [personal design system docs](https://ameliakim.co/design-system/docs/foundation).

## Tests

```bash
npm test                # run once
npm run test:watch      # re-run on save
npm run test:coverage   # with coverage report
```

80 tests across `Button` and `Pill`:

| Category          | What's covered                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Rendering**     | label output, default `type="button"`, attribute forwarding, ref forwarding, className merging                                             |
| **Variants**      | all 6 `Button` hierarchies, all 4 sizes, `Pill` size `md`                                                                                  |
| **States**        | selected (`aria-pressed`, `pill--selected`), loading (`aria-busy`, spinner, loading text, disabled), disabled (native + click suppression) |
| **Icon slots**    | leading, trailing, both together, `aria-hidden` on wrappers, icon-only label suppression                                                   |
| **Interaction**   | click, keyboard Space/Enter, `onToggle` direction (true/false), no-fire when disabled or loading, native `onClick` alongside `onToggle`    |
| **Accessibility** | axe audit across every hierarchy, size, and state: catches `button-name`, `aria-busy`, and structural violations                           |

## Getting Started

Built with [Vite](https://vite.dev/guide/), React, TypeScript, and SCSS.

```bash
npm install
npm run dev
```

## Design Reference

Figma: [Midi Take-Home Submission](https://www.figma.com/design/xEXmb9BaMUOuT2umOd53pd/Midi-Take-Home-Submission)

https://github.com/user-attachments/assets/cfbf3158-b36d-4a58-b639-3c1fc4bb0d64

