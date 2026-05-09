# Layout: Drawer

The drawer component creates a side-menu overlay, common in mobile apps and dashboards.

## Basic Usage

The drawer consists of a toggle (hidden checkbox), the page content, and the side-menu content.

### Good Example: Standard Drawer
```html
<div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Page content here -->
    <label for="my-drawer" class="btn btn-primary drawer-button">Open drawer</label>
  </div> 
  <div class="drawer-side">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <!-- Sidebar content here -->
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </ul>
  </div>
</div>
```

## Always Open on Large Screens

Use the `lg:drawer-open` modifier to keep the sidebar visible on desktops.

### Good Example: Responsive Sidebar
```html
<div class="drawer lg:drawer-open">
  ...
</div>
```

## Drawer End (Right Side)

Use the `drawer-end` modifier to move the sidebar to the right.

### Good Example: Right Sidebar
```html
<div class="drawer drawer-end">
  ...
</div>
```

### Bad Example: Missing Overlay
```html
<!-- Bad: Without the drawer-overlay label, the user cannot click outside the sidebar to close it -->
<div class="drawer-side">
  <ul class="menu ...">...</ul>
</div>
```
