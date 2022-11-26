var Util = require('../../util');

module.exports = {
  getFirstScale: function getFirstScale(scales) {
    var firstScale;
    Util.each(scales, function (scale) {
      if (scale) {
        firstScale = scale;
        return false;
      }
    });
    return firstScale;
  }
};