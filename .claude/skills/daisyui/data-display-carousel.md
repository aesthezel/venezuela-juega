# Data Display: Carousel

Carousels display multiple items in a scrollable horizontal area. They utilize native CSS scroll snapping.

## Basic Carousel

### Good Example: Standard Scroll Carousel
```html
<div class="carousel rounded-box">
  <div class="carousel-item">
    <img src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp" alt="Burger" />
  </div> 
  <div class="carousel-item">
    <img src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp" alt="Burger" />
  </div>
</div>
```

## Carousels with Navigation

### Good Example: Button Navigation
```html
<div class="carousel w-full">
  <div id="item1" class="carousel-item w-full">
    <img src="..." class="w-full" />
  </div> 
  <div id="item2" class="carousel-item w-full">
    <img src="..." class="w-full" />
  </div>
</div> 
<div class="flex w-full justify-center gap-2 py-2">
  <a href="#item1" class="btn btn-xs">1</a> 
  <a href="#item2" class="btn btn-xs">2</a>
</div>
```

### Good Example: Full-width Items with Prev/Next Buttons
```html
<div class="carousel w-full">
  <div id="slide1" class="carousel-item relative w-full">
    <img src="..." class="w-full" />
    <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide4" class="btn btn-circle">❮</a> 
      <a href="#slide2" class="btn btn-circle">❯</a>
    </div>
  </div>
</div>
```

### Bad Example: JS Over-engineering
```html
<!-- Bad: Bringing in heavy JS libraries for basic sliders when CSS scroll snap (DaisyUI's approach) works natively and performantly. -->
```
