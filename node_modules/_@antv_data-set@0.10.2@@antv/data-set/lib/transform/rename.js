var forIn = require('@antv/util/lib/each');

var isPlainObject = require('@antv/util/lib/type/is-plain-object');

var isString = require('@antv/util/lib/type/is-string');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;
/*
 * options: {
 *   type: 'pick',
 *   fields: [],
 * }
 */


function transform(dataView, options) {
  if (options === void 0) {
    options = {};
  }

  var map = options.map || {};
  var cleanMap = {};

  if (isPlainObject(map)) {
    forIn(map, function (value, key) {
      if (isString(value) && isString(key)) {
        cleanMap[key] = value;
      }
    });
  }

  dataView.rows.forEach(function (row) {
    forIn(map, function (newKey, key) {
      var temp = row[key];
      delete row[key];
      row[newKey] = temp;
    });
  });
}

registerTransform('rename', transform);
registerTransform('rename-fields', transform);