import {epsilon} from "./math";
import {geoMercator as mercator} from "d3-geo";
import {fitExtent, fitSize} from "./fit";
import {path} from "d3-path";


// The projections must have mutually exclusive clip regions on the sphere,
// as this will avoid emitting interleaving lines and polygons.
function multiplex(streams) {
  var n = streams.length;
  return {
    point: function(x, y) { var i = -1; while (++i < n) {streams[i].point(x, y); }},
    sphere: function() { var i = -1; while (++i < n) {streams[i].sphere(); }},
    lineStart: function() { var i = -1; while (++i < n) {streams[i].lineStart(); }},
    lineEnd: function() { var i = -1; while (++i < n) {streams[i].lineEnd(); }},
    polygonStart: function() { var i = -1; while (++i < n) {streams[i].polygonStart(); }},
    polygonEnd: function() { var i = -1; while (++i < n) {streams[i].polygonEnd(); }}
  };
}

// A composite projection for Malaysia, configured by default for 960×500.
export default function() {
  var cache,
      cacheStream,

      peninsular = mercator().center([105.25, 4.00]), peninsularPoint,
      borneo = mercator().center([118.65,2.86]), borneoPoint,

      point, pointStream = {point: function(x, y) { point = [x, y]; }};


  function mercatorMalaysia(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (peninsularPoint.point(x, y), point) ||
        (borneoPoint.point(x, y), point);
  }

  mercatorMalaysia.invert = function(coordinates) {
    var k = peninsular.scale(),
        t = peninsular.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;

        return (y >=  -0.0521 && y < 0.0229 && x >= -0.0111 && x < 0.1000 ? borneo
            : peninsular).invert(coordinates);
  };

  mercatorMalaysia.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([peninsular.stream(cacheStream = stream), borneo.stream(stream)]);
  };

  mercatorMalaysia.precision = function(_) {
    if (!arguments.length) {return peninsular.precision();}
    peninsular.precision(_);
    borneo.precision(_);
    return reset();
  };

  mercatorMalaysia.scale = function(_) {
    if (!arguments.length) {return peninsular.scale();}
    peninsular.scale(_);
    borneo.scale(_ * 0.615);
    return mercatorMalaysia.translate(peninsular.translate());
  };

  mercatorMalaysia.translate = function(_) {
    if (!arguments.length) {return peninsular.translate();}
    var k = peninsular.scale(), x = +_[0], y = +_[1];

    peninsularPoint = peninsular
        .translate(_)
        .clipExtent([[x - 0.1100 * k, y - 0.0521 * k],[x - 0.0111 * k, y + 0.0521 * k]])
        .stream(pointStream);

    borneoPoint = borneo
        .translate([x + 0.09000 * k, y - 0.00 * k])
        .clipExtent([[x - 0.0111 * k + epsilon, y -0.0521 * k + epsilon],[x + 0.1000 * k - epsilon, y + 0.024 * k - epsilon]])
        .stream(pointStream);

    return reset();
  };

  mercatorMalaysia.fitExtent = function(extent, object) {
    return fitExtent(mercatorMalaysia, extent, object);
  };

  mercatorMalaysia.fitSize = function(size, object) {
    return fitSize(mercatorMalaysia, size, object);
  };

  function reset() {
    cache = cacheStream = null;
    return mercatorMalaysia;
  }

  mercatorMalaysia.drawCompositionBorders = function(context) {
  
    var llbor = peninsular([106.3214, 2.0228]);
		var lmbor = peninsular([105.1843, 2.3761]);
		var lrbor = peninsular([104.2151, 3.3618]);
		var llrbor = peninsular([104.2150, 4.5651]);

    context.moveTo(llbor[0], llbor[1]);
    context.lineTo(lmbor[0], lmbor[1]);
    context.lineTo(lrbor[0], lrbor[1]);
    context.lineTo(llrbor[0], llrbor[1]);

  };
  mercatorMalaysia.getCompositionBorders = function() {
    var context = path();
    this.drawCompositionBorders(context);
    return context.toString();
  };

  return mercatorMalaysia.scale(4800);
}
