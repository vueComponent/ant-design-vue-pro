"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDefaultPoint = exports.process = void 0;

var _omit2 = _interopRequireDefault(require("lodash/omit"));

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var EventUtils = _interopRequireWildcard(require("../utils/EventUtils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var process = function process(chart, config, isUpdate) {
  if (isUpdate === void 0) {
    isUpdate = false;
  }

  var cTooltip = (0, _cloneDeep2.default)(config.tooltip);

  if ((0, _isNil2.default)(cTooltip) || cTooltip === false || cTooltip.show === false) {
    return chart.tooltip(false);
  }

  for (var item in cTooltip) {
    if (cTooltip.hasOwnProperty(item)) {
      if (item === 'g2Tooltip') {
        cTooltip['g2-tooltip'] = cTooltip[item];
        cTooltip = (0, _omit2.default)(cTooltip, 'g2Tooltip');
      }

      if (item === 'g2TooltipTitle') {
        cTooltip['g2-tooltip-title'] = cTooltip[item];
        cTooltip = (0, _omit2.default)(cTooltip, 'g2TooltipTitle');
      }

      if (item === 'g2TooltipList') {
        cTooltip['g2-tooltip-list'] = cTooltip[item];
        cTooltip = (0, _omit2.default)(cTooltip, 'g2TooltipList');
      }

      if (item === 'g2TooltipListItem') {
        cTooltip['g2-tooltip-list-item'] = cTooltip[item];
        cTooltip = (0, _omit2.default)(cTooltip, 'g2TooltipListItem');
      }

      if (item === 'g2TooltipMaker') {
        cTooltip['g2-tooltip-maker'] = cTooltip[item];
        cTooltip = (0, _omit2.default)(cTooltip, 'g2TooltipMaker');
      }
    }
  }

  if (!isUpdate) {
    EventUtils.setEvent(chart, 'tooltip', cTooltip);
  }

  return chart.tooltip(cTooltip);
};

exports.process = process;

var setDefaultPoint = function setDefaultPoint(chart, config) {
  var cTooltip = (0, _cloneDeep2.default)(config.tooltip);

  if (!(0, _isNil2.default)(cTooltip) && cTooltip !== false && cTooltip.show !== false && cTooltip.defaultPoint) {
    var defaultPoint = cTooltip.defaultPoint;
    var xyPoint = chart.getXY(defaultPoint);

    if (!!xyPoint) {
      chart.showTooltip(xyPoint);
    }
  }
};

exports.setDefaultPoint = setDefaultPoint;