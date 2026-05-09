# DaisyUI Data Display: Text Rotate

An animation component that rotates text elements, useful for headlines with dynamic content.

## Basic Usage
The `text-rotate` class contains multiple spans that rotate in sequence.

```html
<h1 class="text-4xl font-bold">
  Build 
  <span class="text-rotate text-primary">
    <span>faster</span>
    <span>better</span>
    <span>stronger</span>
  </span>
  websites.
</h1>
```

## Patterns: Colors and Timing
You can style individual rotated items.

```html
<div class="text-lg">
  Status: 
  <span class="text-rotate font-mono">
    <span class="text-success">Online</span>
    <span class="text-warning">Connecting</span>
    <span class="text-error">Offline</span>
  </span>
</div>
```

## Good vs. Bad Text Rotate
```html
<!-- Good: Using the built-in text-rotate component -->
<span class="text-rotate">...</span>

<!-- Bad: Complex JavaScript intervals or heavy Framer Motion animations for simple text flips -->
<div id="rotating-text">...</div>
```
