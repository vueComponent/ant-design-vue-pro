var TAG_MAP = {
  svg: 'svg',
  circle: 'circle',
  rect: 'rect',
  text: 'text',
  path: 'path',
  foreignObject: 'foreignObject',
  polygon: 'polygon',
  ellipse: 'ellipse',
  image: 'image'
};

module.exports = function getShape(x, y, e) {
  var target = e.target || e.srcElement;

  if (!TAG_MAP[target.tagName]) {
    var parent = target.parentNode;

    while (parent && !TAG_MAP[parent.tagName]) {
      parent = parent.parentNode;
    }

    target = parent;
  }

  if (this._cfg.el === target) {
    return this;
  }

  return this.find(function (item) {
    return item._cfg && item._cfg.el === target;
  });
};