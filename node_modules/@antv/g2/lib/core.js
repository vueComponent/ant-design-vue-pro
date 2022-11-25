var Scale = require('@antv/scale/lib');

var G = require('./renderer');

var Animate = require('./animate/animate');

var Chart = require('./chart/chart');

var Global = require('./global');

var Shape = require('./geom/shape/shape');

var Util = require('./util');

var G2 = {
  // version
  version: Global.version,
  // visual encoding
  Animate: Animate,
  Chart: Chart,
  Global: Global,
  Scale: Scale,
  Shape: Shape,
  Util: Util,
  // render engine
  G: G,
  DomUtil: Util.DomUtil,
  MatrixUtil: Util.MatrixUtil,
  PathUtil: Util.PathUtil
}; // G2.track = function(enable) {
//   Global.trackable = enable;
// };
// require('./track');

G2.track = function () {
  console.warn('G2 tracks nothing ;-)');
}; // 保证两个版本共存


if (typeof window !== 'undefined') {
  if (window.G2) {
    console.warn("There are multiple versions of G2. Version " + G2.version + "'s reference is 'window.G2_3'");
  } else {
    window.G2 = G2;
  }
}

module.exports = G2;