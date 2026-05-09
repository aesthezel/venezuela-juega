# DaisyUI Data Display: Status

A compact component used to show status indicators (online, busy, etc.) on avatars or standalone elements.

## Basic Usage
The `status` class provides a small circle indicator.

```html
<div class="status"></div>
<div class="status status-success"></div>
<div class="status status-error"></div>
<div class="status status-warning"></div>
<div class="status status-info"></div>
```

## Pattern: Status on Avatars
Place the `status` inside an `avatar` container for automatic positioning.

```html
<div class="avatar">
  <div class="w-16 rounded-full">
    <img src="..." />
  </div>
  <div class="status status-success status-bottom status-right border-2 border-base-100"></div>
</div>
```

## Good vs. Bad Status
```html
<!-- Good: Semantic status indicator -->
<span class="status status-success"></span>

<!-- Bad: Manual circle styling -->
<span class="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
```

## Quick Reference
- `status-success`, `status-error`, `status-warning`, `status-info`: Colors.
- `status-top`, `status-bottom`, `status-left`, `status-right`: Positioning relative to parent.
