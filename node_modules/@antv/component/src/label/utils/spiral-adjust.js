const Greedy = require('./greedy');

const MAX_TIMES = 20;

function spiralFill(label, greedy) {
  const dt = -1;
  const x = label.attr('x'),
    y = label.attr('y');
  const bbox = label.getBBox();
  const maxDelta = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height);
  let dxdy,
    t = -dt,
    dx = 0,
    dy = 0;
  const f = function(t) {
    return [ (t *= 0.1) * Math.cos(t), t * Math.sin(t) ];
  };

  if (greedy.hasGap(bbox)) {
    greedy.fillGap(bbox);
    return true;
  }
  let canFill = false,
    times = 0;
  while (Math.min(Math.abs(dx), Math.abs(dy)) < maxDelta && times < MAX_TIMES) {
    dxdy = f(t += dt);
    dx = ~~dxdy[0];
    dy = ~~dxdy[1];
    label.attr({ x: x + dx, y: y + dy });
    times++;
    if (greedy.hasGap(label.getBBox())) {
      greedy.fillGap(bbox);
      canFill = true;
      break;
    }
  }
  return canFill;
}

module.exports = function(labels) {
  let label;
  const greedy = new Greedy();
  const toBeRemoved = [];
  for (let i = 0; i < labels.length; i++) {
    label = labels[i];
    if (!spiralFill(label, greedy)) {
      toBeRemoved.push(label);
    }
  }
  for (let i = 0; i < toBeRemoved.length; i++) {
    toBeRemoved[i].remove();
  }
};
