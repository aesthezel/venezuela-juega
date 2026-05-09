# DaisyUI Data Input: Fieldset

A semantic container for grouping related form inputs with legends and labels.

## Basic Usage
Use `fieldset`, `fieldset-legend`, and `fieldset-label` for accessible forms.

```html
<fieldset class="fieldset bg-base-200 p-4 rounded-box">
  <legend class="fieldset-legend">User Information</legend>
  
  <label class="fieldset-label">Name</label>
  <input type="text" class="input input-bordered" placeholder="Full Name" />
  
  <label class="fieldset-label">Email</label>
  <input type="email" class="input input-bordered" placeholder="email@example.com" />
</fieldset>
```

## Pattern: Radio Groups
Fieldsets are ideal for radio button groups.

```html
<fieldset class="fieldset">
  <legend class="fieldset-legend text-primary">Notification Settings</legend>
  <label class="label cursor-pointer">
    <span class="label-text">Email</span>
    <input type="radio" name="notify" class="radio" checked />
  </label>
  <label class="label cursor-pointer">
    <span class="label-text">Push</span>
    <input type="radio" name="notify" class="radio" />
  </label>
</fieldset>
```

## Good vs. Bad Fieldset
```html
<!-- Good: Accessible fieldset with semantic legend -->
<fieldset class="fieldset">
  <legend class="fieldset-legend">Title</legend>
  ...
</fieldset>

<!-- Bad: Using a div with font-bold to simulate a legend -->
<div class="p-4 border">
  <div class="font-bold">Title</div>
  ...
</div>
```
