var objectProto = Object.prototype;
var isPrototype = function isPrototype(value) {
  var Ctor = value && value.constructor;
  var proto = typeof Ctor === 'function' && Ctor.prototype || objectProto;
  return value === proto;
};

module.exports = isPrototype;