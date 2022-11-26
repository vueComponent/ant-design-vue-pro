var clone = require('../clone');
var each = require('../each');
var mat3 = require('./mat3');

module.exports = function transform(m, ts) {
  m = clone(m);
  each(ts, function (t) {
    switch (t[0]) {
      case 't':
        mat3.translate(m, m, [t[1], t[2]]);
        break;
      case 's':
        mat3.scale(m, m, [t[1], t[2]]);
        break;
      case 'r':
        mat3.rotate(m, m, t[1]);
        break;
      case 'm':
        mat3.multiply(m, m, t[1]);
        break;
      default:
        return false;
    }
  });
  return m;
};