"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Slider = _interopRequireDefault(require("./Slider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(config) {
  var plugins = {};

  for (var pluginName in config) {
    if (config.hasOwnProperty(pluginName)) {
      var pluginConfig = config[pluginName];

      switch (pluginName) {
        case 'slider':
          plugins.slider = (0, _Slider.default)(pluginConfig);
          break;

        default:
          break;
      }
    }
  }

  return plugins;
};

exports.default = _default;