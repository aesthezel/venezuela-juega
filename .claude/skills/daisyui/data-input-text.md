# Data Input: Text

The text input component styles standard single-line text inputs.

## Basic Usage

### Good Example: Bordered Input
```html
<input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
```

## Variants

### Good Example: Ghost and Color Variants
```html
<input type="text" placeholder="Ghost" class="input input-ghost w-full max-w-xs" />
<input type="text" placeholder="Primary" class="input input-primary w-full max-w-xs" />
```

## Sizes

### Good Example: Input Sizes
```html
<input type="text" class="input input-lg" />
<input type="text" class="input input-md" />
<input type="text" class="input input-sm" />
<input type="text" class="input input-xs" />
```

## Form Control Integration

### Good Example: Input with Labels and Helper Text
```html
<label class="form-control w-full max-w-xs">
  <div class="label">
    <span class="label-text">What is your name?</span>
    <span class="label-text-alt">Top Right</span>
  </div>
  <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
  <div class="label">
    <span class="label-text-alt">Bottom Left</span>
  </div>
</label>
```

### Bad Example: Input without width class
```html
<!-- Bad: Inputs have small default widths; use 'w-full' for responsive layouts -->
<input class="input input-bordered" />
```
