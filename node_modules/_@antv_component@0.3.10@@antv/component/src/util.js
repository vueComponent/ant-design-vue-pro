/**
 * @fileOverview The util method based on the lodash.
 * @author dxq613@gmail.com
 */
const G = require('@antv/g/lib');
const Utils = require('@antv/util/lib');

const Util = Utils.mix({
  assign: Utils.mix,
  isFinite,
  isNaN,
  Group: G.Group,
  Event: G.Event
}, Utils);

module.exports = Util;
