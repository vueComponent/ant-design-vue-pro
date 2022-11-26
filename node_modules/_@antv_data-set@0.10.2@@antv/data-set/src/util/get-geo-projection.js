const isFunction = require('@antv/util/lib/type/is-function');
const isString = require('@antv/util/lib/type/is-string');
const d3Geo = require('d3-geo');
const d3GeoProjection = require('d3-geo-projection');
const d3CompositeProjection = require('d3-composite-projections');

/*
* getGeoProjection
*
* @param {string|function} projection  projection name or projection function
* @param {boolean} [exportRaw = false] - whether return the raw projection or not
* */
module.exports = (projection, exportRaw) => {
  if (isFunction(projection)) {
    return exportRaw ? projection : projection();
  }
  if (isString(projection)) {
    if (d3Geo[projection]) {
      return exportRaw ? d3Geo[projection] : d3Geo[projection]();
    }
    if (d3GeoProjection[projection]) {
      return exportRaw ? d3GeoProjection[projection] : d3GeoProjection[projection]();
    }
    if (d3CompositeProjection[projection]) {
      return exportRaw ? d3CompositeProjection[projection] : d3CompositeProjection[projection]();
    }
  }
  return null;
};
