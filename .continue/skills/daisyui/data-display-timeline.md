# Data Display: Timeline

The timeline component displays a list of events in chronological order. It can be oriented horizontally or vertically.

## Horizontal Timeline

### Good Example: Horizontal Steps
```html
<ul class="timeline">
  <li>
    <div class="timeline-start">1984</div>
    <div class="timeline-middle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="timeline-end timeline-box">First Macintosh computer</div>
    <hr/>
  </li>
  <li>
    <hr/>
    <div class="timeline-start">1998</div>
    <div class="timeline-middle">...</div>
    <div class="timeline-end timeline-box">iMac</div>
  </li>
</ul>
```

## Vertical Timeline

Add the `timeline-vertical` class to stack items.

### Good Example: Vertical Events
```html
<ul class="timeline timeline-vertical">
  <li>
    <div class="timeline-start">Step 1</div>
    <div class="timeline-middle">...</div>
    <hr/>
  </li>
  <li>
    <hr/>
    <div class="timeline-start">Step 2</div>
    <div class="timeline-middle">...</div>
  </li>
</ul>
```

### Bad Example: Inconsistent Alignment
```html
<!-- Bad: Mixing timeline-start and timeline-end on the same side without clear hierarchy -->
<li>
  <div class="timeline-start">Date</div>
  <div class="timeline-start">Description</div>
</li>
```
