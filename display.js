/*! screen v0.1.0 - MIT license */
/** easy way to obtain the full window size and some other prop */
;(function (global) { function moduleDefinition(/*dependency*/) {

  var
    abs = Math.abs,
    min = Math.min,
    Infinity = global.Infinity,
    screen = global.screen || Infinity,
    matchMedia = window.matchMedia,
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
    },
    forEach = handlers.change.forEach || function (callback, self) {
      // partial polyfill for this case only
      for(var i = 0; i < this.length; i++) {
        callback.call(self, this[i], i, this);
      }
    }
  ;

  function notify(callback) {
    callback.call(display, display.width, display.height);
  }

  function recalc(e) {
    var
      hasOrientation = 'orientation' in this,
      landscape = hasOrientation ?
        abs(this.orientation || 0) === 90 :
        !!matchMedia && matchMedia("(orientation:landscape)")
      ,
      $width = 'width',
      $height = 'height',
      $availWidth = 'availWidth',
      $availHeight = 'availHeight',
      width = min(
        global.innerWidth || documentElement.clientWidth,
        screen[landscape ? $height : $width] || Infinity,
        screen[landscape ? $availHeight : $availWidth] || Infinity
      ),
      height = min(
        global.innerHeight || documentElement.clientHeight,
        screen[landscape ? $width : $height] || Infinity,
        screen[landscape ? $availWidth : $availHeight] || Infinity
      )
    ;
    if (width !== display.width || height !== display.height) {
      display.width = width;
      display.height = height;
      forEach.call(handlers.change, notify);
    }
  }

  // 
  if (addEventListener in global) {
    global[addEventListener]('orientationchange', recalc, true);
    global[addEventListener]('resize', recalc, true);
    try {
      // W3C proposal
      screen[addEventListener]('orientationchange', recalc, true);
    } catch(e) {}
  } else {
    global.attachEvent('onresize', recalc);
  }

  recalc.call(global);

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