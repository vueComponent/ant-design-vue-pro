var Greedy = require('./greedy');
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
  var bbox = label.getBBox();
  var width = bbox.width;
  var height = bbox.height;
  var attrs = {
    x: x,
    y: y,
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

    default:
      break;
  }

  label.attr(attrs);
  return label.getBBox();
}

module.exports = function (labels) {
  var greedy = new Greedy();
  var toBeRemoved = [];
  var bbox, label, x, y, canFill;

  for (var i = 0; i < labels.length; i++) {
    label = labels[i];
    x = label.attr('x');
    y = label.attr('y');
    canFill = false;

    for (var _i = 0; _i < 8; _i++) {
      bbox = adjustLabelPosition(label, x, y, _i);

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

  for (var _i2 = 0; _i2 < toBeRemoved.length; _i2++) {
    toBeRemoved[_i2].remove();
  }

  return canFill;
};