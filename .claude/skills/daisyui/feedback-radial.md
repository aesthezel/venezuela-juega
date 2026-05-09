# Feedback: Radial Progress

Radial progress displays a circular progress indicator using CSS variables.

## Usage

Set the `--value` and `--size` CSS variables. The component uses a `radial-progress` class.

### Good Example: 70% Circular Progress
```html
<div class="radial-progress" style="--value:70;" role="progressbar">70%</div>
```

## Customization

### Good Example: Colors, Size, and Thickness
```html
<div class="radial-progress text-primary" style="--value:70; --size:12rem; --thickness: 2rem;" role="progressbar">
  70%
</div>
```

## Integration with Backgrounds

### Good Example: Adding Background and Borders
```html
<div class="radial-progress bg-primary text-primary-content border-primary border-4" style="--value:70;" role="progressbar">
  70%
</div>
```

### Bad Example: Missing Role Attribute
```html
<!-- Bad: Missing role="progressbar" makes it difficult for assistive technologies to interpret the component -->
<div class="radial-progress" style="--value:70;">70%</div>
```
