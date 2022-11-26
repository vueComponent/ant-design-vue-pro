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

// A composite projection for Ecuador, configured by default for 960×500.
export default function() {
  var cache,
      cacheStream,

      mainland = mercator().rotate([80, 1.5]), mainlandPoint,
      galapagos = mercator().rotate([90.73, 1]), galapagosPoint,

      point, pointStream = {point: function(x, y) { point = [x, y]; }};

      /*
      var mainlandBbox = [[-81.5, 2.7], [-70.0, -6.0]];
      var galapagosBbox = [[-92.2, 0.58], [-88.8, -1.8]];
      */

  function mercatorEcuador(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (mainlandPoint.point(x, y), point) ||
        (galapagosPoint.point(x, y), point);
  }

  mercatorEcuador.invert = function(coordinates) {
    var k = mainland.scale(),
        t = mainland.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;
        /*
        //How are the return values calculated:
        var c0 = galapagos(galapagosBbox[0]);
        var x0 = (c0[0] - t[0]) / k;
        var y0 = (c0[1] - t[1]) / k;

        console.info("p0 galapagos", x0 + ' - ' + y0);


        var c1 = galapagos(galapagosBbox[1]);
        var x1 = (c1[0] - t[0]) / k;
        var y1 = (c1[1] - t[1]) / k;

        console.info("p1 galapagos", x1 + ' - ' + y1);
        */
        return (y >= -0.0676 && y< -0.026 && x >= -0.0857 && x < -0.0263 ? galapagos
            : mainland).invert(coordinates);
  };

  mercatorEcuador.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([mainland.stream(cacheStream = stream), galapagos.stream(stream)]);
  };

  mercatorEcuador.precision = function(_) {
    if (!arguments.length) {return mainland.precision();}
    mainland.precision(_);
    galapagos.precision(_);
    return reset();
  };

  mercatorEcuador.scale = function(_) {
    if (!arguments.length) {return mainland.scale();}
    mainland.scale(_);
    galapagos.scale(_);
    return mercatorEcuador.translate(mainland.translate());
  };

  mercatorEcuador.translate = function(_) {
    if (!arguments.length) {return mainland.translate();}
    var k = mainland.scale(), x = +_[0], y = +_[1];
    /*
    var c0 = mainland(mainlandBbox[0]);
   var x0 = (x - c0[0]) / k;
   var y0 = (y - c0[1]) / k;

   var c1 = mainland(mainlandBbox[1]);
   var x1 = (x - c1[0]) / k;
   var y1 = (y - c1[1]) / k;

   console.info('mainland: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);
   console.info('.clipExtent([[x '+
    (x0<0?'+ ':'- ') + Math.abs(x0.toFixed(4))+
    ' * k, y '+
    (y0<0?'+ ':'- ') + Math.abs(y0.toFixed(4))+
    ' * k],[x '+
    (x1<0?'+ ':'- ') + Math.abs(x1.toFixed(4))+
    ' * k, y '+
    (y1<0?'+ ':'- ') + Math.abs(y1.toFixed(4))+
    ' * k]])');

   c0 = galapagos.translate([x - 0.06 * k, y - 0.04 * k])(galapagosBbox[0]);
   x0 = (x - c0[0]) / k;
   y0 = (y - c0[1]) / k;

   c1 = galapagos.translate([x - 0.06 * k, y - 0.04 * k])(galapagosBbox[1]);
   x1 = (x - c1[0]) / k;
   y1 = (y - c1[1]) / k;

   console.info('galapagos: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);
   console.info('.clipExtent([[x '+
    (x0<0?'+ ':'- ') + Math.abs(x0.toFixed(4))+
    ' * k + epsilon, y '+
    (y0<0?'+ ':'- ') + Math.abs(y0.toFixed(4))+
    ' * k + epsilon],[x '+
    (x1<0?'+ ':'- ') + Math.abs(x1.toFixed(4))+
    ' * k - epsilon, y '+
    (y1<0?'+ ':'- ') + Math.abs(y1.toFixed(4))+
    ' * k - epsilon]])');*/

    mainlandPoint = mainland
        .translate(_)
        .clipExtent([[x - 0.0262 * k, y - 0.0734 * k],[x + 0.1741 * k, y + 0.079 * k]])
        .stream(pointStream);

    galapagosPoint = galapagos
        .translate([x - 0.06 * k, y - 0.04 * k])
        .clipExtent([[x - 0.0857 * k + epsilon, y - 0.0676 * k + epsilon],[x - 0.0263 * k - epsilon, y - 0.026 * k - epsilon]])
        .stream(pointStream);

    return reset();
  };

  mercatorEcuador.fitExtent = function(extent, object) {
    return fitExtent(mercatorEcuador, extent, object);
  };

  mercatorEcuador.fitSize = function(size, object) {
    return fitSize(mercatorEcuador, size, object);
  };

  function reset() {
    cache = cacheStream = null;
    return mercatorEcuador;
  }

  mercatorEcuador.drawCompositionBorders = function(context) {
    /*
    console.info("CLIP EXTENT: ", galapagos.clipExtent());
    console.info("UL BBOX:", mainland.invert([galapagos.clipExtent()[0][0], galapagos.clipExtent()[0][1]]));
    console.info("UR BBOX:", mainland.invert([galapagos.clipExtent()[1][0], galapagos.clipExtent()[0][1]]));
    console.info("LD BBOX:", mainland.invert([galapagos.clipExtent()[1][0], galapagos.clipExtent()[1][1]]));
    console.info("LL BBOX:", mainland.invert([galapagos.clipExtent()[0][0], galapagos.clipExtent()[1][1]]));
    */

    var ulgalapagos = mainland([-84.9032, 2.3757]);
    var urgalapagos = mainland([-81.5047, 2.3708]);
    var ldgalapagos = mainland([-81.5063, -0.01]);
    var llgalapagos = mainland([-84.9086, -0.005]);

    context.moveTo(ulgalapagos[0], ulgalapagos[1]);
    context.lineTo(urgalapagos[0], urgalapagos[1]);
    context.lineTo(ldgalapagos[0], ldgalapagos[1]);
    context.lineTo(llgalapagos[0], llgalapagos[1]);
    context.closePath();

  };
  mercatorEcuador.getCompositionBorders = function() {
    var context = path();
    this.drawCompositionBorders(context);
    return context.toString();
  };

  return mercatorEcuador.scale(3500);
}
