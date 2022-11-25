var isFunction = require('./type/is-function');
var mix = require('./mix');

var extend = function extend(subclass, superclass, overrides, staticOverrides) {
  // 如果只提供父类构造函数，则自动生成子类构造函数
  if (!isFunction(superclass)) {
    overrides = superclass;
    superclass = subclass;
    subclass = function subclass() {};
  }

  var create = Object.create ? function (proto, c) {
    return Object.create(proto, {
      constructor: {
        value: c
      }
    });
  } : function (proto, c) {
    function Tmp() {}
    Tmp.prototype = proto;
    var o = new Tmp();
    o.constructor = c;
    return o;
  };

  var superObj = create(superclass.prototype, subclass); // new superclass(),//实例化父类作为子类的prototype
  subclass.prototype = mix(superObj, subclass.prototype); // 指定子类的prototype
  subclass.superclass = create(superclass.prototype, superclass);
  mix(superObj, overrides);
  mix(subclass, staticOverrides);
  return subclass;
};

module.exports = extend;