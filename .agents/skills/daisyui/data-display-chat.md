# Data Display: Chat

Chat components style messaging interfaces with avatars, timestamps, and styled bubbles.

## Chat Directions

Use `chat-start` (left) or `chat-end` (right) to determine the alignment of the message.

### Good Example: Chat Start & End
```html
<div class="chat chat-start">
  <div class="chat-bubble">It's over Anakin, I have the high ground.</div>
</div>
<div class="chat chat-end">
  <div class="chat-bubble">You underestimate my power!</div>
</div>
```

## Advanced Anatomy

A complete chat bubble includes headers, footers, and avatars.

### Good Example: Complete Chat Bubble
```html
<div class="chat chat-start">
  <div class="chat-image avatar">
    <div class="w-10 rounded-full">
      <img alt="Tailwind CSS chat bubble component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
    </div>
  </div>
  <div class="chat-header">
    Obi-Wan Kenobi
    <time class="text-xs opacity-50">12:45</time>
  </div>
  <div class="chat-bubble chat-bubble-primary">You were the Chosen One!</div>
  <div class="chat-footer opacity-50">Delivered</div>
</div>
```

### Colors

Apply color variants directly to the `chat-bubble`.

### Good Example: Bubble Colors
```html
<div class="chat chat-start">
  <div class="chat-bubble chat-bubble-info">Calm down.</div>
</div>
<div class="chat chat-end">
  <div class="chat-bubble chat-bubble-error">I HATE YOU!</div>
</div>
```
