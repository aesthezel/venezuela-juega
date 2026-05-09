# Feedback: Loading

The loading component provides various animated indicators for indeterminate wait states.

## Types of Spinners

### Good Example: Different Loading Animations
```html
<span class="loading loading-spinner loading-lg"></span>
<span class="loading loading-dots loading-lg"></span>
<span class="loading loading-ring loading-lg"></span>
<span class="loading loading-ball loading-lg"></span>
<span class="loading loading-bars loading-lg"></span>
<span class="loading loading-infinity loading-lg"></span>
```

## Colors

### Good Example: Semantic Loading Colors
```html
<span class="loading loading-spinner text-primary"></span>
<span class="loading loading-spinner text-secondary"></span>
<span class="loading loading-spinner text-success"></span>
```

## Integration with Buttons

### Good Example: Button with Loading State
```html
<button class="btn">
  <span class="loading loading-spinner"></span>
  loading
</button>
```

### Bad Example: Manual SVG Animations
```html
<!-- Bad: Over-complicating UI with custom keyframe animations when 'loading' classes provide optimized defaults -->
<svg class="animate-spin ...">...</svg>
```
