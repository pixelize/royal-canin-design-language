RCDL.features.sticky = {
  /**
   * Add the default functionality for alerts. Remove alert if close button clicked.
   * Store this decision in the local session and hide the alerts if they've already been closed.
   *
   * @param {String|Array} selectors
   * Either a css selector or an array or selectors.
   */
  init: function (selector) {

    var h = document.querySelector(selector);
    var stuck = false;
    var stickPoint = getDistance();

    function getDistance() {
      var topDist = h.offsetTop + 1;
      return topDist;
    }

    window.onscroll = function(e) {
      var distance = getDistance() - window.pageYOffset;
      var offset = window.pageYOffset;
      var position = h.getAttribute('data-sticky');
      var offsets = setOffsets(position);


      if ( (distance <= 0) && !stuck) {
        var spacer = document.createElement('div');
        spacer.style.height = h.innerHeight + 'px';
        spacer.style.width = h.innerWidth + 'px';

        spacer.setAttribute('data-sticky', position + '-clone');

        h.parentNode.insertBefore(spacer, h);

        h.setAttribute('data-original-position', h.style.position);
        h.style.position = 'fixed';
        h.style.zIndex = '999';

        h.style[position] = '0px';
        stuck = true;

        h.parentNode.style[offsets.padding] = h[offsets.space];
      }
      else if (stuck && (offset <= stickPoint)) {
        h.style.position = h.getAttribute('data-original-position');
        h.style[position] = 'auto';
        stuck = false;

        h.parentNode.style[offsets.padding] = 'auto';

        document.querySelector('[data-sticky="' + position + '-clone"]').remove();
      }
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
      }
    }


  }
};

RCDL.ready(RCDL.features.sticky.init('[data-sticky="top"]'));



