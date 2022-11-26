var Util = require('../../util/index');

var regexTags = /[MLHVQTCSAZ]([^MLHVQTCSAZ]*)/ig;
var regexDot = /[^\s\,]+/ig;
var regexLG = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i;
var regexRG = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i;
var regexPR = /^p\s*\(\s*([axyn])\s*\)\s*(.*)/i;
var regexColorStop = /[\d.]+:(#[^\s]+|[^\)]+\))/ig;
var numColorCache = {};

function addStop(steps, gradient) {
  var arr = steps.match(regexColorStop);
  Util.each(arr, function (item) {
    item = item.split(':');
    gradient.addColorStop(item[0], item[1]);
  });
}

function parseLineGradient(color, self, context) {
  var arr = regexLG.exec(color);
  var angle = Util.mod(Util.toRadian(parseFloat(arr[1])), Math.PI * 2);
  var steps = arr[2];
  var box = self.getBBox();
  var start;
  var end;

  if (angle >= 0 && angle < 0.5 * Math.PI) {
    start = {
      x: box.minX,
      y: box.minY
    };
    end = {
      x: box.maxX,
      y: box.maxY
    };
  } else if (0.5 * Math.PI <= angle && angle < Math.PI) {
    start = {
      x: box.maxX,
      y: box.minY
    };
    end = {
      x: box.minX,
      y: box.maxY
    };
  } else if (Math.PI <= angle && angle < 1.5 * Math.PI) {
    start = {
      x: box.maxX,
      y: box.maxY
    };
    end = {
      x: box.minX,
      y: box.minY
    };
  } else {
    start = {
      x: box.minX,
      y: box.maxY
    };
    end = {
      x: box.maxX,
      y: box.minY
    };
  }

  var tanTheta = Math.tan(angle);
  var tanTheta2 = tanTheta * tanTheta;
  var x = (end.x - start.x + tanTheta * (end.y - start.y)) / (tanTheta2 + 1) + start.x;
  var y = tanTheta * (end.x - start.x + tanTheta * (end.y - start.y)) / (tanTheta2 + 1) + start.y;
  var gradient = context.createLinearGradient(start.x, start.y, x, y);
  addStop(steps, gradient);
  return gradient;
}

function parseRadialGradient(color, self, context) {
  var arr = regexRG.exec(color);
  var fx = parseFloat(arr[1]);
  var fy = parseFloat(arr[2]);
  var fr = parseFloat(arr[3]);
  var steps = arr[4]; // 环半径为0时，默认无渐变，取渐变序列的最后一个颜色

  if (fr === 0) {
    var colors = steps.match(regexColorStop);
    return colors[colors.length - 1].split(':')[1];
  }

  var box = self.getBBox();
  var width = box.maxX - box.minX;
  var height = box.maxY - box.minY;
  var r = Math.sqrt(width * width + height * height) / 2;
  var gradient = context.createRadialGradient(box.minX + width * fx, box.minY + height * fy, fr * r, box.minX + width / 2, box.minY + height / 2, r);
  addStop(steps, gradient);
  return gradient;
}

function parsePattern(color, self, context) {
  if (self.get('patternSource') && self.get('patternSource') === color) {
    return self.get('pattern');
  }

  var pattern;
  var img;
  var arr = regexPR.exec(color);
  var repeat = arr[1];
  var source = arr[2]; // Function to be called when pattern loads

  function onload() {
    // Create pattern
    pattern = context.createPattern(img, repeat);
    self.setSilent('pattern', pattern); // be a cache

    self.setSilent('patternSource', color);
  }

  switch (repeat) {
    case 'a':
      repeat = 'repeat';
      break;

    case 'x':
      repeat = 'repeat-x';
      break;

    case 'y':
      repeat = 'repeat-y';
      break;

    case 'n':
      repeat = 'no-repeat';
      break;

    default:
      repeat = 'no-repeat';
  }

  img = new Image(); // If source URL is not a data URL

  if (!source.match(/^data:/i)) {
    // Set crossOrigin for this image
    img.crossOrigin = 'Anonymous';
  }

  img.src = source;

  if (img.complete) {
    onload();
  } else {
    img.onload = onload; // Fix onload() bug in IE9

    img.src = img.src;
  }

  return pattern;
}

module.exports = {
  parsePath: function parsePath(path) {
    path = path || [];

    if (Util.isArray(path)) {
      return path;
    }

    if (Util.isString(path)) {
      path = path.match(regexTags);
      Util.each(path, function (item, index) {
        item = item.match(regexDot);

        if (item[0].length > 1) {
          var tag = item[0].charAt(0);
          item.splice(1, 0, item[0].substr(1));
          item[0] = tag;
        }

        Util.each(item, function (sub, i) {
          if (!isNaN(sub)) {
            item[i] = +sub;
          }
        });
        path[index] = item;
      });
      return path;
    }
  },
  parseStyle: function parseStyle(color, self, context) {
    if (Util.isString(color)) {
      if (color[1] === '(' || color[2] === '(') {
        if (color[0] === 'l') {
          // regexLG.test(color)
          return parseLineGradient(color, self, context);
        } else if (color[0] === 'r') {
          // regexRG.test(color)
          return parseRadialGradient(color, self, context);
        } else if (color[0] === 'p') {
          // regexPR.test(color)
          return parsePattern(color, self, context);
        }
      }

      return color;
    }
  },
  numberToColor: function numberToColor(num) {
    // 增加缓存
    var color = numColorCache[num];

    if (!color) {
      var str = num.toString(16);

      for (var i = str.length; i < 6; i++) {
        str = '0' + str;
      }

      color = '#' + str;
      numColorCache[num] = color;
    }

    return color;
  }
};