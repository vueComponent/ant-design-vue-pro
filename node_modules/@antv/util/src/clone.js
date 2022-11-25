const isArray = require('./type/is-array');

const clone = function(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  let rst;
  if (isArray(obj)) {
    rst = [];
    for (let i = 0, l = obj.length; i < l; i++) {
      if (typeof obj[i] === 'object' && obj[i] != null) {
        rst[i] = clone(obj[i]);
      } else {
        rst[i] = obj[i];
      }
    }
  } else {
    rst = {};
    for (const k in obj) {
      if (typeof obj[k] === 'object' && obj[k] != null) {
        rst[k] = clone(obj[k]);
      } else {
        rst[k] = obj[k];
      }
    }
  }

  return rst;
};

module.exports = clone;
