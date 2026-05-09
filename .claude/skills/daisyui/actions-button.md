# DaisyUI Actions: Buttons

Comprehensive guide for `btn` classes in daisyUI 5.

## Basic Patterns
Buttons come in various colors and styles. Always prefer semantic modifiers.

```html
<!-- Colors -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-accent">Accent</button>
<button class="btn btn-info">Info</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-error">Error</button>

<!-- Styles -->
<button class="btn btn-soft">Soft (Light background)</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost (No background)</button>
<button class="btn btn-dash">Dashed Border</button>
<button class="btn btn-link">Link Style</button>
```

## Pattern: Sizing & Shapes
Use size modifiers for consistent scaling across devices.

```html
<!-- Sizes -->
<button class="btn btn-xs">Extra Small</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-md">Medium (Default)</button>
<button class="btn btn-lg">Large</button>
<button class="btn btn-xl">Extra Large</button>

<!-- Shapes -->
<button class="btn btn-square">
  <svg>...</svg>
</button>
<button class="btn btn-circle">
  <svg>...</svg>
</button>
<button class="btn btn-wide">Wide Button</button>
<button class="btn btn-block">Full Width</button>
```

## Good vs. Bad Buttons
```html
<!-- Good: Semantic and accessible -->
<button class="btn btn-primary btn-sm" aria-label="Submit Form">
  Submit
</button>

<!-- Bad: Over-relying on Tailwind utilities -->
<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
  Manual Button (Harder to theme)
</button>
```

## Quick Reference: State Classes
- `btn-disabled` / `disabled`: Applies grayed out style and removes pointer events.
- `btn-active`: Forces active/pressed state visual.
- `loading`: (Handled via feedback-loading.md) Can be added to buttons.
