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

var Promise = require('@adobe/reactor-promise');
var store = {};

module.exports = function(chain, syntheticEvent) {
  var eventTypeChainStore = store[syntheticEvent.$type];
  if (!eventTypeChainStore) {
    eventTypeChainStore = store[syntheticEvent.$type] = {
      lastEventOrder: -Infinity,
      previousPromise: Promise.resolve(null),
      currentPromiseArr: []
    };
  }

  if (eventTypeChainStore.lastEventOrder !== syntheticEvent.$rule.eventOrder) {
    eventTypeChainStore.previousPromise = eventTypeChainStore.previousPromise.then(
      (function(arr) {
        return function() {
          return Promise.all(arr);
        };
      })(eventTypeChainStore.currentPromiseArr)
    );

    eventTypeChainStore.currentPromiseArr = [];
    eventTypeChainStore.lastEventOrder = syntheticEvent.$rule.eventOrder;
  }

  eventTypeChainStore.currentPromiseArr.push(
    eventTypeChainStore.previousPromise.then(chain)
  );
};
