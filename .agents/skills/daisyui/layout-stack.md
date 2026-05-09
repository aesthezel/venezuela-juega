# Layout: Stack

The stack component visually layers multiple elements on top of each other, creating a sense of depth or grouping (like a stack of cards or photos).

## Basic Usage

### Good Example: Stack of Cards
```html
<div class="stack">
  <div class="card bg-primary text-primary-content shadow-md">
    <div class="card-body">Top card</div>
  </div>
  <div class="card bg-secondary text-secondary-content shadow-sm">
    <div class="card-body">Middle card</div>
  </div>
  <div class="card bg-accent text-accent-content shadow-xs">
    <div class="card-body">Bottom card</div>
  </div>
</div>
```

## Stacking Images

### Good Example: Image Gallery Stack
```html
<div class="stack">
  <img src="..." class="rounded-box" />
  <img src="..." class="rounded-box" />
  <img src="..." class="rounded-box" />
</div>
```

## Interaction Patterns

Stacks are often used with hover effects to "expand" the stack via custom CSS or simple JS toggles.

### Bad Example: Too many items
```html
<!-- Bad: Stacking more than 3-4 items usually results in a messy appearance as the underlying items become too crowded -->
<div class="stack">
  <!-- 10 items ... -->
</div>
```
