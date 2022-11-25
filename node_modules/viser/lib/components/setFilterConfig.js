"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = void 0;

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _isArray2 = _interopRequireDefault(require("lodash/isArray"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var process = function process(chart, config) {
  var cFilter = (0, _cloneDeep2.default)(config.filter);
  var isArr = (0, _isArray2.default)(cFilter);

  if ((0, _isEmpty2.default)(cFilter)) {
    return;
  }

  var arrFilter = isArr ? cFilter : [cFilter];

  for (var _i = 0, arrFilter_1 = arrFilter; _i < arrFilter_1.length; _i++) {
    var res = arrFilter_1[_i];

    if (res.dataKey && res.callback) {
      chart.filter(res.dataKey, res.callback);
    }
  }

  return chart;
};

exports.process = process;