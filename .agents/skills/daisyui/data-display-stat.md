# Data Display: Stat

The stat component groups labels, values, and descriptive text together, often used for dashboards to display Key Performance Indicators (KPIs).

## Anatomy of a Stat

Wrap multiple stats in a `stats` container. Each individual item is a `stat`.

### Good Example: Basic Stats Group
```html
<div class="stats shadow-sm">
  <div class="stat">
    <div class="stat-title">Total Page Views</div>
    <div class="stat-value">89,400</div>
    <div class="stat-desc">21% more than last month</div>
  </div>
</div>
```

## Adding Figures and Actions

You can include icons (figures) and action buttons within a stat block.

### Good Example: Complex Stat Block
```html
<div class="stats shadow-sm">
  <div class="stat">
    <div class="stat-figure text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-8 w-8 stroke-current">
        <!-- SVG Path -->
      </svg>
    </div>
    <div class="stat-title">Total Likes</div>
    <div class="stat-value text-primary">25.6K</div>
    <div class="stat-desc">21% more than last month</div>
  </div>
</div>
```

## Layouts

Use Tailwind 4 layout utilities to change the orientation.

### Good Example: Vertical Stats
```html
<!-- Use flex-col or stats-vertical for stacking -->
<div class="stats stats-vertical shadow-sm">
  <div class="stat">...</div>
  <div class="stat">...</div>
</div>
```

### Bad Example: Missing Hierarchy
```html
<!-- Bad: Missing semantic child classes breaks the layout -->
<div class="stat">
  <span>Total Views</span>
  <h1>89,400</h1>
</div>
```
