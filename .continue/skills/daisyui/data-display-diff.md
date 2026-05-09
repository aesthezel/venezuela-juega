# DaisyUI Data Display: Diff

A component to compare two images or elements side-by-side with a draggable slider.

## Basic Usage
The `diff` class contains two items and a handle is automatically generated.

```html
<div class="diff aspect-16/9">
  <div class="diff-item-1">
    <img alt="daisyui" src="https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a.webp" />
  </div>
  <div class="diff-item-2">
    <img alt="daisyui" src="https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a-blur.webp" />
  </div>
  <div class="diff-resizer"></div>
</div>
```

## Pattern: Content Comparison
You can compare text or any HTML content, not just images.

```html
<div class="diff aspect-16/9">
  <div class="diff-item-1">
    <div class="bg-primary text-primary-content grid place-content-center text-9xl font-black">
      BEFORE
    </div>
  </div>
  <div class="diff-item-2">
    <div class="bg-base-200 grid place-content-center text-9xl font-black">
      AFTER
    </div>
  </div>
  <div class="diff-resizer"></div>
</div>
```

## Good vs. Bad Diff
```html
<!-- Good: Using the built-in diff component -->
<div class="diff h-64">...</div>

<!-- Bad: Manual implementation with range inputs and absolute positioning -->
<div class="relative overflow-hidden">
  <div class="absolute inset-0">...</div>
  <input type="range" class="absolute w-full ..." />
</div>
```
