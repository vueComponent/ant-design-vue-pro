module.exports = function bboxAdjust(labels, shapes) {
  let labelBBox,
    shapeBBox;
  const toBeRemoved = [];
  for (let i = 0; i < labels.length; i++) {
    labelBBox = labels[i].getBBox();
    shapeBBox = shapes[i].getBBox();
    if (labelBBox.width > shapeBBox.width || labelBBox.height > shapeBBox.height) {
      toBeRemoved.push(labels[i]);
    } else if (labelBBox.width * labelBBox.height > shapeBBox.width * shapeBBox.height) {
      toBeRemoved.push(labels[i]);
    }
  }
  for (let i = 0; i < toBeRemoved.length; i++) {
    toBeRemoved[i].remove();
  }
};
