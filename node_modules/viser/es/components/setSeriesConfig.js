import * as _ from 'lodash';
import * as EventUtils from '../utils/EventUtils';
import * as setCustomFormatter from './setCustomFormatter';
import * as setQuickType from './setQuickType';
function setSeriesGemo(chart, currSeries) {
    var gemo = currSeries.gemo;
    switch (gemo) {
        case 'line':
            chart = chart.line();
            break;
        case 'area':
            chart = chart.area();
            break;
        case 'bar':
        case 'interval':
            chart = chart.interval();
            break;
        case 'point':
            chart = chart.point();
            break;
        case 'schema':
            chart = chart.schema();
            break;
        case 'polygon':
            chart = chart.polygon();
            break;
        case 'contour':
            chart = chart.contour();
            break;
        case 'heatmap':
            chart = chart.heatmap();
            break;
        case 'edge':
            chart = chart.edge();
            break;
        case 'path':
            chart = chart.path();
            break;
        case 'venn':
            chart = chart.venn();
            break;
        default:
            chart = chart.line();
    }
    return chart;
}
function setSeriesPosition(chart, currSeries) {
    var position = currSeries.position;
    if (!_.isNil(position)) {
        return chart.position(position);
    }
    return chart;
}
function setSeriesAdjust(chart, currSeries) {
    var adjust = currSeries.adjust;
    if (!_.isNil(adjust)) {
        return chart.adjust(adjust);
    }
    return chart;
}
function setSeriesShape(chart, currSeries) {
    var shape = currSeries.shape;
    if (_.isString(shape)) {
        return chart.shape(shape);
    }
    if (_.isArray(shape) && shape.length >= 1) {
        if (shape[1]) {
            return chart.shape(shape[0], shape[1]);
        }
        return chart.shape(shape[0]);
    }
    return chart;
}
function setSeriesColor(chart, currSeries) {
    var color = currSeries.color;
    if (_.isString(color)) {
        return chart.color(color);
    }
    if (_.isArray(color) && color.length >= 1) {
        if (color[1]) {
            return chart.color(color[0], color[1]);
        }
        return chart.color(color[0]);
    }
    return chart;
}
function setSeriesSize(chart, currSeries) {
    var size = currSeries.size;
    if (_.isNumber(size) || _.isString(size)) {
        return chart.size(size);
    }
    if (_.isArray(size) && size.length >= 1) {
        if (size[1]) {
            return chart.size(size[0], size[1]);
        }
        return chart.size(size[0]);
    }
    return chart;
}
function setSeriesOpacity(chart, currSeries) {
    var opacity = currSeries.opacity;
    if (_.isNumber(opacity) || _.isString(opacity)) {
        return chart.opacity(opacity);
    }
    if (_.isArray(opacity) && opacity.length >= 1) {
        if (opacity[1]) {
            return chart.opacity(opacity[0], opacity[1]);
        }
        return chart.opacity(opacity[0]);
    }
    return chart;
}
function setSeriesLabel(chart, currSeries) {
    var label = currSeries.label;
    if (_.isString(label)) {
        return chart.label(label);
    }
    if (_.isArray(label) && label.length >= 2) {
        if (_.isNumber(label[1].density)
            && (0 < label[1].density) && (label[1].density < 1)
            && (_.isFunction(label[1].formatter) || _.isString(label[1].formatter))) {
            var gap_1 = Math.floor(1 / label[1].density);
            var formatter_1 = _.isString(label[1].formatter) ?
                setCustomFormatter.supportD3Formatter(label[1]).formatter : label[1].formatter;
            label[1].formatter = function (val, item, i) {
                if (i % gap_1) {
                    return ' ';
                }
                else {
                    return formatter_1(val, item, i);
                }
            };
        }
        return chart.label.apply(chart, label);
    }
    return chart;
}
function setSeriesStyle(chart, currSeries) {
    var style = currSeries.style;
    if (_.isArray(style) && style.length >= 1) {
        if (style[1]) {
            return chart.style(style[0], style[1]);
        }
        return chart.style(style[0]);
    }
    if (_.isPlainObject(style)) {
        return chart.style(style);
    }
    return chart;
}
function setSeriesTooltip(chart, currSeries) {
    var tooltip = currSeries.tooltip;
    if (_.isBoolean(tooltip) || _.isString(tooltip)) {
        return chart.tooltip(tooltip);
    }
    if (_.isArray(tooltip) && tooltip.length >= 1) {
        if (tooltip[1]) {
            return chart.tooltip(tooltip[0], tooltip[1]);
        }
        return chart.tooltip(tooltip[0]);
    }
    return chart;
}
function setSeriesSelect(chart, currSeries) {
    var select = currSeries.select;
    if (_.isBoolean(select)) {
        return chart.select(select);
    }
    if (_.isArray(select) && select.length >= 1) {
        if (select[1]) {
            return chart.select(select[0], select[1]);
        }
        return chart.select(select[0]);
    }
    return chart;
}
function setSeriesActive(chart, currSeries) {
    var active = currSeries.active;
    if (_.isArray(active)) {
        return chart.active.apply(chart, active);
    }
    if (_.isBoolean(active) || _.isPlainObject(active)) {
        return chart.active(active);
    }
    return chart;
}
function setSeriesAnimate(chart, currSeries) {
    var animate = currSeries.animate;
    if (!_.isEmpty(animate)) {
        return chart.animate(animate);
    }
    return chart;
}
export var process = function (chart, config, isUpdate) {
    if (isUpdate === void 0) { isUpdate = false; }
    var cSeries = _.cloneDeep(config.series);
    var isArr = _.isArray(cSeries);
    if (_.isNil(cSeries) || _.isEmpty(cSeries)) {
        return chart;
    }
    var arrSeries = isArr ? cSeries : [cSeries];
    arrSeries = setQuickType.process(arrSeries, config.coord);
    arrSeries = _.sortBy(arrSeries, 'zIndex');
    var chartInstance;
    arrSeries.forEach(function (currSeries) {
        if (!isUpdate) {
            EventUtils.setEvent(chart, currSeries.gemo, currSeries);
        }
        for (var item in currSeries) {
            if (currSeries.hasOwnProperty(item)) {
                EventUtils.setSEvent(chart, 'label', name, currSeries[item]);
            }
        }
        chartInstance = setSeriesGemo(chart, currSeries);
        chartInstance = setSeriesPosition(chartInstance, currSeries);
        chartInstance = setSeriesAdjust(chartInstance, currSeries);
        chartInstance = setSeriesShape(chartInstance, currSeries);
        chartInstance = setSeriesColor(chartInstance, currSeries);
        chartInstance = setSeriesOpacity(chartInstance, currSeries);
        chartInstance = setSeriesSize(chartInstance, currSeries);
        chartInstance = setSeriesLabel(chartInstance, currSeries);
        chartInstance = setSeriesTooltip(chartInstance, currSeries);
        chartInstance = setSeriesStyle(chartInstance, currSeries);
        chartInstance = setSeriesSelect(chartInstance, currSeries);
        chartInstance = setSeriesActive(chartInstance, currSeries);
        chartInstance = setSeriesAnimate(chartInstance, currSeries);
    });
    return chartInstance;
};
//# sourceMappingURL=setSeriesConfig.js.map