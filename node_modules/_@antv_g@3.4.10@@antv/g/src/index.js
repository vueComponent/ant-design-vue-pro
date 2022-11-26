module.exports = {
  Canvas: require('./canvas'),
  Group: require('./core/group'),
  Shape: require('./core/shape'),
  Arc: require('./shapes/arc'),
  Circle: require('./shapes/circle'),
  Dom: require('./shapes/dom'),
  Ellipse: require('./shapes/ellipse'),
  Fan: require('./shapes/fan'),
  Image: require('./shapes/image'),
  Line: require('./shapes/line'),
  Marker: require('./shapes/marker'),
  Path: require('./shapes/path'),
  Polygon: require('./shapes/polygon'),
  Polyline: require('./shapes/polyline'),
  Rect: require('./shapes/rect'),
  Text: require('./shapes/text'),
  PathSegment: require('./shapes/util/path-segment'),
  PathUtil: require('./util/path'),
  Event: require('./event'),
  EventEmitter: require('./core/event-emitter'),
  // version, etc.
  version: '3.4.10'
};
