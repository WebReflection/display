/*! display v0.1.7 - MIT license */
/** easy way to obtain the full window size and some other prop */
;(function (global) { function moduleDefinition(/*dependency*/) {

  var
    Math = global.Math,
    abs = Math.abs,
    max = Math.max,
    min = Math.min,
    Infinity = global.Infinity,
    screen = global.screen || Infinity,
    matchMedia = global.matchMedia,
    addEventListener = 'addEventListener',
    document = global.document,
    documentElement = document.documentElement,
    shouldBeMobile  = /\bMobile\b/.test(navigator.userAgent),
    rFS = documentElement.requestFullscreen ||
          documentElement.mozRequestFullScreen ||
          documentElement.webkitRequestFullScreen
    ,
    cFS = document.exitFullscreen ||
          document.cancelFullscreen ||
          document.mozCancelFullScreen ||
          document.webkitExitFullscreen
    ,
    handlers = {
      change: []
    },
    display = {
      width: 0,
      height: 0,
      ratio: 0,
      full: rFS && cFS ? function (onOrOff) {
        var
          isFS =  document.fullscreenElement ||
                  document.mozFullScreenElement ||
                  document.webkitFullscreenElement
        ;
        if (onOrOff || onOrOff == null) {
          display.fullScreen = true;
          if (!isFS) {
            rFS.call(documentElement);
          }
        } else if (isFS) {
          display.fullScreen = false;
          cFS.call(document);
        }
      } : Object,
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
    },
    timer
  ;

  function notify(callback) {
    callback.call(display, display.width, display.height);
  }

  function delayed(e) {
    if (timer) {
      clearTimeout(timer);
      timer = 0;
    }
    // ignore this event if keyboard comes up (300 should be enough)
    return(!isLandscape() && innerHeight < 300) ||
          (timer = setTimeout(recalc, 300, e));
  }

  function isLandscape() {
    return 'orientation' in global ?
      abs(global.orientation || 0) === 90 :
      !!matchMedia && matchMedia("(orientation:landscape)").matches;
  }

  function recalc(e) {
    timer = 0;
    var
      devicePixelRatio = global.devicePixelRatio || 1,
      landscape = isLandscape(),
      swidth = screen.width,    // TODO: verify screen.availWidth in some device
      sheight = screen.height,  // only if width/height not working as expected
      width = min(
        global.innerWidth || documentElement.clientWidth,
        // some Android has 0.75 ratio
        devicePixelRatio < 1 ? Infinity : (
          // Android flips screen width and height size in landscape
          // Find biggest dimension in landscape otherwise width is OK
          (shouldBeMobile && landscape ? max(swidth, sheight) : swidth) || Infinity
        )
      ),
      height = min(
        global.innerHeight || documentElement.clientHeight,
        // some Android has 0.75 ratio
        devicePixelRatio < 1 ? Infinity : (
          // Android flips screen width and height size in landscape
          // Find biggest dimension in landscape otherwise width is OK
          (shouldBeMobile && landscape ? min(swidth, sheight) : sheight) || Infinity
        )
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
    global[addEventListener]('orientationchange', delayed, true);
    global[addEventListener]('resize', delayed, true);
    try {
      // W3C proposal
      screen[addEventListener]('orientationchange', delayed, true);
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