import {epsilon} from "./math";
import {geoConicConformal as conicConformal} from "d3-geo";
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

// A composite projection for Spain, configured by default for 960×500.
export default function() {
  var cache,
      cacheStream,

      iberianPeninsule = conicConformal().rotate([5, -38.6]).parallels([0,60]), iberianPeninsulePoint,
      canaryIslands = conicConformal().rotate([5, -38.6]).parallels([0,60]), canaryIslandsPoint,

      point, pointStream = {point: function(x, y) { point = [x, y]; }};

      /*
      var iberianPeninsuleBbox = [[-11, 46], [4, 35]];
      var canaryIslandsBbox = [[-19.0, 28.85], [-12.7, 28.1]];
      */

  function conicConformalSpain(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (iberianPeninsulePoint.point(x, y), point) ||
        (canaryIslandsPoint.point(x, y), point);
  }

  conicConformalSpain.invert = function(coordinates) {
    var k = iberianPeninsule.scale(),
        t = iberianPeninsule.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;

        return (y >= 0.05346 && y< 0.0897 && x >= -0.13388 && x < -0.0322 ? canaryIslands
            : iberianPeninsule).invert(coordinates);
  };

  conicConformalSpain.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([iberianPeninsule.stream(cacheStream = stream), canaryIslands.stream(stream)]);
  };

  conicConformalSpain.precision = function(_) {
    if (!arguments.length) {return iberianPeninsule.precision();}
    iberianPeninsule.precision(_);
    canaryIslands.precision(_);
    return reset();
  };

  conicConformalSpain.scale = function(_) {
    if (!arguments.length) {return iberianPeninsule.scale();}
    iberianPeninsule.scale(_);
    canaryIslands.scale(_);
    return conicConformalSpain.translate(iberianPeninsule.translate());
  };

  conicConformalSpain.translate = function(_) {
    if (!arguments.length) {return iberianPeninsule.translate();}
    var k = iberianPeninsule.scale(), x = +_[0], y = +_[1];
    /*
    var c0 = iberianPeninsule(iberianPeninsuleBbox[0]);
   var x0 = (x - c0[0]) / k;
   var y0 = (y - c0[1]) / k;

   var c1 = iberianPeninsule(iberianPeninsuleBbox[1]);
   var x1 = (x - c1[0]) / k;
   var y1 = (y - c1[1]) / k;

   console.info('Iberian Peninsula: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);

   c0 = canaryIslands.translate([x + 0.1 * k, y - 0.094 * k])(canaryIslandsBbox[0]);
   x0 = (x - c0[0]) / k;
   y0 = (y - c0[1]) / k;

   c1 = canaryIslands.translate([x + 0.1 * k, y - 0.094 * k])(canaryIslandsBbox[1]);
   x1 = (x - c1[0]) / k;
   y1 = (y - c1[1]) / k;

   console.info('Canry Islands: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);
   */
    iberianPeninsulePoint = iberianPeninsule
        .translate(_)
        .clipExtent([[x - 0.06857 * k, y - 0.1288 * k],[x + 0.13249 * k, y + 0.06 * k]])
        .stream(pointStream);

    canaryIslandsPoint = canaryIslands
        .translate([x + 0.1 * k, y - 0.094 * k])
        .clipExtent([[x - 0.1331 * k + epsilon, y + 0.053457 * k + epsilon],[x  - 0.0354 * k - epsilon, y + 0.08969 * k - epsilon]])
        .stream(pointStream);

    return reset();
  };

  conicConformalSpain.fitExtent = function(extent, object) {
    return fitExtent(conicConformalSpain, extent, object);
  };

  conicConformalSpain.fitSize = function(size, object) {
    return fitSize(conicConformalSpain, size, object);
  };

  function reset() {
    cache = cacheStream = null;
    return conicConformalSpain;
  }

  conicConformalSpain.drawCompositionBorders = function(context) {
    /*
    console.info("CLIP EXTENT: ", canaryIslands.clipExtent());
    console.info("UL BBOX:", iberianPeninsule.invert([canaryIslands.clipExtent()[0][0], canaryIslands.clipExtent()[0][1]]));
    console.info("UR BBOX:", iberianPeninsule.invert([canaryIslands.clipExtent()[1][0], canaryIslands.clipExtent()[0][1]]));
    console.info("LD BBOX:", iberianPeninsule.invert([canaryIslands.clipExtent()[1][0], canaryIslands.clipExtent()[1][1]]));
    */

    var ulCanaryIslands = iberianPeninsule([-14.0346750, 34.965007]);
    var urCanaryIslands = iberianPeninsule([-7.4208899, 35.536988]);
    var ldCanaryIslands = iberianPeninsule([-7.3148275, 33.54359]);

    context.moveTo(ulCanaryIslands[0], ulCanaryIslands[1]);
    context.lineTo(urCanaryIslands[0], urCanaryIslands[1]);
    context.lineTo(ldCanaryIslands[0], ldCanaryIslands[1]);
  };
  conicConformalSpain.getCompositionBorders = function() {
    var context = path();
    this.drawCompositionBorders(context);
    return context.toString();
  };

  return conicConformalSpain.scale(2700);
}
