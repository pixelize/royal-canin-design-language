var RCWDL = {};
RCWDL.features = {};
RCWDL.utilities = {};

// Function to handle when DOM is ready.
RCWDL.ready = function (fn) {
  'use strict';

  if (document.readyState !== 'loading') {
    fn();
  }
  else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

RCWDL.utilities.toggleClass = function (target, className, addRemove) {
  'use strict';

  // IE 8+ support.
  if (target.classList) {
    target.classList[addRemove]('hidden');
  }
  else {
    if (addRemove === 'add') {
      target.className += ' hidden';
    }
    else {
      target.className = target.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }
};

RCWDL.utilities.wrap = function (el, wrapper) {
  'use strict';

  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
};

RCWDL.utilities.triggerResize = function () {
  'use strict';

  var evt = document.createEvent('HTMLEvents');
  evt.initEvent('resize', true, false);
  window.dispatchEvent(evt);
};

RCWDL.utilities.hasClass = function (el, className) {
  'use strict';

  if (el.classList) {
    return el.classList.contains(className);
  }
  else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
};

RCWDL.utilities.triggerAndTargetClassModifier = {

  /**
   * Add event handler to elements with specified css selector, when specified event triggers,
   * toggle the the supplied class name on both the trigger and target element.
   *
   * @param {String} event
   * Event type to add handler to.
   *
   * @param {String} trigger
   * Element selector that will be used to toggle the modifier class.
   *
   * @param {String} target
   * Element selector that will be targeted when the event fires.
   *
   * @param {String} modifier
   * Class added to both the trigger and target elements.
   *
   * @param {Number} depth
   * Numeric value used to help toggles that climb the DOM to stop after a set amount of increments.
   *
   */
  init: function (event, trigger, target, modifier, depth) {
    'use strict';

    // Find the nodes we will use as triggers.
    if (typeof document.querySelector(trigger) === 'object' && document.querySelector(trigger) !== null) {
      this.attach(event, document.querySelectorAll(trigger), target, modifier, depth);
    }
  },
  attach: function (event, targetNodes, target, modifier, depth) {
    'use strict';

    // Loop through the list of nodes and attached events to each.
    if (event === 'load') {
      for (var i = 0; i < (targetNodes.length); i++) {
        this.action(targetNodes[i], target, modifier, depth);
      }
    }
    else {
      if (targetNodes.length > 0) {
        for (var b = 0; b < (targetNodes.length); b++) {
          targetNodes[b].addEventListener(event, function (event) { this.action(event.target, target, modifier, depth); });
        }
      }
      else {
        targetNodes.addEventListener(event, function (event) { this.action(event.target, target, modifier, depth); });
      }
    }
  },
  action: function (targetNode, target, modifier, depth) {
    'use strict';

    // Store the node in a temporary variable, which we will replace as we climb the DOM.
    var currentNode = targetNode;
    var classNoDot = modifier.replace(/^\./, '');
    var toggle = !RCWDL.utilities.hasClass(targetNode, classNoDot) ? 'add' : 'remove';

    if (depth > 0) {
      for (var i = 0; i < depth; i++) {
        currentNode = this.climbTreeAndToggle(currentNode, target, modifier, i);
      }
    }
    else if (/data-js-trigger/i.test(target)) {
      document.querySelectorAll('[data-js-target]').forEach(function (item) {
        RCWDL.utilities.triggerAndTargetClassModifier.removeModifier(item, classNoDot);
      });

      document.querySelectorAll(target).forEach(function (item) {
        RCWDL.utilities.triggerAndTargetClassModifier.removeModifier(item, classNoDot);
      });

      var childTarget = document.querySelector('[data-js-target="' + targetNode.getAttribute('data-js-trigger') + '"]');
      childTarget.classList[toggle](classNoDot);

      // Toggle the active class on the trigger.
      targetNode.classList[toggle](classNoDot);
    }
  },
  removeModifier: function (item, modifier) {
    'use strict';

    if (item.classList) {
      item.classList.remove(modifier);
    }
    else {
      item.modifier = item.modifier.replace(new RegExp('(^|\\b)' + modifier.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  },
  climbTreeAndToggle: function (currentNode, target, modifier) {
    'use strict';

    while (!this.classCheck(currentNode, target.target) && currentNode !== null) {
      // Check the node for the target class and climb the DOM if not found.
      currentNode = currentNode.parentNode;
    }

    if (target.siblingCheck) {
      var childTarget = currentNode.querySelector(target.targetClass);
      childTarget.classList.toggle(modifier.replace(/^\./, ''));
    }
    else {
      // Toggle the active class on the target.
      currentNode.classList.toggle(modifier.replace(/^\./, ''));
    }
    return currentNode.parentNode;
  },
  classCheck: function classCheck(el, className) {
    'use strict';

    try {
      // Try and find the class with contains function, use RegEx for older browsers.
      if (el.classList) {
        return el.classList.contains(className.replace(/^\./, ''));
      }
      else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
      }
    }
    catch (e) {
      throw new Error('Css Selector: "' + className + '" doesn\'t appear to be in the DOM');
    }
  }
};
