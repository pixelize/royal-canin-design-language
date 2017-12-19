RCDL.features.sticky = {

  /**
   * Add the default functionality for alerts. Remove alert if close button clicked.
   * Store this decision in the local session and hide the alerts if they've already been closed.
   *
   * @param {String|Array} selector
   * Either a css selector or an array or selectors.
   */
  init: function (selector) {
    'use strict';

    var sticky = document.querySelector(selector);
    var stuck = false;
    var stickPoint = getDistance();

    function getDistance() {
      return sticky ? sticky.offsetTop + 1 : null;
    }

    function getDimentions(selector) {
      var item = document.querySelector(selector);
      return {
        height: item.offsetHeight,
        width: item.offsetWidth
      };
    }

    if (sticky !== null) {
      window.onscroll = function (e) {
        var distance = getDistance() - window.pageYOffset;
        var offset = window.pageYOffset;
        var position = sticky.getAttribute('data-sticky');
        var offsets = setOffsets(position);

        if ((distance <= 0) && !stuck) {

          // Create a temporary element to take up the space lost when the sticky
          // item becomes fixed.
          var spacer = document.createElement('div');
          spacer.setAttribute('data-sticky', position + '-clone');
          spacer.style.height = getDimentions(selector).height + 'px';
          spacer.style.width = getDimentions(selector).width + 'px';

          // Insert the temporary item before the sticky item.
          sticky.parentNode.insertBefore(spacer, sticky);

          sticky.setAttribute('data-original-position', sticky.style.position);
          sticky.style.position = 'fixed';

          sticky.style[position] = '0px';
          stuck = true;

          sticky.parentNode.style[offsets.padding] = sticky[offsets.space];
        }
        else if (stuck && (offset <= stickPoint)) {
          sticky.style.position = sticky.getAttribute('data-original-position');
          sticky.style[position] = 'auto';
          stuck = false;

          sticky.parentNode.style[offsets.padding] = 'auto';

          document.querySelector('[data-sticky="' + position + '-clone"]').remove();
        }
      };
    }

    function setOffsets (position) {
      var padding = null;
      var space = null;
      switch (position) {
        case 'top':
          padding = 'paddingTop';
          space = 'clientHeight';
          break;
        case 'bottom':
          padding = 'paddingTop';
          space = 'clientHeight';
          break;
        case 'left':
          padding = 'paddingLeft';
          space = 'clientWidth';
          break;
        case 'right':
          padding = 'paddingRight';
          space = 'clientWidth';
          break;
      }

      return {
        padding: padding,
        space: space
      };
    }
  }
};

RCDL.ready(RCDL.features.sticky.init('[data-sticky]'));



