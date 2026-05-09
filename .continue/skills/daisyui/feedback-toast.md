# Feedback: Toast

Toasts are used to display floating notifications, typically in one of the corners of the viewport.

## Positioning

The `toast` container can be positioned using Tailwind 4 utility classes (e.g., `toast-start`, `toast-end`, `toast-top`, `toast-bottom`).

### Good Example: Bottom-End Toast
```html
<div class="toast toast-end toast-bottom">
  <div class="alert alert-info">
    <span>New message arrived.</span>
  </div>
  <div class="alert alert-success">
    <span>Message sent successfully.</span>
  </div>
</div>
```

## Alignment Variants

### Good Example: Top-Center Toast
```html
<div class="toast toast-top toast-center">
  <div class="alert alert-info">
    <span>New notification</span>
  </div>
</div>
```

## Responsive Positioning

### Good Example: Changing Position on Mobile
```html
<!-- Bottom on mobile, Top-End on larger screens -->
<div class="toast toast-bottom sm:toast-top sm:toast-end">
  <div class="alert">...</div>
</div>
```

### Bad Example: Multiple Toast Containers
```html
<!-- Bad: Multiple 'toast' divs can overlap. Use a single container for multiple alerts if they share the same position. -->
<div class="toast">...</div>
<div class="toast">...</div>
```
