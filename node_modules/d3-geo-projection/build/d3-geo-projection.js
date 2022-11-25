// https://d3js.org/d3-geo-projection/ Version 2.1.2. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-geo'), require('d3-array')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-geo', 'd3-array'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3,global.d3));
}(this, (function (exports,d3Geo,d3Array) { 'use strict';

var abs = Math.abs;
var atan = Math.atan;
var atan2 = Math.atan2;

var cos = Math.cos;
var exp = Math.exp;
var floor = Math.floor;
var log = Math.log;
var max = Math.max;
var min = Math.min;
var pow = Math.pow;
var round = Math.round;
var sign = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
var sin = Math.sin;
var tan = Math.tan;

var epsilon = 1e-6;
var epsilon2 = 1e-12;
var pi = Math.PI;
var halfPi = pi / 2;
var quarterPi = pi / 4;
var sqrt1_2 = Math.SQRT1_2;
var sqrt2 = sqrt(2);
var sqrtPi = sqrt(pi);
var tau = pi * 2;
var degrees = 180 / pi;
var radians = pi / 180;

function sinci(x) {
  return x ? x / Math.sin(x) : 1;
}

function asin(x) {
  return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
}

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

function sqrt(x) {
  return x > 0 ? Math.sqrt(x) : 0;
}

function tanh(x) {
  x = exp(2 * x);
  return (x - 1) / (x + 1);
}

function sinh(x) {
  return (exp(x) - exp(-x)) / 2;
}

function cosh(x) {
  return (exp(x) + exp(-x)) / 2;
}

function arsinh(x) {
  return log(x + sqrt(x * x + 1));
}

function arcosh(x) {
  return log(x + sqrt(x * x - 1));
}

function airyRaw(beta) {
  var tanBeta_2 = tan(beta / 2),
      b = 2 * log(cos(beta / 2)) / (tanBeta_2 * tanBeta_2);

  function forward(x, y) {
    var cosx = cos(x),
        cosy = cos(y),
        siny = sin(y),
        cosz = cosy * cosx,
        k = -((1 - cosz ? log((1 + cosz) / 2) / (1 - cosz) : -0.5) + b / (1 + cosz));
    return [k * cosy * sin(x), k * siny];
  }

  forward.invert = function(x, y) {
    var r = sqrt(x * x + y * y),
        z = -beta / 2,
        i = 50, delta;
    if (!r) return [0, 0];
    do {
      var z_2 = z / 2,
          cosz_2 = cos(z_2),
          sinz_2 = sin(z_2),
          tanz_2 = tan(z_2),
          lnsecz_2 = log(1 / cosz_2);
      z -= delta = (2 / tanz_2 * lnsecz_2 - b * tanz_2 - r) / (-lnsecz_2 / (sinz_2 * sinz_2) + 1 - b / (2 * cosz_2 * cosz_2));
    } while (abs(delta) > epsilon && --i > 0);
    var sinz = sin(z);
    return [atan2(x * sinz, r * cos(z)), asin(y * sinz / r)];
  };

  return forward;
}

var airy = function() {
  var beta = halfPi,
      m = d3Geo.geoProjectionMutator(airyRaw),
      p = m(beta);

  p.radius = function(_) {
    return arguments.length ? m(beta = _ * radians) : beta * degrees;
  };

  return p
      .scale(179.976)
      .clipAngle(147);
};

function aitoffRaw(x, y) {
  var cosy = cos(y), sincia = sinci(acos(cosy * cos(x /= 2)));
  return [2 * cosy * sin(x) * sincia, sin(y) * sincia];
}

// Abort if [x, y] is not within an ellipse centered at [0, 0] with
// semi-major axis pi and semi-minor axis pi/2.
aitoffRaw.invert = function(x, y) {
  if (x * x + 4 * y * y > pi * pi + epsilon) return;
  var x1 = x, y1 = y, i = 25;
  do {
    var sinx = sin(x1),
        sinx_2 = sin(x1 / 2),
        cosx_2 = cos(x1 / 2),
        siny = sin(y1),
        cosy = cos(y1),
        sin_2y = sin(2 * y1),
        sin2y = siny * siny,
        cos2y = cosy * cosy,
        sin2x_2 = sinx_2 * sinx_2,
        c = 1 - cos2y * cosx_2 * cosx_2,
        e = c ? acos(cosy * cosx_2) * sqrt(f = 1 / c) : f = 0,
        f,
        fx = 2 * e * cosy * sinx_2 - x,
        fy = e * siny - y,
        dxdx = f * (cos2y * sin2x_2 + e * cosy * cosx_2 * sin2y),
        dxdy = f * (0.5 * sinx * sin_2y - e * 2 * siny * sinx_2),
        dydx = f * 0.25 * (sin_2y * sinx_2 - e * siny * cos2y * sinx),
        dydy = f * (sin2y * cosx_2 + e * sin2x_2 * cosy),
        z = dxdy * dydx - dydy * dxdx;
    if (!z) break;
    var dx = (fy * dxdy - fx * dydy) / z,
        dy = (fx * dydx - fy * dxdx) / z;
    x1 -= dx, y1 -= dy;
  } while ((abs(dx) > epsilon || abs(dy) > epsilon) && --i > 0);
  return [x1, y1];
};

var aitoff = function() {
  return d3Geo.geoProjection(aitoffRaw)
      .scale(152.63);
};

function armadilloRaw(phi0) {
  var sinPhi0 = sin(phi0),
      cosPhi0 = cos(phi0),
      sPhi0 = phi0 >= 0 ? 1 : -1,
      tanPhi0 = tan(sPhi0 * phi0),
      k = (1 + sinPhi0 - cosPhi0) / 2;

  function forward(lambda, phi) {
    var cosPhi = cos(phi),
        cosLambda = cos(lambda /= 2);
    return [
      (1 + cosPhi) * sin(lambda),
      (sPhi0 * phi > -atan2(cosLambda, tanPhi0) - 1e-3 ? 0 : -sPhi0 * 10) + k + sin(phi) * cosPhi0 - (1 + cosPhi) * sinPhi0 * cosLambda // TODO D3 core should allow null or [NaN, NaN] to be returned.
    ];
  }

  forward.invert = function(x, y) {
    var lambda = 0,
        phi = 0,
        i = 50;
    do {
      var cosLambda = cos(lambda),
          sinLambda = sin(lambda),
          cosPhi = cos(phi),
          sinPhi = sin(phi),
          A = 1 + cosPhi,
          fx = A * sinLambda - x,
          fy = k + sinPhi * cosPhi0 - A * sinPhi0 * cosLambda - y,
          dxdLambda = A * cosLambda / 2,
          dxdPhi = -sinLambda * sinPhi,
          dydLambda = sinPhi0 * A * sinLambda / 2,
          dydPhi = cosPhi0 * cosPhi + sinPhi0 * cosLambda * sinPhi,
          denominator = dxdPhi * dydLambda - dydPhi * dxdLambda,
          dLambda = (fy * dxdPhi - fx * dydPhi) / denominator / 2,
          dPhi = (fx * dydLambda - fy * dxdLambda) / denominator;
      lambda -= dLambda, phi -= dPhi;
    } while ((abs(dLambda) > epsilon || abs(dPhi) > epsilon) && --i > 0);
    return sPhi0 * phi > -atan2(cos(lambda), tanPhi0) - 1e-3 ? [lambda * 2, phi] : null;
  };

  return forward;
}

var armadillo = function() {
  var phi0 = 20 * radians,
      sPhi0 = phi0 >= 0 ? 1 : -1,
      tanPhi0 = tan(sPhi0 * phi0),
      m = d3Geo.geoProjectionMutator(armadilloRaw),
      p = m(phi0),
      stream_ = p.stream;

  p.parallel = function(_) {
    if (!arguments.length) return phi0 * degrees;
    tanPhi0 = tan((sPhi0 = (phi0 = _ * radians) >= 0 ? 1 : -1) * phi0);
    return m(phi0);
  };

  p.stream = function(stream) {
    var rotate = p.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (p.rotate([0, 0]), stream_(stream));
    p.rotate(rotate);
    rotateStream.sphere = function() {
      sphereStream.polygonStart(), sphereStream.lineStart();
      for (var lambda = sPhi0 * -180; sPhi0 * lambda < 180; lambda += sPhi0 * 90) sphereStream.point(lambda, sPhi0 * 90);
      while (sPhi0 * (lambda -= phi0) >= -180) { // TODO precision?
        sphereStream.point(lambda, sPhi0 * -atan2(cos(lambda * radians / 2), tanPhi0) * degrees);
      }
      sphereStream.lineEnd(), sphereStream.polygonEnd();
    };
    return rotateStream;
  };

  return p
      .scale(218.695)
      .center([0, 28.0974]);
};

function augustRaw(lambda, phi) {
  var tanPhi = tan(phi / 2),
      k = sqrt(1 - tanPhi * tanPhi),
      c = 1 + k * cos(lambda /= 2),
      x = sin(lambda) * k / c,
      y = tanPhi / c,
      x2 = x * x,
      y2 = y * y;
  return [
    4 / 3 * x * (3 + x2 - 3 * y2),
    4 / 3 * y * (3 + 3 * x2 - y2)
  ];
}

augustRaw.invert = function(x, y) {
  x *= 3 / 8, y *= 3 / 8;
  if (!x && abs(y) > 1) return null;
  var x2 = x * x,
      y2 = y * y,
      s = 1 + x2 + y2,
      sin3Eta = sqrt((s - sqrt(s * s - 4 * y * y)) / 2),
      eta = asin(sin3Eta) / 3,
      xi = sin3Eta ? arcosh(abs(y / sin3Eta)) / 3 : arsinh(abs(x)) / 3,
      cosEta = cos(eta),
      coshXi = cosh(xi),
      d = coshXi * coshXi - cosEta * cosEta;
  return [
    sign(x) * 2 * atan2(sinh(xi) * cosEta, 0.25 - d),
    sign(y) * 2 * atan2(coshXi * sin(eta), 0.25 + d)
  ];
};

var august = function() {
  return d3Geo.geoProjection(augustRaw)
      .scale(66.1603);
};

var sqrt8 = sqrt(8);
var phi0 = log(1 + sqrt2);

function bakerRaw(lambda, phi) {
  var phi0 = abs(phi);
  return phi0 < quarterPi
      ? [lambda, log(tan(quarterPi + phi / 2))]
      : [lambda * cos(phi0) * (2 * sqrt2 - 1 / sin(phi0)), sign(phi) * (2 * sqrt2 * (phi0 - quarterPi) - log(tan(phi0 / 2)))];
}

bakerRaw.invert = function(x, y) {
  if ((y0 = abs(y)) < phi0) return [x, 2 * atan(exp(y)) - halfPi];
  var phi = quarterPi, i = 25, delta, y0;
  do {
    var cosPhi_2 = cos(phi / 2), tanPhi_2 = tan(phi / 2);
    phi -= delta = (sqrt8 * (phi - quarterPi) - log(tanPhi_2) - y0) / (sqrt8 - cosPhi_2 * cosPhi_2 / (2 * tanPhi_2));
  } while (abs(delta) > epsilon2 && --i > 0);
  return [x / (cos(phi) * (sqrt8 - 1 / sin(phi))), sign(y) * phi];
};

var baker = function() {
  return d3Geo.geoProjection(bakerRaw)
      .scale(112.314);
};

function berghausRaw(lobes) {
  var k = 2 * pi / lobes;

  function forward(lambda, phi) {
    var p = d3Geo.geoAzimuthalEquidistantRaw(lambda, phi);
    if (abs(lambda) > halfPi) { // back hemisphere
      var theta = atan2(p[1], p[0]),
          r = sqrt(p[0] * p[0] + p[1] * p[1]),
          theta0 = k * round((theta - halfPi) / k) + halfPi,
          alpha = atan2(sin(theta -= theta0), 2 - cos(theta)); // angle relative to lobe end
      theta = theta0 + asin(pi / r * sin(alpha)) - alpha;
      p[0] = r * cos(theta);
      p[1] = r * sin(theta);
    }
    return p;
  }

  forward.invert = function(x, y) {
    var r = sqrt(x * x + y * y);
    if (r > halfPi) {
      var theta = atan2(y, x),
          theta0 = k * round((theta - halfPi) / k) + halfPi,
          s = theta > theta0 ? -1 : 1,
          A = r * cos(theta0 - theta),
          cotAlpha = 1 / tan(s * acos((A - pi) / sqrt(pi * (pi - 2 * A) + r * r)));
      theta = theta0 + 2 * atan((cotAlpha + s * sqrt(cotAlpha * cotAlpha - 3)) / 3);
      x = r * cos(theta), y = r * sin(theta);
    }
    return d3Geo.geoAzimuthalEquidistantRaw.invert(x, y);
  };

  return forward;
}

var berghaus = function() {
  var lobes = 5,
      m = d3Geo.geoProjectionMutator(berghausRaw),
      p = m(lobes),
      projectionStream = p.stream,
      epsilon$$1 = 1e-2,
      cr = -cos(epsilon$$1 * radians),
      sr = sin(epsilon$$1 * radians);

  p.lobes = function(_) {
    return arguments.length ? m(lobes = +_) : lobes;
  };

  p.stream = function(stream) {
    var rotate = p.rotate(),
        rotateStream = projectionStream(stream),
        sphereStream = (p.rotate([0, 0]), projectionStream(stream));
    p.rotate(rotate);
    rotateStream.sphere = function() {
      sphereStream.polygonStart(), sphereStream.lineStart();
      for (var i = 0, delta = 360 / lobes, delta0 = 2 * pi / lobes, phi = 90 - 180 / lobes, phi0 = halfPi; i < lobes; ++i, phi -= delta, phi0 -= delta0) {
        sphereStream.point(atan2(sr * cos(phi0), cr) * degrees, asin(sr * sin(phi0)) * degrees);
        if (phi < -90) {
          sphereStream.point(-90, -180 - phi - epsilon$$1);
          sphereStream.point(-90, -180 - phi + epsilon$$1);
        } else {
          sphereStream.point(90, phi + epsilon$$1);
          sphereStream.point(90, phi - epsilon$$1);
        }
      }
      sphereStream.lineEnd(), sphereStream.polygonEnd();
    };
    return rotateStream;
  };

  return p
      .scale(87.8076)
      .center([0, 17.1875])
      .clipAngle(180 - 1e-3);
};

function mollweideBromleyTheta(cp, phi) {
  var cpsinPhi = cp * sin(phi), i = 30, delta;
  do phi -= delta = (phi + sin(phi) - cpsinPhi) / (1 + cos(phi));
  while (abs(delta) > epsilon && --i > 0);
  return phi / 2;
}

function mollweideBromleyRaw(cx, cy, cp) {

  function forward(lambda, phi) {
    return [cx * lambda * cos(phi = mollweideBromleyTheta(cp, phi)), cy * sin(phi)];
  }

  forward.invert = function(x, y) {
    return y = asin(y / cy), [x / (cx * cos(y)), asin((2 * y + sin(2 * y)) / cp)];
  };

  return forward;
}

var mollweideRaw = mollweideBromleyRaw(sqrt2 / halfPi, sqrt2, pi);

var mollweide = function() {
  return d3Geo.geoProjection(mollweideRaw)
      .scale(169.529);
};

var k = 2.00276;
var w = 1.11072;

function boggsRaw(lambda, phi) {
  var theta = mollweideBromleyTheta(pi, phi);
  return [k * lambda / (1 / cos(phi) + w / cos(theta)), (phi + sqrt2 * sin(theta)) / k];
}

boggsRaw.invert = function(x, y) {
  var ky = k * y, theta = y < 0 ? -quarterPi : quarterPi, i = 25, delta, phi;
  do {
    phi = ky - sqrt2 * sin(theta);
    theta -= delta = (sin(2 * theta) + 2 * theta - pi * sin(phi)) / (2 * cos(2 * theta) + 2 + pi * cos(phi) * sqrt2 * cos(theta));
  } while (abs(delta) > epsilon && --i > 0);
  phi = ky - sqrt2 * sin(theta);
  return [x * (1 / cos(phi) + w / cos(theta)) / k, phi];
};

var boggs = function() {
  return d3Geo.geoProjection(boggsRaw)
      .scale(160.857);
};

var parallel1 = function(projectAt) {
  var phi0 = 0,
      m = d3Geo.geoProjectionMutator(projectAt),
      p = m(phi0);

  p.parallel = function(_) {
    return arguments.length ? m(phi0 = _ * radians) : phi0 * degrees;
  };

  return p;
};

function sinusoidalRaw(lambda, phi) {
  return [lambda * cos(phi), phi];
}

sinusoidalRaw.invert = function(x, y) {
  return [x / cos(y), y];
};

var sinusoidal = function() {
  return d3Geo.geoProjection(sinusoidalRaw)
      .scale(152.63);
};

function bonneRaw(phi0) {
  if (!phi0) return sinusoidalRaw;
  var cotPhi0 = 1 / tan(phi0);

  function forward(lambda, phi) {
    var rho = cotPhi0 + phi0 - phi,
        e = rho ? lambda * cos(phi) / rho : rho;
    return [rho * sin(e), cotPhi0 - rho * cos(e)];
  }

  forward.invert = function(x, y) {
    var rho = sqrt(x * x + (y = cotPhi0 - y) * y),
        phi = cotPhi0 + phi0 - rho;
    return [rho / cos(phi) * atan2(x, y), phi];
  };

  return forward;
}

var bonne = function() {
  return parallel1(bonneRaw)
      .scale(123.082)
      .center([0, 26.1441])
      .parallel(45);
};

function bottomleyRaw(sinPsi) {

  function forward(lambda, phi) {
    var rho = halfPi - phi,
        eta = rho ? lambda * sinPsi * sin(rho) / rho : rho;
    return [rho * sin(eta) / sinPsi, halfPi - rho * cos(eta)];
  }

  forward.invert = function(x, y) {
    var x1 = x * sinPsi,
        y1 = halfPi - y,
        rho = sqrt(x1 * x1 + y1 * y1),
        eta = atan2(x1, y1);
    return [(rho ? rho / sin(rho) : 1) * eta / sinPsi, halfPi - rho];
  };

  return forward;
}

var bottomley = function() {
  var sinPsi = 0.5,
      m = d3Geo.geoProjectionMutator(bottomleyRaw),
      p = m(sinPsi);

  p.fraction = function(_) {
    return arguments.length ? m(sinPsi = +_) : sinPsi;
  };

  return p
      .scale(158.837);
};

var bromleyRaw = mollweideBromleyRaw(1, 4 / pi, pi);

var bromley = function() {
  return d3Geo.geoProjection(bromleyRaw)
      .scale(152.63);
};

// Azimuthal distance.
function distance(dPhi, c1, s1, c2, s2, dLambda) {
  var cosdLambda = cos(dLambda), r;
  if (abs(dPhi) > 1 || abs(dLambda) > 1) {
    r = acos(s1 * s2 + c1 * c2 * cosdLambda);
  } else {
    var sindPhi = sin(dPhi / 2), sindLambda = sin(dLambda / 2);
    r = 2 * asin(sqrt(sindPhi * sindPhi + c1 * c2 * sindLambda * sindLambda));
  }
  return abs(r) > epsilon ? [r, atan2(c2 * sin(dLambda), c1 * s2 - s1 * c2 * cosdLambda)] : [0, 0];
}

// Angle opposite a, and contained between sides of lengths b and c.
function angle(b, c, a) {
  return acos((b * b + c * c - a * a) / (2 * b * c));
}

// Normalize longitude.
function longitude(lambda) {
  return lambda - 2 * pi * floor((lambda + pi) / (2 * pi));
}

function chamberlinRaw(p0, p1, p2) {
  var points = [
    [p0[0], p0[1], sin(p0[1]), cos(p0[1])],
    [p1[0], p1[1], sin(p1[1]), cos(p1[1])],
    [p2[0], p2[1], sin(p2[1]), cos(p2[1])]
  ];

  for (var a = points[2], b, i = 0; i < 3; ++i, a = b) {
    b = points[i];
    a.v = distance(b[1] - a[1], a[3], a[2], b[3], b[2], b[0] - a[0]);
    a.point = [0, 0];
  }

  var beta0 = angle(points[0].v[0], points[2].v[0], points[1].v[0]),
      beta1 = angle(points[0].v[0], points[1].v[0], points[2].v[0]),
      beta2 = pi - beta0;

  points[2].point[1] = 0;
  points[0].point[0] = -(points[1].point[0] = points[0].v[0] / 2);

  var mean = [
    points[2].point[0] = points[0].point[0] + points[2].v[0] * cos(beta0),
    2 * (points[0].point[1] = points[1].point[1] = points[2].v[0] * sin(beta0))
  ];

  function forward(lambda, phi) {
    var sinPhi = sin(phi),
        cosPhi = cos(phi),
        v = new Array(3), i;

    // Compute distance and azimuth from control points.
    for (i = 0; i < 3; ++i) {
      var p = points[i];
      v[i] = distance(phi - p[1], p[3], p[2], cosPhi, sinPhi, lambda - p[0]);
      if (!v[i][0]) return p.point;
      v[i][1] = longitude(v[i][1] - p.v[1]);
    }

    // Arithmetic mean of interception points.
    var point = mean.slice();
    for (i = 0; i < 3; ++i) {
      var j = i == 2 ? 0 : i + 1;
      var a = angle(points[i].v[0], v[i][0], v[j][0]);
      if (v[i][1] < 0) a = -a;

      if (!i) {
        point[0] += v[i][0] * cos(a);
        point[1] -= v[i][0] * sin(a);
      } else if (i == 1) {
        a = beta1 - a;
        point[0] -= v[i][0] * cos(a);
        point[1] -= v[i][0] * sin(a);
      } else {
        a = beta2 - a;
        point[0] += v[i][0] * cos(a);
        point[1] += v[i][0] * sin(a);
      }
    }

    point[0] /= 3, point[1] /= 3;
    return point;
  }

  return forward;
}

function pointRadians(p) {
  return p[0] *= radians, p[1] *= radians, p;
}

function chamberlinAfrica() {
  return chamberlin([0, 22], [45, 22], [22.5, -22])
      .scale(380)
      .center([22.5, 2]);
}

function chamberlin(p0, p1, p2) { // TODO order matters!
  var c = d3Geo.geoCentroid({type: "MultiPoint", coordinates: [p0, p1, p2]}),
      R = [-c[0], -c[1]],
      r = d3Geo.geoRotation(R),
      p = d3Geo.geoProjection(chamberlinRaw(pointRadians(r(p0)), pointRadians(r(p1)), pointRadians(r(p2)))).rotate(R),
      center = p.center;

  delete p.rotate;

  p.center = function(_) {
    return arguments.length ? center(r(_)) : r.invert(center());
  };

  return p
      .clipAngle(90);
}

function collignonRaw(lambda, phi) {
  var alpha = sqrt(1 - sin(phi));
  return [(2 / sqrtPi) * lambda * alpha, sqrtPi * (1 - alpha)];
}

collignonRaw.invert = function(x, y) {
  var lambda = (lambda = y / sqrtPi - 1) * lambda;
  return [lambda > 0 ? x * sqrt(pi / lambda) / 2 : 0, asin(1 - lambda)];
};

var collignon = function() {
  return d3Geo.geoProjection(collignonRaw)
      .scale(95.6464)
      .center([0, 30]);
};

function craigRaw(phi0) {
  var tanPhi0 = tan(phi0);

  function forward(lambda, phi) {
    return [lambda, (lambda ? lambda / sin(lambda) : 1) * (sin(phi) * cos(lambda) - tanPhi0 * cos(phi))];
  }

  forward.invert = tanPhi0 ? function(x, y) {
    if (x) y *= sin(x) / x;
    var cosLambda = cos(x);
    return [x, 2 * atan2(sqrt(cosLambda * cosLambda + tanPhi0 * tanPhi0 - y * y) - cosLambda, tanPhi0 - y)];
  } : function(x, y) {
    return [x, asin(x ? y * tan(x) / x : y)];
  };

  return forward;
}

var craig = function() {
  return parallel1(craigRaw)
      .scale(249.828)
      .clipAngle(90);
};

var sqrt3 = sqrt(3);

function crasterRaw(lambda, phi) {
  return [sqrt3 * lambda * (2 * cos(2 * phi / 3) - 1) / sqrtPi, sqrt3 * sqrtPi * sin(phi / 3)];
}

crasterRaw.invert = function(x, y) {
  var phi = 3 * asin(y / (sqrt3 * sqrtPi));
  return [sqrtPi * x / (sqrt3 * (2 * cos(2 * phi / 3) - 1)), phi];
};

var craster = function() {
  return d3Geo.geoProjection(crasterRaw)
      .scale(156.19);
};

function cylindricalEqualAreaRaw(phi0) {
  var cosPhi0 = cos(phi0);

  function forward(lambda, phi) {
    return [lambda * cosPhi0, sin(phi) / cosPhi0];
  }

  forward.invert = function(x, y) {
    return [x / cosPhi0, asin(y * cosPhi0)];
  };

  return forward;
}

var cylindricalEqualArea = function() {
  return parallel1(cylindricalEqualAreaRaw)
      .parallel(38.58) // acos(sqrt(width / height / pi)) * radians
      .scale(195.044); // width / (sqrt(width / height / pi) * 2 * pi)
};

function cylindricalStereographicRaw(phi0) {
  var cosPhi0 = cos(phi0);

  function forward(lambda, phi) {
    return [lambda * cosPhi0, (1 + cosPhi0) * tan(phi / 2)];
  }

  forward.invert = function(x, y) {
    return [x / cosPhi0, atan(y / (1 + cosPhi0)) * 2];
  };

  return forward;
}

var cylindricalStereographic = function() {
  return parallel1(cylindricalStereographicRaw)
      .scale(124.75);
};

function eckert1Raw(lambda, phi) {
  var alpha = sqrt(8 / (3 * pi));
  return [
    alpha * lambda * (1 - abs(phi) / pi),
    alpha * phi
  ];
}

eckert1Raw.invert = function(x, y) {
  var alpha = sqrt(8 / (3 * pi)),
      phi = y / alpha;
  return [
    x / (alpha * (1 - abs(phi) / pi)),
    phi
  ];
};

var eckert1 = function() {
  return d3Geo.geoProjection(eckert1Raw)
      .scale(165.664);
};

function eckert2Raw(lambda, phi) {
  var alpha = sqrt(4 - 3 * sin(abs(phi)));
  return [
    2 / sqrt(6 * pi) * lambda * alpha,
    sign(phi) * sqrt(2 * pi / 3) * (2 - alpha)
  ];
}

eckert2Raw.invert = function(x, y) {
  var alpha = 2 - abs(y) / sqrt(2 * pi / 3);
  return [
    x * sqrt(6 * pi) / (2 * alpha),
    sign(y) * asin((4 - alpha * alpha) / 3)
  ];
};

var eckert2 = function() {
  return d3Geo.geoProjection(eckert2Raw)
      .scale(165.664);
};

function eckert3Raw(lambda, phi) {
  var k = sqrt(pi * (4 + pi));
  return [
    2 / k * lambda * (1 + sqrt(1 - 4 * phi * phi / (pi * pi))),
    4 / k * phi
  ];
}

eckert3Raw.invert = function(x, y) {
  var k = sqrt(pi * (4 + pi)) / 2;
  return [
    x * k / (1 + sqrt(1 - y * y * (4 + pi) / (4 * pi))),
    y * k / 2
  ];
};

var eckert3 = function() {
  return d3Geo.geoProjection(eckert3Raw)
      .scale(180.739);
};

function eckert4Raw(lambda, phi) {
  var k = (2 + halfPi) * sin(phi);
  phi /= 2;
  for (var i = 0, delta = Infinity; i < 10 && abs(delta) > epsilon; i++) {
    var cosPhi = cos(phi);
    phi -= delta = (phi + sin(phi) * (cosPhi + 2) - k) / (2 * cosPhi * (1 + cosPhi));
  }
  return [
    2 / sqrt(pi * (4 + pi)) * lambda * (1 + cos(phi)),
    2 * sqrt(pi / (4 + pi)) * sin(phi)
  ];
}

eckert4Raw.invert = function(x, y) {
  var A = y * sqrt((4 + pi) / pi) / 2,
      k = asin(A),
      c = cos(k);
  return [
    x / (2 / sqrt(pi * (4 + pi)) * (1 + c)),
    asin((k + A * (c + 2)) / (2 + halfPi))
  ];
};

var eckert4 = function() {
  return d3Geo.geoProjection(eckert4Raw)
      .scale(180.739);
};

function eckert5Raw(lambda, phi) {
  return [
    lambda * (1 + cos(phi)) / sqrt(2 + pi),
    2 * phi / sqrt(2 + pi)
  ];
}

eckert5Raw.invert = function(x, y) {
  var k = sqrt(2 + pi),
      phi = y * k / 2;
  return [
    k * x / (1 + cos(phi)),
    phi
  ];
};

var eckert5 = function() {
  return d3Geo.geoProjection(eckert5Raw)
      .scale(173.044);
};

function eckert6Raw(lambda, phi) {
  var k = (1 + halfPi) * sin(phi);
  for (var i = 0, delta = Infinity; i < 10 && abs(delta) > epsilon; i++) {
    phi -= delta = (phi + sin(phi) - k) / (1 + cos(phi));
  }
  k = sqrt(2 + pi);
  return [
    lambda * (1 + cos(phi)) / k,
    2 * phi / k
  ];
}

eckert6Raw.invert = function(x, y) {
  var j = 1 + halfPi,
      k = sqrt(j / 2);
  return [
    x * 2 * k / (1 + cos(y *= k)),
    asin((y + sin(y)) / j)
  ];
};

var eckert6 = function() {
  return d3Geo.geoProjection(eckert6Raw)
      .scale(173.044);
};

var eisenlohrK = 3 + 2 * sqrt2;

function eisenlohrRaw(lambda, phi) {
  var s0 = sin(lambda /= 2),
      c0 = cos(lambda),
      k = sqrt(cos(phi)),
      c1 = cos(phi /= 2),
      t = sin(phi) / (c1 + sqrt2 * c0 * k),
      c = sqrt(2 / (1 + t * t)),
      v = sqrt((sqrt2 * c1 + (c0 + s0) * k) / (sqrt2 * c1 + (c0 - s0) * k));
  return [
    eisenlohrK * (c * (v - 1 / v) - 2 * log(v)),
    eisenlohrK * (c * t * (v + 1 / v) - 2 * atan(t))
  ];
}

eisenlohrRaw.invert = function(x, y) {
  if (!(p = augustRaw.invert(x / 1.2, y * 1.065))) return null;
  var lambda = p[0], phi = p[1], i = 20, p;
  x /= eisenlohrK, y /= eisenlohrK;
  do {
    var _0 = lambda / 2,
        _1 = phi / 2,
        s0 = sin(_0),
        c0 = cos(_0),
        s1 = sin(_1),
        c1 = cos(_1),
        cos1 = cos(phi),
        k = sqrt(cos1),
        t = s1 / (c1 + sqrt2 * c0 * k),
        t2 = t * t,
        c = sqrt(2 / (1 + t2)),
        v0 = (sqrt2 * c1 + (c0 + s0) * k),
        v1 = (sqrt2 * c1 + (c0 - s0) * k),
        v2 = v0 / v1,
        v = sqrt(v2),
        vm1v = v - 1 / v,
        vp1v = v + 1 / v,
        fx = c * vm1v - 2 * log(v) - x,
        fy = c * t * vp1v - 2 * atan(t) - y,
        deltatDeltaLambda = s1 && sqrt1_2 * k * s0 * t2 / s1,
        deltatDeltaPhi = (sqrt2 * c0 * c1 + k) / (2 * (c1 + sqrt2 * c0 * k) * (c1 + sqrt2 * c0 * k) * k),
        deltacDeltat = -0.5 * t * c * c * c,
        deltacDeltaLambda = deltacDeltat * deltatDeltaLambda,
        deltacDeltaPhi = deltacDeltat * deltatDeltaPhi,
        A = (A = 2 * c1 + sqrt2 * k * (c0 - s0)) * A * v,
        deltavDeltaLambda = (sqrt2 * c0 * c1 * k + cos1) / A,
        deltavDeltaPhi = -(sqrt2 * s0 * s1) / (k * A),
        deltaxDeltaLambda = vm1v * deltacDeltaLambda - 2 * deltavDeltaLambda / v + c * (deltavDeltaLambda + deltavDeltaLambda / v2),
        deltaxDeltaPhi = vm1v * deltacDeltaPhi - 2 * deltavDeltaPhi / v + c * (deltavDeltaPhi + deltavDeltaPhi / v2),
        deltayDeltaLambda = t * vp1v * deltacDeltaLambda - 2 * deltatDeltaLambda / (1 + t2) + c * vp1v * deltatDeltaLambda + c * t * (deltavDeltaLambda - deltavDeltaLambda / v2),
        deltayDeltaPhi = t * vp1v * deltacDeltaPhi - 2 * deltatDeltaPhi / (1 + t2) + c * vp1v * deltatDeltaPhi + c * t * (deltavDeltaPhi - deltavDeltaPhi / v2),
        denominator = deltaxDeltaPhi * deltayDeltaLambda - deltayDeltaPhi * deltaxDeltaLambda;
    if (!denominator) break;
    var deltaLambda = (fy * deltaxDeltaPhi - fx * deltayDeltaPhi) / denominator,
        deltaPhi = (fx * deltayDeltaLambda - fy * deltaxDeltaLambda) / denominator;
    lambda -= deltaLambda;
    phi = max(-halfPi, min(halfPi, phi - deltaPhi));
  } while ((abs(deltaLambda) > epsilon || abs(deltaPhi) > epsilon) && --i > 0);
  return abs(abs(phi) - halfPi) < epsilon ? [0, phi] : i && [lambda, phi];
};

var eisenlohr = function() {
  return d3Geo.geoProjection(eisenlohrRaw)
      .scale(62.5271);
};

var faheyK = cos(35 * radians);

function faheyRaw(lambda, phi) {
  var t = tan(phi / 2);
  return [lambda * faheyK * sqrt(1 - t * t), (1 + faheyK) * t];
}

faheyRaw.invert = function(x, y) {
  var t = y / (1 + faheyK);
  return [x && x / (faheyK * sqrt(1 - t * t)), 2 * atan(t)];
};

var fahey = function() {
  return d3Geo.geoProjection(faheyRaw)
      .scale(137.152);
};

function foucautRaw(lambda, phi) {
  var k = phi / 2, cosk = cos(k);
  return [ 2 * lambda / sqrtPi * cos(phi) * cosk * cosk, sqrtPi * tan(k)];
}

foucautRaw.invert = function(x, y) {
  var k = atan(y / sqrtPi), cosk = cos(k), phi = 2 * k;
  return [x * sqrtPi / 2 / (cos(phi) * cosk * cosk), phi];
};

var foucaut = function() {
  return d3Geo.geoProjection(foucautRaw)
      .scale(135.264);
};

function gilbertForward(point) {
  return [point[0] / 2, asin(tan(point[1] / 2 * radians)) * degrees];
}

function gilbertInvert(point) {
  return [point[0] * 2, 2 * atan(sin(point[1] * radians)) * degrees];
}

var gilbert = function(projectionType) {
  if (projectionType == null) projectionType = d3Geo.geoOrthographic;
  var projection = projectionType(),
      equirectangular = d3Geo.geoEquirectangular().scale(degrees).precision(0).clipAngle(null).translate([0, 0]); // antimeridian cutting

  function gilbert(point) {
    return projection(gilbertForward(point));
  }

  if (projection.invert) gilbert.invert = function(point) {
    return gilbertInvert(projection.invert(point));
  };

  gilbert.stream = function(stream) {
    var s1 = projection.stream(stream), s0 = equirectangular.stream({
      point: function(lambda, phi) { s1.point(lambda / 2, asin(tan(-phi / 2 * radians)) * degrees); },
      lineStart: function() { s1.lineStart(); },
      lineEnd: function() { s1.lineEnd(); },
      polygonStart: function() { s1.polygonStart(); },
      polygonEnd: function() { s1.polygonEnd(); }
    });
    s0.sphere = s1.sphere;
    return s0;
  };

  function property(name) {
    gilbert[name] = function(_) {
      return arguments.length ? (projection[name](_), gilbert) : projection[name]();
    };
  }

  gilbert.rotate = function(_) {
    return arguments.length ? (equirectangular.rotate(_), gilbert) : equirectangular.rotate();
  };

  gilbert.center = function(_) {
    return arguments.length ? (projection.center(gilbertForward(_)), gilbert) : gilbertInvert(projection.center());
  };

  property("clipAngle");
  property("clipExtent");
  property("scale");
  property("translate");
  property("precision");

  return gilbert
      .scale(249.5);
};

function gingeryRaw(rho, n) {
  var k = 2 * pi / n,
      rho2 = rho * rho;

  function forward(lambda, phi) {
    var p = d3Geo.geoAzimuthalEquidistantRaw(lambda, phi),
        x = p[0],
        y = p[1],
        r2 = x * x + y * y;

    if (r2 > rho2) {
      var r = sqrt(r2),
          theta = atan2(y, x),
          theta0 = k * round(theta / k),
          alpha = theta - theta0,
          rhoCosAlpha = rho * cos(alpha),
          k_ = (rho * sin(alpha) - alpha * sin(rhoCosAlpha)) / (halfPi - rhoCosAlpha),
          s_ = gingeryLength(alpha, k_),
          e = (pi - rho) / gingeryIntegrate(s_, rhoCosAlpha, pi);

      x = r;
      var i = 50, delta;
      do {
        x -= delta = (rho + gingeryIntegrate(s_, rhoCosAlpha, x) * e - r) / (s_(x) * e);
      } while (abs(delta) > epsilon && --i > 0);

      y = alpha * sin(x);
      if (x < halfPi) y -= k_ * (x - halfPi);

      var s = sin(theta0),
          c = cos(theta0);
      p[0] = x * c - y * s;
      p[1] = x * s + y * c;
    }
    return p;
  }

  forward.invert = function(x, y) {
    var r2 = x * x + y * y;
    if (r2 > rho2) {
      var r = sqrt(r2),
          theta = atan2(y, x),
          theta0 = k * round(theta / k),
          dTheta = theta - theta0;

      x = r * cos(dTheta);
      y = r * sin(dTheta);

      var x_halfPi = x - halfPi,
          sinx = sin(x),
          alpha = y / sinx,
          delta = x < halfPi ? Infinity : 0,
          i = 10;

      while (true) {
        var rhosinAlpha = rho * sin(alpha),
            rhoCosAlpha = rho * cos(alpha),
            sinRhoCosAlpha = sin(rhoCosAlpha),
            halfPi_RhoCosAlpha = halfPi - rhoCosAlpha,
            k_ = (rhosinAlpha - alpha * sinRhoCosAlpha) / halfPi_RhoCosAlpha,
            s_ = gingeryLength(alpha, k_);

        if (abs(delta) < epsilon2 || !--i) break;

        alpha -= delta = (alpha * sinx - k_ * x_halfPi - y) / (
          sinx - x_halfPi * 2 * (
            halfPi_RhoCosAlpha * (rhoCosAlpha + alpha * rhosinAlpha * cos(rhoCosAlpha) - sinRhoCosAlpha) -
            rhosinAlpha * (rhosinAlpha - alpha * sinRhoCosAlpha)
          ) / (halfPi_RhoCosAlpha * halfPi_RhoCosAlpha));
      }
      r = rho + gingeryIntegrate(s_, rhoCosAlpha, x) * (pi - rho) / gingeryIntegrate(s_, rhoCosAlpha, pi);
      theta = theta0 + alpha;
      x = r * cos(theta);
      y = r * sin(theta);
    }
    return d3Geo.geoAzimuthalEquidistantRaw.invert(x, y);
  };

  return forward;
}

function gingeryLength(alpha, k) {
  return function(x) {
    var y_ = alpha * cos(x);
    if (x < halfPi) y_ -= k;
    return sqrt(1 + y_ * y_);
  };
}

// Numerical integration: trapezoidal rule.
function gingeryIntegrate(f, a, b) {
  var n = 50,
      h = (b - a) / n,
      s = f(a) + f(b);
  for (var i = 1, x = a; i < n; ++i) s += 2 * f(x += h);
  return s * 0.5 * h;
}

var gingery = function() {
  var n = 6,
      rho = 30 * radians,
      cRho = cos(rho),
      sRho = sin(rho),
      m = d3Geo.geoProjectionMutator(gingeryRaw),
      p = m(rho, n),
      stream_ = p.stream,
      epsilon$$1 = 1e-2,
      cr = -cos(epsilon$$1 * radians),
      sr = sin(epsilon$$1 * radians);

  p.radius = function(_) {
    if (!arguments.length) return rho * degrees;
    cRho = cos(rho = _ * radians);
    sRho = sin(rho);
    return m(rho, n);
  };

  p.lobes = function(_) {
    if (!arguments.length) return n;
    return m(rho, n = +_);
  };

  p.stream = function(stream) {
    var rotate = p.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (p.rotate([0, 0]), stream_(stream));
    p.rotate(rotate);
    rotateStream.sphere = function() {
      sphereStream.polygonStart(), sphereStream.lineStart();
      for (var i = 0, delta = 2 * pi / n, phi = 0; i < n; ++i, phi -= delta) {
        sphereStream.point(atan2(sr * cos(phi), cr) * degrees, asin(sr * sin(phi)) * degrees);
        sphereStream.point(atan2(sRho * cos(phi - delta / 2), cRho) * degrees, asin(sRho * sin(phi - delta / 2)) * degrees);
      }
      sphereStream.lineEnd(), sphereStream.polygonEnd();
    };
    return rotateStream;
  };

  return p
      .rotate([90, -40])
      .scale(91.7095)
      .clipAngle(180 - 1e-3);
};

var ginzburgPolyconicRaw = function(a, b, c, d, e, f, g, h) {
  if (arguments.length < 8) h = 0;

  function forward(lambda, phi) {
    if (!phi) return [a * lambda / pi, 0];
    var phi2 = phi * phi,
        xB = a + phi2 * (b + phi2 * (c + phi2 * d)),
        yB = phi * (e - 1 + phi2 * (f - h + phi2 * g)),
        m = (xB * xB + yB * yB) / (2 * yB),
        alpha = lambda * asin(xB / m) / pi;
    return [m * sin(alpha), phi * (1 + phi2 * h) + m * (1 - cos(alpha))];
  }

  forward.invert = function(x, y) {
    var lambda = pi * x / a,
        phi = y,
        deltaLambda, deltaPhi, i = 50;
    do {
      var phi2 = phi * phi,
          xB = a + phi2 * (b + phi2 * (c + phi2 * d)),
          yB = phi * (e - 1 + phi2 * (f - h + phi2 * g)),
          p = xB * xB + yB * yB,
          q = 2 * yB,
          m = p / q,
          m2 = m * m,
          dAlphadLambda = asin(xB / m) / pi,
          alpha = lambda * dAlphadLambda,
          xB2 = xB * xB,
          dxBdPhi = (2 * b + phi2 * (4 * c + phi2 * 6 * d)) * phi,
          dyBdPhi = e + phi2 * (3 * f + phi2 * 5 * g),
          dpdPhi = 2 * (xB * dxBdPhi + yB * (dyBdPhi - 1)),
          dqdPhi = 2 * (dyBdPhi - 1),
          dmdPhi = (dpdPhi * q - p * dqdPhi) / (q * q),
          cosAlpha = cos(alpha),
          sinAlpha = sin(alpha),
          mcosAlpha = m * cosAlpha,
          msinAlpha = m * sinAlpha,
          dAlphadPhi = ((lambda / pi) * (1 / sqrt(1 - xB2 / m2)) * (dxBdPhi * m - xB * dmdPhi)) / m2,
          fx = msinAlpha - x,
          fy = phi * (1 + phi2 * h) + m - mcosAlpha - y,
          deltaxDeltaPhi = dmdPhi * sinAlpha + mcosAlpha * dAlphadPhi,
          deltaxDeltaLambda = mcosAlpha * dAlphadLambda,
          deltayDeltaPhi = 1 + dmdPhi - (dmdPhi * cosAlpha - msinAlpha * dAlphadPhi),
          deltayDeltaLambda = msinAlpha * dAlphadLambda,
          denominator = deltaxDeltaPhi * deltayDeltaLambda - deltayDeltaPhi * deltaxDeltaLambda;
      if (!denominator) break;
      lambda -= deltaLambda = (fy * deltaxDeltaPhi - fx * deltayDeltaPhi) / denominator;
      phi -= deltaPhi = (fx * deltayDeltaLambda - fy * deltaxDeltaLambda) / denominator;
    } while ((abs(deltaLambda) > epsilon || abs(deltaPhi) > epsilon) && --i > 0);
    return [lambda, phi];
  };

  return forward;
};

var ginzburg4Raw = ginzburgPolyconicRaw(2.8284, -1.6988, 0.75432, -0.18071, 1.76003, -0.38914, 0.042555);

var ginzburg4 = function() {
  return d3Geo.geoProjection(ginzburg4Raw)
      .scale(149.995);
};

var ginzburg5Raw = ginzburgPolyconicRaw(2.583819, -0.835827, 0.170354, -0.038094, 1.543313, -0.411435,0.082742);

var ginzburg5 = function() {
  return d3Geo.geoProjection(ginzburg5Raw)
      .scale(153.93);
};

var ginzburg6Raw = ginzburgPolyconicRaw(5 / 6 * pi, -0.62636, -0.0344, 0, 1.3493, -0.05524, 0, 0.045);

var ginzburg6 = function() {
  return d3Geo.geoProjection(ginzburg6Raw)
      .scale(130.945);
};

function ginzburg8Raw(lambda, phi) {
  var lambda2 = lambda * lambda,
      phi2 = phi * phi;
  return [
    lambda * (1 - 0.162388 * phi2) * (0.87 - 0.000952426 * lambda2 * lambda2),
    phi * (1 + phi2 / 12)
  ];
}

ginzburg8Raw.invert = function(x, y) {
  var lambda = x,
      phi = y,
      i = 50, delta;
  do {
    var phi2 = phi * phi;
    phi -= delta = (phi * (1 + phi2 / 12) - y) / (1 + phi2 / 4);
  } while (abs(delta) > epsilon && --i > 0);
  i = 50;
  x /= 1 -0.162388 * phi2;
  do {
    var lambda4 = (lambda4 = lambda * lambda) * lambda4;
    lambda -= delta = (lambda * (0.87 - 0.000952426 * lambda4) - x) / (0.87 - 0.00476213 * lambda4);
  } while (abs(delta) > epsilon && --i > 0);
  return [lambda, phi];
};

var ginzburg8 = function() {
  return d3Geo.geoProjection(ginzburg8Raw)
      .scale(131.747);
};

var ginzburg9Raw = ginzburgPolyconicRaw(2.6516, -0.76534, 0.19123, -0.047094, 1.36289, -0.13965,0.031762);

var ginzburg9 = function() {
  return d3Geo.geoProjection(ginzburg9Raw)
      .scale(131.087);
};

var squareRaw = function(project) {
  var dx = project(halfPi, 0)[0] - project(-halfPi, 0)[0];

  function projectSquare(lambda, phi) {
    var s = lambda > 0 ? -0.5 : 0.5,
        point = project(lambda + s * pi, phi);
    point[0] -= s * dx;
    return point;
  }

  if (project.invert) projectSquare.invert = function(x, y) {
    var s = x > 0 ? -0.5 : 0.5,
        location = project.invert(x + s * dx, y),
        lambda = location[0] - s * pi;
    if (lambda < -pi) lambda += 2 * pi;
    else if (lambda > pi) lambda -= 2 * pi;
    location[0] = lambda;
    return location;
  };

  return projectSquare;
};

function gringortenRaw(lambda, phi) {
  var sLambda = sign(lambda),
      sPhi = sign(phi),
      cosPhi = cos(phi),
      x = cos(lambda) * cosPhi,
      y = sin(lambda) * cosPhi,
      z = sin(sPhi * phi);
  lambda = abs(atan2(y, z));
  phi = asin(x);
  if (abs(lambda - halfPi) > epsilon) lambda %= halfPi;
  var point = gringortenHexadecant(lambda > pi / 4 ? halfPi - lambda : lambda, phi);
  if (lambda > pi / 4) z = point[0], point[0] = -point[1], point[1] = -z;
  return (point[0] *= sLambda, point[1] *= -sPhi, point);
}

gringortenRaw.invert = function(x, y) {
  if (abs(x) > 1) x = sign(x) * 2 - x;
  if (abs(y) > 1) y = sign(y) * 2 - y;
  var sx = sign(x),
      sy = sign(y),
      x0 = -sx * x,
      y0 = -sy * y,
      t = y0 / x0 < 1,
      p = gringortenHexadecantInvert(t ? y0 : x0, t ? x0 : y0),
      lambda = p[0],
      phi = p[1],
      cosPhi = cos(phi);
  if (t) lambda = -halfPi - lambda;
  return [sx * (atan2(sin(lambda) * cosPhi, -sin(phi)) + pi), sy * asin(cos(lambda) * cosPhi)];
};

function gringortenHexadecant(lambda, phi) {
  if (phi === halfPi) return [0, 0];

  var sinPhi = sin(phi),
      r = sinPhi * sinPhi,
      r2 = r * r,
      j = 1 + r2,
      k = 1 + 3 * r2,
      q = 1 - r2,
      z = asin(1 / sqrt(j)),
      v = q + r * j * z,
      p2 = (1 - sinPhi) / v,
      p = sqrt(p2),
      a2 = p2 * j,
      a = sqrt(a2),
      h = p * q,
      x,
      i;

  if (lambda === 0) return [0, -(h + r * a)];

  var cosPhi = cos(phi),
      secPhi = 1 / cosPhi,
      drdPhi = 2 * sinPhi * cosPhi,
      dvdPhi = (-3 * r + z * k) * drdPhi,
      dp2dPhi = (-v * cosPhi - (1 - sinPhi) * dvdPhi) / (v * v),
      dpdPhi = (0.5 * dp2dPhi) / p,
      dhdPhi = q * dpdPhi - 2 * r * p * drdPhi,
      dra2dPhi = r * j * dp2dPhi + p2 * k * drdPhi,
      mu = -secPhi * drdPhi,
      nu = -secPhi * dra2dPhi,
      zeta = -2 * secPhi * dhdPhi,
      lambda1 = 4 * lambda / pi,
      delta;

  // Slower but accurate bisection method.
  if (lambda > 0.222 * pi || phi < pi / 4 && lambda > 0.175 * pi) {
    x = (h + r * sqrt(a2 * (1 + r2) - h * h)) / (1 + r2);
    if (lambda > pi / 4) return [x, x];
    var x1 = x, x0 = 0.5 * x;
    x = 0.5 * (x0 + x1), i = 50;
    do {
      var g = sqrt(a2 - x * x),
          f = (x * (zeta + mu * g) + nu * asin(x / a)) - lambda1;
      if (!f) break;
      if (f < 0) x0 = x;
      else x1 = x;
      x = 0.5 * (x0 + x1);
    } while (abs(x1 - x0) > epsilon && --i > 0);
  }

  // Newton-Raphson.
  else {
    x = epsilon, i = 25;
    do {
      var x2 = x * x,
          g2 = sqrt(a2 - x2),
          zetaMug = zeta + mu * g2,
          f2 = x * zetaMug + nu * asin(x / a) - lambda1,
          df = zetaMug + (nu - mu * x2) / g2;
      x -= delta = g2 ? f2 / df : 0;
    } while (abs(delta) > epsilon && --i > 0);
  }

  return [x, -h - r * sqrt(a2 - x * x)];
}

function gringortenHexadecantInvert(x, y) {
  var x0 = 0,
      x1 = 1,
      r = 0.5,
      i = 50;

  while (true) {
    var r2 = r * r,
        sinPhi = sqrt(r),
        z = asin(1 / sqrt(1 + r2)),
        v = (1 - r2) + r * (1 + r2) * z,
        p2 = (1 - sinPhi) / v,
        p = sqrt(p2),
        a2 = p2 * (1 + r2),
        h = p * (1 - r2),
        g2 = a2 - x * x,
        g = sqrt(g2),
        y0 = y + h + r * g;
    if (abs(x1 - x0) < epsilon2 || --i === 0 || y0 === 0) break;
    if (y0 > 0) x0 = r;
    else x1 = r;
    r = 0.5 * (x0 + x1);
  }

  if (!i) return null;

  var phi = asin(sinPhi),
      cosPhi = cos(phi),
      secPhi = 1 / cosPhi,
      drdPhi = 2 * sinPhi * cosPhi,
      dvdPhi = (-3 * r + z * (1 + 3 * r2)) * drdPhi,
      dp2dPhi = (-v * cosPhi - (1 - sinPhi) * dvdPhi) / (v * v),
      dpdPhi = 0.5 * dp2dPhi / p,
      dhdPhi = (1 - r2) * dpdPhi - 2 * r * p * drdPhi,
      zeta = -2 * secPhi * dhdPhi,
      mu = -secPhi * drdPhi,
      nu = -secPhi * (r * (1 + r2) * dp2dPhi + p2 * (1 + 3 * r2) * drdPhi);

  return [pi / 4 * (x * (zeta + mu * g) + nu * asin(x / sqrt(a2))), phi];
}

var gringorten = function() {
  return d3Geo.geoProjection(squareRaw(gringortenRaw))
      .scale(239.75);
};

// Returns [sn, cn, dn](u + iv|m).
function ellipticJi(u, v, m) {
  var a, b, c;
  if (!u) {
    b = ellipticJ(v, 1 - m);
    return [
      [0, b[0] / b[1]],
      [1 / b[1], 0],
      [b[2] / b[1], 0]
    ];
  }
  a = ellipticJ(u, m);
  if (!v) return [[a[0], 0], [a[1], 0], [a[2], 0]];
  b = ellipticJ(v, 1 - m);
  c = b[1] * b[1] + m * a[0] * a[0] * b[0] * b[0];
  return [
    [a[0] * b[2] / c, a[1] * a[2] * b[0] * b[1] / c],
    [a[1] * b[1] / c, -a[0] * a[2] * b[0] * b[2] / c],
    [a[2] * b[1] * b[2] / c, -m * a[0] * a[1] * b[0] / c]
  ];
}

// Returns [sn, cn, dn, ph](u|m).
function ellipticJ(u, m) {
  var ai, b, phi, t, twon;
  if (m < epsilon) {
    t = sin(u);
    b = cos(u);
    ai = m * (u - t * b) / 4;
    return [
      t - ai * b,
      b + ai * t,
      1 - m * t * t / 2,
      u - ai
    ];
  }
  if (m >= 1 - epsilon) {
    ai = (1 - m) / 4;
    b = cosh(u);
    t = tanh(u);
    phi = 1 / b;
    twon = b * sinh(u);
    return [
      t + ai * (twon - u) / (b * b),
      phi - ai * t * phi * (twon - u),
      phi + ai * t * phi * (twon + u),
      2 * atan(exp(u)) - halfPi + ai * (twon - u) / b
    ];
  }

  var a = [1, 0, 0, 0, 0, 0, 0, 0, 0],
      c = [sqrt(m), 0, 0, 0, 0, 0, 0, 0, 0],
      i = 0;
  b = sqrt(1 - m);
  twon = 1;

  while (abs(c[i] / a[i]) > epsilon && i < 8) {
    ai = a[i++];
    c[i] = (ai - b) / 2;
    a[i] = (ai + b) / 2;
    b = sqrt(ai * b);
    twon *= 2;
  }

  phi = twon * a[i] * u;
  do {
    t = c[i] * sin(b = phi) / a[i];
    phi = (asin(t) + phi) / 2;
  } while (--i);

  return [sin(phi), t = cos(phi), t / cos(phi - b), phi];
}

// Calculate F(phi+iPsi|m).
// See Abramowitz and Stegun, 17.4.11.
function ellipticFi(phi, psi, m) {
  var r = abs(phi),
      i = abs(psi),
      sinhPsi = sinh(i);
  if (r) {
    var cscPhi = 1 / sin(r),
        cotPhi2 = 1 / (tan(r) * tan(r)),
        b = -(cotPhi2 + m * (sinhPsi * sinhPsi * cscPhi * cscPhi) - 1 + m),
        c = (m - 1) * cotPhi2,
        cotLambda2 = (-b + sqrt(b * b - 4 * c)) / 2;
    return [
      ellipticF(atan(1 / sqrt(cotLambda2)), m) * sign(phi),
      ellipticF(atan(sqrt((cotLambda2 / cotPhi2 - 1) / m)), 1 - m) * sign(psi)
    ];
  }
  return [
    0,
    ellipticF(atan(sinhPsi), 1 - m) * sign(psi)
  ];
}

// Calculate F(phi|m) where m = k² = sin²α.
// See Abramowitz and Stegun, 17.6.7.
function ellipticF(phi, m) {
  if (!m) return phi;
  if (m === 1) return log(tan(phi / 2 + quarterPi));
  var a = 1,
      b = sqrt(1 - m),
      c = sqrt(m);
  for (var i = 0; abs(c) > epsilon; i++) {
    if (phi % pi) {
      var dPhi = atan(b * tan(phi) / a);
      if (dPhi < 0) dPhi += pi;
      phi += dPhi + ~~(phi / pi) * pi;
    } else phi += phi;
    c = (a + b) / 2;
    b = sqrt(a * b);
    c = ((a = c) - b) / 2;
  }
  return phi / (pow(2, i) * a);
}

function guyouRaw(lambda, phi) {
  var k_ = (sqrt2 - 1) / (sqrt2 + 1),
      k = sqrt(1 - k_ * k_),
      K = ellipticF(halfPi, k * k),
      f = -1,
      psi = log(tan(pi / 4 + abs(phi) / 2)),
      r = exp(f * psi) / sqrt(k_),
      at = guyouComplexAtan(r * cos(f * lambda), r * sin(f * lambda)),
      t = ellipticFi(at[0], at[1], k * k);
  return [-t[1], (phi >= 0 ? 1 : -1) * (0.5 * K - t[0])];
}

function guyouComplexAtan(x, y) {
  var x2 = x * x,
      y_1 = y + 1,
      t = 1 - x2 - y * y;
  return [
   0.5 * ((x >= 0 ? halfPi : -halfPi) - atan2(t, 2 * x)),
    -0.25 * log(t * t + 4 * x2) +0.5 * log(y_1 * y_1 + x2)
  ];
}

function guyouComplexDivide(a, b) {
  var denominator = b[0] * b[0] + b[1] * b[1];
  return [
    (a[0] * b[0] + a[1] * b[1]) / denominator,
    (a[1] * b[0] - a[0] * b[1]) / denominator
  ];
}

guyouRaw.invert = function(x, y) {
  var k_ = (sqrt2 - 1) / (sqrt2 + 1),
      k = sqrt(1 - k_ * k_),
      K = ellipticF(halfPi, k * k),
      f = -1,
      j = ellipticJi(0.5 * K - y, -x, k * k),
      tn = guyouComplexDivide(j[0], j[1]),
      lambda = atan2(tn[1], tn[0]) / f;
  return [
    lambda,
    2 * atan(exp(0.5 / f * log(k_ * tn[0] * tn[0] + k_ * tn[1] * tn[1]))) - halfPi
  ];
};

var guyou = function() {
  return d3Geo.geoProjection(squareRaw(guyouRaw))
      .scale(151.496);
};

function hammerRaw(A, B) {
  if (arguments.length < 2) B = A;
  if (B === 1) return d3Geo.geoAzimuthalEqualAreaRaw;
  if (B === Infinity) return hammerQuarticAuthalicRaw;

  function forward(lambda, phi) {
    var coordinates = d3Geo.geoAzimuthalEqualAreaRaw(lambda / B, phi);
    coordinates[0] *= A;
    return coordinates;
  }

  forward.invert = function(x, y) {
    var coordinates = d3Geo.geoAzimuthalEqualAreaRaw.invert(x / A, y);
    coordinates[0] *= B;
    return coordinates;
  };

  return forward;
}

function hammerQuarticAuthalicRaw(lambda, phi) {
  return [
    lambda * cos(phi) / cos(phi /= 2),
    2 * sin(phi)
  ];
}

hammerQuarticAuthalicRaw.invert = function(x, y) {
  var phi = 2 * asin(y / 2);
  return [
    x * cos(phi / 2) / cos(phi),
    phi
  ];
};

var hammer = function() {
  var B = 2,
      m = d3Geo.geoProjectionMutator(hammerRaw),
      p = m(B);

  p.coefficient = function(_) {
    if (!arguments.length) return B;
    return m(B = +_);
  };

  return p
    .scale(169.529);
};

function hammerRetroazimuthalRaw(phi0) {
  var sinPhi0 = sin(phi0),
      cosPhi0 = cos(phi0),
      rotate = hammerRetroazimuthalRotation(phi0);

  rotate.invert = hammerRetroazimuthalRotation(-phi0);

  function forward(lambda, phi) {
    var p = rotate(lambda, phi);
    lambda = p[0], phi = p[1];
    var sinPhi = sin(phi),
        cosPhi = cos(phi),
        cosLambda = cos(lambda),
        z = acos(sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosLambda),
        sinz = sin(z),
        K = abs(sinz) > epsilon ? z / sinz : 1;
    return [
      K * cosPhi0 * sin(lambda),
      (abs(lambda) > halfPi ? K : -K) // rotate for back hemisphere
        * (sinPhi0 * cosPhi - cosPhi0 * sinPhi * cosLambda)
    ];
  }

  forward.invert = function(x, y) {
    var rho = sqrt(x * x + y * y),
        sinz = -sin(rho),
        cosz = cos(rho),
        a = rho * cosz,
        b = -y * sinz,
        c = rho * sinPhi0,
        d = sqrt(a * a + b * b - c * c),
        phi = atan2(a * c + b * d, b * c - a * d),
        lambda = (rho > halfPi ? -1 : 1) * atan2(x * sinz, rho * cos(phi) * cosz + y * sin(phi) * sinz);
    return rotate.invert(lambda, phi);
  };

  return forward;
}

// Latitudinal rotation by phi0.
// Temporary hack until D3 supports arbitrary small-circle clipping origins.
function hammerRetroazimuthalRotation(phi0) {
  var sinPhi0 = sin(phi0),
      cosPhi0 = cos(phi0);

  return function(lambda, phi) {
    var cosPhi = cos(phi),
        x = cos(lambda) * cosPhi,
        y = sin(lambda) * cosPhi,
        z = sin(phi);
    return [
      atan2(y, x * cosPhi0 - z * sinPhi0),
      asin(z * cosPhi0 + x * sinPhi0)
    ];
  };
}

var hammerRetroazimuthal = function() {
  var phi0 = 0,
      m = d3Geo.geoProjectionMutator(hammerRetroazimuthalRaw),
      p = m(phi0),
      rotate_ = p.rotate,
      stream_ = p.stream,
      circle = d3Geo.geoCircle();

  p.parallel = function(_) {
    if (!arguments.length) return phi0 * degrees;
    var r = p.rotate();
    return m(phi0 = _ * radians).rotate(r);
  };

  // Temporary hack; see hammerRetroazimuthalRotation.
  p.rotate = function(_) {
    if (!arguments.length) return (_ = rotate_.call(p), _[1] += phi0 * degrees, _);
    rotate_.call(p, [_[0], _[1] - phi0 * degrees]);
    circle.center([-_[0], -_[1]]);
    return p;
  };

  p.stream = function(stream) {
    stream = stream_(stream);
    stream.sphere = function() {
      stream.polygonStart();
      var epsilon$$1 = 1e-2,
          ring = circle.radius(90 - epsilon$$1)().coordinates[0],
          n = ring.length - 1,
          i = -1,
          p;
      stream.lineStart();
      while (++i < n) stream.point((p = ring[i])[0], p[1]);
      stream.lineEnd();
      ring = circle.radius(90 + epsilon$$1)().coordinates[0];
      n = ring.length - 1;
      stream.lineStart();
      while (--i >= 0) stream.point((p = ring[i])[0], p[1]);
      stream.lineEnd();
      stream.polygonEnd();
    };
    return stream;
  };

  return p
      .scale(79.4187)
      .parallel(45)
      .clipAngle(180 - 1e-3);
};

var healpixParallel = 41 + 48 / 36 + 37 / 3600;
var healpixLambert = cylindricalEqualAreaRaw(0);

function healpixRaw(H) {
  var phi0 = healpixParallel * radians,
      dx = collignonRaw(pi, phi0)[0] - collignonRaw(-pi, phi0)[0],
      y0 = healpixLambert(0, phi0)[1],
      y1 = collignonRaw(0, phi0)[1],
      dy1 = sqrtPi - y1,
      k = tau / H,
      w = 4 / tau,
      h = y0 + (dy1 * dy1 * 4) / tau;

  function forward(lambda, phi) {
    var point,
        phi2 = abs(phi);
    if (phi2 > phi0) {
      var i = min(H - 1, max(0, floor((lambda + pi) / k)));
      lambda += pi * (H - 1) / H - i * k;
      point = collignonRaw(lambda, phi2);
      point[0] = point[0] * tau / dx - tau * (H - 1) / (2 * H) + i * tau / H;
      point[1] = y0 + (point[1] - y1) * 4 * dy1 / tau;
      if (phi < 0) point[1] = -point[1];
    } else {
      point = healpixLambert(lambda, phi);
    }
    point[0] *= w, point[1] /= h;
    return point;
  }

  forward.invert = function(x, y) {
    x /= w, y *= h;
    var y2 = abs(y);
    if (y2 > y0) {
      var i = min(H - 1, max(0, floor((x + pi) / k)));
      x = (x + pi * (H - 1) / H - i * k) * dx / tau;
      var point = collignonRaw.invert(x, 0.25 * (y2 - y0) * tau / dy1 + y1);
      point[0] -= pi * (H - 1) / H - i * k;
      if (y < 0) point[1] = -point[1];
      return point;
    }
    return healpixLambert.invert(x, y);
  };

  return forward;
}

function sphere(step) {
  return {
    type: "Polygon",
    coordinates: [
      d3Array.range(-180, 180 + step / 2, step).map(function(x, i) { return [x, i & 1 ? 90 - 1e-6 : healpixParallel]; })
      .concat(d3Array.range(180, -180 - step / 2, -step).map(function(x, i) { return [x, i & 1 ? -90 + 1e-6 : -healpixParallel]; }))
    ]
  };
}

var healpix = function() {
  var H = 4,
      m = d3Geo.geoProjectionMutator(healpixRaw),
      p = m(H),
      stream_ = p.stream;

  p.lobes = function(_) {
    return arguments.length ? m(H = +_) : H;
  };

  p.stream = function(stream) {
    var rotate = p.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (p.rotate([0, 0]), stream_(stream));
    p.rotate(rotate);
    rotateStream.sphere = function() { d3Geo.geoStream(sphere(180 / H), sphereStream); };
    return rotateStream;
  };

  return p
      .scale(239.75);
};

function hillRaw(K) {
  var L = 1 + K,
      sinBt = sin(1 / L),
      Bt = asin(sinBt),
      A = 2 * sqrt(pi / (B = pi + 4 * Bt * L)),
      B,
      rho0 = 0.5 * A * (L + sqrt(K * (2 + K))),
      K2 = K * K,
      L2 = L * L;

  function forward(lambda, phi) {
    var t = 1 - sin(phi),
        rho,
        omega;
    if (t && t < 2) {
      var theta = halfPi - phi, i = 25, delta;
      do {
        var sinTheta = sin(theta),
            cosTheta = cos(theta),
            Bt_Bt1 = Bt + atan2(sinTheta, L - cosTheta),
            C = 1 + L2 - 2 * L * cosTheta;
        theta -= delta = (theta - K2 * Bt - L * sinTheta + C * Bt_Bt1 -0.5 * t * B) / (2 * L * sinTheta * Bt_Bt1);
      } while (abs(delta) > epsilon2 && --i > 0);
      rho = A * sqrt(C);
      omega = lambda * Bt_Bt1 / pi;
    } else {
      rho = A * (K + t);
      omega = lambda * Bt / pi;
    }
    return [
      rho * sin(omega),
      rho0 - rho * cos(omega)
    ];
  }

  forward.invert = function(x, y) {
    var rho2 = x * x + (y -= rho0) * y,
        cosTheta = (1 + L2 - rho2 / (A * A)) / (2 * L),
        theta = acos(cosTheta),
        sinTheta = sin(theta),
        Bt_Bt1 = Bt + atan2(sinTheta, L - cosTheta);
    return [
      asin(x / sqrt(rho2)) * pi / Bt_Bt1,
      asin(1 - 2 * (theta - K2 * Bt - L * sinTheta + (1 + L2 - 2 * L * cosTheta) * Bt_Bt1) / B)
    ];
  };

  return forward;
}

var hill = function() {
  var K = 1,
      m = d3Geo.geoProjectionMutator(hillRaw),
      p = m(K);

  p.ratio = function(_) {
    return arguments.length ? m(K = +_) : K;
  };

  return p
      .scale(167.774)
      .center([0, 18.67]);
};

var sinuMollweidePhi = 0.7109889596207567;

var sinuMollweideY = 0.0528035274542;

function sinuMollweideRaw(lambda, phi) {
  return phi > -sinuMollweidePhi
      ? (lambda = mollweideRaw(lambda, phi), lambda[1] += sinuMollweideY, lambda)
      : sinusoidalRaw(lambda, phi);
}

sinuMollweideRaw.invert = function(x, y) {
  return y > -sinuMollweidePhi
      ? mollweideRaw.invert(x, y - sinuMollweideY)
      : sinusoidalRaw.invert(x, y);
};

var sinuMollweide = function() {
  return d3Geo.geoProjection(sinuMollweideRaw)
      .rotate([-20, -55])
      .scale(164.263)
      .center([0, -5.4036]);
};

function homolosineRaw(lambda, phi) {
  return abs(phi) > sinuMollweidePhi
      ? (lambda = mollweideRaw(lambda, phi), lambda[1] -= phi > 0 ? sinuMollweideY : -sinuMollweideY, lambda)
      : sinusoidalRaw(lambda, phi);
}

homolosineRaw.invert = function(x, y) {
  return abs(y) > sinuMollweidePhi
      ? mollweideRaw.invert(x, y + (y > 0 ? sinuMollweideY : -sinuMollweideY))
      : sinusoidalRaw.invert(x, y);
};

var homolosine = function() {
  return d3Geo.geoProjection(homolosineRaw)
      .scale(152.63);
};

function pointEqual(a, b) {
  return abs(a[0] - b[0]) < epsilon && abs(a[1] - b[1]) < epsilon;
}

function interpolateLine(coordinates, m) {
  var i = -1,
      n = coordinates.length,
      p0 = coordinates[0],
      p1,
      dx,
      dy,
      resampled = [];
  while (++i < n) {
    p1 = coordinates[i];
    dx = (p1[0] - p0[0]) / m;
    dy = (p1[1] - p0[1]) / m;
    for (var j = 0; j < m; ++j) resampled.push([p0[0] + j * dx, p0[1] + j * dy]);
    p0 = p1;
  }
  resampled.push(p1);
  return resampled;
}

function interpolateSphere(lobes) {
  var coordinates = [],
      lobe,
      lambda0, phi0, phi1,
      lambda2, phi2,
      i, n = lobes[0].length;

  // Northern Hemisphere
  for (i = 0; i < n; ++i) {
    lobe = lobes[0][i];
    lambda0 = lobe[0][0], phi0 = lobe[0][1], phi1 = lobe[1][1];
    lambda2 = lobe[2][0], phi2 = lobe[2][1];
    coordinates.push(interpolateLine([
      [lambda0 + epsilon, phi0 + epsilon],
      [lambda0 + epsilon, phi1 - epsilon],
      [lambda2 - epsilon, phi1 - epsilon],
      [lambda2 - epsilon, phi2 + epsilon]
    ], 30));
  }

  // Southern Hemisphere
  for (i = lobes[1].length - 1; i >= 0; --i) {
    lobe = lobes[1][i];
    lambda0 = lobe[0][0], phi0 = lobe[0][1], phi1 = lobe[1][1];
    lambda2 = lobe[2][0], phi2 = lobe[2][1];
    coordinates.push(interpolateLine([
      [lambda2 - epsilon, phi2 - epsilon],
      [lambda2 - epsilon, phi1 + epsilon],
      [lambda0 + epsilon, phi1 + epsilon],
      [lambda0 + epsilon, phi0 - epsilon]
    ], 30));
  }

  return {
    type: "Polygon",
    coordinates: [d3Array.merge(coordinates)]
  };
}

var interrupt = function(project, lobes) {
  var sphere = interpolateSphere(lobes);

  lobes = lobes.map(function(lobe) {
    return lobe.map(function(l) {
      return [
        [l[0][0] * radians, l[0][1] * radians],
        [l[1][0] * radians, l[1][1] * radians],
        [l[2][0] * radians, l[2][1] * radians]
      ];
    });
  });

  var bounds = lobes.map(function(lobe) {
    return lobe.map(function(l) {
      var x0 = project(l[0][0], l[0][1])[0],
          x1 = project(l[2][0], l[2][1])[0],
          y0 = project(l[1][0], l[0][1])[1],
          y1 = project(l[1][0], l[1][1])[1],
          t;
      if (y0 > y1) t = y0, y0 = y1, y1 = t;
      return [[x0, y0], [x1, y1]];
    });
  });

  function forward(lambda, phi) {
    var sign$$1 = phi < 0 ? -1 : +1, lobe = lobes[+(phi < 0)];
    for (var i = 0, n = lobe.length - 1; i < n && lambda > lobe[i][2][0]; ++i);
    var p = project(lambda - lobe[i][1][0], phi);
    p[0] += project(lobe[i][1][0], sign$$1 * phi > sign$$1 * lobe[i][0][1] ? lobe[i][0][1] : phi)[0];
    return p;
  }

  // Assumes mutually exclusive bounding boxes for lobes.
  if (project.invert) forward.invert = function(x, y) {
    var bound = bounds[+(y < 0)], lobe = lobes[+(y < 0)];
    for (var i = 0, n = bound.length; i < n; ++i) {
      var b = bound[i];
      if (b[0][0] <= x && x < b[1][0] && b[0][1] <= y && y < b[1][1]) {
        var p = project.invert(x - project(lobe[i][1][0], 0)[0], y);
        p[0] += lobe[i][1][0];
        return pointEqual(forward(p[0], p[1]), [x, y]) ? p : null;
      }
    }
  };

  var p = d3Geo.geoProjection(forward),
      stream_ = p.stream;

  p.stream = function(stream) {
    var rotate = p.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (p.rotate([0, 0]), stream_(stream));
    p.rotate(rotate);
    rotateStream.sphere = function() { d3Geo.geoStream(sphere, sphereStream); };
    return rotateStream;
  };

  return p;
};

var lobes = [[ // northern hemisphere
  [[-180,   0], [-100,  90], [ -40,   0]],
  [[ -40,   0], [  30,  90], [ 180,   0]]
], [ // southern hemisphere
  [[-180,   0], [-160, -90], [-100,   0]],
  [[-100,   0], [ -60, -90], [ -20,   0]],
  [[ -20,   0], [  20, -90], [  80,   0]],
  [[  80,   0], [ 140, -90], [ 180,   0]]
]];

var boggs$1 = function() {
  return interrupt(boggsRaw, lobes)
      .scale(160.857);
};

var lobes$1 = [[ // northern hemisphere
  [[-180,   0], [-100,  90], [ -40,   0]],
  [[ -40,   0], [  30,  90], [ 180,   0]]
], [ // southern hemisphere
  [[-180,   0], [-160, -90], [-100,   0]],
  [[-100,   0], [ -60, -90], [ -20,   0]],
  [[ -20,   0], [  20, -90], [  80,   0]],
  [[  80,   0], [ 140, -90], [ 180,   0]]
]];

var homolosine$1 = function() {
  return interrupt(homolosineRaw, lobes$1)
      .scale(152.63);
};

var lobes$2 = [[ // northern hemisphere
  [[-180,   0], [-100,  90], [ -40,   0]],
  [[ -40,   0], [  30,  90], [ 180,   0]]
], [ // southern hemisphere
  [[-180,   0], [-160, -90], [-100,   0]],
  [[-100,   0], [ -60, -90], [ -20,   0]],
  [[ -20,   0], [  20, -90], [  80,   0]],
  [[  80,   0], [ 140, -90], [ 180,   0]]
]];

var mollweide$1 = function() {
  return interrupt(mollweideRaw, lobes$2)
      .scale(169.529);
};

var lobes$3 = [[ // northern hemisphere
  [[-180,   0], [ -90,  90], [   0,   0]],
  [[   0,   0], [  90,  90], [ 180,   0]]
], [ // southern hemisphere
  [[-180,   0], [ -90, -90], [   0,   0]],
  [[   0,   0], [  90, -90], [ 180,   0]]
]];

var mollweideHemispheres = function() {
  return interrupt(mollweideRaw, lobes$3)
      .scale(169.529)
      .rotate([20, 0]);
};

var lobes$4 = [[ // northern hemisphere
  [[-180,  35], [ -30,  90], [   0,  35]],
  [[   0,  35], [  30,  90], [ 180,  35]]
], [ // southern hemisphere
  [[-180, -10], [-102, -90], [ -65, -10]],
  [[ -65, -10], [   5, -90], [  77, -10]],
  [[  77, -10], [ 103, -90], [ 180, -10]]
]];

var sinuMollweide$1 = function() {
  return interrupt(sinuMollweideRaw, lobes$4)
      .rotate([-20, -55])
      .scale(164.263)
      .center([0, -5.4036]);
};

var lobes$5 = [[ // northern hemisphere
  [[-180,   0], [-110,  90], [ -40,   0]],
  [[ -40,   0], [   0,  90], [  40,   0]],
  [[  40,   0], [ 110,  90], [ 180,   0]]
], [ // southern hemisphere
  [[-180,   0], [-110, -90], [ -40,   0]],
  [[ -40,   0], [   0, -90], [  40,   0]],
  [[  40,   0], [ 110, -90], [ 180,   0]]
]];

var sinusoidal$1 = function() {
  return interrupt(sinusoidalRaw, lobes$5)
      .scale(152.63)
      .rotate([-20, 0]);
};

function kavrayskiy7Raw(lambda, phi) {
  return [3 / tau * lambda * sqrt(pi * pi / 3 - phi * phi), phi];
}

kavrayskiy7Raw.invert = function(x, y) {
  return [tau / 3 * x / sqrt(pi * pi / 3 - y * y), y];
};

var kavrayskiy7 = function() {
  return d3Geo.geoProjection(kavrayskiy7Raw)
      .scale(158.837);
};

function lagrangeRaw(n) {

  function forward(lambda, phi) {
    if (abs(abs(phi) - halfPi) < epsilon) return [0, phi < 0 ? -2 : 2];
    var sinPhi = sin(phi),
        v = pow((1 + sinPhi) / (1 - sinPhi), n / 2),
        c = 0.5 * (v + 1 / v) + cos(lambda *= n);
    return [
      2 * sin(lambda) / c,
      (v - 1 / v) / c
    ];
  }

  forward.invert = function(x, y) {
    var y0 = abs(y);
    if (abs(y0 - 2) < epsilon) return x ? null : [0, sign(y) * halfPi];
    if (y0 > 2) return null;

    x /= 2, y /= 2;
    var x2 = x * x,
        y2 = y * y,
        t = 2 * y / (1 + x2 + y2); // tanh(nPhi)
    t = pow((1 + t) / (1 - t), 1 / n);
    return [
      atan2(2 * x, 1 - x2 - y2) / n,
      asin((t - 1) / (t + 1))
    ];
  };

  return forward;
}

var lagrange = function() {
  var n = 0.5,
      m = d3Geo.geoProjectionMutator(lagrangeRaw),
      p = m(n);

  p.spacing = function(_) {
    return arguments.length ? m(n = +_) : n;
  };

  return p
      .scale(124.75);
};

var pi_sqrt2 = pi / sqrt2;

function larriveeRaw(lambda, phi) {
  return [
    lambda * (1 + sqrt(cos(phi))) / 2,
    phi / (cos(phi / 2) * cos(lambda / 6))
  ];
}

larriveeRaw.invert = function(x, y) {
  var x0 = abs(x),
      y0 = abs(y),
      lambda = epsilon,
      phi = halfPi;
  if (y0 < pi_sqrt2) phi *= y0 / pi_sqrt2;
  else lambda += 6 * acos(pi_sqrt2 / y0);
  for (var i = 0; i < 25; i++) {
    var sinPhi = sin(phi),
        sqrtcosPhi = sqrt(cos(phi)),
        sinPhi_2 = sin(phi / 2),
        cosPhi_2 = cos(phi / 2),
        sinLambda_6 = sin(lambda / 6),
        cosLambda_6 = cos(lambda / 6),
        f0 = 0.5 * lambda * (1 + sqrtcosPhi) - x0,
        f1 = phi / (cosPhi_2 * cosLambda_6) - y0,
        df0dPhi = sqrtcosPhi ? -0.25 * lambda * sinPhi / sqrtcosPhi : 0,
        df0dLambda = 0.5 * (1 + sqrtcosPhi),
        df1dPhi = (1 +0.5 * phi * sinPhi_2 / cosPhi_2) / (cosPhi_2 * cosLambda_6),
        df1dLambda = (phi / cosPhi_2) * (sinLambda_6 / 6) / (cosLambda_6 * cosLambda_6),
        denom = df0dPhi * df1dLambda - df1dPhi * df0dLambda,
        dPhi = (f0 * df1dLambda - f1 * df0dLambda) / denom,
        dLambda = (f1 * df0dPhi - f0 * df1dPhi) / denom;
    phi -= dPhi;
    lambda -= dLambda;
    if (abs(dPhi) < epsilon && abs(dLambda) < epsilon) break;
  }
  return [x < 0 ? -lambda : lambda, y < 0 ? -phi : phi];
};

var larrivee = function() {
  return d3Geo.geoProjection(larriveeRaw)
      .scale(97.2672);
};

function laskowskiRaw(lambda, phi) {
  var lambda2 = lambda * lambda, phi2 = phi * phi;
  return [
    lambda * (0.975534 + phi2 * (-0.119161 + lambda2 * -0.0143059 + phi2 * -0.0547009)),
    phi * (1.00384 + lambda2 * (0.0802894 + phi2 * -0.02855 + lambda2 * 0.000199025) + phi2 * (0.0998909 + phi2 * -0.0491032))
  ];
}

laskowskiRaw.invert = function(x, y) {
  var lambda = sign(x) * pi,
      phi = y / 2,
      i = 50;
  do {
    var lambda2 = lambda * lambda,
        phi2 = phi * phi,
        lambdaPhi = lambda * phi,
        fx = lambda * (0.975534 + phi2 * (-0.119161 + lambda2 * -0.0143059 + phi2 * -0.0547009)) - x,
        fy = phi * (1.00384 + lambda2 * (0.0802894 + phi2 * -0.02855 + lambda2 * 0.000199025) + phi2 * (0.0998909 + phi2 * -0.0491032)) - y,
        deltaxDeltaLambda = 0.975534 - phi2 * (0.119161 + 3 * lambda2 * 0.0143059 + phi2 * 0.0547009),
        deltaxDeltaPhi = -lambdaPhi * (2 * 0.119161 + 4 * 0.0547009 * phi2 + 2 * 0.0143059 * lambda2),
        deltayDeltaLambda = lambdaPhi * (2 * 0.0802894 + 4 * 0.000199025 * lambda2 + 2 * -0.02855 * phi2),
        deltayDeltaPhi = 1.00384 + lambda2 * (0.0802894 + 0.000199025 * lambda2) + phi2 * (3 * (0.0998909 - 0.02855 * lambda2) - 5 * 0.0491032 * phi2),
        denominator = deltaxDeltaPhi * deltayDeltaLambda - deltayDeltaPhi * deltaxDeltaLambda,
        deltaLambda = (fy * deltaxDeltaPhi - fx * deltayDeltaPhi) / denominator,
        deltaPhi = (fx * deltayDeltaLambda - fy * deltaxDeltaLambda) / denominator;
    lambda -= deltaLambda, phi -= deltaPhi;
  } while ((abs(deltaLambda) > epsilon || abs(deltaPhi) > epsilon) && --i > 0);
  return i && [lambda, phi];
};

var laskowski = function() {
  return d3Geo.geoProjection(laskowskiRaw)
      .scale(139.98);
};

function littrowRaw(lambda, phi) {
  return [
    sin(lambda) / cos(phi),
    tan(phi) * cos(lambda)
  ];
}

littrowRaw.invert = function(x, y) {
  var x2 = x * x,
      y2 = y * y,
      y2_1 = y2 + 1,
      cosPhi = x
          ? sqrt1_2 * sqrt((y2_1 - sqrt(x2 * x2 + 2 * x2 * (y2 - 1) + y2_1 * y2_1)) / x2 + 1)
          : 1 / sqrt(y2_1);
  return [
    asin(x * cosPhi),
    sign(y) * acos(cosPhi)
  ];
};

var littrow = function() {
  return d3Geo.geoProjection(littrowRaw)
      .scale(144.049)
      .clipAngle(90 - 1e-3);
};

function loximuthalRaw(phi0) {
  var cosPhi0 = cos(phi0),
      tanPhi0 = tan(quarterPi + phi0 / 2);

  function forward(lambda, phi) {
    var y = phi - phi0,
        x = abs(y) < epsilon ? lambda * cosPhi0
            : abs(x = quarterPi + phi / 2) < epsilon || abs(abs(x) - halfPi) < epsilon
            ? 0 : lambda * y / log(tan(x) / tanPhi0);
    return [x, y];
  }

  forward.invert = function(x, y) {
    var lambda,
        phi = y + phi0;
    return [
      abs(y) < epsilon ? x / cosPhi0
          : (abs(lambda = quarterPi + phi / 2) < epsilon || abs(abs(lambda) - halfPi) < epsilon) ? 0
          : x * log(tan(lambda) / tanPhi0) / y,
      phi
    ];
  };

  return forward;
}

var loximuthal = function() {
  return parallel1(loximuthalRaw)
      .parallel(40)
      .scale(158.837);
};

function millerRaw(lambda, phi) {
  return [lambda, 1.25 * log(tan(quarterPi + 0.4 * phi))];
}

millerRaw.invert = function(x, y) {
  return [x, 2.5 * atan(exp(0.8 * y)) - 0.625 * pi];
};

var miller = function() {
  return d3Geo.geoProjection(millerRaw)
      .scale(108.318);
};

function modifiedStereographicRaw(C) {
  var m = C.length - 1;

  function forward(lambda, phi) {
    var cosPhi = cos(phi),
        k = 2 / (1 + cosPhi * cos(lambda)),
        zr = k * cosPhi * sin(lambda),
        zi = k * sin(phi),
        i = m,
        w = C[i],
        ar = w[0],
        ai = w[1],
        t;
    while (--i >= 0) {
      w = C[i];
      ar = w[0] + zr * (t = ar) - zi * ai;
      ai = w[1] + zr * ai + zi * t;
    }
    ar = zr * (t = ar) - zi * ai;
    ai = zr * ai + zi * t;
    return [ar, ai];
  }

  forward.invert = function(x, y) {
    var i = 20,
        zr = x,
        zi = y;
    do {
      var j = m,
          w = C[j],
          ar = w[0],
          ai = w[1],
          br = 0,
          bi = 0,
          t;

      while (--j >= 0) {
        w = C[j];
        br = ar + zr * (t = br) - zi * bi;
        bi = ai + zr * bi + zi * t;
        ar = w[0] + zr * (t = ar) - zi * ai;
        ai = w[1] + zr * ai + zi * t;
      }
      br = ar + zr * (t = br) - zi * bi;
      bi = ai + zr * bi + zi * t;
      ar = zr * (t = ar) - zi * ai - x;
      ai = zr * ai + zi * t - y;

      var denominator = br * br + bi * bi, deltar, deltai;
      zr -= deltar = (ar * br + ai * bi) / denominator;
      zi -= deltai = (ai * br - ar * bi) / denominator;
    } while (abs(deltar) + abs(deltai) > epsilon * epsilon && --i > 0);

    if (i) {
      var rho = sqrt(zr * zr + zi * zi),
          c = 2 * atan(rho * 0.5),
          sinc = sin(c);
      return [atan2(zr * sinc, rho * cos(c)), rho ? asin(zi * sinc / rho) : 0];
    }
  };

  return forward;
}

var alaska = [[0.9972523, 0], [0.0052513, -0.0041175], [0.0074606, 0.0048125], [-0.0153783, -0.1968253], [0.0636871, -0.1408027], [0.3660976, -0.2937382]];
var gs48 = [[0.98879, 0], [0, 0], [-0.050909, 0], [0, 0], [0.075528, 0]];
var gs50 = [[0.9842990, 0], [0.0211642, 0.0037608], [-0.1036018, -0.0575102], [-0.0329095, -0.0320119], [0.0499471, 0.1223335], [0.0260460, 0.0899805], [0.0007388, -0.1435792], [0.0075848, -0.1334108], [-0.0216473, 0.0776645], [-0.0225161, 0.0853673]];
var miller$1 = [[0.9245, 0], [0, 0], [0.01943, 0]];
var lee = [[0.721316, 0], [0, 0], [-0.00881625, -0.00617325]];

function modifiedStereographicAlaska() {
  return modifiedStereographic(alaska, [152, -64])
      .scale(1500)
      .center([-160.908, 62.4864])
      .clipAngle(25);
}

function modifiedStereographicGs48() {
  return modifiedStereographic(gs48, [95, -38])
      .scale(1000)
      .clipAngle(55)
      .center([-96.5563, 38.8675]);
}

function modifiedStereographicGs50() {
  return modifiedStereographic(gs50, [120, -45])
      .scale(359.513)
      .clipAngle(55)
      .center([-117.474, 53.0628]);
}

function modifiedStereographicMiller() {
  return modifiedStereographic(miller$1, [-20, -18])
      .scale(209.091)
      .center([20, 16.7214])
      .clipAngle(82);
}

function modifiedStereographicLee() {
  return modifiedStereographic(lee, [165, 10])
      .scale(250)
      .clipAngle(130)
      .center([-165, -10]);
}

function modifiedStereographic(coefficients, rotate) {
  var p = d3Geo.geoProjection(modifiedStereographicRaw(coefficients)).rotate(rotate).clipAngle(90),
      r = d3Geo.geoRotation(rotate),
      center = p.center;

  delete p.rotate;

  p.center = function(_) {
    return arguments.length ? center(r(_)) : r.invert(center());
  };

  return p;
}

var sqrt6 = sqrt(6);
var sqrt7 = sqrt(7);

function mtFlatPolarParabolicRaw(lambda, phi) {
  var theta = asin(7 * sin(phi) / (3 * sqrt6));
  return [
    sqrt6 * lambda * (2 * cos(2 * theta / 3) - 1) / sqrt7,
    9 * sin(theta / 3) / sqrt7
  ];
}

mtFlatPolarParabolicRaw.invert = function(x, y) {
  var theta = 3 * asin(y * sqrt7 / 9);
  return [
    x * sqrt7 / (sqrt6 * (2 * cos(2 * theta / 3) - 1)),
    asin(sin(theta) * 3 * sqrt6 / 7)
  ];
};

var mtFlatPolarParabolic = function() {
  return d3Geo.geoProjection(mtFlatPolarParabolicRaw)
      .scale(164.859);
};

function mtFlatPolarQuarticRaw(lambda, phi) {
  var k = (1 + sqrt1_2) * sin(phi),
      theta = phi;
  for (var i = 0, delta; i < 25; i++) {
    theta -= delta = (sin(theta / 2) + sin(theta) - k) / (0.5 * cos(theta / 2) + cos(theta));
    if (abs(delta) < epsilon) break;
  }
  return [
    lambda * (1 + 2 * cos(theta) / cos(theta / 2)) / (3 * sqrt2),
    2 * sqrt(3) * sin(theta / 2) / sqrt(2 + sqrt2)
  ];
}

mtFlatPolarQuarticRaw.invert = function(x, y) {
  var sinTheta_2 = y * sqrt(2 + sqrt2) / (2 * sqrt(3)),
      theta = 2 * asin(sinTheta_2);
  return [
    3 * sqrt2 * x / (1 + 2 * cos(theta) / cos(theta / 2)),
    asin((sinTheta_2 + sin(theta)) / (1 + sqrt1_2))
  ];
};

var mtFlatPolarQuartic = function() {
  return d3Geo.geoProjection(mtFlatPolarQuarticRaw)
      .scale(188.209);
};

function mtFlatPolarSinusoidalRaw(lambda, phi) {
  var A = sqrt(6 / (4 + pi)),
      k = (1 + pi / 4) * sin(phi),
      theta = phi / 2;
  for (var i = 0, delta; i < 25; i++) {
    theta -= delta = (theta / 2 + sin(theta) - k) / (0.5 + cos(theta));
    if (abs(delta) < epsilon) break;
  }
  return [
    A * (0.5 + cos(theta)) * lambda / 1.5,
    A * theta
  ];
}

mtFlatPolarSinusoidalRaw.invert = function(x, y) {
  var A = sqrt(6 / (4 + pi)),
      theta = y / A;
  if (abs(abs(theta) - halfPi) < epsilon) theta = theta < 0 ? -halfPi : halfPi;
  return [
    1.5 * x / (A * (0.5 + cos(theta))),
    asin((theta / 2 + sin(theta)) / (1 + pi / 4))
  ];
};

var mtFlatPolarSinusoidal = function() {
  return d3Geo.geoProjection(mtFlatPolarSinusoidalRaw)
      .scale(166.518);
};

function naturalEarthRaw(lambda, phi) {
  var phi2 = phi * phi, phi4 = phi2 * phi2;
  return [
    lambda * (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4))),
    phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4)))
  ];
}

naturalEarthRaw.invert = function(x, y) {
  var phi = y, i = 25, delta;
  do {
    var phi2 = phi * phi, phi4 = phi2 * phi2;
    phi -= delta = (phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))) - y) /
        (1.007226 + phi2 * (0.015085 * 3 + phi4 * (-0.044475 * 7 + 0.028874 * 9 * phi2 - 0.005916 * 11 * phi4)));
  } while (abs(delta) > epsilon && --i > 0);
  return [
    x / (0.8707 + (phi2 = phi * phi) * (-0.131979 + phi2 * (-0.013791 + phi2 * phi2 * phi2 * (0.003971 - 0.001529 * phi2)))),
    phi
  ];
};

var naturalEarth = function() {
  return d3Geo.geoProjection(naturalEarthRaw)
      .scale(175.295);
};

function naturalEarth2Raw(lambda, phi) {
  var phi2 = phi * phi, phi4 = phi2 * phi2, phi6 = phi2 * phi4;
  return [
    lambda * (0.84719 - 0.13063 * phi2 + phi6 * phi6 * (-0.04515 + 0.05494 * phi2 - 0.02326 * phi4 + 0.00331 * phi6)),
    phi * (1.01183 + phi4 * phi4 * (-0.02625 + 0.01926 * phi2 - 0.00396 * phi4))
  ];
}

naturalEarth2Raw.invert = function(x, y) {
  var phi = y, i = 25, delta, phi2, phi4, phi6;
  do {
    phi2 = phi * phi; phi4 = phi2 * phi2;
    phi -= delta = ((phi * (1.01183 + phi4 * phi4 * (-0.02625 + 0.01926 * phi2 - 0.00396 * phi4))) - y) /
      (1.01183 + phi4 * phi4 * ((9 * -0.02625) + (11 * 0.01926) * phi2 + (13 * -0.00396) * phi4));
  } while (abs(delta) > epsilon2 && --i > 0);
  phi2 = phi * phi; phi4 = phi2 * phi2; phi6 = phi2 * phi4;
  return [
    x / (0.84719 - 0.13063 * phi2 + phi6 * phi6 * (-0.04515 + 0.05494 * phi2 - 0.02326 * phi4 + 0.00331 * phi6)),
    phi
  ];
};

var naturalEarth2 = function() {
  return d3Geo.geoProjection(naturalEarth2Raw)
      .scale(175.295);
};

function nellHammerRaw(lambda, phi) {
  return [
    lambda * (1 + cos(phi)) / 2,
    2 * (phi - tan(phi / 2))
  ];
}

nellHammerRaw.invert = function(x, y) {
  var p = y / 2;
  for (var i = 0, delta = Infinity; i < 10 && abs(delta) > epsilon; ++i) {
    var c = cos(y / 2);
    y -= delta = (y - tan(y / 2) - p) / (1 - 0.5 / (c * c));
  }
  return [
    2 * x / (1 + cos(y)),
    y
  ];
};

var nellHammer = function() {
  return d3Geo.geoProjection(nellHammerRaw)
      .scale(152.63);
};

// Based on Java implementation by Bojan Savric.
// https://github.com/OSUCartography/JMapProjLib/blob/master/src/com/jhlabs/map/proj/PattersonProjection.java

var pattersonK1 = 1.0148;
var pattersonK2 = 0.23185;
var pattersonK3 = -0.14499;
var pattersonK4 = 0.02406;
var pattersonC1 = pattersonK1;
var pattersonC2 = 5 * pattersonK2;
var pattersonC3 = 7 * pattersonK3;
var pattersonC4 = 9 * pattersonK4;
var pattersonYmax = 1.790857183;

function pattersonRaw(lambda, phi) {
  var phi2 = phi * phi;
  return [
    lambda,
    phi * (pattersonK1 + phi2 * phi2 * (pattersonK2 + phi2 * (pattersonK3 + pattersonK4 * phi2)))
  ];
}

pattersonRaw.invert = function(x, y) {
  if (y > pattersonYmax) y = pattersonYmax;
  else if (y < -pattersonYmax) y = -pattersonYmax;
  var yc = y, delta;

  do { // Newton-Raphson
    var y2 = yc * yc;
    yc -= delta = ((yc * (pattersonK1 + y2 * y2 * (pattersonK2 + y2 * (pattersonK3 + pattersonK4 * y2)))) - y) / (pattersonC1 + y2 * y2 * (pattersonC2 + y2 * (pattersonC3 + pattersonC4 * y2)));
  } while (abs(delta) > epsilon);

  return [x, yc];
};

var patterson = function() {
  return d3Geo.geoProjection(pattersonRaw)
      .scale(139.319);
};

function polyconicRaw(lambda, phi) {
  if (abs(phi) < epsilon) return [lambda, 0];
  var tanPhi = tan(phi),
      k = lambda * sin(phi);
  return [
    sin(k) / tanPhi,
    phi + (1 - cos(k)) / tanPhi
  ];
}

polyconicRaw.invert = function(x, y) {
  if (abs(y) < epsilon) return [x, 0];
  var k = x * x + y * y,
      phi = y * 0.5,
      i = 10, delta;
  do {
    var tanPhi = tan(phi),
        secPhi = 1 / cos(phi),
        j = k - 2 * y * phi + phi * phi;
    phi -= delta = (tanPhi * j + 2 * (phi - y)) / (2 + j * secPhi * secPhi + 2 * (phi - y) * tanPhi);
  } while (abs(delta) > epsilon && --i > 0);
  tanPhi = tan(phi);
  return [
    (abs(y) < abs(phi + 1 / tanPhi) ? asin(x * tanPhi) : sign(x) * (acos(abs(x * tanPhi)) + halfPi)) / sin(phi),
    phi
  ];
};

var polyconic = function() {
  return d3Geo.geoProjection(polyconicRaw)
      .scale(103.74);
};

// Note: 6-element arrays are used to denote the 3x3 affine transform matrix:
// [a, b, c,
//  d, e, f,
//  0, 0, 1] - this redundant row is left out.

// Transform matrix for [a0, a1] -> [b0, b1].
var matrix = function(a, b) {
  var u = subtract(a[1], a[0]),
      v = subtract(b[1], b[0]),
      phi = angle$1(u, v),
      s = length(u) / length(v);

  return multiply([
    1, 0, a[0][0],
    0, 1, a[0][1]
  ], multiply([
    s, 0, 0,
    0, s, 0
  ], multiply([
    cos(phi), sin(phi), 0,
    -sin(phi), cos(phi), 0
  ], [
    1, 0, -b[0][0],
    0, 1, -b[0][1]
  ])));
};

// Inverts a transform matrix.
function inverse(m) {
  var k = 1 / (m[0] * m[4] - m[1] * m[3]);
  return [
    k * m[4], -k * m[1], k * (m[1] * m[5] - m[2] * m[4]),
    -k * m[3], k * m[0], k * (m[2] * m[3] - m[0] * m[5])
  ];
}

// Multiplies two 3x2 matrices.
function multiply(a, b) {
  return [
    a[0] * b[0] + a[1] * b[3],
    a[0] * b[1] + a[1] * b[4],
    a[0] * b[2] + a[1] * b[5] + a[2],
    a[3] * b[0] + a[4] * b[3],
    a[3] * b[1] + a[4] * b[4],
    a[3] * b[2] + a[4] * b[5] + a[5]
  ];
}

// Subtracts 2D vectors.
function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

// Magnitude of a 2D vector.
function length(v) {
  return sqrt(v[0] * v[0] + v[1] * v[1]);
}

// Angle between two 2D vectors.
function angle$1(a, b) {
  return atan2(a[0] * b[1] - a[1] * b[0], a[0] * b[0] + a[1] * b[1]);
}

// Creates a polyhedral projection.
//  * root: a spanning tree of polygon faces.  Nodes are automatically
//    augmented with a transform matrix.
//  * face: a function that returns the appropriate node for a given {lambda, phi}
//    point (radians).
//  * r: rotation angle for final polyhedral net.  Defaults to -pi / 6 (for
//    butterflies).
var polyhedral = function(root, face, r) {

  r = r == null ? -pi / 6 : r; // TODO automate

  recurse(root, {transform: [
    cos(r), sin(r), 0,
    -sin(r), cos(r), 0
  ]});

  function recurse(node, parent) {
    node.edges = faceEdges(node.face);
    // Find shared edge.
    if (parent.face) {
      var shared = node.shared = sharedEdge(node.face, parent.face),
          m = matrix(shared.map(parent.project), shared.map(node.project));
      node.transform = parent.transform ? multiply(parent.transform, m) : m;
      // Replace shared edge in parent edges array.
      var edges = parent.edges;
      for (var i = 0, n = edges.length; i < n; ++i) {
        if (pointEqual$1(shared[0], edges[i][1]) && pointEqual$1(shared[1], edges[i][0])) edges[i] = node;
        if (pointEqual$1(shared[0], edges[i][0]) && pointEqual$1(shared[1], edges[i][1])) edges[i] = node;
      }
      edges = node.edges;
      for (i = 0, n = edges.length; i < n; ++i) {
        if (pointEqual$1(shared[0], edges[i][0]) && pointEqual$1(shared[1], edges[i][1])) edges[i] = parent;
        if (pointEqual$1(shared[0], edges[i][1]) && pointEqual$1(shared[1], edges[i][0])) edges[i] = parent;
      }
    } else {
      node.transform = parent.transform;
    }
    if (node.children) {
      node.children.forEach(function(child) {
        recurse(child, node);
      });
    }
    return node;
  }

  function forward(lambda, phi) {
    var node = face(lambda, phi),
        point = node.project([lambda * degrees, phi * degrees]),
        t;
    if (t = node.transform) {
      return [
        t[0] * point[0] + t[1] * point[1] + t[2],
        -(t[3] * point[0] + t[4] * point[1] + t[5])
      ];
    }
    point[1] = -point[1];
    return point;
  }

  // Naive inverse!  A faster solution would use bounding boxes, or even a
  // polygonal quadtree.
  if (hasInverse(root)) forward.invert = function(x, y) {
    var coordinates = faceInvert(root, [x, -y]);
    return coordinates && (coordinates[0] *= radians, coordinates[1] *= radians, coordinates);
  };

  function faceInvert(node, coordinates) {
    var invert = node.project.invert,
        t = node.transform,
        point = coordinates;
    if (t) {
      t = inverse(t);
      point = [
        t[0] * point[0] + t[1] * point[1] + t[2],
        (t[3] * point[0] + t[4] * point[1] + t[5])
      ];
    }
    if (invert && node === faceDegrees(p = invert(point))) return p;
    var p,
        children = node.children;
    for (var i = 0, n = children && children.length; i < n; ++i) {
      if (p = faceInvert(children[i], coordinates)) return p;
    }
  }

  function faceDegrees(coordinates) {
    return face(coordinates[0] * radians, coordinates[1] * radians);
  }

  var proj = d3Geo.geoProjection(forward),
      stream_ = proj.stream;

  proj.stream = function(stream) {
    var rotate = proj.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (proj.rotate([0, 0]), stream_(stream));
    proj.rotate(rotate);
    rotateStream.sphere = function() {
      sphereStream.polygonStart();
      sphereStream.lineStart();
      outline(sphereStream, root);
      sphereStream.lineEnd();
      sphereStream.polygonEnd();
    };
    return rotateStream;
  };

  return proj;
};

function outline(stream, node, parent) {
  var point,
      edges = node.edges,
      n = edges.length,
      edge,
      multiPoint = {type: "MultiPoint", coordinates: node.face},
      notPoles = node.face.filter(function(d) { return abs(d[1]) !== 90; }),
      b = d3Geo.geoBounds({type: "MultiPoint", coordinates: notPoles}),
      inside = false,
      j = -1,
      dx = b[1][0] - b[0][0];
  // TODO
  var c = dx === 180 || dx === 360
      ? [(b[0][0] + b[1][0]) / 2, (b[0][1] + b[1][1]) / 2]
      : d3Geo.geoCentroid(multiPoint);
  // First find the shared edge…
  if (parent) while (++j < n) {
    if (edges[j] === parent) break;
  }
  ++j;
  for (var i = 0; i < n; ++i) {
    edge = edges[(i + j) % n];
    if (Array.isArray(edge)) {
      if (!inside) {
        stream.point((point = d3Geo.geoInterpolate(edge[0], c)(epsilon))[0], point[1]);
        inside = true;
      }
      stream.point((point = d3Geo.geoInterpolate(edge[1], c)(epsilon))[0], point[1]);
    } else {
      inside = false;
      if (edge !== parent) outline(stream, edge, node);
    }
  }
}

// Tests equality of two spherical points.
function pointEqual$1(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}

// Finds a shared edge given two clockwise polygons.
function sharedEdge(a, b) {
  var x, y, n = a.length, found = null;
  for (var i = 0; i < n; ++i) {
    x = a[i];
    for (var j = b.length; --j >= 0;) {
      y = b[j];
      if (x[0] === y[0] && x[1] === y[1]) {
        if (found) return [found, x];
        found = x;
      }
    }
  }
}

// Converts an array of n face vertices to an array of n + 1 edges.
function faceEdges(face) {
  var n = face.length,
      edges = [];
  for (var a = face[n - 1], i = 0; i < n; ++i) edges.push([a, a = face[i]]);
  return edges;
}

function hasInverse(node) {
  return node.project.invert || node.children && node.children.some(hasInverse);
}

// TODO generate on-the-fly to avoid external modification.
var octahedron = [
  [0, 90],
  [-90, 0], [0, 0], [90, 0], [180, 0],
  [0, -90]
];

var octahedron$1 = [
  [0, 2, 1],
  [0, 3, 2],
  [5, 1, 2],
  [5, 2, 3],
  [0, 1, 4],
  [0, 4, 3],
  [5, 4, 1],
  [5, 3, 4]
].map(function(face) {
  return face.map(function(i) {
    return octahedron[i];
  });
});

var butterfly = function(faceProjection) {

  faceProjection = faceProjection || function(face) {
    var c = d3Geo.geoCentroid({type: "MultiPoint", coordinates: face});
    return d3Geo.geoGnomonic().scale(1).translate([0, 0]).rotate([-c[0], -c[1]]);
  };

  var faces = octahedron$1.map(function(face) {
    return {face: face, project: faceProjection(face)};
  });

  [-1, 0, 0, 1, 0, 1, 4, 5].forEach(function(d, i) {
    var node = faces[d];
    node && (node.children || (node.children = [])).push(faces[i]);
  });

  return polyhedral(faces[0], function(lambda, phi) {
        return faces[lambda < -pi / 2 ? phi < 0 ? 6 : 4
            : lambda < 0 ? phi < 0 ? 2 : 0
            : lambda < pi / 2 ? phi < 0 ? 3 : 1
            : phi < 0 ? 7 : 5];
      })
      .scale(101.858)
      .center([0, 45]);
};

var kx = 2 / sqrt(3);

function collignonK(a, b) {
  var p = collignonRaw(a, b);
  return [p[0] * kx, p[1]];
}

collignonK.invert = function(x,y) {
  return collignonRaw.invert(x / kx, y);
};

var collignon$1 = function(faceProjection) {

  faceProjection = faceProjection || function(face) {
    var c = d3Geo.geoCentroid({type: "MultiPoint", coordinates: face});
    return d3Geo.geoProjection(collignonK).translate([0, 0]).scale(1).rotate(c[1] > 0 ? [-c[0], 0] : [180 - c[0], 180]);
  };

  var faces = octahedron$1.map(function(face) {
    return {face: face, project: faceProjection(face)};
  });

  [-1, 0, 0, 1, 0, 1, 4, 5].forEach(function(d, i) {
    var node = faces[d];
    node && (node.children || (node.children = [])).push(faces[i]);
  });

  return polyhedral(faces[0], function(lambda, phi) {
        return faces[lambda < -pi / 2 ? phi < 0 ? 6 : 4
            : lambda < 0 ? phi < 0 ? 2 : 0
            : lambda < pi / 2 ? phi < 0 ? 3 : 1
            : phi < 0 ? 7 : 5];
      })
      .scale(121.906)
      .center([0, 48.5904]);
};

var waterman = function(faceProjection) {

  faceProjection = faceProjection || function(face) {
    var c = face.length === 6 ? d3Geo.geoCentroid({type: "MultiPoint", coordinates: face}) : face[0];
    return d3Geo.geoGnomonic().scale(1).translate([0, 0]).rotate([-c[0], -c[1]]);
  };

  var w5 = octahedron$1.map(function(face) {
    var xyz = face.map(cartesian),
        n = xyz.length,
        a = xyz[n - 1],
        b,
        hexagon = [];
    for (var i = 0; i < n; ++i) {
      b = xyz[i];
      hexagon.push(spherical([
        a[0] * 0.9486832980505138 + b[0] * 0.31622776601683794,
        a[1] * 0.9486832980505138 + b[1] * 0.31622776601683794,
        a[2] * 0.9486832980505138 + b[2] * 0.31622776601683794
      ]), spherical([
        b[0] * 0.9486832980505138 + a[0] * 0.31622776601683794,
        b[1] * 0.9486832980505138 + a[1] * 0.31622776601683794,
        b[2] * 0.9486832980505138 + a[2] * 0.31622776601683794
      ]));
      a = b;
    }
    return hexagon;
  });

  var cornerNormals = [];

  var parents = [-1, 0, 0, 1, 0, 1, 4, 5];

  w5.forEach(function(hexagon, j) {
    var face = octahedron$1[j],
        n = face.length,
        normals = cornerNormals[j] = [];
    for (var i = 0; i < n; ++i) {
      w5.push([
        face[i],
        hexagon[(i * 2 + 2) % (2 * n)],
        hexagon[(i * 2 + 1) % (2 * n)]
      ]);
      parents.push(j);
      normals.push(cross(
        cartesian(hexagon[(i * 2 + 2) % (2 * n)]),
        cartesian(hexagon[(i * 2 + 1) % (2 * n)])
      ));
    }
  });

  var faces = w5.map(function(face) {
    return {
      project: faceProjection(face),
      face: face
    };
  });

  parents.forEach(function(d, i) {
    var parent = faces[d];
    parent && (parent.children || (parent.children = [])).push(faces[i]);
  });

  function face(lambda, phi) {
    var cosphi = cos(phi),
        p = [cosphi * cos(lambda), cosphi * sin(lambda), sin(phi)];

    var hexagon = lambda < -pi / 2 ? phi < 0 ? 6 : 4
        : lambda < 0 ? phi < 0 ? 2 : 0
        : lambda < pi / 2 ? phi < 0 ? 3 : 1
        : phi < 0 ? 7 : 5;

    var n = cornerNormals[hexagon];

    return faces[dot(n[0], p) < 0 ? 8 + 3 * hexagon
        : dot(n[1], p) < 0 ? 8 + 3 * hexagon + 1
        : dot(n[2], p) < 0 ? 8 + 3 * hexagon + 2
        : hexagon];
  }

  return polyhedral(faces[0], face)
      .scale(110.625)
      .center([0,45]);
};

function dot(a, b) {
  for (var i = 0, n = a.length, s = 0; i < n; ++i) s += a[i] * b[i];
  return s;
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

// Converts 3D Cartesian to spherical coordinates (degrees).
function spherical(cartesian) {
  return [
    atan2(cartesian[1], cartesian[0]) * degrees,
    asin(max(-1, min(1, cartesian[2]))) * degrees
  ];
}

// Converts spherical coordinates (degrees) to 3D Cartesian.
function cartesian(coordinates) {
  var lambda = coordinates[0] * radians,
      phi = coordinates[1] * radians,
      cosphi = cos(phi);
  return [
    cosphi * cos(lambda),
    cosphi * sin(lambda),
    sin(phi)
  ];
}

var noop = function() {};

var clockwise = function(ring) {
  if ((n = ring.length) < 4) return false;
  var i = 0,
      n,
      area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];
  while (++i < n) area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
  return area <= 0;
};

var contains = function(ring, point) {
  var x = point[0],
      y = point[1],
      contains = false;
  for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
    var pi = ring[i], xi = pi[0], yi = pi[1],
        pj = ring[j], xj = pj[0], yj = pj[1];
    if (((yi > y) ^ (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) contains = !contains;
  }
  return contains;
};

var index = function(object, projection) {
  var stream = projection.stream, project;
  if (!stream) throw new Error("invalid projection");
  switch (object && object.type) {
    case "Feature": project = projectFeature; break;
    case "FeatureCollection": project = projectFeatureCollection; break;
    default: project = projectGeometry; break;
  }
  return project(object, stream);
};

function projectFeatureCollection(o, stream) {
  return {
    type: "FeatureCollection",
    features: o.features.map(function(f) {
      return projectFeature(f, stream);
    })
  };
}

function projectFeature(o, stream) {
  return {
    type: "Feature",
    id: o.id,
    properties: o.properties,
    geometry: projectGeometry(o.geometry, stream)
  };
}

function projectGeometryCollection(o, stream) {
  return {
    type: "GeometryCollection",
    geometries: o.geometries.map(function(o) {
      return projectGeometry(o, stream);
    })
  };
}

function projectGeometry(o, stream) {
  if (!o) return null;
  if (o.type === "GeometryCollection") return projectGeometryCollection(o, stream);
  var sink;
  switch (o.type) {
    case "Point": sink = sinkPoint; break;
    case "MultiPoint": sink = sinkPoint; break;
    case "LineString": sink = sinkLine; break;
    case "MultiLineString": sink = sinkLine; break;
    case "Polygon": sink = sinkPolygon; break;
    case "MultiPolygon": sink = sinkPolygon; break;
    case "Sphere": sink = sinkPolygon; break;
    default: return null;
  }
  d3Geo.geoStream(o, stream(sink));
  return sink.result();
}

var points = [];
var lines = [];

var sinkPoint = {
  point: function(x, y) {
    points.push([x, y]);
  },
  result: function() {
    var result = !points.length ? null
        : points.length < 2 ? {type: "Point", coordinates: points[0]}
        : {type: "MultiPoint", coordinates: points};
    points = [];
    return result;
  }
};

var sinkLine = {
  lineStart: noop,
  point: function(x, y) {
    points.push([x, y]);
  },
  lineEnd: function() {
    if (points.length) lines.push(points), points = [];
  },
  result: function() {
    var result = !lines.length ? null
        : lines.length < 2 ? {type: "LineString", coordinates: lines[0]}
        : {type: "MultiLineString", coordinates: lines};
    lines = [];
    return result;
  }
};

var sinkPolygon = {
  polygonStart: noop,
  lineStart: noop,
  point: function(x, y) {
    points.push([x, y]);
  },
  lineEnd: function() {
    var n = points.length;
    if (n) {
      do points.push(points[0].slice()); while (++n < 4);
      lines.push(points), points = [];
    }
  },
  polygonEnd: noop,
  result: function() {
    if (!lines.length) return null;
    var polygons = [],
        holes = [];

    // https://github.com/d3/d3/issues/1558
    lines.forEach(function(ring) {
      if (clockwise(ring)) polygons.push([ring]);
      else holes.push(ring);
    });

    holes.forEach(function(hole) {
      var point = hole[0];
      polygons.some(function(polygon) {
        if (contains(polygon[0], point)) {
          polygon.push(hole);
          return true;
        }
      }) || polygons.push([hole]);
    });

    lines = [];

    return !polygons.length ? null
        : polygons.length > 1 ? {type: "MultiPolygon", coordinates: polygons}
        : {type: "Polygon", coordinates: polygons[0]};
  }
};

var quincuncial = function(project) {
  var dx = project(halfPi, 0)[0] - project(-halfPi, 0)[0];

  function projectQuincuncial(lambda, phi) {
    var t = abs(lambda) < halfPi,
        p = project(t ? lambda : lambda > 0 ? lambda - pi : lambda + pi, phi),
        x = (p[0] - p[1]) * sqrt1_2,
        y = (p[0] + p[1]) * sqrt1_2;
    if (t) return [x, y];
    var d = dx * sqrt1_2,
        s = x > 0 ^ y > 0 ? -1 : 1;
    return [s * x - sign(y) * d, s * y - sign(x) * d];
  }

  if (project.invert) projectQuincuncial.invert = function(x0, y0) {
    var x = (x0 + y0) * sqrt1_2,
        y = (y0 - x0) * sqrt1_2,
        t = abs(x) < 0.5 * dx && abs(y) < 0.5 * dx;

    if (!t) {
      var d = dx * sqrt1_2,
          s = x > 0 ^ y > 0 ? -1 : 1,
          x1 = -s * x0 + (y > 0 ? 1 : -1) * d,
          y1 = -s * y0 + (x > 0 ? 1 : -1) * d;
      x = (-x1 - y1) * sqrt1_2;
      y = (x1 - y1) * sqrt1_2;
    }

    var p = project.invert(x, y);
    if (!t) p[0] += x > 0 ? pi : -pi;
    return p;
  };

  return d3Geo.geoProjection(projectQuincuncial)
      .rotate([-90, -90, 45])
      .clipAngle(180 - 1e-3);
};

var gringorten$1 = function() {
  return quincuncial(gringortenRaw)
      .scale(176.423);
};

var peirce = function() {
  return quincuncial(guyouRaw)
      .scale(111.48);
};

var quantize = function(input, digits) {
  if (!(0 <= (digits = +digits) && digits <= 20)) throw new Error("invalid digits");

  function quantizePoint(input) {
    var n = input.length, i = 2, output = new Array(n);
    output[0] = +input[0].toFixed(digits);
    output[1] = +input[1].toFixed(digits);
    while (i < n) output[i] = input[i], ++i;
    return output;
  }

  function quantizePoints(input) {
    return input.map(quantizePoint);
  }

  function quantizePolygon(input) {
    return input.map(quantizePoints);
  }

  function quantizeGeometry(input) {
    if (input == null) return input;
    var output;
    switch (input.type) {
      case "GeometryCollection": output = {type: "GeometryCollection", geometries: input.geometries.map(quantizeGeometry)}; break;
      case "Point": output = {type: "Point", coordinates: quantizePoint(input.coordinates)}; break;
      case "MultiPoint": case "LineString": output = {type: input.type, coordinates: quantizePoints(input.coordinates)}; break;
      case "MultiLineString": case "Polygon": output = {type: input.type, coordinates: quantizePolygon(input.coordinates)}; break;
      case "MultiPolygon": output = {type: "MultiPolygon", coordinates: input.coordinates.map(quantizePolygon)}; break;
      default: return input;
    }
    if (input.bbox != null) output.bbox = input.bbox;
    return output;
  }

  function quantizeFeature(input) {
    var output = {type: "Feature", properties: input.properties, geometry: quantizeGeometry(input.geometry)};
    if (input.id != null) output.id = input.id;
    if (input.bbox != null) output.bbox = input.bbox;
    return output;
  }

  if (input != null) switch (input.type) {
    case "Feature": return quantizeFeature(input);
    case "FeatureCollection": {
      var output = {type: "FeatureCollection", features: input.features.map(quantizeFeature)};
      if (input.bbox != null) output.bbox = input.bbox;
      return output;
    }
    default: return quantizeGeometry(input);
  }

  return input;
};

function rectangularPolyconicRaw(phi0) {
  var sinPhi0 = sin(phi0);

  function forward(lambda, phi) {
    var A = sinPhi0 ? tan(lambda * sinPhi0 / 2) / sinPhi0 : lambda / 2;
    if (!phi) return [2 * A, -phi0];
    var E = 2 * atan(A * sin(phi)),
        cotPhi = 1 / tan(phi);
    return [
      sin(E) * cotPhi,
      phi + (1 - cos(E)) * cotPhi - phi0
    ];
  }

  // TODO return null for points outside outline.
  forward.invert = function(x, y) {
    if (abs(y += phi0) < epsilon) return [sinPhi0 ? 2 * atan(sinPhi0 * x / 2) / sinPhi0 : x, 0];
    var k = x * x + y * y,
        phi = 0,
        i = 10, delta;
    do {
      var tanPhi = tan(phi),
          secPhi = 1 / cos(phi),
          j = k - 2 * y * phi + phi * phi;
      phi -= delta = (tanPhi * j + 2 * (phi - y)) / (2 + j * secPhi * secPhi + 2 * (phi - y) * tanPhi);
    } while (abs(delta) > epsilon && --i > 0);
    var E = x * (tanPhi = tan(phi)),
        A = tan(abs(y) < abs(phi + 1 / tanPhi) ? asin(E) * 0.5 : acos(E) * 0.5 + pi / 4) / sin(phi);
    return [
      sinPhi0 ? 2 * atan(sinPhi0 * A) / sinPhi0 : 2 * A,
      phi
    ];
  };

  return forward;
}

var rectangularPolyconic = function() {
  return parallel1(rectangularPolyconicRaw)
      .scale(131.215);
};

var K = [
  [0.9986, -0.062],
  [1.0000, 0.0000],
  [0.9986, 0.0620],
  [0.9954, 0.1240],
  [0.9900, 0.1860],
  [0.9822, 0.2480],
  [0.9730, 0.3100],
  [0.9600, 0.3720],
  [0.9427, 0.4340],
  [0.9216, 0.4958],
  [0.8962, 0.5571],
  [0.8679, 0.6176],
  [0.8350, 0.6769],
  [0.7986, 0.7346],
  [0.7597, 0.7903],
  [0.7186, 0.8435],
  [0.6732, 0.8936],
  [0.6213, 0.9394],
  [0.5722, 0.9761],
  [0.5322, 1.0000]
];

K.forEach(function(d) {
  d[1] *= 1.0144;
});

function robinsonRaw(lambda, phi) {
  var i = min(18, abs(phi) * 36 / pi),
      i0 = floor(i),
      di = i - i0,
      ax = (k = K[i0])[0],
      ay = k[1],
      bx = (k = K[++i0])[0],
      by = k[1],
      cx = (k = K[min(19, ++i0)])[0],
      cy = k[1],
      k;
  return [
    lambda * (bx + di * (cx - ax) / 2 + di * di * (cx - 2 * bx + ax) / 2),
    (phi > 0 ? halfPi : -halfPi) * (by + di * (cy - ay) / 2 + di * di * (cy - 2 * by + ay) / 2)
  ];
}

robinsonRaw.invert = function(x, y) {
  var yy = y / halfPi,
      phi = yy * 90,
      i = min(18, abs(phi / 5)),
      i0 = max(0, floor(i));
  do {
    var ay = K[i0][1],
        by = K[i0 + 1][1],
        cy = K[min(19, i0 + 2)][1],
        u = cy - ay,
        v = cy - 2 * by + ay,
        t = 2 * (abs(yy) - by) / u,
        c = v / u,
        di = t * (1 - c * t * (1 - 2 * c * t));
    if (di >= 0 || i0 === 1) {
      phi = (y >= 0 ? 5 : -5) * (di + i);
      var j = 50, delta;
      do {
        i = min(18, abs(phi) / 5);
        i0 = floor(i);
        di = i - i0;
        ay = K[i0][1];
        by = K[i0 + 1][1];
        cy = K[min(19, i0 + 2)][1];
        phi -= (delta = (y >= 0 ? halfPi : -halfPi) * (by + di * (cy - ay) / 2 + di * di * (cy - 2 * by + ay) / 2) - y) * degrees;
      } while (abs(delta) > epsilon2 && --j > 0);
      break;
    }
  } while (--i0 >= 0);
  var ax = K[i0][0],
      bx = K[i0 + 1][0],
      cx = K[min(19, i0 + 2)][0];
  return [
    x / (bx + di * (cx - ax) / 2 + di * di * (cx - 2 * bx + ax) / 2),
    phi * radians
  ];
};

var robinson = function() {
  return d3Geo.geoProjection(robinsonRaw)
      .scale(152.63);
};

function satelliteVerticalRaw(P) {
  function forward(lambda, phi) {
    var cosPhi = cos(phi),
        k = (P - 1) / (P - cosPhi * cos(lambda));
    return [
      k * cosPhi * sin(lambda),
      k * sin(phi)
    ];
  }

  forward.invert = function(x, y) {
    var rho2 = x * x + y * y,
        rho = sqrt(rho2),
        sinc = (P - sqrt(1 - rho2 * (P + 1) / (P - 1))) / ((P - 1) / rho + rho / (P - 1));
    return [
      atan2(x * sinc, rho * sqrt(1 - sinc * sinc)),
      rho ? asin(y * sinc / rho) : 0
    ];
  };

  return forward;
}

function satelliteRaw(P, omega) {
  var vertical = satelliteVerticalRaw(P);
  if (!omega) return vertical;
  var cosOmega = cos(omega),
      sinOmega = sin(omega);

  function forward(lambda, phi) {
    var coordinates = vertical(lambda, phi),
        y = coordinates[1],
        A = y * sinOmega / (P - 1) + cosOmega;
    return [
      coordinates[0] * cosOmega / A,
      y / A
    ];
  }

  forward.invert = function(x, y) {
    var k = (P - 1) / (P - 1 - y * sinOmega);
    return vertical.invert(k * x, k * y * cosOmega);
  };

  return forward;
}

var satellite = function() {
  var distance = 2,
      omega = 0,
      m = d3Geo.geoProjectionMutator(satelliteRaw),
      p = m(distance, omega);

  // As a multiple of radius.
  p.distance = function(_) {
    if (!arguments.length) return distance;
    return m(distance = +_, omega);
  };

  p.tilt = function(_) {
    if (!arguments.length) return omega * degrees;
    return m(distance, omega = _ * radians);
  };

  return p
      .scale(432.147)
      .clipAngle(acos(1 / distance) * degrees - 1e-6);
};

var epsilon$1 = 1e-4;
var epsilonInverse = 1e4;
var x0 = -180;
var x0e = x0 + epsilon$1;
var x1 = 180;
var x1e = x1 - epsilon$1;
var y0 = -90;
var y0e = y0 + epsilon$1;
var y1 = 90;
var y1e = y1 - epsilon$1;

function nonempty(coordinates) {
  return coordinates.length > 0;
}

function quantize$1(x) {
  return Math.floor(x * epsilonInverse) / epsilonInverse;
}

function normalizePoint(y) {
  return y === y0 || y === y1 ? [0, y] : [x0, quantize$1(y)]; // pole or antimeridian?
}

function clampPoint(p) {
  var x = p[0], y = p[1], clamped = false;
  if (x <= x0e) x = x0, clamped = true;
  else if (x >= x1e) x = x1, clamped = true;
  if (y <= y0e) y = y0, clamped = true;
  else if (y >= y1e) y = y1, clamped = true;
  return clamped ? [x, y] : p;
}

function clampPoints(points) {
  return points.map(clampPoint);
}

// For each ring, detect where it crosses the antimeridian or pole.
function extractFragments(rings, polygon, fragments) {
  for (var j = 0, m = rings.length; j < m; ++j) {
    var ring = rings[j].slice();

    // By default, assume that this ring doesn’t need any stitching.
    fragments.push({index: -1, polygon: polygon, ring: ring});

    for (var i = 0, n = ring.length; i < n; ++i) {
      var point = ring[i],
          x = point[0],
          y = point[1];

      // If this is an antimeridian or polar point…
      if (x <= x0e || x >= x1e || y <= y0e || y >= y1e) {
        ring[i] = clampPoint(point);

        // Advance through any antimeridian or polar points…
        for (var k = i + 1; k < n; ++k) {
          var pointk = ring[k],
              xk = pointk[0],
              yk = pointk[1];
          if (xk > x0e && xk < x1e && yk > y0e && yk < y1e) break;
        }

        // If this was just a single antimeridian or polar point,
        // we don’t need to cut this ring into a fragment;
        // we can just leave it as-is.
        if (k === i + 1) continue;

        // Otherwise, if this is not the first point in the ring,
        // cut the current fragment so that it ends at the current point.
        // The current point is also normalized for later joining.
        if (i) {
          var fragmentBefore = {index: -1, polygon: polygon, ring: ring.slice(0, i + 1)};
          fragmentBefore.ring[fragmentBefore.ring.length - 1] = normalizePoint(y);
          fragments[fragments.length - 1] = fragmentBefore;
        }

        // If the ring started with an antimeridian fragment,
        // we can ignore that fragment entirely.
        else fragments.pop();

        // If the remainder of the ring is an antimeridian fragment,
        // move on to the next ring.
        if (k >= n) break;

        // Otherwise, add the remaining ring fragment and continue.
        fragments.push({index: -1, polygon: polygon, ring: ring = ring.slice(k - 1)});
        ring[0] = normalizePoint(ring[0][1]);
        i = -1;
        n = ring.length;
      }
    }
  }
}

// Now stitch the fragments back together into rings.
function stitchFragments(fragments) {
  var i, n = fragments.length;

  // To connect the fragments start-to-end, create a simple index by end.
  var fragmentByStart = {},
      fragmentByEnd = {},
      fragment,
      start,
      startFragment,
      end,
      endFragment;

  // For each fragment…
  for (i = 0; i < n; ++i) {
    fragment = fragments[i];
    start = fragment.ring[0];
    end = fragment.ring[fragment.ring.length - 1];

    // If this fragment is closed, add it as a standalone ring.
    if (start[0] === end[0] && start[1] === end[1]) {
      fragment.polygon.push(fragment.ring);
      fragments[i] = null;
      continue;
    }

    fragment.index = i;
    fragmentByStart[start] = fragmentByEnd[end] = fragment;
  }

  // For each open fragment…
  for (i = 0; i < n; ++i) {
    fragment = fragments[i];
    if (fragment) {
      start = fragment.ring[0];
      end = fragment.ring[fragment.ring.length - 1];
      startFragment = fragmentByEnd[start];
      endFragment = fragmentByStart[end];

      delete fragmentByStart[start];
      delete fragmentByEnd[end];

      // If this fragment is closed, add it as a standalone ring.
      if (start[0] === end[0] && start[1] === end[1]) {
        fragment.polygon.push(fragment.ring);
        continue;
      }

      if (startFragment) {
        delete fragmentByEnd[start];
        delete fragmentByStart[startFragment.ring[0]];
        startFragment.ring.pop(); // drop the shared coordinate
        fragments[startFragment.index] = null;
        fragment = {index: -1, polygon: startFragment.polygon, ring: startFragment.ring.concat(fragment.ring)};

        if (startFragment === endFragment) {
          // Connect both ends to this single fragment to create a ring.
          fragment.polygon.push(fragment.ring);
        } else {
          fragment.index = n++;
          fragments.push(fragmentByStart[fragment.ring[0]] = fragmentByEnd[fragment.ring[fragment.ring.length - 1]] = fragment);
        }
      } else if (endFragment) {
        delete fragmentByStart[end];
        delete fragmentByEnd[endFragment.ring[endFragment.ring.length - 1]];
        fragment.ring.pop(); // drop the shared coordinate
        fragment = {index: n++, polygon: endFragment.polygon, ring: fragment.ring.concat(endFragment.ring)};
        fragments[endFragment.index] = null;
        fragments.push(fragmentByStart[fragment.ring[0]] = fragmentByEnd[fragment.ring[fragment.ring.length - 1]] = fragment);
      } else {
        fragment.ring.push(fragment.ring[0]); // close ring
        fragment.polygon.push(fragment.ring);
      }
    }
  }
}

function stitchFeature(input) {
  var output = {type: "Feature", geometry: stitchGeometry(input.geometry)};
  if (input.id != null) output.id = input.id;
  if (input.bbox != null) output.bbox = input.bbox;
  if (input.properties != null) output.properties = input.properties;
  return output;
}

function stitchGeometry(input) {
  if (input == null) return input;
  var output, fragments, i, n;
  switch (input.type) {
    case "GeometryCollection": output = {type: "GeometryCollection", geometries: input.geometries.map(stitchGeometry)}; break;
    case "Point": output = {type: "Point", coordinates: clampPoint(input.coordinates)}; break;
    case "MultiPoint": case "LineString": output = {type: input.type, coordinates: clampPoints(input.coordinates)}; break;
    case "MultiLineString": output = {type: "MultiLineString", coordinates: input.coordinates.map(clampPoints)}; break;
    case "Polygon": {
      var polygon = [];
      extractFragments(input.coordinates, polygon, fragments = []);
      stitchFragments(fragments);
      output = {type: "Polygon", coordinates: polygon};
      break;
    }
    case "MultiPolygon": {
      fragments = [], i = -1, n = input.coordinates.length;
      var polygons = new Array(n);
      while (++i < n) extractFragments(input.coordinates[i], polygons[i] = [], fragments);
      stitchFragments(fragments);
      output = {type: "MultiPolygon", coordinates: polygons.filter(nonempty)};
      break;
    }
    default: return input;
  }
  if (input.bbox != null) output.bbox = input.bbox;
  return output;
}

var stitch = function(input) {
  if (input == null) return input;
  switch (input.type) {
    case "Feature": return stitchFeature(input);
    case "FeatureCollection": {
      var output = {type: "FeatureCollection", features: input.features.map(stitchFeature)};
      if (input.bbox != null) output.bbox = input.bbox;
      return output;
    }
    default: return stitchGeometry(input);
  }
};

function timesRaw(lambda, phi) {
  var t = tan(phi / 2),
      s = sin(quarterPi * t);
  return [
    lambda * (0.74482 - 0.34588 * s * s),
    1.70711 * t
  ];
}

timesRaw.invert = function(x, y) {
  var t = y / 1.70711,
      s = sin(quarterPi * t);
  return [
    x / (0.74482 - 0.34588 * s * s),
    2 * atan(t)
  ];
};

var times = function() {
  return d3Geo.geoProjection(timesRaw)
      .scale(146.153);
};

// Compute the origin as the midpoint of the two reference points.
// Rotate one of the reference points by the origin.
// Apply the spherical law of sines to compute gamma rotation.
var twoPoint = function(raw, p0, p1) {
  var i = d3Geo.geoInterpolate(p0, p1),
      o = i(0.5),
      a = d3Geo.geoRotation([-o[0], -o[1]])(p0),
      b = i.distance / 2,
      y = -asin(sin(a[1] * radians) / sin(b)),
      R = [-o[0], -o[1], -(a[0] > 0 ? pi - y : y) * degrees],
      p = d3Geo.geoProjection(raw(b)).rotate(R),
      r = d3Geo.geoRotation(R),
      center = p.center;

  delete p.rotate;

  p.center = function(_) {
    return arguments.length ? center(r(_)) : r.invert(center());
  };

  return p
      .clipAngle(90);
};

function twoPointAzimuthalRaw(d) {
  var cosd = cos(d);

  function forward(lambda, phi) {
    var coordinates = d3Geo.geoGnomonicRaw(lambda, phi);
    coordinates[0] *= cosd;
    return coordinates;
  }

  forward.invert = function(x, y) {
    return d3Geo.geoGnomonicRaw.invert(x / cosd, y);
  };

  return forward;
}

function twoPointAzimuthalUsa() {
  return twoPointAzimuthal([-158, 21.5], [-77, 39])
      .clipAngle(60)
      .scale(400);
}

function twoPointAzimuthal(p0, p1) {
  return twoPoint(twoPointAzimuthalRaw, p0, p1);
}

// TODO clip to ellipse
function twoPointEquidistantRaw(z0) {
  if (!(z0 *= 2)) return d3Geo.geoAzimuthalEquidistantRaw;
  var lambdaa = -z0 / 2,
      lambdab = -lambdaa,
      z02 = z0 * z0,
      tanLambda0 = tan(lambdab),
      S = 0.5 / sin(lambdab);

  function forward(lambda, phi) {
    var za = acos(cos(phi) * cos(lambda - lambdaa)),
        zb = acos(cos(phi) * cos(lambda - lambdab)),
        ys = phi < 0 ? -1 : 1;
    za *= za, zb *= zb;
    return [
      (za - zb) / (2 * z0),
      ys * sqrt(4 * z02 * zb - (z02 - za + zb) * (z02 - za + zb)) / (2 * z0)
    ];
  }

  forward.invert = function(x, y) {
    var y2 = y * y,
        cosza = cos(sqrt(y2 + (t = x + lambdaa) * t)),
        coszb = cos(sqrt(y2 + (t = x + lambdab) * t)),
        t,
        d;
    return [
      atan2(d = cosza - coszb, t = (cosza + coszb) * tanLambda0),
      (y < 0 ? -1 : 1) * acos(sqrt(t * t + d * d) * S)
    ];
  };

  return forward;
}

function twoPointEquidistantUsa() {
  return twoPointEquidistant([-158, 21.5], [-77, 39])
      .clipAngle(130)
      .scale(122.571);
}

function twoPointEquidistant(p0, p1) {
  return twoPoint(twoPointEquidistantRaw, p0, p1);
}

function vanDerGrintenRaw(lambda, phi) {
  if (abs(phi) < epsilon) return [lambda, 0];
  var sinTheta = abs(phi / halfPi),
      theta = asin(sinTheta);
  if (abs(lambda) < epsilon || abs(abs(phi) - halfPi) < epsilon) return [0, sign(phi) * pi * tan(theta / 2)];
  var cosTheta = cos(theta),
      A = abs(pi / lambda - lambda / pi) / 2,
      A2 = A * A,
      G = cosTheta / (sinTheta + cosTheta - 1),
      P = G * (2 / sinTheta - 1),
      P2 = P * P,
      P2_A2 = P2 + A2,
      G_P2 = G - P2,
      Q = A2 + G;
  return [
    sign(lambda) * pi * (A * G_P2 + sqrt(A2 * G_P2 * G_P2 - P2_A2 * (G * G - P2))) / P2_A2,
    sign(phi) * pi * (P * Q - A * sqrt((A2 + 1) * P2_A2 - Q * Q)) / P2_A2
  ];
}

vanDerGrintenRaw.invert = function(x, y) {
  if (abs(y) < epsilon) return [x, 0];
  if (abs(x) < epsilon) return [0, halfPi * sin(2 * atan(y / pi))];
  var x2 = (x /= pi) * x,
      y2 = (y /= pi) * y,
      x2_y2 = x2 + y2,
      z = x2_y2 * x2_y2,
      c1 = -abs(y) * (1 + x2_y2),
      c2 = c1 - 2 * y2 + x2,
      c3 = -2 * c1 + 1 + 2 * y2 + z,
      d = y2 / c3 + (2 * c2 * c2 * c2 / (c3 * c3 * c3) - 9 * c1 * c2 / (c3 * c3)) / 27,
      a1 = (c1 - c2 * c2 / (3 * c3)) / c3,
      m1 = 2 * sqrt(-a1 / 3),
      theta1 = acos(3 * d / (a1 * m1)) / 3;
  return [
    pi * (x2_y2 - 1 + sqrt(1 + 2 * (x2 - y2) + z)) / (2 * x),
    sign(y) * pi * (-m1 * cos(theta1 + pi / 3) - c2 / (3 * c3))
  ];
};

var vanDerGrinten = function() {
  return d3Geo.geoProjection(vanDerGrintenRaw)
      .scale(79.4183);
};

function vanDerGrinten2Raw(lambda, phi) {
  if (abs(phi) < epsilon) return [lambda, 0];
  var sinTheta = abs(phi / halfPi),
      theta = asin(sinTheta);
  if (abs(lambda) < epsilon || abs(abs(phi) - halfPi) < epsilon) return [0, sign(phi) * pi * tan(theta / 2)];
  var cosTheta = cos(theta),
      A = abs(pi / lambda - lambda / pi) / 2,
      A2 = A * A,
      x1 = cosTheta * (sqrt(1 + A2) - A * cosTheta) / (1 + A2 * sinTheta * sinTheta);
  return [
    sign(lambda) * pi * x1,
    sign(phi) * pi * sqrt(1 - x1 * (2 * A + x1))
  ];
}

vanDerGrinten2Raw.invert = function(x, y) {
  if (!x) return [0, halfPi * sin(2 * atan(y / pi))];
  var x1 = abs(x / pi),
      A = (1 - x1 * x1 - (y /= pi) * y) / (2 * x1),
      A2 = A * A,
      B = sqrt(A2 + 1);
  return [
    sign(x) * pi * (B - A),
    sign(y) * halfPi * sin(2 * atan2(sqrt((1 - 2 * A * x1) * (A + B) - x1), sqrt(B + A + x1)))
  ];
};

var vanDerGrinten2 = function() {
  return d3Geo.geoProjection(vanDerGrinten2Raw)
      .scale(79.4183);
};

function vanDerGrinten3Raw(lambda, phi) {
  if (abs(phi) < epsilon) return [lambda, 0];
  var sinTheta = phi / halfPi,
      theta = asin(sinTheta);
  if (abs(lambda) < epsilon || abs(abs(phi) - halfPi) < epsilon) return [0, pi * tan(theta / 2)];
  var A = (pi / lambda - lambda / pi) / 2,
      y1 = sinTheta / (1 + cos(theta));
  return [
    pi * (sign(lambda) * sqrt(A * A + 1 - y1 * y1) - A),
    pi * y1
  ];
}

vanDerGrinten3Raw.invert = function(x, y) {
  if (!y) return [x, 0];
  var y1 = y / pi,
      A = (pi * pi * (1 - y1 * y1) - x * x) / (2 * pi * x);
  return [
    x ? pi * (sign(x) * sqrt(A * A + 1) - A) : 0,
    halfPi * sin(2 * atan(y1))
  ];
};

var vanDerGrinten3 = function() {
  return d3Geo.geoProjection(vanDerGrinten3Raw)
        .scale(79.4183);
};

function vanDerGrinten4Raw(lambda, phi) {
  if (!phi) return [lambda, 0];
  var phi0 = abs(phi);
  if (!lambda || phi0 === halfPi) return [0, phi];
  var B = phi0 / halfPi,
      B2 = B * B,
      C = (8 * B - B2 * (B2 + 2) - 5) / (2 * B2 * (B - 1)),
      C2 = C * C,
      BC = B * C,
      B_C2 = B2 + C2 + 2 * BC,
      B_3C = B + 3 * C,
      lambda0 = lambda / halfPi,
      lambda1 = lambda0 + 1 / lambda0,
      D = sign(abs(lambda) - halfPi) * sqrt(lambda1 * lambda1 - 4),
      D2 = D * D,
      F = B_C2 * (B2 + C2 * D2 - 1) + (1 - B2) * (B2 * (B_3C * B_3C + 4 * C2) + 12 * BC * C2 + 4 * C2 * C2),
      x1 = (D * (B_C2 + C2 - 1) + 2 * sqrt(F)) / (4 * B_C2 + D2);
  return [
    sign(lambda) * halfPi * x1,
    sign(phi) * halfPi * sqrt(1 + D * abs(x1) - x1 * x1)
  ];
}

vanDerGrinten4Raw.invert = function(x, y) {
  var delta;
  if (!x || !y) return [x, y];
  y /= pi;
  var x1 = sign(x) * x / halfPi,
      D = (x1 * x1 - 1 + 4 * y * y) / abs(x1),
      D2 = D * D,
      B = 2 * y,
      i = 50;
  do {
    var B2 = B * B,
        C = (8 * B - B2 * (B2 + 2) - 5) / (2 * B2 * (B - 1)),
        C_ = (3 * B - B2 * B - 10) / (2 * B2 * B),
        C2 = C * C,
        BC = B * C,
        B_C = B + C,
        B_C2 = B_C * B_C,
        B_3C = B + 3 * C,
        F = B_C2 * (B2 + C2 * D2 - 1) + (1 - B2) * (B2 * (B_3C * B_3C + 4 * C2) + C2 * (12 * BC + 4 * C2)),
        F_ = -2 * B_C * (4 * BC * C2 + (1 - 4 * B2 + 3 * B2 * B2) * (1 + C_) + C2 * (-6 + 14 * B2 - D2 + (-8 + 8 * B2 - 2 * D2) * C_) + BC * (-8 + 12 * B2 + (-10 + 10 * B2 - D2) * C_)),
        sqrtF = sqrt(F),
        f = D * (B_C2 + C2 - 1) + 2 * sqrtF - x1 * (4 * B_C2 + D2),
        f_ = D * (2 * C * C_ + 2 * B_C * (1 + C_)) + F_ / sqrtF - 8 * B_C * (D * (-1 + C2 + B_C2) + 2 * sqrtF) * (1 + C_) / (D2 + 4 * B_C2);
    B -= delta = f / f_;
  } while (delta > epsilon && --i > 0);
  return [
    sign(x) * (sqrt(D * D + 4) + D) * pi / 4,
    halfPi * B
  ];
};

var vanDerGrinten4 = function() {
  return d3Geo.geoProjection(vanDerGrinten4Raw)
      .scale(127.16);
};

var A = 4 * pi + 3 * sqrt(3);
var B = 2 * sqrt(2 * pi * sqrt(3) / A);

var wagner4Raw = mollweideBromleyRaw(B * sqrt(3) / pi, B, A / 6);

var wagner4 = function() {
  return d3Geo.geoProjection(wagner4Raw)
      .scale(176.84);
};

function wagner6Raw(lambda, phi) {
  return [lambda * sqrt(1 - 3 * phi * phi / (pi * pi)), phi];
}

wagner6Raw.invert = function(x, y) {
  return [x / sqrt(1 - 3 * y * y / (pi * pi)), y];
};

var wagner6 = function() {
  return d3Geo.geoProjection(wagner6Raw)
      .scale(152.63);
};

function wagner7Raw(lambda, phi) {
  var s = 0.90631 * sin(phi),
      c0 = sqrt(1 - s * s),
      c1 = sqrt(2 / (1 + c0 * cos(lambda /= 3)));
  return [
    2.66723 * c0 * c1 * sin(lambda),
    1.24104 * s * c1
  ];
}

wagner7Raw.invert = function(x, y) {
  var t1 = x / 2.66723,
      t2 = y / 1.24104,
      p = sqrt(t1 * t1 + t2 * t2),
      c = 2 * asin(p / 2);
  return [
    3 * atan2(x * tan(c), 2.66723 * p),
    p && asin(y * sin(c) / (1.24104 * 0.90631 * p))
  ];
};

var wagner7 = function() {
  return d3Geo.geoProjection(wagner7Raw)
      .scale(172.632);
};

function wiechelRaw(lambda, phi) {
  var cosPhi = cos(phi),
      sinPhi = cos(lambda) * cosPhi,
      sin1_Phi = 1 - sinPhi,
      cosLambda = cos(lambda = atan2(sin(lambda) * cosPhi, -sin(phi))),
      sinLambda = sin(lambda);
  cosPhi = sqrt(1 - sinPhi * sinPhi);
  return [
    sinLambda * cosPhi - cosLambda * sin1_Phi,
    -cosLambda * cosPhi - sinLambda * sin1_Phi
  ];
}

wiechelRaw.invert = function(x, y) {
  var w = (x * x + y * y) / -2,
      k = sqrt(-w * (2 + w)),
      b = y * w + x * k,
      a = x * w - y * k,
      D = sqrt(a * a + b * b);
  return [
    atan2(k * b, D * (1 + w)),
    D ? -asin(k * a / D) : 0
  ];
};

var wiechel = function() {
  return d3Geo.geoProjection(wiechelRaw)
      .rotate([0, -90, 45])
      .scale(124.75)
      .clipAngle(180 - 1e-3);
};

function winkel3Raw(lambda, phi) {
  var coordinates = aitoffRaw(lambda, phi);
  return [
    (coordinates[0] + lambda / halfPi) / 2,
    (coordinates[1] + phi) / 2
  ];
}

winkel3Raw.invert = function(x, y) {
  var lambda = x, phi = y, i = 25;
  do {
    var cosphi = cos(phi),
        sinphi = sin(phi),
        sin_2phi = sin(2 * phi),
        sin2phi = sinphi * sinphi,
        cos2phi = cosphi * cosphi,
        sinlambda = sin(lambda),
        coslambda_2 = cos(lambda / 2),
        sinlambda_2 = sin(lambda / 2),
        sin2lambda_2 = sinlambda_2 * sinlambda_2,
        C = 1 - cos2phi * coslambda_2 * coslambda_2,
        E = C ? acos(cosphi * coslambda_2) * sqrt(F = 1 / C) : F = 0,
        F,
        fx = 0.5 * (2 * E * cosphi * sinlambda_2 + lambda / halfPi) - x,
        fy = 0.5 * (E * sinphi + phi) - y,
        dxdlambda = 0.5 * F * (cos2phi * sin2lambda_2 + E * cosphi * coslambda_2 * sin2phi) + 0.5 / halfPi,
        dxdphi = F * (sinlambda * sin_2phi / 4 - E * sinphi * sinlambda_2),
        dydlambda = 0.125 * F * (sin_2phi * sinlambda_2 - E * sinphi * cos2phi * sinlambda),
        dydphi = 0.5 * F * (sin2phi * coslambda_2 + E * sin2lambda_2 * cosphi) + 0.5,
        denominator = dxdphi * dydlambda - dydphi * dxdlambda,
        dlambda = (fy * dxdphi - fx * dydphi) / denominator,
        dphi = (fx * dydlambda - fy * dxdlambda) / denominator;
    lambda -= dlambda, phi -= dphi;
  } while ((abs(dlambda) > epsilon || abs(dphi) > epsilon) && --i > 0);
  return [lambda, phi];
};

var winkel3 = function() {
  return d3Geo.geoProjection(winkel3Raw)
      .scale(158.837);
};

exports.geoAiry = airy;
exports.geoAiryRaw = airyRaw;
exports.geoAitoff = aitoff;
exports.geoAitoffRaw = aitoffRaw;
exports.geoArmadillo = armadillo;
exports.geoArmadilloRaw = armadilloRaw;
exports.geoAugust = august;
exports.geoAugustRaw = augustRaw;
exports.geoBaker = baker;
exports.geoBakerRaw = bakerRaw;
exports.geoBerghaus = berghaus;
exports.geoBerghausRaw = berghausRaw;
exports.geoBoggs = boggs;
exports.geoBoggsRaw = boggsRaw;
exports.geoBonne = bonne;
exports.geoBonneRaw = bonneRaw;
exports.geoBottomley = bottomley;
exports.geoBottomleyRaw = bottomleyRaw;
exports.geoBromley = bromley;
exports.geoBromleyRaw = bromleyRaw;
exports.geoChamberlin = chamberlin;
exports.geoChamberlinRaw = chamberlinRaw;
exports.geoChamberlinAfrica = chamberlinAfrica;
exports.geoCollignon = collignon;
exports.geoCollignonRaw = collignonRaw;
exports.geoCraig = craig;
exports.geoCraigRaw = craigRaw;
exports.geoCraster = craster;
exports.geoCrasterRaw = crasterRaw;
exports.geoCylindricalEqualArea = cylindricalEqualArea;
exports.geoCylindricalEqualAreaRaw = cylindricalEqualAreaRaw;
exports.geoCylindricalStereographic = cylindricalStereographic;
exports.geoCylindricalStereographicRaw = cylindricalStereographicRaw;
exports.geoEckert1 = eckert1;
exports.geoEckert1Raw = eckert1Raw;
exports.geoEckert2 = eckert2;
exports.geoEckert2Raw = eckert2Raw;
exports.geoEckert3 = eckert3;
exports.geoEckert3Raw = eckert3Raw;
exports.geoEckert4 = eckert4;
exports.geoEckert4Raw = eckert4Raw;
exports.geoEckert5 = eckert5;
exports.geoEckert5Raw = eckert5Raw;
exports.geoEckert6 = eckert6;
exports.geoEckert6Raw = eckert6Raw;
exports.geoEisenlohr = eisenlohr;
exports.geoEisenlohrRaw = eisenlohrRaw;
exports.geoFahey = fahey;
exports.geoFaheyRaw = faheyRaw;
exports.geoFoucaut = foucaut;
exports.geoFoucautRaw = foucautRaw;
exports.geoGilbert = gilbert;
exports.geoGingery = gingery;
exports.geoGingeryRaw = gingeryRaw;
exports.geoGinzburg4 = ginzburg4;
exports.geoGinzburg4Raw = ginzburg4Raw;
exports.geoGinzburg5 = ginzburg5;
exports.geoGinzburg5Raw = ginzburg5Raw;
exports.geoGinzburg6 = ginzburg6;
exports.geoGinzburg6Raw = ginzburg6Raw;
exports.geoGinzburg8 = ginzburg8;
exports.geoGinzburg8Raw = ginzburg8Raw;
exports.geoGinzburg9 = ginzburg9;
exports.geoGinzburg9Raw = ginzburg9Raw;
exports.geoGringorten = gringorten;
exports.geoGringortenRaw = gringortenRaw;
exports.geoGuyou = guyou;
exports.geoGuyouRaw = guyouRaw;
exports.geoHammer = hammer;
exports.geoHammerRaw = hammerRaw;
exports.geoHammerRetroazimuthal = hammerRetroazimuthal;
exports.geoHammerRetroazimuthalRaw = hammerRetroazimuthalRaw;
exports.geoHealpix = healpix;
exports.geoHealpixRaw = healpixRaw;
exports.geoHill = hill;
exports.geoHillRaw = hillRaw;
exports.geoHomolosine = homolosine;
exports.geoHomolosineRaw = homolosineRaw;
exports.geoInterrupt = interrupt;
exports.geoInterruptedBoggs = boggs$1;
exports.geoInterruptedHomolosine = homolosine$1;
exports.geoInterruptedMollweide = mollweide$1;
exports.geoInterruptedMollweideHemispheres = mollweideHemispheres;
exports.geoInterruptedSinuMollweide = sinuMollweide$1;
exports.geoInterruptedSinusoidal = sinusoidal$1;
exports.geoKavrayskiy7 = kavrayskiy7;
exports.geoKavrayskiy7Raw = kavrayskiy7Raw;
exports.geoLagrange = lagrange;
exports.geoLagrangeRaw = lagrangeRaw;
exports.geoLarrivee = larrivee;
exports.geoLarriveeRaw = larriveeRaw;
exports.geoLaskowski = laskowski;
exports.geoLaskowskiRaw = laskowskiRaw;
exports.geoLittrow = littrow;
exports.geoLittrowRaw = littrowRaw;
exports.geoLoximuthal = loximuthal;
exports.geoLoximuthalRaw = loximuthalRaw;
exports.geoMiller = miller;
exports.geoMillerRaw = millerRaw;
exports.geoModifiedStereographic = modifiedStereographic;
exports.geoModifiedStereographicRaw = modifiedStereographicRaw;
exports.geoModifiedStereographicAlaska = modifiedStereographicAlaska;
exports.geoModifiedStereographicGs48 = modifiedStereographicGs48;
exports.geoModifiedStereographicGs50 = modifiedStereographicGs50;
exports.geoModifiedStereographicMiller = modifiedStereographicMiller;
exports.geoModifiedStereographicLee = modifiedStereographicLee;
exports.geoMollweide = mollweide;
exports.geoMollweideRaw = mollweideRaw;
exports.geoMtFlatPolarParabolic = mtFlatPolarParabolic;
exports.geoMtFlatPolarParabolicRaw = mtFlatPolarParabolicRaw;
exports.geoMtFlatPolarQuartic = mtFlatPolarQuartic;
exports.geoMtFlatPolarQuarticRaw = mtFlatPolarQuarticRaw;
exports.geoMtFlatPolarSinusoidal = mtFlatPolarSinusoidal;
exports.geoMtFlatPolarSinusoidalRaw = mtFlatPolarSinusoidalRaw;
exports.geoNaturalEarth = naturalEarth;
exports.geoNaturalEarthRaw = naturalEarthRaw;
exports.geoNaturalEarth2 = naturalEarth2;
exports.geoNaturalEarth2Raw = naturalEarth2Raw;
exports.geoNellHammer = nellHammer;
exports.geoNellHammerRaw = nellHammerRaw;
exports.geoPatterson = patterson;
exports.geoPattersonRaw = pattersonRaw;
exports.geoPolyconic = polyconic;
exports.geoPolyconicRaw = polyconicRaw;
exports.geoPolyhedral = polyhedral;
exports.geoPolyhedralButterfly = butterfly;
exports.geoPolyhedralCollignon = collignon$1;
exports.geoPolyhedralWaterman = waterman;
exports.geoProject = index;
exports.geoGringortenQuincuncial = gringorten$1;
exports.geoPeirceQuincuncial = peirce;
exports.geoPierceQuincuncial = peirce;
exports.geoQuantize = quantize;
exports.geoQuincuncial = quincuncial;
exports.geoRectangularPolyconic = rectangularPolyconic;
exports.geoRectangularPolyconicRaw = rectangularPolyconicRaw;
exports.geoRobinson = robinson;
exports.geoRobinsonRaw = robinsonRaw;
exports.geoSatellite = satellite;
exports.geoSatelliteRaw = satelliteRaw;
exports.geoSinuMollweide = sinuMollweide;
exports.geoSinuMollweideRaw = sinuMollweideRaw;
exports.geoSinusoidal = sinusoidal;
exports.geoSinusoidalRaw = sinusoidalRaw;
exports.geoStitch = stitch;
exports.geoTimes = times;
exports.geoTimesRaw = timesRaw;
exports.geoTwoPointAzimuthal = twoPointAzimuthal;
exports.geoTwoPointAzimuthalRaw = twoPointAzimuthalRaw;
exports.geoTwoPointAzimuthalUsa = twoPointAzimuthalUsa;
exports.geoTwoPointEquidistant = twoPointEquidistant;
exports.geoTwoPointEquidistantRaw = twoPointEquidistantRaw;
exports.geoTwoPointEquidistantUsa = twoPointEquidistantUsa;
exports.geoVanDerGrinten = vanDerGrinten;
exports.geoVanDerGrintenRaw = vanDerGrintenRaw;
exports.geoVanDerGrinten2 = vanDerGrinten2;
exports.geoVanDerGrinten2Raw = vanDerGrinten2Raw;
exports.geoVanDerGrinten3 = vanDerGrinten3;
exports.geoVanDerGrinten3Raw = vanDerGrinten3Raw;
exports.geoVanDerGrinten4 = vanDerGrinten4;
exports.geoVanDerGrinten4Raw = vanDerGrinten4Raw;
exports.geoWagner4 = wagner4;
exports.geoWagner4Raw = wagner4Raw;
exports.geoWagner6 = wagner6;
exports.geoWagner6Raw = wagner6Raw;
exports.geoWagner7 = wagner7;
exports.geoWagner7Raw = wagner7Raw;
exports.geoWiechel = wiechel;
exports.geoWiechelRaw = wiechelRaw;
exports.geoWinkel3 = winkel3;
exports.geoWinkel3Raw = winkel3Raw;

Object.defineProperty(exports, '__esModule', { value: true });

})));
