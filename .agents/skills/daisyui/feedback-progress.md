# Feedback: Progress

The progress component is used for displaying both determinate and indeterminate progress states.

## Determinate Progress

Set the `value` and `max` attributes to show a specific progress level.

### Good Example: 40% Progress
```html
<progress class="progress progress-primary w-56" value="40" max="100"></progress>
```

## Indeterminate Progress

Omit the `value` attribute to create a looping animation for unknown wait times.

### Good Example: Indeterminate Progress
```html
<progress class="progress w-56"></progress>
```

## Colors

### Good Example: Semantic Colors
```html
<progress class="progress progress-success w-56" value="100" max="100"></progress>
<progress class="progress progress-warning w-56" value="70" max="100"></progress>
<progress class="progress progress-error w-56" value="10" max="100"></progress>
```

### Bad Example: Using Divs with Widths
```html
<!-- Bad: Using a div with a fixed width for progress is less accessible than the semantic <progress> element -->
<div class="h-2 w-full bg-gray-200">
  <div class="h-2 bg-blue-500 w-[40%]"></div>
</div>
```
