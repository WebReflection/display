/*! screen v0.1.0 - MIT license */
/** easy way to obtain the full window size and some other prop */
;(function (global) { function moduleDefinition(/*dependency*/) {

  var
    min = Math.min,
    Infinity = global.Infinity,
    screen = global.screen || Infinity,
    addEventListener = 'addEventListener',
    documentElement = global.document.documentElement,
    handlers = {
      change: []
    },
    display = {
      width: 0,
      height: 0,
      ratio: 0,
      on: function (type, callback) {
        // right now only change is supported
        // throws otherwise
        handlers[type].push(callback);
      }
    }
  ;

  function notify(callback) {
    callback.call(display, display.width, display.height);
  }

  function recalc() {
    var
      width = min(
        global.innerWidth || documentElement.clientWidth,
        screen.width || Infinity,
        screen.availWidth || Infinity
      ),
      height = min(
        global.innerHeight || documentElement.clientHeight,
        screen.height || Infinity,
        screen.availHeight || Infinity
      )
    ;
    if (width !== display.width || height !== display.height) {
      display.width = width;
      display.height = height;
      handlers.change.forEach(notify);
    }
  }

  // 
  if (addEventListener in global) {
    global[addEventListener]('orientationchange', recalc, true);
    global[addEventListener]('resize', recalc, true);
  } else {
    global.attachEvent('onresize', recalc);
  }

  recalc();

  // calculated only once
  // works with MS Tablets/Phones too
  display.ratio = global.devicePixelRatio ||
                  screen.width / display.width ||
                  (screen.deviceXDPI || 1) / (screen.logicalXDPI || 1);

  return display;

// ---------------------------------------------------------------------------

} if (typeof exports === 'object') {
    // node export
    module.exports = moduleDefinition(/*require('dependency')*/);
} else if (typeof define === 'function' && define.amd) {
    // amd anonymous module registration
    define([/*'dependency'*/], moduleDefinition);
} else {
    // browser global
    global.display = moduleDefinition(/*global.dependency*/);
}}(this));