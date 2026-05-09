# DaisyUI Data Input: Calendar

A semantic calendar component for date selection and display. Often uses the `cally` class for enhanced functionality.

## Basic Usage
The `calendar` class creates a standard date grid.

```html
<div class="calendar bg-base-100 p-4 rounded-box shadow">
  <!-- Calendar header/grid provided by daisyUI styles -->
  <div class="calendar-month">October 2024</div>
  <div class="calendar-grid">...</div>
</div>
```

## Pattern: Date Range Picker
Use with multiple calendars or specialized `cally` wrappers.

```html
<div class="flex gap-4">
  <div class="calendar calendar-sm">...</div>
  <div class="calendar calendar-sm border-l pl-4">...</div>
</div>
```

## Good vs. Bad Calendar
```html
<!-- Good: DaisyUI calendar component for consistent theming -->
<div class="calendar">...</div>

<!-- Bad: Over-relying on browser default <input type="date"> which is hard to style -->
<input type="date" class="input input-bordered" />
```

## Quick Reference
- `calendar-sm`, `calendar-lg`: Sizing.
- `calendar-today`: Highlights current date.
- `calendar-selected`: Highlights active selection.
