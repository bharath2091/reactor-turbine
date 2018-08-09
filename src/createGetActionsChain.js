/***************************************************************************************
 * (c) 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

var logger = require('./logger');
var Promise = require('@adobe/reactor-promise');

module.exports = function(
  moduleProvider,
  replaceTokens,
  getErrorMessage,
  notifyMonitors,
  MODULE_NOT_FUNCTION_ERROR
) {
  return function(rule, syntheticEvent) {
    var done = function() {
      logger.log('Rule "' + rule.name + '" fired.');
      notifyMonitors('ruleCompleted', {
        rule: rule
      });
    };

    return rule.actions.reduceRight(function(next, action) {
      return function() {
        action.settings = action.settings || {};

        var moduleExports;

        try {
          moduleExports = moduleProvider.getModuleExports(action.modulePath);
        } catch (e) {
          logger.error(getErrorMessage(action, rule, e.message, e.stack));
          return Promise.resolve(next());
        }

        if (typeof moduleExports !== 'function') {
          logger.error(
            getErrorMessage(action, rule, MODULE_NOT_FUNCTION_ERROR)
          );
          return Promise.resolve(next());
        }

        var settings = replaceTokens(action.settings, syntheticEvent);

        try {
          return Promise.race([
            Promise.resolve(moduleExports(settings, syntheticEvent)),
            new Promise(function(resolve) {
              var timeout = 5000;
              setTimeout(resolve, timeout);
            })
          ]).then(next, next);
        } catch (e) {
          logger.error(getErrorMessage(action, rule, e.message, e.stack));
          return Promise.resolve(next());
        }
      };
    }, done);
  };
};
