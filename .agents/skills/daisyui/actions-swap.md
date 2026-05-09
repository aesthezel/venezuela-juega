# Actions: Swap

The `swap` class allows toggling between two different elements (usually icons, text, or SVGs) using a hidden checkbox or dynamically via a class toggle.

## Checkbox Trigger

### Good Example: Icon Swap (Active/Inactive)
```html
<label class="swap swap-rotate">
  <!-- This hidden checkbox controls the state -->
  <input type="checkbox" />

  <!-- Sun icon (shown when unchecked) -->
  <svg class="swap-off h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <!-- SVG Path -->
  </svg>

  <!-- Moon icon (shown when checked) -->
  <svg class="swap-on h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <!-- SVG Path -->
  </svg>
</label>
```

## Animation Variants

Use modifier classes to change the transition effect.

- `swap-rotate`: Rotates the elements during the swap.
- `swap-flip`: Flips the elements 3D style.

### Good Example: Flip Animation with Text
```html
<label class="swap swap-flip text-9xl">
  <input type="checkbox" />
  <div class="swap-on">😈</div>
  <div class="swap-off">😇</div>
</label>
```

### Bad Example: Manual State Management for Pure UI Swaps
```html
<!-- Bad: Using JS for a purely visual toggle when CSS can handle it via the 'swap' class -->
<div onclick="toggleIcon()">
  <span id="icon-a">A</span>
  <span id="icon-b" class="hidden">B</span>
</div>
```
