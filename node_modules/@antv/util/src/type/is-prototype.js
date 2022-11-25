const objectProto = Object.prototype;
const isPrototype = function(value) {
  const Ctor = value && value.constructor;
  const proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto;
  return value === proto;
};

module.exports = isPrototype;
