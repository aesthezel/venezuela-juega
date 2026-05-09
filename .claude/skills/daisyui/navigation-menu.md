# Navigation: Menu

The menu component is a list of links, often used for sidebars or dropdowns. It can be vertical or horizontal.

## Vertical Menu

### Good Example: Basic Sidebar Menu
```html
<ul class="menu bg-base-200 rounded-box w-56">
  <li><a>Item 1</a></li>
  <li>
    <a>Parent</a>
    <ul>
      <li><a>Submenu 1</a></li>
      <li><a>Submenu 2</a></li>
    </ul>
  </li>
  <li><a>Item 3</a></li>
</ul>
```

## Horizontal Menu

### Good Example: Navbar Menu
```html
<ul class="menu menu-horizontal bg-base-200 rounded-box">
  <li><a>Item 1</a></li>
  <li><a>Item 2</a></li>
  <li><a>Item 3</a></li>
</ul>
```

## Active and Focus States

### Good Example: Highlighted Item
```html
<li><a class="active">Current Page</a></li>
<li><a class="focus">Focused Item</a></li>
```

## With Icons

### Good Example: Menu with Icons
```html
<ul class="menu bg-base-200 rounded-box w-56">
  <li>
    <a>
      <svg ...></svg>
      Dashboard
    </a>
  </li>
</ul>
```

### Bad Example: Unordered Structure
```html
<!-- Bad: DaisyUI menu expects a strict <ul> -> <li> -> <a> structure -->
<div class="menu">
  <a>Item 1</a>
</div>
```
