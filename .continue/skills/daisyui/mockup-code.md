# Mockup: Code

The code mockup component displays code snippets inside a simulated terminal window.

## Basic Usage

Use `data-prefix` on the `<code>` tag to show terminal prompts.

### Good Example: Simple Terminal Command
```html
<div class="mockup-code">
  <pre data-prefix="$"><code>npm i daisyui</code></pre>
  <pre data-prefix=">" class="text-warning"><code>installing...</code></pre> 
  <pre data-prefix=">" class="text-success"><code>Done!</code></pre>
</div>
```

## Line Highlights and Colors

### Good Example: Multi-line Code with Highlights
```html
<div class="mockup-code">
  <pre data-prefix="1"><code>const x = 10;</code></pre>
  <pre data-prefix="2" class="bg-warning text-warning-content"><code>console.log(x);</code></pre>
  <pre data-prefix="3"><code>// Output: 10</code></pre>
</div>
```

## Multi-line Wraps

Use `overflow-x-auto` if your code lines are long.

### Bad Example: Hardcoded Prefixes
```html
<!-- Bad: Do not put '$' directly in the code text; use the 'data-prefix' attribute for proper alignment and styling -->
<div class="mockup-code">
  <pre><code>$ npm install</code></pre>
</div>
```
