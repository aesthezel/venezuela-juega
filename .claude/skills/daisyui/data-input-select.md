# Data Input: Select

The select component provides a styled dropdown menu for selecting an option from a list.

## Basic Usage

### Good Example: Bordered Select
```html
<select class="select select-bordered w-full max-w-xs">
  <option disabled selected>Who shot first?</option>
  <option>Han Solo</option>
  <option>Greedo</option>
</select>
```

## Colors and Variants

### Good Example: Ghost and Color Variants
```html
<select class="select select-ghost w-full max-w-xs">...</select>
<select class="select select-primary w-full max-w-xs">...</select>
```

## Sizes

### Good Example: Sizing Selects
```html
<select class="select select-lg">...</select>
<select class="select select-xs">...</select>
```

## Use Case: Select with Form Control

### Good Example: Select with Label
```html
<label class="form-control w-full max-w-xs">
  <div class="label">
    <span class="label-text">Pick the best sci-fi movie</span>
  </div>
  <select class="select select-bordered">
    <option>Star Wars</option>
    <option>Star Trek</option>
  </select>
</label>
```

### Bad Example: Bare Select
```html
<!-- Bad: Unstyled select looks inconsistent with the rest of the UI -->
<select>
  <option>Option 1</option>
</select>
```
