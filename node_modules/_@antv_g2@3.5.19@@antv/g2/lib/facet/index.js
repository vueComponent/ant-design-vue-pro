/**
 * @fileOverview Facet 的入口
 * @author dxq613@gmail.com
 */
var Util = require('../util');

var Chart = require('../chart/chart');

var Facets = {};
Facets.Rect = require('./rect');
Facets.List = require('./list');
Facets.Circle = require('./circle');
Facets.Tree = require('./tree');
Facets.Mirror = require('./mirror');
Facets.Matrix = require('./matrix');

Chart.prototype.facet = function (type, cfg) {
  var cls = Facets[Util.upperFirst(type)];

  if (!cls) {
    throw new Error('Not support such type of facets as: ' + type);
  }

  var preFacets = this.get('facets');

  if (preFacets) {
    preFacets.destroy();
  }

  cfg.chart = this;
  var facets = new cls(cfg);
  this.set('facets', facets);
};

module.exports = Facets;