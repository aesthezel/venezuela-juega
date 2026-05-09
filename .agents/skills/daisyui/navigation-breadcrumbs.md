# Navigation: Breadcrumbs

Breadcrumbs help users understand their current location within a site's hierarchy.

## Basic Usage

Breadcrumbs use a standard `<ul>` inside a `<nav>` or `<div>` with the `breadcrumbs` class.

### Good Example: List-based Breadcrumbs
```html
<div class="breadcrumbs text-sm">
  <ul>
    <li><a>Home</a></li>
    <li><a>Documents</a></li>
    <li>Add Document</li>
  </ul>
</div>
```

## With Icons

### Good Example: Breadcrumbs with SVGs
```html
<div class="breadcrumbs text-sm">
  <ul>
    <li>
      <a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="mr-2 h-4 w-4 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
        </svg>
        Home
      </a>
    </li> 
    <li>
      <a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="mr-2 h-4 w-4 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
        </svg>
        Documents
      </a>
    </li>
  </ul>
</div>
```

### Bad Example: Using Divs instead of Lis
```html
<!-- Bad: DaisyUI breadcrumbs rely on <ul> and <li> structure for proper styling and separators -->
<div class="breadcrumbs">
  <a>Home</a> / <a>Settings</a>
</div>
```
