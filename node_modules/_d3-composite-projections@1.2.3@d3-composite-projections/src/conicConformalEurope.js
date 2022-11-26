import {epsilon} from "./math";
import {geoConicConformal as conicConformal} from "d3-geo";
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

// A composite projection for Portugal, configured by default for 960×500.
export default function() {
  var cache,
      cacheStream,
      europe = conicConformal().rotate([-10, -53]).parallels([0, 60]), europePoint,
      guadeloupe = mercator().center([-61.46, 16.14]), guadeloupePoint,
      guyane = mercator().center([-53.2, 3.9]), guyanePoint,
      azores = conicConformal().rotate([27.8, -38.9]).parallels([0, 60]), azoresPoint,
      azores2 = conicConformal().rotate([25.43, -37.398]).parallels([0, 60]), azores2Point,
      azores3 = conicConformal().rotate([31.17, -39.539]).parallels([0, 60]), azores3Point,
      madeira = conicConformal().rotate([17, -32.7]).parallels([0, 60]), madeiraPoint,
      canaryIslands = conicConformal().rotate([16, -28.5]).parallels([0,60]), canaryIslandsPoint,
      martinique = mercator().center([-61.03, 14.67]), martiniquePoint,
      mayotte = mercator().center([45.16, -12.8]), mayottePoint,
      reunion = mercator().center([55.52, -21.13]), reunionPoint,
      malta = conicConformal().rotate([-14.4, -35.95]).parallels([0, 60]), maltaPoint,





      point, pointStream = {point: function(x, y) { point = [x, y]; }};

      /*
      var europeBbox = [[-6.5, 51], [10, 41]];
      var guyaneBbox = [[-54.5, 6.29], [-50.9, 1.48]];
      */


  function conicConformalEurope(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (europePoint.point(x, y), point) ||
        (guyanePoint.point(x, y), point) ||
        (martiniquePoint.point(x, y), point) ||
        (guadeloupePoint.point(x, y), point) ||
        (canaryIslandsPoint.point(x, y), point) ||
        (madeiraPoint.point(x, y), point) ||
        (mayottePoint.point(x, y), point) ||
        (reunionPoint.point(x, y), point) ||
        (maltaPoint.point(x, y), point) ||
        (azoresPoint.point(x, y), point) ||
        (azores2Point.point(x, y), point) ||
        (azores3Point.point(x, y), point);
  }

  conicConformalEurope.invert = function(coordinates) {
    var k = europe.scale(),
        t = europe.translate(),
        x = (coordinates[0] - (t[0] + 0.08 * k)) / k,
        y = (coordinates[1] - t[1]) / k;

        return (y >= -0.31 && y< -0.24 && x >= 0.14 && x < 0.24 ? guadeloupe
            : y >= -0.24 && y< -0.17 && x >= 0.14 && x < 0.24 ? guyane
            : y >= -0.17 && y< -0.12 && x >= 0.21 && x < 0.24 ? azores2
            : y >= -0.17 && y< -0.14 && x >= 0.14 && x < 0.165 ? azores3
            : y >= -0.17 && y< -0.1 && x >= 0.14 && x < 0.24 ? azores
            : y >= -0.1 && y< -0.03 && x >= 0.14 && x < 0.24 ? madeira
            : y >= -0.03 && y< 0.04 && x >= 0.14 && x < 0.24 ? canaryIslands
            : y >= -0.31 && y< -0.24 && x >= 0.24 && x < 0.34 ? martinique
            : y >= -0.24 && y< -0.17 && x >= 0.24 && x < 0.34 ? mayotte
            : y >= -0.17 && y< -0.1 && x >= 0.24 && x < 0.34 ? reunion
            : y >= -0.1 && y< -0.03 && x >= 0.24 && x < 0.34 ? malta
            : europe).invert(coordinates);

  };

  conicConformalEurope.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([europe.stream(cacheStream = stream), guyane.stream(stream), martinique.stream(stream), guadeloupe.stream(stream), canaryIslands.stream(stream), madeira.stream(stream), mayotte.stream(stream), reunion.stream(stream), malta.stream(stream), azores.stream(stream), azores2.stream(stream), azores3.stream(stream)]);
  };

  conicConformalEurope.precision = function(_) {
    if (!arguments.length) {return europe.precision();}
    europe.precision(_);
    guyane.precision(_);
    martinique.precision(_);
    guadeloupe.precision(_);
    canaryIslands.precision(_);
    madeira.precision(_);
    mayotte.precision(_);
    reunion.precision(_);
    malta.precision(_);

    azores.precision(_);
    azores2.precision(_);
    azores3.precision(_);

    return reset();
  };

  conicConformalEurope.scale = function(_) {
    if (!arguments.length) {return europe.scale();}
    europe.scale(_);
    guadeloupe.scale(_ * 3);
    guyane.scale(_ * 0.8);
    martinique.scale(_ * 3.5);
    reunion.scale(_ * 2.7);
    azores.scale(_ * 2);
    azores2.scale(_ * 2);
    azores3.scale(_ * 2);
    madeira.scale(_ * 3);
    canaryIslands.scale(_);

    mayotte.scale(_ * 5.5);
    malta.scale(_ * 6);



    return conicConformalEurope.translate(europe.translate());
  };

  conicConformalEurope.translate = function(_) {
    if (!arguments.length) {return europe.translate();}
    var k = europe.scale(), x = +_[0], y = +_[1];

    europePoint = europe
        .translate([x - 0.08 * k, y])
        .clipExtent([[x - 0.51 * k, y - 0.33 * k],[x + 0.5 * k, y + 0.33 * k]])
        .stream(pointStream);

    guadeloupePoint = guadeloupe
        .translate([x + 0.19 * k, y - 0.275 * k])
        .clipExtent([[x + 0.14 * k + epsilon, y - 0.31 * k + epsilon],[x + 0.24 * k - epsilon, y - 0.24 * k - epsilon]])
        .stream(pointStream);

    guyanePoint = guyane
        .translate([x + 0.19 * k, y - 0.205 * k])
        .clipExtent([[x + 0.14 * k + epsilon, y - 0.24 * k + epsilon],[x + 0.24 * k - epsilon, y - 0.17 * k - epsilon]])
        .stream(pointStream);

    azoresPoint = azores
        .translate([x + 0.19 * k, y - 0.135 * k])
        .clipExtent([[x + 0.14 * k + epsilon, y - 0.17 * k + epsilon],[x + 0.24 * k - epsilon, y - 0.1 * k - epsilon]])
        .stream(pointStream);

    azores2Point = azores2
        .translate([x + 0.225 * k, y - 0.147 * k])
        .clipExtent([[x + 0.21 * k + epsilon, y - 0.17 * k + epsilon],[x + 0.24 * k - epsilon, y - 0.12 * k - epsilon]])
        .stream(pointStream);

    azores3Point = azores3
        .translate([x + 0.153 * k, y - 0.15 * k])
        .clipExtent([[x + 0.14 * k + epsilon, y - 0.17 * k + epsilon],[x + 0.165 * k - epsilon, y - 0.14 * k - epsilon]])
        .stream(pointStream);

    madeiraPoint = madeira
        .translate([x + 0.19 * k, y - 0.065 * k])
        .clipExtent([[x + 0.14 * k + epsilon, y - 0.1 * k + epsilon],[x + 0.24 * k - epsilon, y - 0.03 * k - epsilon]])
        .stream(pointStream);

    canaryIslandsPoint = canaryIslands
        .translate([x + 0.19 * k, y + 0.005 * k])
        .clipExtent([[x + 0.14 * k + epsilon, y - 0.03 * k + epsilon],[x + 0.24 * k - epsilon, y + 0.04 * k - epsilon]])
        .stream(pointStream);

    martiniquePoint = martinique
        .translate([x + 0.29 * k, y - 0.275 * k])
        .clipExtent([[x + 0.24 * k + epsilon, y - 0.31 * k + epsilon],[x + 0.34 * k - epsilon, y - 0.24 * k - epsilon]])
        .stream(pointStream);

    mayottePoint = mayotte
        .translate([x + 0.29 * k, y - 0.205 * k])
        .clipExtent([[x + 0.24 * k + epsilon, y - 0.24 * k + epsilon],[x + 0.34 * k - epsilon, y - 0.17 * k - epsilon]])
        .stream(pointStream);

    reunionPoint = reunion
        .translate([x + 0.29 * k, y - 0.135 * k])
        .clipExtent([[x + 0.24 * k + epsilon, y - 0.17 * k + epsilon],[x + 0.34 * k - epsilon, y - 0.1 * k - epsilon]])
        .stream(pointStream);

    maltaPoint = malta
        .translate([x + 0.29 * k, y - 0.065 * k])
        .clipExtent([[x + 0.24 * k + epsilon, y - 0.1 * k + epsilon],[x + 0.34 * k - epsilon, y - 0.03 * k - epsilon]])
        .stream(pointStream);



    return reset();
  };

  conicConformalEurope.fitExtent = function(extent, object) {
    return fitExtent(conicConformalEurope, extent, object);
  };

  conicConformalEurope.fitSize = function(size, object) {
    return fitSize(conicConformalEurope, size, object);
  };

  function reset() {
    cache = cacheStream = null;
    return conicConformalEurope;
  }

  conicConformalEurope.drawCompositionBorders = function(context) {

    /*
    console.log("var ul, ur, ld, ll;");
    var projs = [guyane, martinique, guadeloupe, canaryIslands, madeira, mayotte, reunion, malta, azores, azores2, azores3];
    for (var i in projs){
      var ul = europe.invert([projs[i].clipExtent()[0][0], projs[i].clipExtent()[0][1]]);
      var ur = europe.invert([projs[i].clipExtent()[1][0], projs[i].clipExtent()[0][1]]);
      var ld = europe.invert([projs[i].clipExtent()[1][0], projs[i].clipExtent()[1][1]]);
      var ll = europe.invert([projs[i].clipExtent()[0][0], projs[i].clipExtent()[1][1]]);

      console.log("ul = europe(["+ul+"]);");
      console.log("ur = europe(["+ur+"]);");
      console.log("ld = europe(["+ld+"]);");
      console.log("ll = europe(["+ll+"]);");

      console.log("context.moveTo(ul[0], ul[1]);");
      console.log("context.lineTo(ur[0], ur[1]);");
      console.log("context.lineTo(ld[0], ld[1]);");
      console.log("context.lineTo(ll[0], ll[1]);");
      console.log("context.closePath();");

    }*/

    var ul, ur, ld, ll;
    ul = europe([42.45755610828648,63.343658547914934]);
    ur = europe([52.65837266667029,59.35045080290929]);
    ld = europe([47.19754502247785,56.12653496548117]);
    ll = europe([37.673034273363044,59.61638268506111]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
    ul = europe([59.41110754003403,62.35069727399336]);
    ur = europe([66.75050228640794,57.11797303636038]);
    ld = europe([60.236065725110436,54.63331433818992]);
    ll = europe([52.65837313153311,59.350450804599355]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
    ul = europe([48.81091130080243,66.93353402634641]);
    ur = europe([59.41110730654679,62.35069740653086]);
    ld = europe([52.6583728974441,59.3504509222445]);
    ll = europe([42.45755631675751,63.34365868805821]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
    ul = europe([31.054198418446475,52.1080673766184]);
    ur = europe([39.09869284884117,49.400700047190554]);
    ld = europe([36.0580811499175,46.02944174908498]);
    ll = europe([28.690508588835726,48.433126979386415]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
    ul = europe([33.977877745912025,55.849945501331]);
    ur = europe([42.75328432167726,52.78455122462353]);
    ld = europe([39.09869297540224,49.400700176148625]);
    ll = europe([31.05419851807008,52.10806751810923]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
    ul = europe([52.658372900759296,59.35045068526415]);
    ur = europe([60.23606549583304,54.63331423800264]);
    ld = europe([54.6756370953122,51.892298789399455]);
    ll = europe([47.19754524788189,56.126534861222794]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
    ul = europe([47.19754506082455,56.126534735591456]);
    ur = europe([54.675636900123514,51.892298681337095]);
    ld = europe([49.94448648951486,48.98775484983285]);
    ll = europe([42.75328468716108,52.78455126060818]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
    ul = europe([42.75328453416769,52.78455113209101]);
    ur = europe([49.94448632339758,48.98775473706457]);
    ld = europe([45.912339990394315,45.99361784987003]);
    ll = europe([39.09869317356607,49.40070009378711]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
    ul = europe([37.673034114296634,59.61638254183119]);
    ur = europe([47.197544835420544,56.126534839849846]);
    ld = europe([42.75328447467064,52.78455135314068]);
    ll = europe([33.977877870363905,55.849945644671145]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
    ul = europe([44.56748486446032,57.26489367845818]);
    ld = europe([43.9335791193588,53.746540942601726]);
    ll = europe([43,56]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
    ul = europe([37.673034114296634,59.61638254183119]);
    ur = europe([40.25902691953466,58.83002044222639]);
    ld = europe([38.458270492742024,57.26232178028002]);
    ll = europe([35.97754948030156,58.00266637992386]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();



  };
  conicConformalEurope.getCompositionBorders = function() {
    var context = path();
    this.drawCompositionBorders(context);
    return context.toString();
  };

  return conicConformalEurope.scale(750);
}
