RCDL.features.sticky = {
  /**
   * Add the default functionality for alerts. Remove alert if close button clicked.
   * Store this decision in the local session and hide the alerts if they've already been closed.
   *
   * @param {String|Array} selectors
   * Either a css selector or an array or selectors.
   */
  init: function (selector) {
    'use strict';

    var stickies = document.querySelectorAll(selector);

    stickies.forEach(function (sticky) {
      // Update the selector to be more accurate.
      selector = '[data-sticky-id="' + sticky.getAttribute('data-sticky-id') + '"]';
      var offsetRequired = (sticky.getAttribute('data-sticky-offset') === 'true');
      var stuck = false;

      var original = {
        top: sticky.getBoundingClientRect().top + window.scrollY,
        bottom: sticky.getBoundingClientRect().bottom,
        left: sticky.getBoundingClientRect().left,
        right: sticky.getBoundingClientRect().right,
        width: sticky.getBoundingClientRect().width,
        height: sticky.offsetHeight
      };

      window.addEventListener('scroll', fireSticky);
      window.addEventListener('scroll', maintainWidthofParent);
      window.addEventListener('resize', maintainWidthofParent);
      window.addEventListener('resize', fireSticky);
      RCDL.ready(fireSticky);


      function maintainWidthofParent () {
        var sticky = document.querySelector(selector);
        sticky.style.width = '';
        if (sticky.getAttribute('data-sticky-retain-width') === 'true') {
          if (sticky.style.width === null) {
            sticky.style.width = sticky.parentNode.style.width;
          }
        }
      }

      function fireSticky() {
        var position = sticky.getAttribute('data-sticky');
        var offsets = setOffsets(position);

        if ((window.scrollY >= 1) && !stuck && window.matchMedia('(min-width: 800px)').matches) {

          if (offsetRequired) {
            // Create a temporary element to take up the space lost when the sticky
            // item becomes fixed.
            var spacer = document.createElement('div');
            spacer.setAttribute('data-sticky', position + '-clone');
            spacer.style.height = original.height + 'px';
            spacer.style.width = original.width + 'px';

            // Insert the temporary item before the sticky item.
            sticky.parentNode.insertBefore(spacer, sticky);
          }

          sticky.setAttribute('data-original-position', sticky.style.position);

          sticky.style[position] = Math.sign(original[position]) === 1 ? original[position] : 0 + 'px';

          if (position === 'left' || position === 'right') {
            sticky.style['top'] = (original.top)  + 'px';
            sticky.style['bottom'] = original.height > window.innerHeight ? 0 : window.innerHeight -
              ((Math.sign(original.top) === 1 ? original.top : 0) + original.height) + 'px';

            var offsetBottom = document.querySelector('body > footer');
            if (offsetBottom !== null) {
              sticky.style.paddingBottom = offsetBottom.offsetHeight + 'px';
              sticky.style.bottom = offsetBottom.offsetHeight + 'px';
            }
          }

          sticky.style.position = 'fixed';
          stuck = true;

          sticky.parentNode.style[offsets.padding] = sticky[offsets.space];
        }
        else if (stuck && (window.scrollY === 0)) {
          sticky.style.position = sticky.getAttribute('data-original-position');
          sticky.style[position] = 'auto';
          stuck = false;

          sticky.parentNode.style[offsets.padding] = 'auto';

          if (offsetRequired) {
            sticky.style['top'] = '';
            sticky.style['bottom'] = '';
            sticky.style.paddingBottom = '';
            document.querySelector('[data-sticky="' + position + '-clone"]').remove();
          }
        }

      }
    });

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



