# Navigation: Link

The link component styles anchor tags with subtle hover effects and semantic colors.

## Basic Usage

### Good Example: Standard Link
```html
<a class="link">I am a simple link</a>
```

## Colors and Hover

Use `link-hover` if you want the underline to only appear on hover.

### Good Example: Link Variants
```html
<a class="link link-primary">Primary color</a>
<a class="link link-secondary">Secondary color</a>
<a class="link link-hover">Underline only on hover</a>
<a class="link link-neutral">Neutral color</a>
```

## Interaction Patterns

### Good Example: Hover-Primary
```html
<!-- Text starts neutral and becomes primary on hover -->
<a class="link hover:link-primary">Hover me to see primary color</a>
```

### Bad Example: Over-styling Links
```html
<!-- Bad: Using button classes for text-only inline links is confusing for UX -->
<p>Click <a class="btn btn-link">this button</a> to continue.</p>
```
