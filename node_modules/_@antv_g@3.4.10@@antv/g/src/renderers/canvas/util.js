const Util = require('../../util/index');

const regexTags = /[MLHVQTCSAZ]([^MLHVQTCSAZ]*)/ig;
const regexDot = /[^\s\,]+/ig;
const regexLG = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i;
const regexRG = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i;
const regexPR = /^p\s*\(\s*([axyn])\s*\)\s*(.*)/i;
const regexColorStop = /[\d.]+:(#[^\s]+|[^\)]+\))/ig;
// const numColorCache = {};

function addStop(steps, gradient) {
  const arr = steps.match(regexColorStop);
  Util.each(arr, function(item) {
    item = item.split(':');
    gradient.addColorStop(item[0], item[1]);
  });
}

function parseLineGradient(color, self, context) {
  const arr = regexLG.exec(color);
  const angle = Util.mod(Util.toRadian(parseFloat(arr[1])), Math.PI * 2);
  const steps = arr[2];
  const box = self.getBBox();
  let start;
  let end;

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

  const tanTheta = Math.tan(angle);
  const tanTheta2 = tanTheta * tanTheta;

  const x = ((end.x - start.x) + tanTheta * (end.y - start.y)) / (tanTheta2 + 1) + start.x;
  const y = tanTheta * ((end.x - start.x) + tanTheta * (end.y - start.y)) / (tanTheta2 + 1) + start.y;
  const gradient = context.createLinearGradient(start.x, start.y, x, y);
  addStop(steps, gradient);
  return gradient;
}

function parseRadialGradient(color, self, context) {
  const arr = regexRG.exec(color);
  const fx = parseFloat(arr[1]);
  const fy = parseFloat(arr[2]);
  const fr = parseFloat(arr[3]);
  const steps = arr[4];
  // 环半径为0时，默认无渐变，取渐变序列的最后一个颜色
  if (fr === 0) {
    const colors = steps.match(regexColorStop);
    return colors[colors.length - 1].split(':')[1];
  }
  const box = self.getBBox();
  const width = box.maxX - box.minX;
  const height = box.maxY - box.minY;
  const r = Math.sqrt(width * width + height * height) / 2;
  const gradient = context.createRadialGradient(box.minX + width * fx, box.minY + height * fy, fr * r, box.minX + width / 2, box.minY + height / 2, r);
  addStop(steps, gradient);
  return gradient;
}

function parsePattern(color, self, context) {
  if (self.get('patternSource') && self.get('patternSource') === color) {
    return self.get('pattern');
  }
  let pattern;
  let img;
  const arr = regexPR.exec(color);
  let repeat = arr[1];
  const source = arr[2];

  // Function to be called when pattern loads
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

  img = new Image();
  // If source URL is not a data URL
  if (!source.match(/^data:/i)) {
    // Set crossOrigin for this image
    img.crossOrigin = 'Anonymous';
  }
  img.src = source;

  if (img.complete) {
    onload();
  } else {
    img.onload = onload;
    // Fix onload() bug in IE9
    img.src = img.src;
  }

  return pattern;
}

module.exports = {
  parsePath(path) {
    path = path || [];
    if (Util.isArray(path)) {
      return path;
    }

    if (Util.isString(path)) {
      path = path.match(regexTags);
      Util.each(path, function(item, index) {
        item = item.match(regexDot);
        if (item[0].length > 1) {
          const tag = item[0].charAt(0);
          item.splice(1, 0, item[0].substr(1));
          item[0] = tag;
        }
        Util.each(item, function(sub, i) {
          if (!isNaN(sub)) {
            item[i] = +sub;
          }
        });
        path[index] = item;
      });
      return path;
    }
  },
  parseStyle(color, self, context) {
    if (Util.isString(color)) {
      if (color[1] === '(' || color[2] === '(') {
        if (color[0] === 'l') { // regexLG.test(color)
          return parseLineGradient(color, self, context);
        } else if (color[0] === 'r') { // regexRG.test(color)
          return parseRadialGradient(color, self, context);
        } else if (color[0] === 'p') { // regexPR.test(color)
          return parsePattern(color, self, context);
        }
      }
      return color;
    }
  }
  /* ,
  numberToColor(num) {
    // 增加缓存
    let color = numColorCache[num];
    if (!color) {
      let str = num.toString(16);
      for (let i = str.length; i < 6; i++) {
        str = '0' + str;
      }
      color = '#' + str;
      numColorCache[num] = color;
    }
    return color;
  }*/
};

