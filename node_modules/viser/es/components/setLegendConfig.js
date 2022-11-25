import * as _ from 'lodash';
import * as EventUtils from '../utils/EventUtils';
function setHighlight(item) {
    item.onHover = function (ev) {
        var shapes = ev.shapes;
        var geom = ev.geom;
        geom.highlightShapes(shapes);
    };
    return item;
}
export var process = function (chart, config, isUpdate) {
    if (isUpdate === void 0) { isUpdate = false; }
    var cLegend = _.cloneDeep(config.legend);
    var isArr = Array.isArray(cLegend);
    if (_.isNil(cLegend) || cLegend === false ||
        (isArr && cLegend.length === 0)) {
        return chart.legend(false);
    }
    if (cLegend === true) {
        return chart.legend();
    }
    var arrLegend = isArr ? cLegend : [cLegend];
    for (var _i = 0, arrLegend_1 = arrLegend; _i < arrLegend_1.length; _i++) {
        var res = arrLegend_1[_i];
        if (res.highlight) {
            res = setHighlight(res);
        }
        var _loop_1 = function (item) {
            if (res.hasOwnProperty(item)) {
                if (item === 'onClick') {
                    var content_1 = res.onClick;
                    res.onClick = function (ev) {
                        content_1(ev, chart);
                    };
                }
                if (!isUpdate) {
                    EventUtils.setSEvent(chart, 'legend', item, res[item]);
                }
            }
        };
        for (var item in res) {
            _loop_1(item);
        }
        if (!_.isNil(res.legendMarker)) {
            res['g2-legend-marker'] = res.legendMarker;
        }
        if (!_.isNil(res.legendListItem)) {
            res['g2-legend-list-item'] = res.legendListItem;
        }
        if (!_.isNil(res.legendTitle)) {
            res['g2-legend-title'] = res.legendTitle;
        }
        if (!_.isNil(res.legendList)) {
            res['g2-legend-list'] = res.legendList;
        }
        res = _.omit(res, ['legendMarker', 'legendListItem', 'legendTitle', 'legendList']);
        if (res.dataKey) {
            if (res.show === false) {
                chart.legend(res.dataKey, false);
            }
            else {
                var option = _.omit(res, ['dataKey', 'show']);
                chart.legend(res.dataKey, option);
            }
        }
        else {
            chart.legend(res);
        }
    }
    return chart;
};
//# sourceMappingURL=setLegendConfig.js.map