# Data Input: Rating

The rating component uses a set of radio inputs to create a star, heart, or emoji-based rating system.

## Basic Usage

### Good Example: Star Rating
```html
<div class="rating">
  <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
  <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" checked="checked" />
  <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
  <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
  <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
</div>
```

## Half Stars

Use the `mask-half-1` and `mask-half-2` classes on two separate inputs to create a single star that can be half-filled.

### Good Example: Half-Star Rating
```html
<div class="rating rating-half">
  <input type="radio" name="rating-10" class="rating-hidden" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-1 bg-green-500" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-2 bg-green-500" />
  <!-- repeat ... -->
</div>
```

## Sizes

### Good Example: Rating Sizes
```html
<div class="rating rating-lg">...</div>
<div class="rating rating-sm">...</div>
```

### Bad Example: Using Buttons
```html
<!-- Bad: Ratings should be radio inputs for form compatibility and accessibility. -->
<div class="rating">
  <button class="mask mask-star">1</button>
</div>
```
