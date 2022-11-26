"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTheme = exports.updateColorWeak = exports.themeColor = void 0;

var _client = _interopRequireDefault(require("webpack-theme-color-replacer/client"));

var _generate = _interopRequireDefault(require("@ant-design/colors/lib/generate"));

var _antDesignVue = require("ant-design-vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var themeColor = {
  getAntdSerials: function getAntdSerials(color) {
    // 淡化（即less的tint）
    var lightens = new Array(9).fill().map(function (t, i) {
      return _client["default"].varyColor.lighten(color, i / 10);
    }); // colorPalette 变换得到颜色值

    var colorPalettes = (0, _generate["default"])(color);

    var rgb = _client["default"].varyColor.toNum3(color.replace('#', '')).join(',');

    return lightens.concat(colorPalettes).concat(rgb);
  },
  changeColor: function changeColor(newColor) {
    var options = {
      newColors: this.getAntdSerials(newColor),
      // new colors array, one-to-one corresponde with `matchColors`
      changeUrl: function changeUrl(cssUrl) {
        return "/".concat(cssUrl); // while router is not `hash` mode, it needs absolute path
      }
    };
    return _client["default"].changer.changeColor(options, Promise);
  }
};
exports.themeColor = themeColor;

var updateTheme = function updateTheme(newPrimaryColor) {
  var hideMessage = _antDesignVue.message.loading('正在切换主题', 0);

  themeColor.changeColor(newPrimaryColor).then(function (r) {
    hideMessage();
  });
};

exports.updateTheme = updateTheme;

var updateColorWeak = function updateColorWeak(colorWeak) {
  // document.body.className = colorWeak ? 'colorWeak' : '';
  var app = document.body.querySelector('#app .ant-pro-basicLayout');
  colorWeak ? app.classList.add('colorWeak') : app.classList.remove('colorWeak');
};

exports.updateColorWeak = updateColorWeak;