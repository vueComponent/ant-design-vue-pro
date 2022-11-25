/**
 * @fileOverview The entry of chart's animation
 * @author sima.zhang
 */
var Util = require('../util');

var Animate = require('./animate');

var MatrixUtil = Util.MatrixUtil;
var mat3 = MatrixUtil.mat3; // 获取图组内所有的shapes

function getShapes(container, viewId) {
  var shapes = [];

  if (container.get('animate') === false) {
    return [];
  }

  var children = container.get('children');
  Util.each(children, function (child) {
    if (child.isGroup) {
      shapes = shapes.concat(getShapes(child, viewId));
    } else if (child.isShape && child._id) {
      var id = child._id;
      id = id.split('-')[0];

      if (id === viewId) {
        shapes.push(child);
      }
    }
  });
  return shapes;
}

function cache(shapes) {
  var rst = {};
  Util.each(shapes, function (shape) {
    if (!shape._id || shape.isClip) return;
    var id = shape._id;
    rst[id] = {
      _id: id,
      type: shape.get('type'),
      attrs: Util.cloneDeep(shape.attr()),
      // 原始属性
      name: shape.name,
      index: shape.get('index'),
      animateCfg: shape.get('animateCfg'),
      coord: shape.get('coord')
    };
  });
  return rst;
}

function getAnimate(geomType, coord, animationType, animationName) {
  var result;

  if (animationName) {
    result = Animate.Action[animationType][animationName];
  } else {
    result = Animate.getAnimation(geomType, coord, animationType);
  }

  return result;
}

function getAnimateCfg(geomType, animationType, animateCfg) {
  var defaultCfg = Animate.getAnimateCfg(geomType, animationType);

  if (animateCfg && animateCfg[animationType]) {
    return Util.deepMix({}, defaultCfg, animateCfg[animationType]);
  }

  return defaultCfg;
}

function addAnimate(cache, shapes, canvas, isUpdate) {
  var animate;
  var animateCfg;
  var canvasDrawn = false;

  if (isUpdate) {
    // Step: leave -> update -> enter
    var updateShapes = []; // 存储的是 shapes

    var newShapes = []; // 存储的是 shapes

    Util.each(shapes, function (shape) {
      var result = cache[shape._id];

      if (!result) {
        newShapes.push(shape);
      } else {
        shape.setSilent('cacheShape', result);
        updateShapes.push(shape);
        delete cache[shape._id];
      }
    });
    Util.each(cache, function (deletedShape) {
      var name = deletedShape.name,
          coord = deletedShape.coord,
          _id = deletedShape._id,
          attrs = deletedShape.attrs,
          index = deletedShape.index,
          type = deletedShape.type;
      animateCfg = getAnimateCfg(name, 'leave', deletedShape.animateCfg);
      animate = getAnimate(name, coord, 'leave', animateCfg.animation);

      if (Util.isFunction(animate)) {
        var tempShape = canvas.addShape(type, {
          attrs: attrs,
          index: index
        });
        tempShape._id = _id;
        tempShape.name = name;

        if (coord && name !== 'label') {
          var tempShapeMatrix = tempShape.getMatrix();
          var finalMatrix = mat3.multiply([], tempShapeMatrix, coord.matrix);
          tempShape.setMatrix(finalMatrix);
        }

        canvasDrawn = true;
        animate(tempShape, animateCfg, coord);
      }
    });
    Util.each(updateShapes, function (updateShape) {
      var name = updateShape.name;
      var coord = updateShape.get('coord');
      var cacheAttrs = updateShape.get('cacheShape').attrs; // 判断如果属性相同的话就不进行变换

      if (!Util.isEqual(cacheAttrs, updateShape.attr())) {
        animateCfg = getAnimateCfg(name, 'update', updateShape.get('animateCfg'));
        animate = getAnimate(name, coord, 'update', animateCfg.animation);

        if (Util.isFunction(animate)) {
          animate(updateShape, animateCfg, coord);
        } else {
          var endState = Util.cloneDeep(updateShape.attr());
          updateShape.attr(cacheAttrs);
          updateShape.animate(endState, animateCfg.duration, animateCfg.easing, function () {
            updateShape.setSilent('cacheShape', null);
          });
        }

        canvasDrawn = true;
      }
    });
    Util.each(newShapes, function (newShape) {
      var name = newShape.name;
      var coord = newShape.get('coord');
      animateCfg = getAnimateCfg(name, 'enter', newShape.get('animateCfg'));
      animate = getAnimate(name, coord, 'enter', animateCfg.animation);

      if (Util.isFunction(animate)) {
        animate(newShape, animateCfg, coord);
        canvasDrawn = true;
      }
    });
  } else {
    Util.each(shapes, function (shape) {
      var name = shape.name;
      var coord = shape.get('coord');
      animateCfg = getAnimateCfg(name, 'appear', shape.get('animateCfg'));
      animate = getAnimate(name, coord, 'appear', animateCfg.animation);

      if (Util.isFunction(animate)) {
        animate(shape, animateCfg, coord);
        canvasDrawn = true;
      }
    });
  }

  return canvasDrawn;
}

module.exports = {
  execAnimation: function execAnimation(view, isUpdate) {
    var viewContainer = view.get('middlePlot');
    var axisContainer = view.get('backPlot');
    var viewId = view.get('_id');
    var canvas = view.get('canvas');
    var caches = canvas.get(viewId + 'caches') || [];

    if (caches.length === 0) {
      isUpdate = false;
    }

    var shapes = getShapes(viewContainer, viewId);
    var axisShapes = getShapes(axisContainer, viewId);
    var cacheShapes = shapes.concat(axisShapes);
    canvas.setSilent(viewId + 'caches', cache(cacheShapes));
    var drawn;

    if (isUpdate) {
      drawn = addAnimate(caches, cacheShapes, canvas, isUpdate);
    } else {
      drawn = addAnimate(caches, shapes, canvas, isUpdate);
    }

    if (!drawn) {
      canvas.draw();
    }
  }
};