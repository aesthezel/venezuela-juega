# DaisyUI Actions: Speed Dial

A fixed-position floating action button that reveals secondary actions when clicked or hovered.

## Basic Usage
Speed Dial uses the `dropdown` class combined with `fixed` and `btn-circle` for a classic floating action button feel.

```html
<div class="dropdown dropdown-top dropdown-end fixed right-6 bottom-6">
  <div tabindex="0" role="button" class="btn btn-primary btn-circle btn-lg shadow-xl">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </div>
  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-2xl mb-4">
    <li><a><svg>...</svg> New Document</a></li>
    <li><a><svg>...</svg> Upload Photo</a></li>
    <li><a><svg>...</svg> Share Link</a></li>
  </ul>
</div>
```

## Good vs. Bad Speed Dial
```html
<!-- Good: Semantic and properly positioned -->
<div class="dropdown dropdown-top fixed bottom-8 right-8">
  <button class="btn btn-accent btn-circle shadow-lg" aria-label="Quick Actions">
    +
  </button>
  <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box mb-2">
    <li><a>Action 1</a></li>
  </ul>
</div>

<!-- Bad: Manual absolute positioning and z-index hacks -->
<div class="absolute bottom-0 right-0 z-50 p-4">
  <button class="rounded-full h-12 w-12 bg-blue-500">
    +
  </button>
</div>
```

## Variants
- `dropdown-top`: Opens upwards (common for FABs).
- `dropdown-left` / `dropdown-right`: Horizontal speed dials.
- `btn-circle`: Essential for the rounded floating action button look.
