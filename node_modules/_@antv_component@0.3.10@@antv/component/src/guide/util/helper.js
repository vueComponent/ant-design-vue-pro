const Util = require('../../util');
module.exports = {
  getFirstScale(scales) {
    let firstScale;
    Util.each(scales, scale => {
      if (scale) {
        firstScale = scale;
        return false;
      }
    });
    return firstScale;
  }
};
