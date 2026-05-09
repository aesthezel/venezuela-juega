# DaisyUI Data Input: Label

A semantic label component for form inputs, providing consistent spacing and typography.

## Basic Usage
The `label` class wraps label text or spans.

```html
<div class="form-control">
  <label class="label">
    <span class="label-text text-base-content">Username</span>
  </label>
  <input type="text" class="input input-bordered" />
</div>
```

## Pattern: Top/Bottom Labels
Use multiple spans within a `label` to create descriptive helpers.

```html
<div class="form-control">
  <label class="label">
    <span class="label-text">Email</span>
    <span class="label-text-alt text-error">Required</span>
  </label>
  <input type="email" class="input input-bordered" />
  <label class="label">
    <span class="label-text-alt">We'll never share your email.</span>
  </label>
</div>
```

## Good vs. Bad Label
```html
<!-- Good: Semantic label with text-alt for auxiliary information -->
<label class="label">
  <span class="label-text">Password</span>
</label>

<!-- Bad: Using a p tag with mb-2 for labeling -->
<p class="mb-2 font-semibold">Password</p>
```
