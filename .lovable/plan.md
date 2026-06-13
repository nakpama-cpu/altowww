## Goal

Make the Min/Max price filters easy to adjust on phone and tablet, where the native number-input arrows aren't shown. Add tactile −/+ buttons that step by £500.

## Scope

File: `src/pages/portal/AvailableStock.tsx` (Min and Max price inputs, lines ~230–261). No other pages or logic touched.

## Layout (each field)

```
[ − ] [ £  1,500     ] [ + ]
```

- `−` and `+` are square buttons (h-10, w-10), matching the input border/colors, with `Minus`/`Plus` icons from lucide-react.
- Input keeps the £ prefix, `type="number"`, `min=0`, `step=500`, no-negative guard, and current value/onChange wiring.
- Inputs/buttons sit in a `flex` row inside the existing grid cells so they still occupy `md:col-span-2 lg:col-span-2`.

## Stepper behaviour

- `+` adds £500 to the current value (empty/invalid → starts at £500 for Min, £500 for Max).
- `−` subtracts £500, clamped to 0; if value becomes 0 and field is Min, leave at 0; never go negative.
- Buttons use `type="button"` so they don't submit anything.
- Holding the button is not required — single taps only (keeps it simple and predictable).

## Accessibility / polish

- `aria-label="Decrease minimum price"` etc.
- Disabled state on `−` when value is 0/empty, with reduced opacity.
- Same copper focus ring as other filter controls.

## Out of scope

- No range slider, no preset chips, no changes to other filters, no changes to the cask query/sort logic.
