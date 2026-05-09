# DaisyUI Data Display: Avatar

A versatile component for displaying user profile pictures, initials, or status indicators.

## Basic Usage
The `avatar` class wraps an image or text element.

```html
<div class="avatar">
  <div class="w-24 rounded">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </div>
</div>

<!-- With placeholder (initials) -->
<div class="avatar placeholder">
  <div class="bg-neutral text-neutral-content w-12 rounded-full">
    <span>JS</span>
  </div>
</div>
```

## Pattern: Sizes & Shapes
Avatars can be shaped using standard Tailwind border-radius classes inside the `avatar` wrapper.

```html
<!-- Rounded-full (Circle) -->
<div class="avatar">
  <div class="w-16 rounded-full">
    <img src="..." />
  </div>
</div>

<!-- Mask Squircle -->
<div class="avatar">
  <div class="mask mask-squircle w-20">
    <img src="..." />
  </div>
</div>
```

## Good vs. Bad Avatar
```html
<!-- Good: Semantic avatar container with proper sizing -->
<div class="avatar">
  <div class="w-12 h-12 rounded-full">
    <img src="user.jpg" alt="User profile" />
  </div>
</div>

<!-- Bad: Manual image styling without container -->
<img src="user.jpg" class="rounded-full w-12 h-12 object-cover border-2 border-white" />
```

## Quick Reference
- `avatar-online`: Adds a green status indicator.
- `avatar-offline`: Adds a gray status indicator.
- `avatar-group`: Wrapper for multiple overlapping avatars.
