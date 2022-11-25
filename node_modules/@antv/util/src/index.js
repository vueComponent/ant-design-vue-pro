
const each = require('./each');
const mix = require('./mix');

// collections
const DOMUtil = require('./dom/');
const arrayUtil = require('./array/');
const eventUtil = require('./event/');
const formatUtil = require('./format');
const mathUtil = require('./math/');
const matrixUtil = require('./matrix/');
const objectUtil = require('./object/');
const pathUtil = require('./path/');
const stringUtil = require('./string/');
const typeUtil = require('./type/');

const util = {
  // collections
  DOMUtil,
  DomUtil: DOMUtil,
  MatrixUtil: matrixUtil,
  PathUtil: pathUtil,
  arrayUtil,
  domUtil: DOMUtil,
  eventUtil,
  formatUtil,
  mathUtil,
  matrixUtil,
  objectUtil,
  stringUtil,
  pathUtil,
  typeUtil,
  // others
  augment: require('./augment'),
  clone: require('./clone'),
  debounce: require('./debounce'),
  deepMix: require('./deep-mix'),
  each,
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
  mix,
  pick: require('./pick'),
  throttle: require('./throttle'),
  toArray: require('./to-array'),
  toString: require('./to-string'),
  uniqueId: require('./unique-id')
};

each([
  DOMUtil,
  arrayUtil,
  eventUtil,
  formatUtil,
  mathUtil,
  matrixUtil,
  objectUtil,
  pathUtil,
  stringUtil,
  typeUtil
], collection => {
  mix(util, collection);
});

module.exports = util;
