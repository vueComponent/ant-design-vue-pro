/**
 * @fileOverview The util method based on the lodash.
 * @author dxq613@gmail.com
 */
var G = require('@antv/g/lib');

var Utils = require('@antv/util/lib');

var Util = Utils.mix({
  assign: Utils.mix,
  isFinite: isFinite,
  isNaN: isNaN,
  Group: G.Group,
  Event: G.Event
}, Utils);
module.exports = Util;