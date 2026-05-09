# Mockup: Browser

The browser mockup component displays content inside a simulated web browser window.

## Basic Usage

### Good Example: Browser with URL Bar
```html
<div class="mockup-browser bg-base-300 border">
  <div class="mockup-browser-toolbar">
    <div class="input">https://daisyui.com</div>
  </div>
  <div class="flex justify-center bg-base-200 px-4 py-16">Hello!</div>
</div>
```

## Variants

### Good Example: Different Background Colors
```html
<div class="mockup-browser bg-primary text-primary-content border">
  <div class="mockup-browser-toolbar">
    <div class="input">https://daisyui.com</div>
  </div>
  <div class="flex justify-center bg-base-100 p-4">...</div>
</div>
```

### Bad Example: Excessive Content Height
```html
<!-- Bad: Mockups are best for demos; if the content is extremely long, it breaks the "window" illusion. Use a fixed height with overflow-y-auto for long content. -->
<div class="mockup-browser">
  <div class="h-96 overflow-y-auto">...</div>
</div>
```
