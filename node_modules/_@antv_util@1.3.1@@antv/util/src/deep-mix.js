const isPlainObject = require('./type/is-plain-object');
const isArray = require('./type/is-array');

const MAX_MIX_LEVEL = 5;

function _deepMix(dist, src, level, maxLevel) {
  level = level || 0;
  maxLevel = maxLevel || MAX_MIX_LEVEL;
  for (const key in src) {
    if (src.hasOwnProperty(key)) {
      const value = src[key];
      if (value !== null && isPlainObject(value)) {
        if (!isPlainObject(dist[key])) {
          dist[key] = {};
        }
        if (level < maxLevel) {
          _deepMix(dist[key], value, level + 1, maxLevel);
        } else {
          dist[key] = src[key];
        }
      } else if (isArray(value)) {
        dist[key] = [];
        dist[key] = dist[key].concat(value);
      } else if (value !== undefined) {
        dist[key] = value;
      }
    }
  }
}

const deepMix = function() {
  const args = new Array(arguments.length);
  const length = args.length;
  for (let i = 0; i < length; i++) {
    args[i] = arguments[i];
  }
  const rst = args[0];
  for (let i = 1; i < length; i++) {
    _deepMix(rst, args[i]);
  }
  return rst;
};

module.exports = deepMix;
