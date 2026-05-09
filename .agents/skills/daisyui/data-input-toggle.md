# Data Input: Toggle

The toggle component is a styled checkbox that acts as a binary switch.

## Basic Usage

### Good Example: Standard Toggle
```html
<input type="checkbox" class="toggle" checked="checked" />
```

## Colors and Sizes

### Good Example: Color Variants
```html
<input type="checkbox" class="toggle toggle-primary" />
<input type="checkbox" class="toggle toggle-secondary" />
<input type="checkbox" class="toggle toggle-success" />
```

### Good Example: Size Variants
```html
<input type="checkbox" class="toggle toggle-lg" />
<input type="checkbox" class="toggle toggle-md" />
<input type="checkbox" class="toggle toggle-sm" />
<input type="checkbox" class="toggle toggle-xs" />
```

## Integration with Labels

### Good Example: Toggle with Label
```html
<div class="form-control w-52">
  <label class="label cursor-pointer">
    <span class="label-text">Remember me</span> 
    <input type="checkbox" class="toggle" checked="checked" />
  </label>
</div>
```

### Bad Example: Manual Switch Styling
```html
<!-- Bad: Creating custom switch logic when DaisyUI 'toggle' class handles it natively and accessibly -->
<div class="bg-gray-200 rounded-full w-10 h-6">
  <div class="bg-white rounded-full w-4 h-4 translate-x-1"></div>
</div>
```
