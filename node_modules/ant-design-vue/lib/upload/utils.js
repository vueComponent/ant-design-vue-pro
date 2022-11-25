'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isImageUrl = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.T = T;
exports.fileToObject = fileToObject;
exports.genPercentAdd = genPercentAdd;
exports.getFileItem = getFileItem;
exports.removeFileItem = removeFileItem;
exports.previewImage = previewImage;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function T() {
  return true;
}

// Fix IE file.status problem
// via coping a new Object
function fileToObject(file) {
  return (0, _extends3['default'])({}, file, {
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    name: file.name,
    size: file.size,
    type: file.type,
    uid: file.uid,
    percent: 0,
    originFileObj: file
  });
}

/**
 * 生成Progress percent: 0.1 -> 0.98
 *   - for ie
 */
function genPercentAdd() {
  var k = 0.1;
  var i = 0.01;
  var end = 0.98;
  return function (s) {
    var start = s;
    if (start >= end) {
      return start;
    }

    start += k;
    k = k - i;
    if (k < 0.001) {
      k = 0.001;
    }
    return start;
  };
}

function getFileItem(file, fileList) {
  var matchKey = file.uid !== undefined ? 'uid' : 'name';
  return fileList.filter(function (item) {
    return item[matchKey] === file[matchKey];
  })[0];
}

function removeFileItem(file, fileList) {
  var matchKey = file.uid !== undefined ? 'uid' : 'name';
  var removed = fileList.filter(function (item) {
    return item[matchKey] !== file[matchKey];
  });
  if (removed.length === fileList.length) {
    return null;
  }
  return removed;
}

// ==================== Default Image Preview ====================
var extname = function extname() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var temp = url.split('/');
  var filename = temp[temp.length - 1];
  var filenameWithoutSuffix = filename.split(/#|\?/)[0];
  return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0];
};

var isImageFileType = function isImageFileType(type) {
  return !!type && type.indexOf('image/') === 0;
};

var isImageUrl = exports.isImageUrl = function isImageUrl(file) {
  if (isImageFileType(file.type)) {
    return true;
  }
  var url = file.thumbUrl || file.url;
  var extension = extname(url);
  if (/^data:image\//.test(url) || /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(extension)) {
    return true;
  }
  if (/^data:/.test(url)) {
    // other file types of base64
    return false;
  }
  if (extension) {
    // other file types which have extension
    return false;
  }
  return true;
};

var MEASURE_SIZE = 200;
function previewImage(file) {
  return new Promise(function (resolve) {
    if (!isImageFileType(file.type)) {
      resolve('');
      return;
    }

    var canvas = document.createElement('canvas');
    canvas.width = MEASURE_SIZE;
    canvas.height = MEASURE_SIZE;
    canvas.style.cssText = 'position: fixed; left: 0; top: 0; width: ' + MEASURE_SIZE + 'px; height: ' + MEASURE_SIZE + 'px; z-index: 9999; display: none;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = function () {
      var width = img.width,
          height = img.height;


      var drawWidth = MEASURE_SIZE;
      var drawHeight = MEASURE_SIZE;
      var offsetX = 0;
      var offsetY = 0;

      if (width < height) {
        drawHeight = height * (MEASURE_SIZE / width);
        offsetY = -(drawHeight - drawWidth) / 2;
      } else {
        drawWidth = width * (MEASURE_SIZE / height);
        offsetX = -(drawWidth - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      var dataURL = canvas.toDataURL();
      document.body.removeChild(canvas);

      resolve(dataURL);
    };
    img.src = window.URL.createObjectURL(file);
  });
}