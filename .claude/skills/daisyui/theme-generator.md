# DaisyUI 5 Theme Generator

Guide for generating and customizing themes in DaisyUI 5 using Tailwind CSS 4 `@theme` blocks.

## Basic Usage
In DaisyUI 5, themes are defined using standard CSS variables within a Tailwind `@theme` block.

```css
@theme {
  --color-primary: oklch(0.65 0.25 250);
  --color-secondary: oklch(0.7 0.15 300);
  --radius-box: 1rem;
  --radius-btn: 0.5rem;
}
```

## Pattern: Multiple Themes
You can define multiple themes by nesting variables under data attributes.

```css
[data-theme="my-custom-theme"] {
  --color-primary: oklch(0.6 0.2 20);
  --color-base-100: oklch(0.95 0.02 20);
  --color-base-content: oklch(0.2 0.05 20);
}

[data-theme="dark-pro"] {
  --color-primary: oklch(0.5 0.15 200);
  --color-base-100: oklch(0.2 0.01 200);
  --color-base-content: oklch(0.9 0.01 200);
}
```

## Good vs. Bad Theme Config
```css
/* Good: Using OKLCH for consistent perceptual lightness across themes */
--color-primary: oklch(0.65 0.25 250);

/* Bad: Using Hex codes which don't support modern color features natively */
--color-primary: #3b82f6;
```

## Key Variable Prefix
DaisyUI 5 looks for specifically named variables to apply its component styles:
- `--color-primary`, `--color-secondary`, etc.
- `--color-base-100`, `--color-base-200`, etc.
- `--radius-btn`, `--radius-box`.
- `--padding-card`.
