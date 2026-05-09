# Data Display: Accordion

DaisyUI uses the `.collapse` class with radio inputs to create a mutually exclusive accordion.

## Mutually Exclusive Accordion (Single Open)

### Good Example: Radio Input Accordion
```html
<div class="join join-vertical w-full">
  <div class="collapse collapse-arrow join-item border-base-300 border">
    <input type="radio" name="my-accordion-4" checked="checked" /> 
    <div class="collapse-title text-xl font-medium">Click to open this one and close others</div>
    <div class="collapse-content"> 
      <p>Content for the first section.</p>
    </div>
  </div>
  <div class="collapse collapse-arrow join-item border-base-300 border">
    <input type="radio" name="my-accordion-4" /> 
    <div class="collapse-title text-xl font-medium">Click to open this one and close others</div>
    <div class="collapse-content"> 
      <p>Content for the second section.</p>
    </div>
  </div>
</div>
```
*Note: Using `name="my-accordion-4"` on all radio inputs groups them, ensuring only one can be checked at a time.*

## Multiple Open Accordion (Independent)

If you want multiple sections to be open simultaneously, use `type="checkbox"` or the HTML `<details>` element instead of radio buttons. See the `collapse` component for more details.

### Bad Example: Missing Name Attribute
```html
<!-- Bad: Missing 'name' attribute means they act as independent checkboxes, breaking the accordion behavior. -->
<div class="collapse">
  <input type="radio" />
  ...
</div>
```
