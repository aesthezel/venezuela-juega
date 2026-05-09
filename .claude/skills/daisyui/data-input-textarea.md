# Data Input: Textarea

The textarea component styles multi-line text inputs.

## Basic Usage

### Good Example: Bordered Textarea
```html
<textarea class="textarea textarea-bordered" placeholder="Bio"></textarea>
```

## Colors and Variants

### Good Example: Ghost and Color Variants
```html
<textarea class="textarea textarea-ghost" placeholder="Bio"></textarea>
<textarea class="textarea textarea-primary" placeholder="Bio"></textarea>
```

## Sizes

### Good Example: Textarea Sizes
```html
<textarea class="textarea textarea-lg"></textarea>
<textarea class="textarea textarea-xs"></textarea>
```

## Form Control Integration

### Good Example: Textarea with Label
```html
<label class="form-control">
  <div class="label">
    <span class="label-text">Your bio</span>
  </div>
  <textarea class="textarea textarea-bordered h-24" placeholder="Bio"></textarea>
</label>
```

### Bad Example: Missing Height
```html
<!-- Bad: Textareas often need a specific height (h-24, etc.) to look balanced in a form -->
<textarea class="textarea textarea-bordered"></textarea>
```
