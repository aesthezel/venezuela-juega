# Navigation: Bottom Nav

Bottom navigation is a mobile-first navigation pattern that stays fixed at the bottom of the screen.

## Basic Usage

### Good Example: Standard Bottom Nav
```html
<div class="btm-nav">
  <button>
    <svg ...></svg>
    <span class="btm-nav-label">Home</span>
  </button>
  <button class="active">
    <svg ...></svg>
    <span class="btm-nav-label">Warnings</span>
  </button>
  <button>
    <svg ...></svg>
    <span class="btm-nav-label">Stat</span>
  </button>
</div>
```

## Colors

Apply color classes directly to the buttons to indicate state.

### Good Example: Colored Active States
```html
<div class="btm-nav">
  <button class="text-primary active">...</button>
  <button class="text-secondary">...</button>
  <button class="text-accent">...</button>
</div>
```

## Sizes

### Good Example: Responsive Bottom Nav
```html
<div class="btm-nav btm-nav-xs sm:btm-nav-md md:btm-nav-lg">
  ...
</div>
```

### Bad Example: Missing Active Class
```html
<!-- Bad: If no button has the 'active' class, the user won't know which section they are currently in -->
<div class="btm-nav">
  <button>No Active State</button>
</div>
```
