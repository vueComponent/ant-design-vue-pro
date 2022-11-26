import * as _ from 'lodash';
export var process = function (chart, config) {
    var cFilter = _.cloneDeep(config.filter);
    var isArr = _.isArray(cFilter);
    if (_.isEmpty(cFilter)) {
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
//# sourceMappingURL=setFilterConfig.js.map