display
=======

a very simple object with some display info

version **alpha**

### API

  * `.width:Number` the current device width in pixels
  * `.height:Number` the current device height in pixels
  * `.ratio:Number` the current device ratio (1 === 100%)
  * `.on(type, callback)` a basic mechanism to add a listener. Right now accepts only `change` type

That's pretty much it for now.

The change event should be fired only if something really change on the screen.
Most likely this will fire on browsers window resizes or devices orientation change.

```javascript
display.on('change', function (width, height) {
  alert('new size! ' + [width, height]);
});
alert('current size: ' + [display.width, display.height]);
```

This API is very simple right now on purpose. I need to understand when/why/where it needs to be improved, specially on mobile.