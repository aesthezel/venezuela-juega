# Data Input: Range

The range component is a slider input for selecting a numeric value within a specified range.

## Basic Usage

### Good Example: Standard Range Slider
```html
<input type="range" min="0" max="100" value="40" class="range" />
```

## Colors and Sizes

### Good Example: Color Variants
```html
<input type="range" min="0" max="100" value="25" class="range range-primary" />
<input type="range" min="0" max="100" value="50" class="range range-secondary" />
<input type="range" min="0" max="100" value="75" class="range range-accent" />
```

### Good Example: Size Variants
```html
<input type="range" min="0" max="100" value="40" class="range range-lg" />
<input type="range" min="0" max="100" value="40" class="range range-xs" />
```

## Range with Steps (Ticks)

### Good Example: Stepped Range
```html
<input type="range" min="0" max="100" value="25" class="range" step="25" />
<div class="flex w-full justify-between px-2 text-xs">
  <span>|</span>
  <span>|</span>
  <span>|</span>
  <span>|</span>
  <span>|</span>
</div>
```

### Bad Example: Vertical Range without Modifiers
```html
<!-- Bad: Range is horizontal by default. Native vertical ranges require platform-specific CSS. -->
```
