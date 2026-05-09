# Data Display: Badge

Badges are used to highlight an item's status for quick recognition.

## Colors and Variants

DaisyUI provides semantic colors and stylistic variants for badges.

### Good Example: Color Badges
```html
<div class="badge">neutral</div>
<div class="badge badge-primary">primary</div>
<div class="badge badge-secondary">secondary</div>
<div class="badge badge-accent">accent</div>
```

### Good Example: Variant Badges
```html
<div class="badge badge-outline">Outline</div>
<div class="badge badge-ghost">Ghost</div>
<div class="badge badge-soft">Soft</div> <!-- New in DaisyUI 5 -->
```

## Sizes

### Good Example: Sizing Badges
```html
<div class="badge badge-lg">Large</div>
<div class="badge badge-md">Medium</div>
<div class="badge badge-sm">Small</div>
<div class="badge badge-xs">Extra Small</div>
```

## Common Use Case: Badges in Buttons

### Good Example: Badge in a Button
```html
<button class="btn">
  Inbox
  <div class="badge badge-secondary">+99</div>
</button>
```

### Bad Example: Arbitrary Styling
```html
<!-- Bad: Ignoring built-in badge sizes and variants -->
<div class="badge bg-red-500 border-2 border-dashed text-[10px] p-4">Custom</div>
```
