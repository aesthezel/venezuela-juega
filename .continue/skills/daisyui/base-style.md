# Base Style

DaisyUI 5 relies on Tailwind CSS 4 and OKLCH color spaces. Base styles are automatically applied to standard HTML elements when using the plugin, but can be customized heavily using CSS variables.

## Semantic Colors and OKLCH

Colors in DaisyUI 5 are defined using OKLCH to ensure perceptual uniformity.

### Good Example: Overriding Colors in CSS
```css
/* Customizing base colors in Tailwind 4 / DaisyUI 5 */
@theme {
  --color-primary: oklch(0.65 0.25 250);
  --color-secondary: oklch(0.7 0.15 300);
  --color-base-100: oklch(0.98 0.01 200);
  --color-base-content: oklch(0.2 0.05 200);
}
```

### Good Example: Using Semantic Variables in Utility Classes
```html
<!-- Use semantic names directly, mapping to standard Tailwind 4 colors -->
<div class="bg-base-100 text-base-content">
  <h1 class="text-primary">Welcome</h1>
  <p class="text-secondary">This text uses the secondary color.</p>
</div>
```

### Bad Example: Hardcoding Hex Codes
```html
<!-- Bad: Breaks theme support and OKLCH perceptual lightness -->
<div class="bg-[#ffffff] text-[#333333]">
  <h1 class="text-[#3b82f6]">Welcome</h1>
</div>
```

## Key Variables
- `base-100`: Main background color.
- `base-200`, `base-300`: Slightly darker variants for cards or panels.
- `base-content`: Text color for `base-*` backgrounds.
- `primary`, `secondary`, `accent`, `neutral`: Brand colors.
- `info`, `success`, `warning`, `error`: State colors.
