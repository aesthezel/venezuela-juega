# Layout: Artboard

The artboard component provides fixed-size containers that mimic mobile screen resolutions, useful for prototyping mobile apps.

## Basic Usage

### Good Example: iPhone-sized Artboard
```html
<!-- Phone 1 (320×568) -->
<div class="artboard phone-1 bg-base-200">
  <div class="p-4">Mobile View Content</div>
</div>
```

## Artboard Sizes

- `phone-1`: 320×568
- `phone-2`: 375×667
- `phone-3`: 414×736
- `phone-4`: 375×812
- `phone-5`: 414×896
- `phone-6`: 320×1024

## Orientation

Use `artboard-horizontal` to switch to landscape mode.

### Good Example: Horizontal Artboard
```html
<div class="artboard artboard-horizontal phone-1 bg-base-200">
  Landscape Content
</div>
```

### Bad Example: Using Artboard for Production Layouts
```html
<!-- Bad: Artboards are intended for prototyping and demos, not for actual responsive production website containers. Use standard Tailwind 'container' or 'max-w-*' classes instead. -->
```
