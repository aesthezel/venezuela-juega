# Actions: Dropdown

DaisyUI dropdowns use HTML `<details>` or custom `.dropdown` classes to display a list of actions or links.

## Hover & Click Triggers

### Good Example: Standard Click Dropdown
```html
<div class="dropdown">
  <div tabindex="0" role="button" class="btn m-1">Click Me</div>
  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</div>
```
*Note: `z-[1]` or `z-1` in Tailwind 4 is needed so the dropdown floats above content.*

### Good Example: Hover Dropdown
```html
<div class="dropdown dropdown-hover">
  <div tabindex="0" role="button" class="btn m-1">Hover Me</div>
  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    <li><a>Item 1</a></li>
  </ul>
</div>
```

## Positioning

Use directional modifier classes to change where the menu appears.

### Good Example: Dropdown Directions
```html
<!-- Top -->
<div class="dropdown dropdown-top">...</div>
<!-- Left -->
<div class="dropdown dropdown-left">...</div>
<!-- Right -->
<div class="dropdown dropdown-right">...</div>
<!-- End (RTL Support) -->
<div class="dropdown dropdown-end">...</div>
```

### Bad Example: Custom Positioning
```html
<!-- Bad: Using arbitrary margins instead of built-in directional classes -->
<div class="dropdown">
  <div class="btn">Click</div>
  <ul class="dropdown-content mt-[-200px]">...</ul>
</div>
```
