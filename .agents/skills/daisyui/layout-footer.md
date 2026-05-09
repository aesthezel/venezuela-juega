# Layout: Footer

The footer component styles page footers with multiple columns of links and branding.

## Basic Usage

### Good Example: Multi-column Footer
```html
<footer class="footer p-10 bg-neutral text-neutral-content">
  <nav>
    <h6 class="footer-title">Services</h6> 
    <a class="link link-hover">Branding</a>
    <a class="link link-hover">Design</a>
  </nav> 
  <nav>
    <h6 class="footer-title">Company</h6> 
    <a class="link link-hover">About us</a>
    <a class="link link-hover">Contact</a>
  </nav> 
  <nav>
    <h6 class="footer-title">Legal</h6> 
    <a class="link link-hover">Terms of use</a>
    <a class="link link-hover">Privacy policy</a>
  </nav>
</footer>
```

## Centered Footer

### Good Example: Simple Footer with Icons
```html
<footer class="footer footer-center p-10 bg-base-200 text-base-content rounded">
  <nav class="grid grid-flow-col gap-4">
    <a class="link link-hover">About us</a>
    <a class="link link-hover">Contact</a>
  </nav> 
  <nav>
    <div class="grid grid-flow-col gap-4">
      <a><svg ...></svg></a>
      <a><svg ...></svg></a>
    </div>
  </nav> 
  <aside>
    <p>Copyright © 2024 - All right reserved</p>
  </aside>
</footer>
```

### Bad Example: Complex Layout inside Footer
```html
<!-- Bad: Avoid putting large forms or complex interactive components directly inside the footer; keep it focused on navigation and meta information. -->
```
