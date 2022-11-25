"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = void 0;

var _omit2 = _interopRequireDefault(require("lodash/omit"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _isArray2 = _interopRequireDefault(require("lodash/isArray"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var setCustomFormatter = _interopRequireWildcard(require("./setCustomFormatter"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var process = function process(chart, config) {
  var cScale = (0, _cloneDeep2.default)(config.scale);
  var isArr = (0, _isArray2.default)(cScale);

  if ((0, _isEmpty2.default)(cScale)) {
    return;
  }

  var arrScale = isArr ? cScale : [cScale];
  var options = {};

  for (var _i = 0, arrScale_1 = arrScale; _i < arrScale_1.length; _i++) {
    var res = arrScale_1[_i];

    if (res.dataKey) {
      var currOption = (0, _omit2.default)(res, 'dataKey');
      options[res.dataKey] = currOption;
    }
  }

  options = setCustomFormatter.supportD3Formatter(options);
  return chart.scale(options);
};

exports.process = process;