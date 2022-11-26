var Greedy = require('./greedy');

var MAX_TIMES = 20;

function spiralFill(label, greedy) {
  var dt = -1;
  var x = label.attr('x'),
      y = label.attr('y');
  var bbox = label.getBBox();
  var maxDelta = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height);
  var dxdy,
      t = -dt,
      dx = 0,
      dy = 0;

  var f = function f(t) {
    return [(t *= 0.1) * Math.cos(t), t * Math.sin(t)];
  };

  if (greedy.hasGap(bbox)) {
    greedy.fillGap(bbox);
    return true;
  }

  var canFill = false,
      times = 0;

  while (Math.min(Math.abs(dx), Math.abs(dy)) < maxDelta && times < MAX_TIMES) {
    dxdy = f(t += dt);
    dx = ~~dxdy[0];
    dy = ~~dxdy[1];
    label.attr({
      x: x + dx,
      y: y + dy
    });
    times++;

    if (greedy.hasGap(label.getBBox())) {
      greedy.fillGap(bbox);
      canFill = true;
      break;
    }
  }

  return canFill;
}

module.exports = function (labels) {
  var label;
  var greedy = new Greedy();
  var toBeRemoved = [];

  for (var i = 0; i < labels.length; i++) {
    label = labels[i];

    if (!spiralFill(label, greedy)) {
      toBeRemoved.push(label);
    }
  }

  for (var _i = 0; _i < toBeRemoved.length; _i++) {
    toBeRemoved[_i].remove();
  }
};