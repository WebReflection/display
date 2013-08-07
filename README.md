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