
var each = require('./each');
var mix = require('./mix');

// collections
var DOMUtil = require('./dom/');
var arrayUtil = require('./array/');
var eventUtil = require('./event/');
var formatUtil = require('./format');
var mathUtil = require('./math/');
var matrixUtil = require('./matrix/');
var objectUtil = require('./object/');
var pathUtil = require('./path/');
var stringUtil = require('./string/');
var typeUtil = require('./type/');

var util = {
  // collections
  DOMUtil: DOMUtil,
  DomUtil: DOMUtil,
  MatrixUtil: matrixUtil,
  PathUtil: pathUtil,
  arrayUtil: arrayUtil,
  domUtil: DOMUtil,
  eventUtil: eventUtil,
  formatUtil: formatUtil,
  mathUtil: mathUtil,
  matrixUtil: matrixUtil,
  objectUtil: objectUtil,
  stringUtil: stringUtil,
  pathUtil: pathUtil,
  typeUtil: typeUtil,
  // others
  augment: require('./augment'),
  clone: require('./clone'),
  debounce: require('./debounce'),
  deepMix: require('./deep-mix'),
  each: each,
  extend: require('./extend'),
  filter: require('./filter'),
  group: require('./group'),
  groupBy: require('./group-by'),
  groupToMap: require('./group-to-map'),
  indexOf: require('./index-of'),
  isEmpty: require('./is-empty'),
  isEqual: require('./is-equal'),
  isEqualWith: require('./is-equal-with'),
  map: require('./map'),
  mix: mix,
  pick: require('./pick'),
  throttle: require('./throttle'),
  toArray: require('./to-array'),
  toString: require('./to-string'),
  uniqueId: require('./unique-id')
};

each([DOMUtil, arrayUtil, eventUtil, formatUtil, mathUtil, matrixUtil, objectUtil, pathUtil, stringUtil, typeUtil], function (collection) {
  mix(util, collection);
});

module.exports = util;