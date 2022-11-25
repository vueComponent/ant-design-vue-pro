var isFunction = require('./type/is-function');
var toArray = require('./to-array');
var mix = require('./mix');

var augment = function augment(c) {
  var args = toArray(arguments);
  for (var i = 1; i < args.length; i++) {
    var obj = args[i];
    if (isFunction(obj)) {
      obj = obj.prototype;
    }
    mix(c.prototype, obj);
  }
};

module.exports = augment;