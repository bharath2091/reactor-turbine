'use strict';

var bubbly = require('bubbly')();
var addLiveEventListener = require('addLiveEventListener');

/**
 * Keypress event. This event occurs when a key is pressed down and the key normally produces
 * a character value.
 * @param {Object} config
 * @param {Object} config.eventConfig The event config object.
 * @param {string} config.eventConfig.selector The CSS selector for elements the rule is targeting.
 * @oaram {boolean} [config.eventHandlerOnElement=false] Whether the event listener should be
 * added directly to the element rather than an ancestor.
 * @param {boolean} [config.eventConfig.bubbleFireIfParent=false] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [config.eventConfig.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.eventConfig.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  bubbly.addListener(config.eventConfig, trigger);

  if (config.eventConfig.eventHandlerOnElement) {
    addLiveEventListener(config.eventConfig.selector, 'keypress', bubbly.evaluateEvent);
  } else {
    document.addEventListener('keypress', bubbly.evaluateEvent, true);
  }
};