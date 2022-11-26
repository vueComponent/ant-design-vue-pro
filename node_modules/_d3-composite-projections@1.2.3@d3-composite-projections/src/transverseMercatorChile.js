import {epsilon} from "./math";
import {geoTransverseMercator as transverseMercator} from "d3-geo";
import {geoStereographic as stereographic} from "d3-geo";
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

// A composite projection for Chile, configured by default for 960×500.
export default function() {
  var cache,
      cacheStream,
      mainland = transverseMercator().rotate([72, 37]), mainlandPoint,
      antarctic = stereographic().rotate([72, 0]), antarcticPoint,
      juanFernandez = mercator().rotate([80, 33.5]), juanFernandezPoint,
      pascua = mercator().rotate([110, 25]), pascuaPoint,

      point, pointStream = {point: function(x, y) { point = [x, y]; }};

    /*
    var mainlandBbox = [[-75.5, -15.0], [-32, -49.0]];
    var antarcticBbox = [[-91.0, -60.0], [-43.0, -90.0]];
    var juanFernandezBbox = [[-81.0, -33.0], [-78.5, -34.0]];
    var pascuaBbox = [[-110, -26.6], [-108.7, -27.5]];
    */

  function transverseMercatorChile(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (mainlandPoint.point(x, y), point) ||
        (antarcticPoint.point(x, y), point) ||
        (juanFernandezPoint.point(x, y), point) ||
        (pascuaPoint.point(x, y), point);
  }

  transverseMercatorChile.invert = function(coordinates) {
    var k = mainland.scale(),
        t = mainland.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;

        /*
        //How are the return values calculated:
        console.info("******");
        var c0 = antarctic(antarcticBbox[0]);
        var x0 = (c0[0] - t[0]) / k;
        var y0 = (c0[1] - t[1]) / k;

        console.info("p0 antarctic", x0 + ' - ' + y0);

        var c1 = antarctic(antarcticBbox[1]);
        var x1 = (c1[0] - t[0]) / k;
        var y1 = (c1[1] - t[1]) / k;

        console.info("p1 antarctic", x1 + ' - ' + y1);

        c0 = juanFernandez(juanFernandezBbox[0]);
        x0 = (c0[0] - t[0]) / k;
        y0 = (c0[1] - t[1]) / k;

        console.info("p0 juanFernandez", x0 + ' - ' + y0);

        c1 = juanFernandez(juanFernandezBbox[1]);
        x1 = (c1[0] - t[0]) / k;
        y1 = (c1[1] - t[1]) / k;

        console.info("p1 juanFernandez", x1 + ' - ' + y1);

        c0 = pascua(pascuaBbox[0]);
        x0 = (c0[0] - t[0]) / k;
        y0 = (c0[1] - t[1]) / k;

        console.info("p0 pascua", x0 + ' - ' + y0);

        c1 = pascua(pascuaBbox[1]);
        x1 = (c1[0] - t[0]) / k;
        y1 = (c1[1] - t[1]) / k;

        console.info("p1 pascua", x1 + ' - ' + y1);
        */

        return (y >= 0.2582 && y< 0.32 && x >= -0.1036 && x < -0.087 ? antarctic
            : y >= -0.01298 && y< 0.0133 && x >= -0.11396 && x < -0.05944 ? juanFernandez
            : y >= 0.01539 && y< 0.03911 && x >= -0.089 && x < -0.0588 ? pascua
            : mainland).invert(coordinates);
  };

  transverseMercatorChile.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([mainland.stream(cacheStream = stream), antarctic.stream(stream), juanFernandez.stream(stream), pascua.stream(stream)]);
  };

  transverseMercatorChile.precision = function(_) {
    if (!arguments.length) {return mainland.precision();}
    mainland.precision(_);
    antarctic.precision(_);
    juanFernandez.precision(_);
    pascua.precision(_);
    return reset();
  };

  transverseMercatorChile.scale = function(_) {
    if (!arguments.length) {return mainland.scale();}
    mainland.scale(_);
    antarctic.scale(_ * 0.15);
    juanFernandez.scale(_ * 1.5);
    pascua.scale(_ * 1.5);
    return transverseMercatorChile.translate(mainland.translate());
  };

  transverseMercatorChile.translate = function(_) {
    if (!arguments.length) {return mainland.translate();}
    var k = mainland.scale(), x = +_[0], y = +_[1];

    /*
    var c0 = mainland(mainlandBbox[0]);
   var x0 = (x - c0[0]) / k;
   var y0 = (y - c0[1]) / k;

   var c1 = mainland(mainlandBbox[1]);
   var x1 = (x - c1[0]) / k;
   var y1 = (y - c1[1]) / k;

   console.info('Mainland: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);
   console.info('.clipExtent([[x '+
    (x0<0?'+ ':'- ') + Math.abs(x0.toFixed(4))+
    ' * k, y '+
    (y0<0?'+ ':'- ') + Math.abs(y0.toFixed(4))+
    ' * k],[x '+
    (x1<0?'+ ':'- ') + Math.abs(x1.toFixed(4))+
    ' * k, y '+
    (y1<0?'+ ':'- ') + Math.abs(y1.toFixed(4))+
    ' * k]])');

   c0 = antarctic.translate([x - 0.1 * k, y + 0.17 * k])(antarcticBbox[0]);
   x0 = (x - c0[0]) / k;
   y0 = (y - c0[1]) / k;

   c1 = antarctic.translate([x - 0.1 * k, y + 0.17 * k])(antarcticBbox[1]);
   x1 = (x - c1[0]) / k;
   y1 = (y - c1[1]) / k;

   console.info('antarctic: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);
   console.info('Doesn t work due to -90 latitude!' + '.clipExtent([[x '+
    (x0<0?'+ ':'- ') + Math.abs(x0.toFixed(4))+
    ' * k + epsilon, y '+
    (y0<0?'+ ':'- ') + Math.abs(y0.toFixed(4))+
    ' * k + epsilon],[x '+
    (x1<0?'+ ':'- ') + Math.abs(x1.toFixed(4))+
    ' * k - epsilon, y '+
    (y1<0?'+ ':'- ') + Math.abs(y1.toFixed(4))+
    ' * k - epsilon]])');

    c0 = juanFernandez.translate([x - 0.092 * k, y -0 * k])(juanFernandezBbox[0]);
    x0 = (x - c0[0]) / k;
    y0 = (y - c0[1]) / k;

    c1 = juanFernandez.translate([x - 0.092 * k, y -0 * k])(juanFernandezBbox[1]);
    x1 = (x - c1[0]) / k;
    y1 = (y - c1[1]) / k;

    console.info('juanFernandez: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);
    console.info('.clipExtent([[x '+
     (x0<0?'+ ':'- ') + Math.abs(x0.toFixed(4))+
     ' * k + epsilon, y '+
     (y0<0?'+ ':'- ') + Math.abs(y0.toFixed(4))+
     ' * k + epsilon],[x '+
     (x1<0?'+ ':'- ') + Math.abs(x1.toFixed(4))+
     ' * k - epsilon, y '+
     (y1<0?'+ ':'- ') + Math.abs(y1.toFixed(4))+
     ' * k - epsilon]])');

     c0 = pascua.translate([x - 0.089 * k, y -0.0265 * k])(pascuaBbox[0]);
     x0 = (x - c0[0]) / k;
     y0 = (y - c0[1]) / k;

     c1 = pascua.translate([x - 0.089 * k, y -0.0265 * k])(pascuaBbox[1]);
     x1 = (x - c1[0]) / k;
     y1 = (y - c1[1]) / k;

     console.info('pascua: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);
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
        .clipExtent([[x - 0.059 * k, y - 0.3835 * k],[x + 0.4498 * k, y + 0.3375 * k]])
        .stream(pointStream);

    antarcticPoint = antarctic
        .translate([x - 0.087 * k, y + 0.17 * k])
        .clipExtent([[x - 0.1166 * k + epsilon, y + 0.2582 * k + epsilon],[x - 0.06 * k - epsilon, y + 0.32 * k - epsilon]])
        .stream(pointStream);

    juanFernandezPoint = juanFernandez
        .translate([x - 0.092 * k, y - 0 * k])
        .clipExtent([[x - 0.114 * k + epsilon, y - 0.013 * k + epsilon],[x - 0.0594 * k - epsilon, y + 0.0133 * k - epsilon]])
        .stream(pointStream);

    pascuaPoint = pascua
        .translate([x - 0.089 * k, y - 0.0265 * k])
        .clipExtent([[x - 0.089 * k + epsilon, y + 0.0154 * k + epsilon],[x - 0.0588 * k - epsilon, y + 0.0391 * k - epsilon]])
        .stream(pointStream);

    return reset();
  };

  transverseMercatorChile.fitExtent = function(extent, object) {
    return fitExtent(transverseMercatorChile, extent, object);
  };

  transverseMercatorChile.fitSize = function(size, object) {
    return fitSize(transverseMercatorChile, size, object);
  };

  function reset() {
    cache = cacheStream = null;
    return transverseMercatorChile;
  }

  transverseMercatorChile.drawCompositionBorders = function(context) {
    /*
    console.info("CLIP EXTENT antarctic: ", antarctic.clipExtent());
    console.info("UL BBOX:", mainland.invert([antarctic.clipExtent()[0][0], antarctic.clipExtent()[0][1]]));
    console.info("UR BBOX:", mainland.invert([antarctic.clipExtent()[1][0], antarctic.clipExtent()[0][1]]));
    console.info("LD BBOX:", mainland.invert([antarctic.clipExtent()[1][0], antarctic.clipExtent()[1][1]]));
    console.info("LL BBOX:", mainland.invert([antarctic.clipExtent()[0][0], antarctic.clipExtent()[1][1]]));

    console.info("CLIP EXTENT juanFernandez: ", juanFernandez.clipExtent());
    console.info("UL BBOX:", mainland.invert([juanFernandez.clipExtent()[0][0], juanFernandez.clipExtent()[0][1]]));
    console.info("UR BBOX:", mainland.invert([juanFernandez.clipExtent()[1][0], juanFernandez.clipExtent()[0][1]]));
    console.info("LD BBOX:", mainland.invert([juanFernandez.clipExtent()[1][0], juanFernandez.clipExtent()[1][1]]));
    console.info("LL BBOX:", mainland.invert([juanFernandez.clipExtent()[0][0], juanFernandez.clipExtent()[1][1]]));

    console.info("CLIP EXTENT pascua: ", pascua.clipExtent());
    console.info("UL BBOX:", mainland.invert([pascua.clipExtent()[0][0], pascua.clipExtent()[0][1]]));
    console.info("UR BBOX:", mainland.invert([pascua.clipExtent()[1][0], pascua.clipExtent()[0][1]]));
    console.info("LD BBOX:", mainland.invert([pascua.clipExtent()[1][0], pascua.clipExtent()[1][1]]));
    console.info("LL BBOX:", mainland.invert([pascua.clipExtent()[0][0], pascua.clipExtent()[1][1]]));
    */

    var ulantarctic = mainland([-82.6999, -51.3043]);
    var urantarctic = mainland([-77.5442, -51.6631]);
    var ldantarctic = mainland([-78.0254, -55.1860]);
    var llantarctic = mainland([-83.6106, -54.7785]);

    var uljuanFernandez = mainland([-80.0638, -35.9840]);
    var urjuanFernandez = mainland([-76.2153, -36.1811]);
    var ldjuanFernandez = mainland([-76.2994, -37.6839]);
    var lljuanFernandez = mainland([-80.2231, -37.4757]);

    var ulpascua = mainland([-78.442, -37.706]);
    var urpascua = mainland([-76.263, -37.8054]);
    var ldpascua = mainland([-76.344, -39.1595]);
    var llpascua = mainland([-78.5638, -39.0559]);

    context.moveTo(ulantarctic[0], ulantarctic[1]);
    context.lineTo(urantarctic[0], urantarctic[1]);
    context.lineTo(ldantarctic[0], ldantarctic[1]);
    context.lineTo(ldantarctic[0], ldantarctic[1]);
    context.lineTo(llantarctic[0], llantarctic[1]);
    context.closePath();

    context.moveTo(uljuanFernandez[0], uljuanFernandez[1]);
    context.lineTo(urjuanFernandez[0], urjuanFernandez[1]);
    context.lineTo(ldjuanFernandez[0], ldjuanFernandez[1]);
    context.lineTo(ldjuanFernandez[0], ldjuanFernandez[1]);
    context.lineTo(lljuanFernandez[0], lljuanFernandez[1]);
    context.closePath();

    context.moveTo(ulpascua[0], ulpascua[1]);
    context.lineTo(urpascua[0], urpascua[1]);
    context.lineTo(ldpascua[0], ldpascua[1]);
    context.lineTo(ldpascua[0], ldpascua[1]);
    context.lineTo(llpascua[0], llpascua[1]);
    context.closePath();


  };
  transverseMercatorChile.getCompositionBorders = function() {
    var context = path();
    this.drawCompositionBorders(context);
    return context.toString();
  };

  return transverseMercatorChile.scale(700);
}
