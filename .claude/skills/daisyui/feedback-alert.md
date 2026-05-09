# Feedback: Alert

Alerts inform users about important events or changes in state. They use semantic colors to convey meaning.

## Basic Usage

### Good Example: Informational Alert
```html
<div role="alert" class="alert shadow-sm">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info h-6 w-6 shrink-0">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
  <span>New software update available.</span>
</div>
```

## Semantic Variants

### Good Example: Success, Warning, and Error
```html
<div role="alert" class="alert alert-success">
  <span>Your purchase has been confirmed!</span>
</div>

<div role="alert" class="alert alert-warning">
  <span>Warning: Invalid email address!</span>
</div>

<div role="alert" class="alert alert-error">
  <span>Error! Task failed successfully.</span>
</div>
```

## Alerts with Actions

### Good Example: Alert with Buttons
```html
<div role="alert" class="alert">
  <svg ...></svg>
  <div>
    <h3 class="font-bold">New message!</h3>
    <div class="text-xs">You have 1 unread message</div>
  </div>
  <button class="btn btn-sm">See</button>
</div>
```

### Bad Example: Missing Role Attribute
```html
<!-- Bad: Missing role="alert" reduces accessibility for screen readers -->
<div class="alert alert-info">...</div>
```
