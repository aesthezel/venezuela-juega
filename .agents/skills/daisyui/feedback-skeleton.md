# Feedback: Skeleton

Skeleton loaders act as placeholders while content is being fetched, preventing layout shifts.

## Basic Usage

### Good Example: Square and Circle Placeholders
```html
<div class="skeleton h-32 w-32"></div>
<div class="skeleton h-10 w-10 shrink-0 rounded-full"></div>
```

## Complex Layouts

Combine multiple skeleton elements to mimic the layout of the final content.

### Good Example: Skeleton for a Card/Post
```html
<div class="flex w-52 flex-col gap-4">
  <div class="skeleton h-32 w-full"></div>
  <div class="skeleton h-4 w-28"></div>
  <div class="skeleton h-4 w-full"></div>
  <div class="skeleton h-4 w-full"></div>
</div>
```

## Integration with Actual Content

Use conditional rendering in your framework (React/Vue/etc.) to swap skeletons for real components.

### Good Example: Logic Pseudo-code
```html
{isLoading ? <div class="skeleton ..."></div> : <Card ... />}
```

### Bad Example: Static Heights
```html
<!-- Bad: If the skeleton doesn't match the final content's height, you'll still get a layout shift -->
<div class="skeleton h-10 w-full"></div> <!-- Content is actually 200px tall -->
```
