# Navigation: Navbar

The navbar is a high-level container for branding, navigation links, and actions at the top of a page.

## Anatomy of a Navbar

A standard navbar is divided into `navbar-start`, `navbar-center`, and `navbar-end`.

### Good Example: Standard Layout
```html
<div class="navbar bg-base-100 shadow-sm">
  <div class="navbar-start">
    <a class="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li><a>Item 1</a></li>
      <li><a>Item 2</a></li>
    </ul>
  </div>
  <div class="navbar-end">
    <a class="btn">Button</a>
  </div>
</div>
```

## Responsive Navbar

Use a dropdown in `navbar-start` for mobile menus.

### Good Example: Mobile Dropdown
```html
<div class="navbar-start">
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
      <svg ...></svg>
    </div>
    <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
      <li><a>Item 1</a></li>
    </ul>
  </div>
  <a class="btn btn-ghost text-xl">daisyUI</a>
</div>
```

### Bad Example: Center-heavy Layout on Mobile
```html
<!-- Bad: Centered navigation usually overflows on mobile; always wrap in hidden lg:flex -->
<div class="navbar-center flex">...</div>
```
