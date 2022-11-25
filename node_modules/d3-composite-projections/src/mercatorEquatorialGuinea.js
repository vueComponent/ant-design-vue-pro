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

// A composite projection for Equatorial Guinea, configured by default for 960×500.
export default function() {
  var cache,
      cacheStream,
      continent = mercator().rotate([-9.5, -1.5]), continentPoint,
      bioko = mercator().rotate([-8.6, -3.5]), biokoPoint,
      annobon = mercator().rotate([-5.6, 1.45]), annobonPoint,

      point, pointStream = {point: function(x, y) { point = [x, y]; }};

  function mercatorEquatorialGuinea(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (continentPoint.point(x, y), point) ||
        (biokoPoint.point(x, y), point) ||
        (annobonPoint.point(x, y), point);
  }

  mercatorEquatorialGuinea.invert = function(coordinates) {
    var k = continent.scale(),
        t = continent.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;
        return (y >= -0.02 && y< 0 && x >= -0.038 && x < -0.005 ? bioko
            : y >= 0 && y< 0.02 && x >= -0.038 && x < -0.005 ? annobon
            : continent).invert(coordinates);
  };

  mercatorEquatorialGuinea.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([continent.stream(cacheStream = stream), bioko.stream(stream), annobon.stream(stream)]);
  };

  mercatorEquatorialGuinea.precision = function(_) {
    if (!arguments.length) {return continent.precision();}
    continent.precision(_);
    bioko.precision(_);
    annobon.precision(_);
    return reset();
  };

  mercatorEquatorialGuinea.scale = function(_) {
    if (!arguments.length) {return continent.scale();}
    continent.scale(_);
    bioko.scale(_* 1.5);
    annobon.scale(_* 4);
    return mercatorEquatorialGuinea.translate(continent.translate());
  };

  mercatorEquatorialGuinea.translate = function(_) {
    if (!arguments.length) {return continent.translate();}
    var k = continent.scale(), x = +_[0], y = +_[1];
    continentPoint = continent
        .translate(_)
        .clipExtent([[x - 0.005 * k, y - 0.02 * k],[x + 0.038 * k, y +0.02 * k]])
        .stream(pointStream);

    biokoPoint = bioko
        .translate([x - 0.025 * k, y - 0.01 * k])
        .clipExtent([[x - 0.038 * k + epsilon, y - 0.02 * k + epsilon],[x - 0.005 * k - epsilon, y + 0 * k - epsilon]])
        .stream(pointStream);

    annobonPoint = annobon
        .translate([x - 0.025 * k, y + 0.01 * k])
        .clipExtent([[x - 0.038 * k + epsilon, y - 0 * k + epsilon],[x - 0.005 * k - epsilon, y + 0.02 * k - epsilon]])
        .stream(pointStream);


    return reset();
  };

  mercatorEquatorialGuinea.fitExtent = function(extent, object) {
    return fitExtent(mercatorEquatorialGuinea, extent, object);
  };

  mercatorEquatorialGuinea.fitSize = function(size, object) {
    return fitSize(mercatorEquatorialGuinea, size, object);
  };

  function reset() {
    cache = cacheStream = null;
    return mercatorEquatorialGuinea;
  }

  mercatorEquatorialGuinea.drawCompositionBorders = function(context) {
    /*
    console.log("var ul, ur, ld, ll;");
    var projs = [continent, bioko, annobon];
    for (var i in projs){
      var ul = continent.invert([projs[i].clipExtent()[0][0], projs[i].clipExtent()[0][1]]);
      var ur = continent.invert([projs[i].clipExtent()[1][0], projs[i].clipExtent()[0][1]]);
      var ld = continent.invert([projs[i].clipExtent()[1][0], projs[i].clipExtent()[1][1]]);
      var ll = continent.invert([projs[i].clipExtent()[0][0], projs[i].clipExtent()[1][1]]);

      console.log("ul = continent(["+ul+"]);");
      console.log("ur = continent(["+ur+"]);");
      console.log("ld = continent(["+ld+"]);");
      console.log("ll = continent(["+ll+"]);");

      console.log("context.moveTo(ul[0], ul[1]);");
      console.log("context.lineTo(ur[0], ur[1]);");
      console.log("context.lineTo(ld[0], ld[1]);");
      console.log("context.lineTo(ll[0], ll[1]);");
      console.log("context.closePath();");

    }*/

    var ul, ur, ld, ll;
    ul = continent([9.21327272751682,2.645820439454123]);
    ur = continent([11.679126293239872,2.644755519268689]);
    ld = continent([11.676845389029227,0.35307824637606433]);
    ll = continent([9.213572917774014,0.35414205204417754]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
    ul = continent([7.320873711543669,2.64475551449975]);
    ur = continent([9.213272722738658,2.645820434679803]);
    ld = continent([9.213422896480349,1.4999812505283054]);
    ll = continent([7.322014760520787,1.4989168878985566]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
    ul = continent([7.3220147605302905,1.4989168783492766]);
    ur = continent([9.213422896481598,1.499981240979021]);
    ld = continent([9.213572912999604,0.354142056817247]);
    ll = continent([7.323154615739809,0.353078251154504]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();

  };
  mercatorEquatorialGuinea.getCompositionBorders = function() {
    var context = path();
    this.drawCompositionBorders(context);
    return context.toString();
  };

  return mercatorEquatorialGuinea.scale(12000);
}
