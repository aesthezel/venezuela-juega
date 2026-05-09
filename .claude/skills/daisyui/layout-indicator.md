# Layout: Indicator

Indicators are used to place an element (like a badge or status dot) on the corner of another element.

## Basic Usage

The `indicator` class is placed on the parent, and `indicator-item` is placed on the element that floats.

### Good Example: Badge on an Avatar
```html
<div class="avatar indicator">
  <span class="indicator-item badge badge-secondary">new</span> 
  <div class="h-20 w-20 rounded-lg">
    <img src="..." />
  </div>
</div>
```

## Positioning

Use alignment utilities to move the indicator to different corners.

### Good Example: Placement Variants
```html
<!-- Top End (Default) -->
<div class="indicator">
  <span class="indicator-item badge">1</span>
  <div class="grid w-32 h-32 bg-base-300 place-items-center">content</div>
</div>

<!-- Bottom Start -->
<div class="indicator">
  <span class="indicator-item indicator-bottom indicator-start badge">1</span>
  <div class="grid w-32 h-32 bg-base-300 place-items-center">content</div>
</div>
```

## Center and Middle

### Good Example: Centered Indicator
```html
<div class="indicator">
  <span class="indicator-item indicator-center indicator-middle badge">Center</span>
  <div class="grid w-32 h-32 bg-base-300 place-items-center">content</div>
</div>
```

### Bad Example: Missing Indicator Parent
```html
<!-- Bad: Without the 'indicator' parent, 'indicator-item' will not be positioned correctly relative to the content -->
<div class="badge indicator-item">1</div>
<div>content</div>
```
