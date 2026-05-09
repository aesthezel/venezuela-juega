# DaisyUI Themes

Expert guidance for implementing and customizing themes in daisyUI 5.

## Official Themes
daisyUI includes 32+ built-in themes. Activate them by adding `data-theme` to your `<html>` tag.

| Theme Group | Names |
|-------------|-------|
| Clean | `light`, `dark`, `cupcake`, `bumblebee`, `winter`, `nord` |
| Vibrant | `emerald`, `corporate`, `synthwave`, `cyberpunk`, `aqua` |
| Aesthetic | `retro`, `valentine`, `halloween`, `garden`, `forest`, `lofi`, `pastel`, `fantasy` |
| Pro | `luxury`, `dracula`, `business`, `night`, `coffee`, `dim`, `sunset` |

## Theme Activation
```html
<!-- Single theme -->
<html data-theme="cupcake">

<!-- Dark mode toggle support -->
<html data-theme="light">
<!-- Switch to -->
<html data-theme="dark">
```

## Pattern: Customizing with Tailwind 4
In Tailwind 4, you customize daisyUI themes directly in your CSS using the `@theme` block.

```css
@import "tailwindcss";
@plugin "daisyui";

@theme {
  /* Customize an existing theme */
  --color-primary: oklch(0.7 0.2 150);
  --color-primary-content: oklch(0.98 0.01 150);
  
  /* Create a custom theme object */
  --daisyui-theme-mytheme: {
    "primary": "#570df8",
    "primary-content": "#ffffff",
    "secondary": "#f000b8",
    "accent": "#37cdbe",
    "neutral": "#3d4451",
    "base-100": "#ffffff",
  }
}
```

## Good vs. Bad Theming
```html
<!-- Good: Using semantic colors -->
<div class="bg-primary text-primary-content p-4">
  Always readable in any theme.
</div>

<!-- Bad: Hardcoding hex values -->
<div class="bg-[#570df8] text-white p-4">
  Will look broken when switching to a light/custom theme.
</div>
```
