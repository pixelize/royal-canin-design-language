RCDL.features.Parallax = {

  /**
   * Receives a css selector and transforms the target wrapper div and input into a slider.
   *
   * @param {String} selector
   * Css selector for finding targets for conversion.
   */
  init: function (selector, options) {
    'use strict';
    var defaultOptions = {
      speed: -2,
      center: false,
      round: true,
      vertical: true,
      horizontal: false
    }

    selector = selector || '[data-rellax-speed]';
    options = options || defaultOptions

    if (document.querySelectorAll(selector).length > 0) {
      return new Rellax(selector, options);
    }
  }
};

RCDL.ready(RCDL.features.Parallax.init());
