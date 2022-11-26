var assign = require('@antv/util/lib/mix');

var _require = require('d3-geo'),
    _geoArea = _require.geoArea,
    _geoCentroid = _require.geoCentroid,
    _geoContains = _require.geoContains,
    _geoDistance = _require.geoDistance,
    _geoLength = _require.geoLength;

var _require2 = require('d3-geo-projection'),
    _geoProject = _require2.geoProject;

var View = require('../view');

var getGeoProjection = require('../util/get-geo-projection');

assign(View.prototype, {
  // geo maintain
  geoArea: function geoArea(feature) {
    return _geoArea(feature);
  },
  geoAreaByName: function geoAreaByName(name) {
    return _geoArea(this.geoFeatureByName(name));
  },
  geoCentroid: function geoCentroid(feature) {
    return _geoCentroid(feature);
  },
  geoCentroidByName: function geoCentroidByName(name) {
    return _geoCentroid(this.geoFeatureByName(name));
  },
  geoDistance: function geoDistance(p1, p2) {
    return _geoDistance(p1, p2);
  },
  geoLength: function geoLength(feature) {
    return _geoLength(feature);
  },
  geoLengthByName: function geoLengthByName(name) {
    return _geoLength(this.geoFeatureByName(name));
  },
  geoContains: function geoContains(feature, position
  /* [longitude, latitude] */
  ) {
    return _geoContains(feature, position);
  },
  geoFeatureByName: function geoFeatureByName(name) {
    var rows = this.rows;
    var result;
    rows.some(function (feature) {
      if (feature.name === name) {
        result = feature;
        return true;
      }

      return false;
    });
    return result;
  },
  geoFeatureByPosition: function geoFeatureByPosition(position) {
    var rows = this.rows;
    var result;
    rows.some(function (feature) {
      if (_geoContains(feature, position)) {
        result = feature;
        return true;
      }

      return false;
    });
    return result;
  },
  geoNameByPosition: function geoNameByPosition(position) {
    var feature = this.geoFeatureByPosition(position);

    if (feature) {
      return feature.name;
    }
  },
  // projection
  // export getGeoProjection for custom used.
  getGeoProjection: getGeoProjection,
  geoProject: function geoProject(feature, projection, exportRaw) {
    projection = getGeoProjection(projection, exportRaw);
    return _geoProject(feature, projection);
  },
  geoProjectByName: function geoProjectByName(name, projection, exportRaw) {
    projection = getGeoProjection(projection, exportRaw);
    return _geoProject(this.geoFeatureByName(name), projection);
  },
  geoProjectPosition: function geoProjectPosition(position, projection, exportRaw) {
    projection = getGeoProjection(projection, exportRaw);
    return projection(position);
  },
  geoProjectInvert: function geoProjectInvert(point
  /* [x, y] */
  , projection, exportRaw) {
    projection = getGeoProjection(projection, exportRaw);
    return projection.invert(point);
  }
});