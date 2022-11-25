import {epsilon} from "./math";
import {geoConicEquidistant as conicEquidistant} from "d3-geo";
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

// A composite projection for Portugal, configured by default for 960×500.
export default function() {
  var cache,
      cacheStream,
      mainland = conicEquidistant().rotate([-136, -22]).parallels([40, 34]), mainlandPoint, //gis.stackexchange.com/a/73135
      hokkaido = conicEquidistant().rotate([-146, -26]).parallels([40, 34]), hokkaidoPoint,
      okinawa = conicEquidistant().rotate([-126, -19]).parallels([40, 34]), okinawaPoint,

      point, pointStream = {point: function(x, y) { point = [x, y]; }};

      /*
      var mainlandBbox = [[126.0, 41.606], [142.97, 29.97]];
      var hokkaidoBbox = [[138.7, 45.61], [146.2, 41.2]];
      var okinawaBbox = [[122.6, 29.0], [130, 23.7]];
      */


  function conicEquidistantJapan(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (mainlandPoint.point(x, y), point) ||
        (hokkaidoPoint.point(x, y), point) ||
        (okinawaPoint.point(x, y), point);
  }

  conicEquidistantJapan.invert = function(coordinates) {
    var k = mainland.scale(),
        t = mainland.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;

        /*
        //How are the return values calculated:
        console.info("******");
        var c0 = hokkaido(hokkaidoBbox[0]);
        var x0 = (c0[0] - t[0]) / k;
        var y0 = (c0[1] - t[1]) / k;

        console.info("p0 hokkaido", x0 + ' - ' + y0);

        var c1 = hokkaido(hokkaidoBbox[1]);
        var x1 = (c1[0] - t[0]) / k;
        var y1 = (c1[1] - t[1]) / k;

        console.info("p1 hokkaido", x1 + ' - ' + y1);

        c0 = okinawa(okinawaBbox[0]);
        x0 = (c0[0] - t[0]) / k;
        y0 = (c0[1] - t[1]) / k;

        console.info("p0 okinawa", x0 + ' - ' + y0);

        c1 = okinawa(okinawaBbox[1]);
        x1 = (c1[0] - t[0]) / k;
        y1 = (c1[1] - t[1]) / k;

        console.info("p1 okinawa", x1 + ' - ' + y1);
        */

        return (y >= -0.10925 && y< -0.02701 && x >= -0.135 && x < -0.0397 ? hokkaido
            : y >= 0.04713 && y< 0.11138 && x >= -0.03986 && x < 0.051 ? okinawa
            : mainland).invert(coordinates);

  };

  conicEquidistantJapan.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([mainland.stream(cacheStream = stream), hokkaido.stream(stream), okinawa.stream(stream)]);
  };

  conicEquidistantJapan.precision = function(_) {
    if (!arguments.length) {return mainland.precision();}
    mainland.precision(_);
    hokkaido.precision(_);
    okinawa.precision(_);
    return reset();
  };

  conicEquidistantJapan.scale = function(_) {
    if (!arguments.length) {return mainland.scale();}
    mainland.scale(_);
    hokkaido.scale(_);
    okinawa.scale(_ * 0.7);
    return conicEquidistantJapan.translate(mainland.translate());
  };

  conicEquidistantJapan.translate = function(_) {
    if (!arguments.length) {return mainland.translate();}
    var k = mainland.scale(), x = +_[0], y = +_[1];

    /*
    var c0 = mainland(mainlandBbox[0]);
   var x0 = (x - c0[0]) / k;
   var y0 = (y - c0[1]) / k;

   var c1 = mainland(mainlandBbox[1]);
   var x1 = (x - c1[0]) / k;
   var y1 = (y - c1[1]) / k;

   console.info('Main: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);
   console.info('.clipExtent([[x '+
    (x0<0?'+ ':'- ') + Math.abs(x0.toFixed(4))+
    ' * k, y '+
    (y0<0?'+ ':'- ') + Math.abs(y0.toFixed(4))+
    ' * k],[x '+
    (x1<0?'+ ':'- ') + Math.abs(x1.toFixed(4))+
    ' * k, y '+
    (y1<0?'+ ':'- ') + Math.abs(y1.toFixed(4))+
    ' * k]])');

   c0 = hokkaido.translate([x - 0.0425 * k, y - 0.005 * k])(hokkaidoBbox[0]);
   x0 = (x - c0[0]) / k;
   y0 = (y - c0[1]) / k;

   c1 = hokkaido.translate([x - 0.0425 * k, y - 0.005 * k])(hokkaidoBbox[1]);
   x1 = (x - c1[0]) / k;
   y1 = (y - c1[1]) / k;

   console.info('hokkaido: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);
   console.info('.clipExtent([[x '+
    (x0<0?'+ ':'- ') + Math.abs(x0.toFixed(4))+
    ' * k + epsilon, y '+
    (y0<0?'+ ':'- ') + Math.abs(y0.toFixed(4))+
    ' * k + epsilon],[x '+
    (x1<0?'+ ':'- ') + Math.abs(x1.toFixed(4))+
    ' * k - epsilon, y '+
    (y1<0?'+ ':'- ') + Math.abs(y1.toFixed(4))+
    ' * k - epsilon]])');

    c0 = okinawa.translate([x - 0 * k, y + 0 * k])(okinawaBbox[0]);
    x0 = (x - c0[0]) / k;
    y0 = (y - c0[1]) / k;

    c1 = okinawa.translate([x - 0 * k, y + 0 * k])(okinawaBbox[1]);
    x1 = (x - c1[0]) / k;
    y1 = (y - c1[1]) / k;

    console.info('okinawa: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);
    console.info('.clipExtent([[x '+
     (x0<0?'+ ':'- ') + Math.abs(x0.toFixed(4))+
     ' * k + epsilon, y '+
     (y0<0?'+ ':'- ') + Math.abs(y0.toFixed(4))+
     ' * k + epsilon],[x '+
     (x1<0?'+ ':'- ') + Math.abs(x1.toFixed(4))+
     ' * k - epsilon, y '+
     (y1<0?'+ ':'- ') + Math.abs(y1.toFixed(4))+
     ' * k - epsilon]])');
     */

    mainlandPoint = mainland
        .translate(_)
        .clipExtent([[x - 0.1352 * k, y - 0.1091 * k],[x + 0.117 * k, y + 0.098 * k]])
        .stream(pointStream);


    hokkaidoPoint = hokkaido
        .translate([x - 0.0425 * k, y - 0.005 * k])
        .clipExtent([[x - 0.135 * k + epsilon, y - 0.1093 * k + epsilon],[x - 0.0397 * k - epsilon, y - 0.027 * k - epsilon]])
        .stream(pointStream);

    okinawaPoint = okinawa
        .translate(_)
        .clipExtent([[x - 0.0399 * k + epsilon, y + 0.0471 * k + epsilon],[x + 0.051 * k - epsilon, y + 0.1114 * k - epsilon]])
        .stream(pointStream);

    return reset();
  };

  conicEquidistantJapan.fitExtent = function(extent, object) {
    return fitExtent(conicEquidistantJapan, extent, object);
  };

  conicEquidistantJapan.fitSize = function(size, object) {
    return fitSize(conicEquidistantJapan, size, object);
  };

  function reset() {
    cache = cacheStream = null;
    return conicEquidistantJapan;
  }

  conicEquidistantJapan.drawCompositionBorders = function(context) {
    /*
    console.info("CLIP EXTENT hokkaido: ", hokkaido.clipExtent());
    console.info("UL BBOX:", mainland.invert([hokkaido.clipExtent()[0][0], hokkaido.clipExtent()[0][1]]));
    console.info("UR BBOX:", mainland.invert([hokkaido.clipExtent()[1][0], hokkaido.clipExtent()[0][1]]));
    console.info("LD BBOX:", mainland.invert([hokkaido.clipExtent()[1][0], hokkaido.clipExtent()[1][1]]));
    console.info("LL BBOX:", mainland.invert([hokkaido.clipExtent()[0][0], hokkaido.clipExtent()[1][1]]));
    */

    var ulhokkaido = mainland([ 126.01320483689143, 41.621090310215585 ]);
    var urhokkaido = mainland([ 133.04304387025903, 42.15087523707186 ]);
    var ldhokkaido = mainland([ 133.3021766080688, 37.43975444725098 ]);
    var llhokkaido = mainland([ 126.87889168628224, 36.95488945159779 ]);

    var llokinawa = mainland([132.9, 29.8]);
    var lmokinawa = mainland([134, 33]);
    var lrokinawa = mainland([139.3, 33.2]);
    var llrokinawa = mainland([139.16, 30.5]);


    context.moveTo(ulhokkaido[0], ulhokkaido[1]);
    context.lineTo(urhokkaido[0], urhokkaido[1]);
    context.lineTo(ldhokkaido[0], ldhokkaido[1]);
    context.lineTo(llhokkaido[0], llhokkaido[1]);
    context.closePath();

    context.moveTo(llokinawa[0], llokinawa[1]);
    context.lineTo(lmokinawa[0], lmokinawa[1]);
    context.lineTo(lrokinawa[0], lrokinawa[1]);
    context.lineTo(llrokinawa[0], llrokinawa[1]);

  };
  conicEquidistantJapan.getCompositionBorders = function() {
    var context = path();
    this.drawCompositionBorders(context);
    return context.toString();
  };

  return conicEquidistantJapan.scale(2200);
}
