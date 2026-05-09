# Data Display: Countdown

The countdown component utilizes CSS variables to display numbers. This allows updating the value via JavaScript by changing a single CSS variable rather than manipulating the DOM text directly.

## Usage

Set the `--value` CSS variable using inline styles. The variable accepts an integer between 0 and 99.

### Good Example: Standard Countdown
```html
<span class="countdown">
  <span style="--value:59;"></span>
</span>
```

### Good Example: Clock Format
```html
<span class="countdown font-mono text-2xl">
  <span style="--value:10;"></span>h
  <span style="--value:24;"></span>m
  <span style="--value:59;"></span>s
</span>
```

### Good Example: Updating via JavaScript
```javascript
// Good: Update the style property to change the number
const timer = document.getElementById('seconds');
let time = 60;
setInterval(() => {
  time--;
  timer.style.setProperty('--value', time);
}, 1000);
```

### Bad Example: Direct DOM Manipulation
```html
<!-- Bad: Modifying the innerText instead of using the CSS variable breaks the component's formatting logic -->
<span class="countdown">
  <span id="counter">59</span> 
</span>
```
