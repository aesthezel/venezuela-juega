# Data Display: Table

The table component styles HTML tables, adding padding, borders, and hover effects. Ensure the table is wrapped in an `overflow-x-auto` container for responsive scrolling.

## Basic Table

### Good Example: Standard Table
```html
<div class="overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Job</th>
        <th>Favorite Color</th>
      </tr>
    </thead>
    <tbody>
      <!-- row 1 -->
      <tr>
        <th>1</th>
        <td>Cy Ganderton</td>
        <td>Quality Control Specialist</td>
        <td>Blue</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Table Variants

### Good Example: Zebra and Hover Effects
```html
<!-- table-zebra adds striped rows, table-hover adds a hover effect to rows -->
<table class="table table-zebra table-hover">
  ...
</table>
```

## Pinning Rows and Columns

DaisyUI provides sticky utilities for complex tables.

### Good Example: Pinned Header and First Column
```html
<table class="table table-pin-rows table-pin-cols">
  <thead>
    <tr>
      <!-- This column stays pinned on horizontal scroll -->
      <th>ID</th> 
      <th>Name</th>
      <th>Job</th>
    </tr>
  </thead>
  <tbody>...</tbody>
</table>
```

### Bad Example: Missing Responsive Wrapper
```html
<!-- Bad: Missing div.overflow-x-auto causes the table to overflow the screen on mobile devices -->
<table class="table">...</table>
```
