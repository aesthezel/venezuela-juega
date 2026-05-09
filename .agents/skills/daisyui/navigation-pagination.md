# Navigation: Pagination

Pagination allows users to navigate through multi-page content using a group of buttons.

## Basic Usage

Wrap buttons in a `join` container to group them together.

### Good Example: Simple Pagination
```html
<div class="join">
  <button class="join-item btn">1</button>
  <button class="join-item btn btn-active">2</button>
  <button class="join-item btn">3</button>
  <button class="join-item btn">4</button>
</div>
```

## Sizes

### Good Example: Different Sizes
```html
<div class="join">
  <button class="join-item btn btn-xs">1</button>
  <button class="join-item btn btn-xs">2</button>
</div>
```

## Navigation with Arrows

### Good Example: Prev/Next Buttons
```html
<div class="join">
  <button class="join-item btn">«</button>
  <button class="join-item btn">Page 22</button>
  <button class="join-item btn">»</button>
</div>
```

### Bad Example: Ungrouped Buttons
```html
<!-- Bad: Without the 'join' container, buttons will have standard margins and separated borders -->
<button class="btn">1</button>
<button class="btn">2</button>
```
