# Data Input: Checkbox

Checkboxes allow users to select one or more options from a set.

## Basic Usage

### Good Example: Standard Checkbox
```html
<div class="form-control">
  <label class="label cursor-pointer">
    <span class="label-text">Remember me</span> 
    <input type="checkbox" checked="checked" class="checkbox" />
  </label>
</div>
```

## Colors and Sizes

### Good Example: Color Variants
```html
<input type="checkbox" class="checkbox checkbox-primary" />
<input type="checkbox" class="checkbox checkbox-secondary" />
<input type="checkbox" class="checkbox checkbox-success" />
```

### Good Example: Size Variants
```html
<input type="checkbox" class="checkbox checkbox-lg" />
<input type="checkbox" class="checkbox checkbox-md" />
<input type="checkbox" class="checkbox checkbox-sm" />
<input type="checkbox" class="checkbox checkbox-xs" />
```

## Intermediate State

Intermediate states must be set via JavaScript as there is no HTML attribute for it.

### Good Example: JS Indeterminate
```javascript
document.getElementById('my-checkbox').indeterminate = true;
```

### Bad Example: Bare Input
```html
<!-- Bad: Missing 'checkbox' class results in unstyled native browser checkbox -->
<input type="checkbox" />
```
