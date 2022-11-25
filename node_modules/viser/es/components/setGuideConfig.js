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
function setGuideLine(chart, item) {
    if (item.quickType === 'parallel') {
        var data = item.data;
        chart.guide().line(__assign({ start: ['min', data], end: ['max', data] }, item));
    }
    else if (item.quickType === 'normal') {
        var data = item.data;
        chart.guide().line(__assign({ start: [data, 'min'], end: [data, 'max'] }, item));
    }
    else {
        chart.guide().line(item);
    }
}
function setGuideArc(chart, item) {
    if (item.quickType === 'parallel') {
        var data = item.data;
        chart.guide().arc(__assign({ start: ['min', data], end: ['max', data] }, item));
        chart.guide().arc(__assign({ start: ['max', data], end: ['min', data] }, item));
    }
    else if (item.quickType === 'normal') {
        var data = item.data;
        chart.guide().line(__assign({ start: [data, 'min'], end: [data, 'max'] }, item));
    }
    else {
        chart.guide().arc(item);
    }
}
export var process = function (chart, config, isUpdate) {
    if (isUpdate === void 0) { isUpdate = false; }
    var cGuide = _.cloneDeep(config.guide);
    var isArr = Array.isArray(cGuide);
    if (_.isNil(cGuide) || _.isEmpty(cGuide)) {
        return;
    }
    var arrGuide = isArr ? cGuide : [cGuide];
    arrGuide.forEach(function (res) {
        if (!isUpdate) {
            EventUtils.setEvent(chart, "guide-" + res.type, res);
        }
        if (res.type === 'line') {
            setGuideLine(chart, res);
        }
        else if (res.type === 'region') {
            chart.guide().region(res);
        }
        else if (res.type === 'arc') {
            setGuideArc(chart, res);
        }
        else if (res.type === 'text') {
            chart.guide().text(res);
        }
        else if (res.type === 'image') {
            chart.guide().image(res);
        }
        else if (res.type === 'html') {
            chart.guide().html(res);
        }
        else if (res.type === 'dataMarker') {
            chart.guide().dataMarker(res);
        }
        else if (res.type === 'regionFilter') {
            chart.guide().regionFilter(res);
        }
        else if (res.type === 'dataRegion') {
            chart.guide().dataRegion(res);
        }
    });
    return chart;
};
//# sourceMappingURL=setGuideConfig.js.map