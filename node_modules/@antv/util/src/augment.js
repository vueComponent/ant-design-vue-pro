const isFunction = require('./type/is-function');
const toArray = require('./to-array');
const mix = require('./mix');

const augment = function(c) {
  const args = toArray(arguments);
  for (let i = 1; i < args.length; i++) {
    let obj = args[i];
    if (isFunction(obj)) {
      obj = obj.prototype;
    }
    mix(c.prototype, obj);
  }
};

module.exports = augment;
