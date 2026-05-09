# DaisyUI Data Display: Hover 3D Card

A visually striking card component that tilts in 3D space based on mouse position.

## Basic Usage
The `hover-3d` class requires 8 empty `div` elements inside to handle the hover detection zones.

```html
<div class="hover-3d h-64 w-96">
  <!-- 8 divs for hover detection -->
  <div></div><div></div><div></div><div></div>
  <div></div><div></div><div></div><div></div>
  
  <div class="hover-3d-card bg-primary text-primary-content grid place-content-center rounded-xl shadow-2xl">
    <div class="text-3xl font-bold">Tilt Me</div>
  </div>
</div>
```

## Patterns
Use `bg-base-100` and `shadow-xl` for a more subtle, professional card look.

```html
<div class="hover-3d h-72 w-60">
  <div></div><div></div><div></div><div></div>
  <div></div><div></div><div></div><div></div>
  <div class="hover-3d-card bg-base-100 p-6 rounded-box shadow-xl border border-base-300">
    <h3 class="text-lg font-bold">Interactive Card</h3>
    <p class="text-sm opacity-70">Move your mouse over this card to see the 3D effect.</p>
  </div>
</div>
```

## Good vs. Bad Hover 3D
```html
<!-- Good: Pure CSS 3D effect using DaisyUI classes -->
<div class="hover-3d">...</div>

<!-- Bad: Heavy JavaScript libraries (like Tilt.js) for simple UI effects -->
<div data-tilt class="manual-tilt-card">...</div>
```
