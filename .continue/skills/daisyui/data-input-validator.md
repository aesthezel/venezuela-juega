# DaisyUI Data Input: Validator

A component for real-time form validation feedback using CSS-only patterns or minimal JS.

## Basic Usage
The `validator` class is applied to input wrappers to show error states.

```html
<div class="form-control">
  <input type="email" placeholder="email@example.com" class="input validator" required />
  <div class="validator-hint">Please enter a valid email address</div>
</div>
```

## Pattern: Successful Validation
DaisyUI can show success states automatically when criteria are met.

```html
<div class="form-control">
  <input type="password" 
         pattern=".{8,}" 
         placeholder="Min 8 chars" 
         class="input validator" 
         required />
  <div class="validator-hint">Password must be at least 8 characters</div>
</div>
```

## Good vs. Bad Validator
```html
<!-- Good: Native HTML5 validation integrated with DaisyUI -->
<input type="text" class="validator" required />

<!-- Bad: Manual error state toggling via complex JS logic -->
<input id="my-input" class="input border-red-500" />
<p id="error-msg" class="hidden text-red-500">Error</p>
```

## Quick Reference
- `validator-hint`: The message shown when validation fails.
- `validator-success`: (Internal) Applied when input is valid.
- `validator-error`: (Internal) Applied when input is invalid.
