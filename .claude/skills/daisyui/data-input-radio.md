# Data Input: Radio

Radio buttons allow users to select exactly one option from a predefined set of mutually exclusive options.

## Basic Usage

Ensure all radio buttons in a group share the same `name` attribute.

### Good Example: Styled Radio Group
```html
<div class="form-control">
  <label class="label cursor-pointer">
    <span class="label-text">Option 1</span> 
    <input type="radio" name="radio-10" class="radio checked:bg-red-500" checked="checked" />
  </label>
</div>
<div class="form-control">
  <label class="label cursor-pointer">
    <span class="label-text">Option 2</span> 
    <input type="radio" name="radio-10" class="radio checked:bg-blue-500" />
  </label>
</div>
```

## Colors and Sizes

### Good Example: Color Variants
```html
<input type="radio" name="radio-1" class="radio radio-primary" />
<input type="radio" name="radio-1" class="radio radio-secondary" />
```

### Good Example: Size Variants
```html
<input type="radio" name="radio-2" class="radio radio-lg" />
<input type="radio" name="radio-2" class="radio radio-xs" />
```

### Bad Example: Missing Name Attribute
```html
<!-- Bad: Without a name, these are not linked and behave like independent checkboxes -->
<input type="radio" class="radio" />
<input type="radio" class="radio" />
```
