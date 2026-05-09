# DaisyUI Data Display: List

A semantic list component for displaying rows of data, often used for settings, menus, or contact lists.

## Basic Usage
The `list` class is used on the container, and `list-row` on each item.

```html
<ul class="list bg-base-100 rounded-box shadow">
  <li class="list-row">
    <div>
      <div class="font-bold">John Doe</div>
      <div class="text-xs opacity-50">Admin</div>
    </div>
    <button class="btn btn-ghost btn-xs">Edit</button>
  </li>
  <li class="list-row">
    <div>
      <div class="font-bold">Jane Smith</div>
      <div class="text-xs opacity-50">User</div>
    </div>
    <button class="btn btn-ghost btn-xs">Edit</button>
  </li>
</ul>
```

## Pattern: List with Avatars
Combine with `avatar` for professional contact lists.

```html
<div class="list bg-base-100 border border-base-300 rounded-box">
  <div class="list-row items-center p-4">
    <div class="avatar">
      <div class="w-10 rounded-full"><img src="..." /></div>
    </div>
    <div class="flex-1">
      <div class="font-bold">Project Alpha</div>
      <div class="text-sm">Ongoing development</div>
    </div>
    <span class="badge badge-success">Active</span>
  </div>
</div>
```

## Good vs. Bad Lists
```html
<!-- Good: Semantic list rows with flexbox alignment -->
<li class="list-row p-4 hover:bg-base-200 transition-colors">...</li>

<!-- Bad: Manual list styling with border-t hacks -->
<li class="p-4 border-t border-gray-200 last:border-b">...</li>
```
