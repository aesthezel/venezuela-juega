# Data Display: Collapse

The collapse component hides or shows content based on focus or a checkbox state.

## Native `<details>` Element

This is the most semantic and accessible way to create a collapsible element.

### Good Example: Semantic Details/Summary
```html
<details class="collapse collapse-arrow bg-base-200">
  <summary class="collapse-title text-xl font-medium">Click to open/close</summary>
  <div class="collapse-content">
    <p>Content goes here.</p>
  </div>
</details>
```

## Checkbox or Focus Triggers

If you need specific styling or behavior that `<details>` cannot provide, use hidden inputs.

### Good Example: Checkbox Trigger
```html
<div class="collapse collapse-plus bg-base-200">
  <input type="checkbox" /> 
  <div class="collapse-title text-xl font-medium">Click me to show/hide content</div>
  <div class="collapse-content"> 
    <p>hello</p>
  </div>
</div>
```

### Good Example: Focus Trigger (Closes when clicking away)
```html
<div tabindex="0" class="collapse collapse-arrow border-base-300 bg-base-100 border">
  <div class="collapse-title text-xl font-medium">Focus me to see content</div>
  <div class="collapse-content"> 
    <p>tabindex="0" attribute is necessary to make the div focusable</p>
  </div>
</div>
```

### Bad Example: Invalid Structure
```html
<!-- Bad: Missing collapse-title and collapse-content wrappers -->
<details class="collapse">
  <h1>Click me</h1>
  <p>Content</p>
</details>
```
