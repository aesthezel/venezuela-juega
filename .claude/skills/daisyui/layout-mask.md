# Layout: Mask

The mask component allows you to clip images or elements into specific shapes like circles, hearts, or squircles.

## Basic Usage

Apply the `mask` class along with a specific shape modifier.

### Good Example: Common Mask Shapes
```html
<!-- Squircle (Smoothed corner square) -->
<img class="mask mask-squircle" src="..." />

<!-- Heart -->
<img class="mask mask-heart" src="..." />

<!-- Hexagon -->
<img class="mask mask-hexagon" src="..." />

<!-- Decagon -->
<img class="mask mask-decagon" src="..." />
```

## Mask with Half Shapes

### Good Example: Half-Star (Used in Ratings)
```html
<div class="mask mask-star-2 mask-half-1 bg-orange-400 w-10 h-10"></div>
<div class="mask mask-star-2 mask-half-2 bg-orange-400 w-10 h-10"></div>
```

## Custom Masks

You can use the `mask` class with standard Tailwind 4 object-fit utilities.

### Good Example: Centered Masked Image
```html
<img class="mask mask-circle object-cover w-32 h-32" src="..." />
```

### Bad Example: Low Resolution Images
```html
<!-- Bad: Small images masked into large shapes will appear pixelated. Ensure the source image resolution is sufficient for the mask size. -->
```
