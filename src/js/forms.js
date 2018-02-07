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
   * Gets validation states from each input and determines whether to validate as you type or on submit and also
   * whether to display an accompanying message. Default validation is activated using data-js-validate (no message),
   * or to add messages use data-js-error-message, data-js-warning-message or data-js-success-message.
   *
   * @param {String} target
   * Selector for each form input
   * @param {String} submit
   * Selector for each form input
   */
  formValidation: function (target, submit) {
    'use strict';
    var submitButton = document.querySelector(submit);
    var inputs = document.querySelectorAll(target);

    // Check if current input has any validation messages and push to array
    function getMessages(el) {
      var result = [];
      Object.keys(el.closest(target).attributes).forEach(function (attr) {
        var attrName = el.closest(target).attributes[attr].name;
        if (/message$/.test(attrName)) {
          result.push(attrName);
        }
      });
      return result;
    }

    // Create the container span for the validation message
    function createMessage(el) {
      var newSpan = document.createElement('span');
      newSpan.setAttribute('data-js-validation-message', '');
      RCDL.utilities.modifyClass('add', newSpan, 'input__validation-message');
      el.closest(target).appendChild(newSpan);
    }

    // Return the correct class and messages for the state
    function state(el, state, messages) {
      
      // Compare the messages to the state to check if any exist
      if (messages.length > 0) {
        var validationMsg = el.closest(target).querySelector('[data-js-validation-message]');
        
        messages.forEach(function (msg) {
          if (msg.includes(state)) {
            RCDL.utilities.modifyClass('add', el.closest(target), 'input--' + state);
            validationMsg.innerText = el.closest(target).getAttribute('data-js-' + state + '-message');
          }
          else {
            var oldState = msg.split('-')[msg.split('-').length - 2]; // Get just the state from the message type
            RCDL.utilities.modifyClass('remove', el.closest(target), 'input--' + oldState);
          }
        });
      }
      else { // If no messages, then only two states are allowed
        var newStates = ['default', 'error'];
        newStates.forEach(function (newState) {
          if (newState === state) { // If the state we passed matches, add the class
            RCDL.utilities.modifyClass('add', el.closest(target), 'input--' + newState);
          }
          else { // Remove all other states
            RCDL.utilities.modifyClass('remove', el.closest(target), 'input--' + newState);
          }
        });
      }
    }

    // Main validation function
    function validate(el, event, messages) {

      // On form submit
      if (submitButton) {
        submitButton.addEventListener('click', function (e) {
          e.preventDefault();
          if (!el.hasAttribute('optional') && el.value.length === 0) {
            state(el, 'error', messages);
          }
          else if (el.checkValidity()) {
            state(el, 'default', messages);
          }
        });
      }

      // On input change
      el.addEventListener(event, function () {
        if (el.value.length > 1 && el.checkValidity()) {
          state(el, 'success', messages);
        }
        else if (el.value.length === 0) {
          state(el, 'default', messages);
        }
        else {
          state(el, 'warning', messages);
        }
      });
    }

    // Matches two inputs
    function matchInput(el, messages) {
      if (el.hasAttribute('data-js-match')) {
        var match = document.getElementById(el.getAttribute('data-js-match'));
        
        el.addEventListener('input', function () {
          if (el.value.length > 2) {
            state(match, el.value === match.value ? 'success' : 'error', getMessages(match));
            state(el, 'default', messages);
          }
          else {
            state(el, 'warning', messages);
          }
        });
        
        match.addEventListener('keyup', function () {
          state(match, el.value === match.value ? 'success' : 'error', getMessages(match));
        });
      }
    }

    // Call our functions for the inputs
    Object.keys(inputs).forEach(function (key) {
      var input = inputs[key].querySelector('input');
      var select = inputs[key].querySelector('select');
      var currentInput = input ? input : select;
      var thisMessages = [];

      // If the input has validation messages
      if (getMessages(currentInput)) {
        createMessage(currentInput);
        thisMessages = getMessages(currentInput);
      }

      // Pass different values based on input type
      if (input) {
        if (input.getAttribute('type') === 'password') {
          matchInput(input, thisMessages);
        }
        else {
          validate(input, 'input', thisMessages);
        }
      }
      if (select) {
        validate(select, 'addItem', thisMessages);
      }
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
      eye.setAttribute('type', 'button');

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
  }
};

RCDL.ready(RCDL.features.FormElements.labels('.input'));
RCDL.ready(RCDL.features.FormElements.formValidation('[data-js-validate]', null));
RCDL.ready(RCDL.features.FormElements.passwordField('[type="password"]'));

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
