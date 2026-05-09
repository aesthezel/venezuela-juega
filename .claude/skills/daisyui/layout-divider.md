# Layout: Divider

Dividers create visual separation between elements and can optionally include text or icons.

## Basic Usage

### Good Example: Horizontal Divider
```html
<div class="flex flex-col w-full">
  <div class="grid h-20 card bg-base-300 rounded-box place-items-center">content</div>
  <div class="divider">OR</div>
  <div class="grid h-20 card bg-base-300 rounded-box place-items-center">content</div>
</div>
```

## Vertical Divider

Add the `divider-horizontal` class. Note that the parent container must be `flex-row`.

### Good Example: Side-by-side Separation
```html
<div class="flex w-full">
  <div class="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center">content</div>
  <div class="divider divider-horizontal">OR</div>
  <div class="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center">content</div>
</div>
```

## Colors

### Good Example: Semantic Divider Colors
```html
<div class="divider divider-primary">Primary</div>
<div class="divider divider-secondary">Secondary</div>
<div class="divider divider-accent">Accent</div>
```

### Bad Example: Absolute Positioning for Dividers
```html
<!-- Bad: Trying to manually position a divider line with absolute positioning and borders is brittle compared to the 'divider' utility -->
```
