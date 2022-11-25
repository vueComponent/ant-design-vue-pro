var each = require('../each');
var toArray = require('../to-array');
var uniq = require('./uniq');

var union = function union() {
  var result = [];
  var sources = toArray(arguments);
  each(sources, function (arr) {
    result = result.concat(arr);
  });
  return uniq(result);
};

module.exports = union;