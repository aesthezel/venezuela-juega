# DaisyUI Data Display: Hover Gallery

An interactive image gallery where images expand or reveal details on hover.

## Basic Usage
Use `hover-gallery` to create a grid of items that respond to mouse interaction.

```html
<div class="hover-gallery flex flex-wrap gap-4">
  <div class="hover-gallery-item">
    <img src="..." alt="Gallery Image" />
    <div class="hover-gallery-content">
      <h2 class="text-xl">Title</h2>
    </div>
  </div>
</div>
```

## Patterns: Grid Layout
Hover galleries work best with auto-filling grids or flexbox.

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 hover-gallery">
  <div class="hover-gallery-item aspect-square overflow-hidden rounded-box">
    <img src="image1.jpg" class="object-cover" />
    <div class="bg-black/50 text-white p-4">Caption 1</div>
  </div>
  <div class="hover-gallery-item aspect-square overflow-hidden rounded-box">
    <img src="image2.jpg" class="object-cover" />
    <div class="bg-black/50 text-white p-4">Caption 2</div>
  </div>
</div>
```

## Good vs. Bad Gallery
```html
<!-- Good: Pure CSS hover effects with DaisyUI -->
<div class="hover-gallery-item">...</div>

<!-- Bad: Complex JS event listeners for simple overlay toggles -->
<div onmouseenter="showOverlay(this)" onmouseleave="hideOverlay(this)">...</div>
```
