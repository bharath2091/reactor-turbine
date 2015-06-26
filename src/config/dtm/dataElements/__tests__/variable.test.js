'use strict';

var rewire = require('rewire');
var dataElementDelegate = rewire('../variable');

var getObjectPropertySpy = jasmine.createSpy().and.returnValue('bar');
dataElementDelegate.__set__('getObjectProperty', getObjectPropertySpy);

describe('variable data element delegate', function() {
  it('should return an object property value', function() {
    var settings = {
      path: 'my.path.var'
    };

    var value = dataElementDelegate(settings);

    expect(value).toBe('bar');
    expect(getObjectPropertySpy.calls.argsFor(0)).toEqual([window, 'my.path.var']);
  });
});