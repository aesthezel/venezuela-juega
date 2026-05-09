# Data Display: KBD

The KBD component is used to format keyboard shortcuts or key combinations.

## Basic Usage

### Good Example: Individual Keys
```html
<kbd class="kbd">A</kbd>
<kbd class="kbd">Ctrl</kbd>
<kbd class="kbd">⌘</kbd>
```

## Sizes

### Good Example: Responsive Key Sizes
```html
<kbd class="kbd kbd-lg">Shift</kbd>
<kbd class="kbd kbd-md">Shift</kbd>
<kbd class="kbd kbd-sm">Shift</kbd>
<kbd class="kbd kbd-xs">Shift</kbd>
```

## Key Combinations

Group keys together with a plus sign or spacing to show shortcuts.

### Good Example: Shortcut Display
```html
<p>
  Press
  <kbd class="kbd kbd-sm">⌘</kbd>
  +
  <kbd class="kbd kbd-sm">C</kbd>
  to copy.
</p>
```

### Bad Example: Complex Structures inside KBD
```html
<!-- Bad: KBD is an inline text element, do not put block elements inside it -->
<kbd class="kbd">
  <div>Enter</div>
</kbd>
```
