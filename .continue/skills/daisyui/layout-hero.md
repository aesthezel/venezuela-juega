# Layout: Hero

The hero component is a large, attention-grabbing section typically found at the top of a page.

## Centered Hero

### Good Example: Text and Button Hero
```html
<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Hello there</h1>
      <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi.</p>
      <button class="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>
```

## Hero with Side Image

### Good Example: Image and Content
```html
<div class="hero min-h-screen bg-base-200">
  <div class="hero-content flex-col lg:flex-row">
    <img src="..." class="max-w-sm rounded-lg shadow-2xl" />
    <div>
      <h1 class="text-5xl font-bold">Box Office News!</h1>
      <p class="py-6">Check out the latest movies.</p>
      <button class="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>
```

## Hero with Background Image

### Good Example: Overlay Hero
```html
<div class="hero min-h-screen" style="background-image: url(...);">
  <div class="hero-overlay bg-opacity-60"></div>
  <div class="hero-content text-center text-neutral-content">
    <div class="max-w-md">
      <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
      <button class="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>
```

### Bad Example: Missing Max-Width
```html
<!-- Bad: Without max-w-md or similar, text lines can become too long and difficult to read in a hero section -->
<div class="hero-content">
  <p>Very long text that spans the whole screen width...</p>
</div>
```
