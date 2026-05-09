# Layout: Join

The `join` component groups multiple items (buttons, inputs, etc.) together into a single cohesive unit with shared borders and radii.

## Basic Usage

### Good Example: Grouping Buttons and Inputs
```html
<div class="join">
  <input class="input input-bordered join-item" placeholder="Search..."/>
  <select class="select select-bordered join-item">
    <option disabled selected>Category</option>
    <option>Sci-fi</option>
    <option>Drama</option>
  </select>
  <button class="btn join-item">Search</button>
</div>
```

## Vertical Join

Add the `join-vertical` class to stack items.

### Good Example: Vertical Button Group
```html
<div class="join join-vertical">
  <button class="btn join-item">Top</button>
  <button class="btn join-item">Middle</button>
  <button class="btn join-item">Bottom</button>
</div>
```

## Responsive Join

### Good Example: Vertical on Mobile, Horizontal on Desktop
```html
<div class="join join-vertical lg:join-horizontal">
  <button class="btn join-item">Item 1</button>
  <button class="btn join-item">Item 2</button>
</div>
```

### Bad Example: Missing Join-Item Class
```html
<!-- Bad: Items without 'join-item' will not have their border-radii adjusted, leading to broken visual continuity -->
<div class="join">
  <button class="btn">1</button>
  <button class="btn">2</button>
</div>
```
