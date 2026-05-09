# Data Input: File

The file input component provides a styled interface for selecting files from the local device.

## Basic Usage

### Good Example: Bordered File Input
```html
<label class="form-control w-full max-w-xs">
  <div class="label">
    <span class="label-text">Pick a file</span>
  </div>
  <input type="file" class="file-input file-input-bordered w-full max-w-xs" />
</label>
```

## Variants

### Good Example: Ghost and Color Variants
```html
<input type="file" class="file-input file-input-ghost w-full max-w-xs" />
<input type="file" class="file-input file-input-primary w-full max-w-xs" />
```

## Sizes

### Good Example: Sizing File Inputs
```html
<input type="file" class="file-input file-input-lg" />
<input type="file" class="file-input file-input-sm" />
```

### Bad Example: Overflowing Container
```html
<!-- Bad: File inputs often have wide default widths; always wrap or use 'w-full' -->
<input type="file" class="file-input" />
```
