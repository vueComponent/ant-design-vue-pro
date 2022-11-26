'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getScrollBarSize = require('./getScrollBarSize');

var _getScrollBarSize2 = _interopRequireDefault(_getScrollBarSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = function (close) {
  var bodyIsOverflowing = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) && window.innerWidth > document.body.offsetWidth;
  if (!bodyIsOverflowing) {
    return;
  }
  if (close) {
    document.body.style.position = '';
    document.body.style.width = '';
    return;
  }
  var scrollBarSize = (0, _getScrollBarSize2['default'])();
  if (scrollBarSize) {
    document.body.style.position = 'relative';
    document.body.style.width = 'calc(100% - ' + scrollBarSize + 'px)';
  }
};