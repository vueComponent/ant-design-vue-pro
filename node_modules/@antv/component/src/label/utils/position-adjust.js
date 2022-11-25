const Greedy = require('./greedy');

/*
   *  根据如下规则尝试放置label
   *                5
   *        ------------------
   *        |    1   |   0   |
   *    8   —————————4————————   7
   *        |    2   |   3   |
   *        ——————————————————
   *                 6
   */
function adjustLabelPosition(label, x, y, index) {
  const bbox = label.getBBox();
  const width = bbox.width;
  const height = bbox.height;
  const attrs = {
    x,
    y,
    textAlign: 'center'
  };
  switch (index) {
    case 0:
      attrs.y -= height / 2;
      attrs.textAlign = 'left';
      break;
    case 1:
      attrs.y -= height / 2;
      attrs.textAlign = 'right';
      break;
    case 2:
      attrs.y += height / 2;
      attrs.textAlign = 'right';
      break;
    case 3:
      attrs.y += height / 2;
      attrs.textAlign = 'left';
      break;
    case 5:
      attrs.y -= height / 2;
      break;

    case 6:
      attrs.y += height / 2;
      break;
    case 7:
      attrs.x += width / 2;
      attrs.textAlign = 'left';
      break;
    case 8:
      attrs.x -= width / 2;
      attrs.textAlign = 'right';
      break;
    default:break;
  }
  label.attr(attrs);
  return label.getBBox();
}

module.exports = function(labels) {
  const greedy = new Greedy();
  const toBeRemoved = [];
  let bbox,
    label,
    x,
    y,
    canFill;

  for (let i = 0; i < labels.length; i++) {
    label = labels[i];
    x = label.attr('x');
    y = label.attr('y');
    canFill = false;
    for (let i = 0; i < 8; i++) {
      bbox = adjustLabelPosition(label, x, y, i);
      if (greedy.hasGap(bbox)) {
        greedy.fillGap(bbox);
        canFill = true;
        break;
      }
    }
    if (!canFill) {
      toBeRemoved.push(label);
    }
  }
  for (let i = 0; i < toBeRemoved.length; i++) {
    toBeRemoved[i].remove();
  }

  return canFill;
};
