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

// A composite projection for Portugal, configured by default for 960×500.
export default function() {
  var cache,
      cacheStream,
      iberianPeninsule = conicConformal().rotate([10, -39.3]).parallels([0, 60]), iberianPeninsulePoint,
      madeira = conicConformal().rotate([17, -32.7]).parallels([0, 60]), madeiraPoint,
      azores = conicConformal().rotate([27.8, -38.6]).parallels([0, 60]), azoresPoint,

      point, pointStream = {point: function(x, y) { point = [x, y]; }};

      /*
      var iberianPeninsuleBbox = [[-11, 46], [4, 34]];
      var madeiraBbox = [[-17.85, 33.6], [-16, 32.02]];
      var azoresBbox = [[-32, 40.529], [-23.98, 35.75]];
      */


  function conicConformalPortugal(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (iberianPeninsulePoint.point(x, y), point) ||
        (madeiraPoint.point(x, y), point) ||
        (azoresPoint.point(x, y), point);
  }

  conicConformalPortugal.invert = function(coordinates) {
    var k = iberianPeninsule.scale(),
        t = iberianPeninsule.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;

        /*
        //How are the return values calculated:
        console.info("******");
        var c0 = madeira(madeiraBbox[0]);
        var x0 = (c0[0] - t[0]) / k;
        var y0 = (c0[1] - t[1]) / k;

        console.info("p0 madeira", x0 + ' - ' + y0);

        var c1 = madeira(madeiraBbox[1]);
        var x1 = (c1[0] - t[0]) / k;
        var y1 = (c1[1] - t[1]) / k;

        console.info("p1 madeira", x1 + ' - ' + y1);

        c0 = azores(azoresBbox[0]);
        x0 = (c0[0] - t[0]) / k;
        y0 = (c0[1] - t[1]) / k;

        console.info("p0 azores", x0 + ' - ' + y0);

        c1 = azores(azoresBbox[1]);
        x1 = (c1[0] - t[0]) / k;
        y1 = (c1[1] - t[1]) / k;

        console.info("p1 azores", x1 + ' - ' + y1);
        */

        return (y >= 0.0093 && y< 0.03678 && x >= -0.03875 && x < -0.0116 ? madeira
            : y >= -0.0412 && y< 0.0091 && x >= -0.07782 && x < -0.01166 ? azores
            : iberianPeninsule).invert(coordinates);
  };

  conicConformalPortugal.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([iberianPeninsule.stream(cacheStream = stream), madeira.stream(stream), azores.stream(stream)]);
  };

  conicConformalPortugal.precision = function(_) {
    if (!arguments.length) {return iberianPeninsule.precision();}
    iberianPeninsule.precision(_);
    madeira.precision(_);
    azores.precision(_);
    return reset();
  };

  conicConformalPortugal.scale = function(_) {
    if (!arguments.length) {return iberianPeninsule.scale();}
    iberianPeninsule.scale(_);
    madeira.scale(_);
    azores.scale(_ * 0.6);
    return conicConformalPortugal.translate(iberianPeninsule.translate());
  };

  conicConformalPortugal.translate = function(_) {
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
   console.info('.clipExtent([[x '+
    (x0<0?'+ ':'- ') + Math.abs(x0.toFixed(4))+
    ' * k, y '+
    (y0<0?'+ ':'- ') + Math.abs(y0.toFixed(4))+
    ' * k],[x '+
    (x1<0?'+ ':'- ') + Math.abs(x1.toFixed(4))+
    ' * k, y '+
    (y1<0?'+ ':'- ') + Math.abs(y1.toFixed(4))+
    ' * k]])');

   c0 = madeira.translate([x - 0.0265 * k, y + 0.025 * k])(madeiraBbox[0]);
   x0 = (x - c0[0]) / k;
   y0 = (y - c0[1]) / k;

   c1 = madeira.translate([x - 0.0265 * k, y + 0.025 * k])(madeiraBbox[1]);
   x1 = (x - c1[0]) / k;
   y1 = (y - c1[1]) / k;

   console.info('Madeira: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);
   console.info('.clipExtent([[x '+
    (x0<0?'+ ':'- ') + Math.abs(x0.toFixed(4))+
    ' * k + epsilon, y '+
    (y0<0?'+ ':'- ') + Math.abs(y0.toFixed(4))+
    ' * k + epsilon],[x '+
    (x1<0?'+ ':'- ') + Math.abs(x1.toFixed(4))+
    ' * k - epsilon, y '+
    (y1<0?'+ ':'- ') + Math.abs(y1.toFixed(4))+
    ' * k - epsilon]])');

    c0 = azores.translate([x - 0.045 * k, y + -0.02 * k])(azoresBbox[0]);
    x0 = (x - c0[0]) / k;
    y0 = (y - c0[1]) / k;

    c1 = azores.translate([x - 0.045 * k, y + -0.02 * k])(azoresBbox[1]);
    x1 = (x - c1[0]) / k;
    y1 = (y - c1[1]) / k;

    console.info('Azores: p0: ' + x0 + ', ' + y0 + ' , p1: ' + x1 + ' - ' + y1);
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
    iberianPeninsulePoint = iberianPeninsule
        .translate(_)
        .clipExtent([[x - 0.0115 * k, y - 0.1138 * k],[x +0.2105 * k, y +0.0673 * k]])
        .stream(pointStream);


    madeiraPoint = madeira
        .translate([x - 0.0265 * k, y + 0.025 * k])
        .clipExtent([[x - 0.0388 * k + epsilon, y + 0.0093 * k + epsilon],[x - 0.0116 * k - epsilon, y + 0.0368 * k - epsilon]])
        .stream(pointStream);

    azoresPoint = azores
        .translate([x - 0.045 * k, y + -0.02 * k])
        .clipExtent([[x - 0.0778 * k + epsilon, y - 0.0413 * k + epsilon],[x - 0.0117 * k - epsilon, y + 0.0091 * k - epsilon]])
        .stream(pointStream);

    return reset();
  };

  conicConformalPortugal.fitExtent = function(extent, object) {
    return fitExtent(conicConformalPortugal, extent, object);
  };

  conicConformalPortugal.fitSize = function(size, object) {
    return fitSize(conicConformalPortugal, size, object);
  };

  function reset() {
    cache = cacheStream = null;
    return conicConformalPortugal;
  }

  conicConformalPortugal.drawCompositionBorders = function(context) {
    /*
    console.info("CLIP EXTENT MADEIRA: ", madeira.clipExtent());
    console.info("UL BBOX:", iberianPeninsule.invert([madeira.clipExtent()[0][0], madeira.clipExtent()[0][1]]));
    console.info("UR BBOX:", iberianPeninsule.invert([madeira.clipExtent()[1][0], madeira.clipExtent()[0][1]]));
    console.info("LD BBOX:", iberianPeninsule.invert([madeira.clipExtent()[1][0], madeira.clipExtent()[1][1]]));
    console.info("LL BBOX:", iberianPeninsule.invert([madeira.clipExtent()[0][0], madeira.clipExtent()[1][1]]));

    console.info("CLIP EXTENT AZORES: ", azores.clipExtent());
    console.info("UL BBOX:", iberianPeninsule.invert([azores.clipExtent()[0][0], azores.clipExtent()[0][1]]));
    console.info("UR BBOX:", iberianPeninsule.invert([azores.clipExtent()[1][0], azores.clipExtent()[0][1]]));
    console.info("LD BBOX:", iberianPeninsule.invert([azores.clipExtent()[1][0], azores.clipExtent()[1][1]]));
    console.info("LL BBOX:", iberianPeninsule.invert([azores.clipExtent()[0][0], azores.clipExtent()[1][1]]));
    */

    var ulmadeira = iberianPeninsule([-12.8351, 38.7113]);
    var urmadeira = iberianPeninsule([-10.8482, 38.7633]);
    var ldmadeira = iberianPeninsule([-10.8181, 37.2072]);
    var llmadeira = iberianPeninsule([-12.7345, 37.1573]);

    var ulazores = iberianPeninsule([-16.0753, 41.4436]);
    var urazores = iberianPeninsule([-10.9168, 41.6861]);
    var ldazores = iberianPeninsule([-10.8557, 38.7747]);
    var llazores = iberianPeninsule([-15.6728, 38.5505]);

    context.moveTo(ulmadeira[0], ulmadeira[1]);
    context.lineTo(urmadeira[0], urmadeira[1]);
    context.lineTo(ldmadeira[0], ldmadeira[1]);
    context.lineTo(ldmadeira[0], ldmadeira[1]);
    context.lineTo(llmadeira[0], llmadeira[1]);
    context.closePath();

    context.moveTo(ulazores[0], ulazores[1]);
    context.lineTo(urazores[0], urazores[1]);
    context.lineTo(ldazores[0], ldazores[1]);
    context.lineTo(ldazores[0], ldazores[1]);
    context.lineTo(llazores[0], llazores[1]);
    context.closePath();

  };
  conicConformalPortugal.getCompositionBorders = function() {
    var context = path();
    this.drawCompositionBorders(context);
    return context.toString();
  };

  return conicConformalPortugal.scale(4200);
}
