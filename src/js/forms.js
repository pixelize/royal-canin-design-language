/**
 * Function factory object for adding features to form elements.
 *
 * @type {{labels: RCDL.features.FormElements.labels, passwordField: RCDL.features.FormElements.passwordField}}
 */
RCDL.features.FormElements = {

  /**
   * To enhance the label behaviour (Moving the label out of the input when in use), we also want to keep the label out
   * after the focus ends on the input. To keep this as light as possible, we just improve the DOM behaviour by
   * keeping the value attribute up to date. With this we can then target the state with css.
   *
   * @param {String} target
   * Css selector.
   */
  labels: function (target) {
    'use strict';
    var inputs = document.querySelectorAll(target);
    var targets = [];

    Object.keys(inputs).forEach(function (inputList) {
      var items = inputs[inputList].querySelectorAll(
        '[type="text"], ' +
        '[type="textbox"], ' +
        '[type="password"], ' +
        '[type="email"], ' +
        '[type="number"], ' +
        '[type="tel"], ' +
        'textarea, ' +
        '[type="url"], ' +
        '[type="search"]');
      // Make sure the wrapper we're targeting actually has inputs inside.
      if (items.length > 0) {
        targets.push(inputs[inputList]);
      }
    });

    targets.forEach(function (input) {
      // Make sure all the elements have been setup correctly and add value attributes if they're missing.
      if (input.getElementsByTagName('textarea').length > 0 &&
          input.getElementsByTagName('textarea')[0].getAttribute('value') === null) {
        input.getElementsByTagName('textarea')[0].setAttribute('value', '');
      }
      else if (input.getElementsByTagName('input')[0].getAttribute('value') === null) {
        input.getElementsByTagName('input')[0].setAttribute('value', '');
      }

      // Attach an event handler to each input and trigger when a value is input.
      input.addEventListener('input', function (event) {
        // Update the attribute to match the DOM state.
        event.target.setAttribute('value', event.target.value);
      });
    });
  },

  /**
   * Adds email validation.
   * @param {String} target
   * Css selector for targeting.
   */
  emailValid: function (target) {
    'use strict';
    var inputs = document.querySelectorAll(target);
    var validationMessage = document.createElement('span');
    RCDL.utilities.modifyClass('add', validationMessage, 'input__validation-message');

    Object.keys(inputs).forEach(function (input) {
      var email = inputs[input];
      
      email.addEventListener('keyup', function () {
        email.parentNode.appendChild(validationMessage);

        if (email.value.length > 1 && email.checkValidity()) {
          RCDL.utilities.modifyClass('add', email.parentNode, 'input--success');
          RCDL.utilities.modifyClass('remove', email.parentNode, 'input--warning');
          validationMessage.innerHTML = '';
        }
        else {
          RCDL.utilities.modifyClass('add', email.parentNode, 'input--warning');
          RCDL.utilities.modifyClass('remove', email.parentNode, 'input--success');
          validationMessage.innerHTML = 'Your email address is invalid';
        }
      });
    });
  },

  /**
   * Adds show/hide toggle to password inputs.
   * @param {String} target
   * Css selector for targeting.
   */
  passwordField: function (target) {
    'use strict';
    var inputs = document.querySelectorAll(target);

    Object.keys(inputs).forEach(function (input) {
      var eye = document.createElement('button');

      // Initial styles and screen reader text for label.
      eye.innerHTML = '<span class="screen-reader-text">Toggle password visibility</span>';
      RCDL.utilities.modifyClass('add', eye, ['btn', 'btn--icon', 'rc-icon-show--xs--iconography', 'input__password-toggle']);
      inputs[input].parentNode.appendChild(eye);

      eye.addEventListener('click', function (event) {
        var input = event.target.parentNode.querySelector('input');

        // Toggle between types.
        switch (input.getAttribute('type')) {
          case 'password':
            input.setAttribute('type', 'text');
            RCDL.utilities.modifyClass('toggle', eye, 'rc-icon-hide--xs--iconography');
            RCDL.utilities.modifyClass('toggle', eye, 'rc-icon-show--xs--iconography');
            break;
          case 'text':
            RCDL.utilities.modifyClass('toggle', eye, 'rc-icon-hide--xs--iconography');
            RCDL.utilities.modifyClass('toggle', eye, 'rc-icon-show--xs--iconography');
            input.setAttribute('type', 'password');
            break;
        }
      });
    });
  },

  /**
   * Adds basic password matching validation.
   * @param {String} target
   * Css selector for targeting.
   */
  passwordMatch: function (target) {
    'use strict';
    var inputs = document.querySelectorAll(target);
    var validationMessage = document.createElement('span');
    RCDL.utilities.modifyClass('add', validationMessage, 'input__validation-message');
    
    Object.keys(inputs).forEach(function (input) {
      var passwordOne = inputs[input].getAttribute('data-pwd-match');
      var passwordTwo = document.getElementById(passwordOne);
      passwordTwo.parentNode.appendChild(validationMessage);
      
      passwordTwo.addEventListener('keyup', function (event) {
        if (passwordTwo.value === input.value) {
          RCDL.utilities.modifyClass('remove', passwordTwo.parentNode, 'input--error');
          RCDL.utilities.modifyClass('add', passwordTwo.parentNode, 'input--success');
          validationMessage.innerHTML = 'Your passwords match';
        }
        else {
          RCDL.utilities.modifyClass('remove', passwordTwo.parentNode, 'input--success');
          RCDL.utilities.modifyClass('add', passwordTwo.parentNode, 'input--error');
          validationMessage.innerHTML = 'Your passwords do not match';
        }
      });
    });
  }
};

RCDL.ready(RCDL.features.FormElements.labels('.input'));
RCDL.ready(RCDL.features.FormElements.emailValid('[type="email"]'));
RCDL.ready(RCDL.features.FormElements.passwordField('[type="password"]'));
RCDL.ready(RCDL.features.FormElements.passwordMatch('[data-pwd-match]'));

/**
 * Converts selector element into Choices.js selectors with improved accessibility and styling.
 *
 * @param {String} selector
 * CSS selector for targeting select elements. Default: [data-js-select]
 * @constructor
 */
RCDL.features.Selects = function (selector) {
  'use strict';
  selector = selector || '[data-js-select]';
  var selects = document.querySelectorAll(selector);

  var singleConfig = {
    placeholderValue: 'Please select...',
    searchEnabled: false
  };

  var multipleConfig = {
    placeholderValue: 'Please select...',
    searchEnabled: false,
    removeItemButton: false,
    classNames: {
      button: 'choices__btn'
    }
  };

  // Check if we actually have any selects on the page.
  if (selects !== null && selects.length > 0) {
    selects.forEach(function (select) {
      var currentConfig = select.hasAttribute('multiple') ? multipleConfig : singleConfig;
      new Choices(select, currentConfig,
        select.addEventListener('choice', function () {
          RCDL.utilities.modifyClass('add', select.parentNode.parentNode, 'has-changed');
        })
      );
    });
  }
};

RCDL.ready(RCDL.features.Selects());

/**
 * Function generate fallback datepicker calendars when the element type date isn't supported.
 *
 * @type {{init: RCDL.features.Datepickers.init, createDatePicker: RCDL.features.Datepickers.createDatePicker}}
 */

RCDL.features.Datepickers = {

  /**
   * Initialisation function to check for and cycle through target elements.
   * @param {String} selector
   * Css selector. Default: [type="date"]
   */
  init: function (selector) {
    'use strict';
    selector = selector || '[type="date"]';
    var datepickers = document.querySelector(selector);

    // Check if we actually have any datepickers on the page.
    if (datepickers !== null) {
      // Check if this browser supports the type date.
      if (Modernizr.inputtypes.date === false) {

        if (Array.isArray(datepickers)) {
          datepickers.forEach(function (picker) {
            RCDL.features.Datepickers.createDatePicker(picker);
          });
        }
        else {
          RCDL.features.Datepickers.createDatePicker(datepickers);
        }
      }
    }
  },

  /**
   * Receives node objects for processing into date pickers.
   * @param {Node} picker
   * Single Node to be process into date picker.
   */
  createDatePicker: function (picker) {
    'use strict';
    picker.setAttribute('type', 'text');
    picker.setAttribute('placeholder', 'Select a date');

    new Pikaday(
      {
        field: picker,
        format: picker.getAttribute('data-js-dateformat')
      }
    );
  }
};

RCDL.ready(RCDL.features.Datepickers.init());
