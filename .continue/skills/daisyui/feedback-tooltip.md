# Feedback: Tooltip

Tooltips provide small contextual information when a user hovers over or focuses on an element.

## Basic Usage

Wrap the target element in a `tooltip` container and set the `data-tip` attribute.

### Good Example: Standard Tooltip
```html
<div class="tooltip" data-tip="hello">
  <button class="btn">Hover me</button>
</div>
```

## Positioning

### Good Example: Tooltip Directions
```html
<div class="tooltip tooltip-top" data-tip="Top">...</div>
<div class="tooltip tooltip-bottom" data-tip="Bottom">...</div>
<div class="tooltip tooltip-left" data-tip="Left">...</div>
<div class="tooltip tooltip-right" data-tip="Right">...</div>
```

## Colors

### Good Example: Semantic Tooltip Colors
```html
<div class="tooltip tooltip-primary" data-tip="Primary color">...</div>
<div class="tooltip tooltip-error" data-tip="Error state">...</div>
```

## Forced Visibility

### Good Example: Persistent Tooltip (Always Open)
```html
<div class="tooltip tooltip-open" data-tip="I am always here">...</div>
```

### Bad Example: Complex HTML inside Tooltip
```html
<!-- Bad: The tooltip content is defined in the data-tip attribute, which only supports plain text. Use a dropdown for complex HTML. -->
<div class="tooltip" data-tip="<b>Bold</b>">...</div>
```
