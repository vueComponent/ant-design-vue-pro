var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as _ from 'lodash';
import * as EventUtils from '../utils/EventUtils';
import * as setCustomFormatter from './setCustomFormatter';
function setRotatePolarAxis(chart, axisItem, coord, data) {
    var polarLabel = _.get(axisItem, 'polarLabel');
    var rotate = _.get(axisItem, 'polarLabel.rotate');
    if (!rotate) {
        return;
    }
    var tickStyle = {};
    if (rotate === 'parallel') {
        tickStyle = {
            rotate: coord.startAngle,
            textAlign: 'center'
        };
    }
    else if (rotate === 'normal') {
        tickStyle = {
            rotate: coord.startAngle + 90,
            textAlign: 'right'
        };
    }
    var offsetX = _.get(axisItem, 'polarLabel.offsetX');
    var offsetY = _.get(axisItem, 'polarLabel.offsetY');
    data.forEach(function (res, i) {
        chart.guide().text(__assign({ position: [i, 0], content: data[i][axisItem.dataKey], style: __assign({ polarLabel: polarLabel }, tickStyle) }, offsetX, offsetY));
    });
}
export var process = function (chart, config, isUpdate) {
    if (isUpdate === void 0) { isUpdate = false; }
    var cAxis = _.cloneDeep(config.axis);
    var isArr = _.isArray(cAxis);
    if (_.isNil(cAxis) || cAxis === false ||
        (isArr && cAxis.length === 0)) {
        return chart.axis(false);
    }
    if (cAxis === true) {
        return chart.axis();
    }
    var arrAxis = isArr ? cAxis : [cAxis];
    var coord = config.coord, data = config.data;
    var _loop_1 = function (res) {
        if (coord && coord.type === 'polar' && coord.direction === 'rotate') {
            setRotatePolarAxis(chart, res, coord, data);
        }
        if (res.label) {
            res.label = setCustomFormatter.supportD3Formatter(res.label);
        }
        if (!isUpdate) {
            for (var item in res) {
                if (res.hasOwnProperty(item)) {
                    var name_1 = item === 'tickLine' ? 'ticks' : item;
                    EventUtils.setSEvent(chart, 'axis', name_1, res[item]);
                }
            }
        }
        if (res.dataKey) {
            if (res.show === false) {
                chart.axis(res.dataKey, false);
            }
            else {
                var options = _.omit(res, ['show', 'dataKey']);
                var label = options.label;
                if (label && _.isNumber(label.density)
                    && (0 < label.density) && (label.density < 1)
                    && _.isFunction(label.formatter)) {
                    var gap_1 = Math.floor(1 / label.density);
                    var formatter_1 = label.formatter;
                    options.label.formatter = function (val, item, i) {
                        if (i % gap_1) {
                            return ' ';
                        }
                        else {
                            return formatter_1(val, item, i);
                        }
                    };
                }
                chart.axis(res.dataKey, options);
            }
        }
        else {
            chart.axis(res);
        }
    };
    for (var _i = 0, arrAxis_1 = arrAxis; _i < arrAxis_1.length; _i++) {
        var res = arrAxis_1[_i];
        _loop_1(res);
    }
    return chart;
};
//# sourceMappingURL=setAxisConfig.js.map