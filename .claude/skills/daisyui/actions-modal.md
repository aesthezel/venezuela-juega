# Actions: Modal

DaisyUI 5 recommends using the native HTML `<dialog>` element for modals to ensure accessibility, focus trapping, and native backdrop support.

## Standard Modal

### Good Example: Native Dialog Modal
```html
<!-- Trigger -->
<button class="btn" onclick="my_modal_1.showModal()">Open Modal</button>

<!-- Modal Content -->
<dialog id="my_modal_1" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Hello!</h3>
    <p class="py-4">Press ESC key or click the button below to close</p>
    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
```

## Click Outside to Close

### Good Example: Backdrop Close
```html
<dialog id="my_modal_2" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Close via backdrop</h3>
  </div>
  <!-- Clicking this form area closes the dialog -->
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
```

### Bad Example: Checkbox Hack (Outdated)
```html
<!-- Bad: While DaisyUI supports this, the <dialog> approach is more accessible and semantic. -->
<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">...</div>
</div>
```
