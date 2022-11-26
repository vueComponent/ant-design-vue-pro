const isFunction = require('./type/is-function');
const mix = require('./mix');

const extend = function(subclass, superclass, overrides, staticOverrides) {
  // 如果只提供父类构造函数，则自动生成子类构造函数
  if (!isFunction(superclass)) {
    overrides = superclass;
    superclass = subclass;
    subclass = function() {};
  }

  const create = Object.create ?
    function(proto, c) {
      return Object.create(proto, {
        constructor: {
          value: c
        }
      });
    } :
    function(proto, c) {
      function Tmp() {}
      Tmp.prototype = proto;
      const o = new Tmp();
      o.constructor = c;
      return o;
    };

  const superObj = create(superclass.prototype, subclass); // new superclass(),//实例化父类作为子类的prototype
  subclass.prototype = mix(superObj, subclass.prototype); // 指定子类的prototype
  subclass.superclass = create(superclass.prototype, superclass);
  mix(superObj, overrides);
  mix(subclass, staticOverrides);
  return subclass;
};

module.exports = extend;
