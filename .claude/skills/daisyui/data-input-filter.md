# DaisyUI Data Input: Filter

A toggleable filter component often used for search tags, categories, or filtering lists.

## Basic Usage
The `filter` class acts as a toggle button for filtering data.

```html
<div class="join">
  <input class="join-item btn filter" type="radio" name="options" aria-label="All" checked />
  <input class="join-item btn filter" type="radio" name="options" aria-label="Active" />
  <input class="join-item btn filter" type="radio" name="options" aria-label="Completed" />
</div>
```

## Pattern: Checkbox Filters
Use `filter` with checkboxes for multi-select filtering.

```html
<div class="flex flex-wrap gap-2">
  <input type="checkbox" aria-label="React" class="filter btn btn-sm" />
  <input type="checkbox" aria-label="Vue" class="filter btn btn-sm" />
  <input type="checkbox" aria-label="Svelte" class="filter btn btn-sm" />
</div>
```

## Good vs. Bad Filter
```html
<!-- Good: Using native inputs with filter classes for accessibility -->
<input type="radio" class="filter btn" aria-label="Selection" />

<!-- Bad: Manual button styling with complex active-state logic in JS -->
<button onclick="toggleFilter(this)" class="btn bg-gray-200">
  Filter
</button>
```
