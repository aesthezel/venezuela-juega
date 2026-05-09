# Navigation: Tab

Tabs allow users to switch between different views or content sections.

## Basic Usage

Tabs use a container with the `tabs` class. For modern DaisyUI 5 projects, using the radio button approach is recommended for state management without JS.

### Good Example: Tabbed Interface with Radio Buttons
```html
<div role="tablist" class="tabs tabs-bordered">
  <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Tab 1" />
  <div role="tabpanel" class="tab-content p-10">Tab content 1</div>

  <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Tab 2" checked="checked" />
  <div role="tabpanel" class="tab-content p-10">Tab content 2</div>

  <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Tab 3" />
  <div role="tabpanel" class="tab-content p-10">Tab content 3</div>
</div>
```

## Variants

### Good Example: Lifted and Boxed Tabs
```html
<div role="tablist" class="tabs tabs-lifted">...</div>
<div role="tablist" class="tabs tabs-boxed">...</div>
```

## Sizes

### Good Example: Sizing Tabs
```html
<div role="tablist" class="tabs tabs-lg">...</div>
<div role="tablist" class="tabs tabs-xs">...</div>
```

### Bad Example: Manual Active Class Toggling
```html
<!-- Bad: Toggling 'tab-active' with JS is less efficient than using the radio input pattern (DaisyUI 5 standard) -->
<a class="tab tab-active">Tab 1</a>
```
