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

export var isFlexSupported = isStyleSupport(['flex', 'webkitFlex', 'Flex', 'msFlex']);

export default isStyleSupport;