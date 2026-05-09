# Data Display: Card

Cards provide a flexible and extensible content container with multiple variants and options.

## Anatomy of a Card

A card typically contains a figure (image) and a body, which further contains the title, content, and actions.

### Good Example: Standard Card
```html
<div class="card bg-base-100 w-96 shadow-sm">
  <figure>
    <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
```

## Variants

### Good Example: Bordered Card
```html
<!-- Add border and remove shadow for a flatter look -->
<div class="card bg-base-100 w-96 border-base-300 border">
  <div class="card-body">...</div>
</div>
```

### Good Example: Image Full (Background Image)
```html
<!-- The image becomes a darkened background behind the text -->
<div class="card image-full bg-base-100 w-96 shadow-sm">
  <figure><img src="..." alt="Shoes" /></figure>
  <div class="card-body">...</div>
</div>
```

### Bad Example: Unstructured Content
```html
<!-- Bad: Missing card-body, text will touch the edges -->
<div class="card bg-base-100 w-96 shadow-sm">
  <h2>Shoes!</h2>
  <button class="btn">Buy</button>
</div>
```
