/**
 * Created by Elaine on 2018/5/9.
 */
var Util = require('../../../util/index');

var regexPR = /^p\s*\(\s*([axyn])\s*\)\s*(.*)/i;

var Pattern =
/*#__PURE__*/
function () {
  function Pattern(cfg) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    el.setAttribute('patternUnits', 'userSpaceOnUse');
    var child = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    el.appendChild(child);
    var id = Util.uniqueId('pattern_');
    el.id = id;
    this.el = el;
    this.id = id;
    this.cfg = cfg;
    var arr = regexPR.exec(cfg);
    var source = arr[2];
    child.setAttribute('href', source);
    var img = new Image();

    if (!source.match(/^data:/i)) {
      img.crossOrigin = 'Anonymous';
    }

    img.src = source;

    function onload() {
      console.log(img.width, img.height);
      el.setAttribute('width', img.width);
      el.setAttribute('height', img.height);
    }

    if (img.complete) {
      onload();
    } else {
      img.onload = onload; // Fix onload() bug in IE9

      img.src = img.src;
    }

    return this;
  }

  var _proto = Pattern.prototype;

  _proto.match = function match(type, attr) {
    return this.cfg === attr;
  };

  return Pattern;
}();

module.exports = Pattern;