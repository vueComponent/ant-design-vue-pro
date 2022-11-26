'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isStyleSupport = function isStyleSupport(styleName) {
  if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
    var styleNameList = Array.isArray(styleName) ? styleName : [styleName];
    var documentElement = window.document.documentElement;


    return styleNameList.some(function (name) {
      return name in documentElement.style;
    });
  }
  return false;
};

var isFlexSupported = exports.isFlexSupported = isStyleSupport(['flex', 'webkitFlex', 'Flex', 'msFlex']);

exports['default'] = isStyleSupport;