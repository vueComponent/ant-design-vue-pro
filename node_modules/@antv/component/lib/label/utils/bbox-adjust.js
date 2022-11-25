module.exports = function bboxAdjust(labels, shapes) {
  var labelBBox, shapeBBox;
  var toBeRemoved = [];

  for (var i = 0; i < labels.length; i++) {
    labelBBox = labels[i].getBBox();
    shapeBBox = shapes[i].getBBox();

    if (labelBBox.width > shapeBBox.width || labelBBox.height > shapeBBox.height) {
      toBeRemoved.push(labels[i]);
    } else if (labelBBox.width * labelBBox.height > shapeBBox.width * shapeBBox.height) {
      toBeRemoved.push(labels[i]);
    }
  }

  for (var _i = 0; _i < toBeRemoved.length; _i++) {
    toBeRemoved[_i].remove();
  }
};