# DaisyUI Navigation: Dock

A bottom navigation component (formerly `btm-nav`) optimized for mobile web and desktop applications.

## Basic Usage
The `dock` class creates a fixed bottom bar.

```html
<div class="dock">
  <button>
    <svg>...</svg>
    <span class="dock-label">Home</span>
  </button>
  <button class="dock-active">
    <svg>...</svg>
    <span class="dock-label">Search</span>
  </button>
  <button>
    <svg>...</svg>
    <span class="dock-label">Profile</span>
  </button>
</div>
```

## Pattern: Responsive Dock
Hide labels on small screens or change dock position.

```html
<div class="dock dock-sm md:dock-md lg:dock-lg">
  <button class="text-primary">
    <svg>...</svg>
  </button>
  <button>
    <svg>...</svg>
  </button>
</div>
```

## Good vs. Bad Dock
```html
<!-- Good: Semantic dock with proper button interaction -->
<nav class="dock">
  <a href="/">...</a>
</nav>

<!-- Bad: Manual absolute positioning and flex-grow hacks -->
<div class="fixed bottom-0 w-full flex justify-around bg-white">...</div>
```

## Quick Reference
- `dock-active`: Highlights the current item.
- `dock-xs` to `dock-lg`: Sizing.
- `dock-label`: Optional text label below icons.
