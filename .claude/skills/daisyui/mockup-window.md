# Mockup: Window

The window mockup component displays content inside a simulated operating system window (macOS style).

## Basic Usage

### Good Example: Standard Window
```html
<div class="mockup-window bg-base-300 border">
  <div class="flex justify-center bg-base-200 px-4 py-16 text-xl">
    Hello!
  </div>
</div>
```

## Background Variants

### Good Example: Color and Contrast
```html
<div class="mockup-window bg-neutral text-neutral-content border">
  <div class="p-10">Window Content</div>
</div>
```

### Bad Example: Missing Border
```html
<!-- Bad: Without a border or a high-contrast background, the window mockup can blend into the page and lose its "window" effect -->
<div class="mockup-window bg-base-100">...</div>
```
