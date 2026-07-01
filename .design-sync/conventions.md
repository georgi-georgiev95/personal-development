## Dark surface is required

This kit is built for a near-black app shell (`background: #030304`). Several
components use light/translucent colors that are only legible on that
surface — most notably `Text` (`tone="default"`/`"muted"` render pale text)
and `Skeleton` (its shimmer is a `rgba(255,255,255,0.06–0.14)` overlay,
invisible on white). When composing a design with this kit, give the
containing surface a dark background (`#030304`, or `#0a0d0f` for elevated
cards/panels) rather than the default light canvas — otherwise text and
skeletons will render but be unreadable.

## Styling idiom: variant/tone props, not utility classes

There are no CSS utility classes and no `var(--token)` custom properties to
target — every component is CSS-in-JS (Linaria) with values compiled in at
build time. Style components by passing their own variant props:

- `Button`: `variant="primary" | "secondary"`
- `Text`: `as="p"|"span"|"strong"|"em"|"label"|"small"|"div"`, `size="xs"|"sm"|"md"|"lg"|"xl"`, `tone="default"|"muted"|"inverse"|"accent"|"success"|"error"`, `weight="regular"|"medium"|"semibold"|"bold"`, `align="left"|"center"|"right"`, `truncate?: boolean`
- `Skeleton`: `variant="text"|"circle"|"rect"`, `width`/`height` (string or number, defaults to `1em`/`40px` depending on variant)
- `Modal`: `open`, `onOpenChange`, `label`, `showCloseButton?: boolean`, composed with `Modal.Header` / `Modal.Content` / `Modal.Footer`

No provider/root wrapper is required — the theme is baked into the compiled
CSS, not supplied at runtime.

## Where the truth lives

Read `styles.css` (and its `@import` of `_ds_bundle.css`) for the compiled
component styles, and each component's own `.prompt.md` for its exact prop
shape and story examples.

## Example

```jsx
<div style={{ background: '#030304', padding: 24 }}>
  <Text as="strong" size="lg" weight="bold">
    Large bold text for prominent UI labels
  </Text>
  <div style={{ marginTop: 16 }}>
    <Button variant="primary">Click me</Button>
  </div>
</div>
```
