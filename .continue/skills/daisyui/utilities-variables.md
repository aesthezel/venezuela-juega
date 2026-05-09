# Utilities & Variables

DaisyUI 5 and Tailwind CSS 4 integrate deeply, allowing you to use CSS variables to override specific component behaviors without writing complex selectors.

## Layout Utilities

Use standard Tailwind layout utilities alongside DaisyUI components.

### Good Example: Mixing Tailwind Layout with DaisyUI
```html
<div class="flex flex-col gap-4 p-6 sm:grid sm:grid-cols-2">
  <div class="card bg-base-100 shadow-sm">...</div>
  <div class="card bg-base-100 shadow-sm">...</div>
</div>
```

## Variable Overrides

DaisyUI 5 allows overriding specific component variables within a local scope or in the `@theme` block.

### Good Example: Local Variable Override
```html
<!-- Overriding the border radius locally using arbitrary property syntax in Tailwind 4 -->
<button class="btn btn-primary [--rounded-btn:0.5rem]">
  Slightly Rounded Button
</button>
```

### Good Example: Global Theme Overrides
```css
@theme {
  /* Tailwind 4 @theme syntax for global DaisyUI variables */
  --rounded-box: 1rem; /* Border radius for cards and modals */
  --rounded-btn: 0.5rem; /* Border radius for buttons */
  --animation-btn: 0.25s; /* Click animation duration */
}
```

### Bad Example: Important Flags and Custom CSS
```css
/* Bad: Bypassing the built-in variable system */
.btn {
  border-radius: 0px !important;
}
```
