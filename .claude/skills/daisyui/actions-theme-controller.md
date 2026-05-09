# DaisyUI Actions: Theme Controller

A toggle, radio, or checkbox component that automatically switches themes for the entire document or a specific container.

## Basic Usage
The `theme-controller` class is used on an input element. It listens for changes and applies the theme specified in the `value` attribute.

```html
<!-- Toggle style -->
<input type="checkbox" value="synthwave" class="toggle theme-controller" />

<!-- Swap style (using icons) -->
<label class="swap swap-rotate">
  <input type="checkbox" class="theme-controller" value="light" />
  <!-- sun icon -->
  <svg class="swap-on ...">...</svg>
  <!-- moon icon -->
  <svg class="swap-off ...">...</svg>
</label>
```

## Pattern: Radio Theme Selection
Use radios with `theme-controller` to provide multiple theme choices.

```html
<div class="form-control">
  <label class="label cursor-pointer gap-4">
    <span class="label-text">Default</span>
    <input type="radio" name="theme-buttons" class="radio theme-controller" value="default"/>
  </label>
</div>
<div class="form-control">
  <label class="label cursor-pointer gap-4">
    <span class="label-text">Retro</span>
    <input type="radio" name="theme-buttons" class="radio theme-controller" value="retro"/>
  </label>
</div>
<div class="form-control">
  <label class="label cursor-pointer gap-4">
    <span class="label-text">Cyberpunk</span>
    <input type="radio" name="theme-buttons" class="radio theme-controller" value="cyberpunk"/>
  </label>
</div>
```

## Good vs. Bad Theme Switching
```html
<!-- Good: Declarative theme control -->
<input type="checkbox" value="dark" class="checkbox theme-controller" />

<!-- Bad: Manual JS theme toggling with classList manipulation -->
<button onclick="document.documentElement.setAttribute('data-theme', 'dark')">
  Dark Mode (Requires extra JS boilerplate)
</button>
```
