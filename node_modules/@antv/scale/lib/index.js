/**
 * @fileOverview Scale entry, used to reference all the scales
 * @author dxq613@gmail.com
 */
var lowerFirst = require('@antv/util/lib/string/lower-first');

var Base = require('./base');

Base.Linear = require('./linear');
Base.Identity = require('./identity');
Base.Cat = require('./category');
Base.Time = require('./time');
Base.TimeCat = require('./time-cat');
Base.Log = require('./log');
Base.Pow = require('./pow');

var _loop = function _loop(k) {
  if (Base.hasOwnProperty(k)) {
    var methodName = lowerFirst(k);

    Base[methodName] = function (cfg) {
      return new Base[k](cfg);
    };
  }
};

for (var k in Base) {
  _loop(k);
}

var CAT_ARR = ['cat', 'timeCat'];

Base.isCategory = function (type) {
  return CAT_ARR.indexOf(type) >= 0;
};

module.exports = Base;