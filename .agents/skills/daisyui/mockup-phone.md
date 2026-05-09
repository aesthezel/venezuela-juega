# Mockup: Phone

The phone mockup component displays content inside a simulated mobile device frame.

## Basic Usage

### Good Example: iPhone Mockup
```html
<div class="mockup-phone">
  <div class="camera"></div> 
  <div class="display">
    <div class="artboard phone-1 bg-base-200">
      <div class="flex h-full items-center justify-center">Hello World</div>
    </div>
  </div>
</div>
```

## Colored Borders

### Good Example: Primary Colored Phone
```html
<div class="mockup-phone border-primary">
  <div class="camera"></div>
  <div class="display">...</div>
</div>
```

### Bad Example: Invalid Hierarchy
```html
<!-- Bad: Missing 'camera' or 'display' divs will break the CSS grid layout of the phone frame -->
<div class="mockup-phone">
  <div class="artboard">...</div>
</div>
```
