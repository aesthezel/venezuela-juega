# Navigation: Steps

Steps are used to visualize a multi-step process or progress through a wizard.

## Basic Usage

Steps use a `<ul>` with the `steps` class and `<li>` with the `step` class.

### Good Example: Progress Tracker
```html
<ul class="steps">
  <li class="step step-primary">Register</li>
  <li class="step step-primary">Choose plan</li>
  <li class="step">Purchase</li>
  <li class="step">Receive Product</li>
</ul>
```

## Vertical Steps

Add the `steps-vertical` class to stack steps.

### Good Example: Vertical Wizard
```html
<ul class="steps steps-vertical">
  <li class="step step-primary">Step 1</li>
  <li class="step step-primary">Step 2</li>
  <li class="step">Step 3</li>
</ul>
```

## Colored Steps

### Good Example: Status-based Colors
```html
<ul class="steps">
  <li class="step step-info">Fly</li>
  <li class="step step-success">Land</li>
  <li class="step step-error">Crash</li>
</ul>
```

### Bad Example: Too many steps
```html
<!-- Bad: More than 5 steps horizontally often overflows on mobile. Use 'steps-vertical' for small screens. -->
<ul class="steps">...</ul>
```
