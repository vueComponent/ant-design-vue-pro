import * as _ from 'lodash';
import * as setCustomFormatter from './setCustomFormatter';
export var process = function (chart, config) {
    var cScale = _.cloneDeep(config.scale);
    var isArr = _.isArray(cScale);
    if (_.isEmpty(cScale)) {
        return;
    }
    var arrScale = isArr ? cScale : [cScale];
    var options = {};
    for (var _i = 0, arrScale_1 = arrScale; _i < arrScale_1.length; _i++) {
        var res = arrScale_1[_i];
        if (res.dataKey) {
            var currOption = _.omit(res, 'dataKey');
            options[res.dataKey] = currOption;
        }
    }
    options = setCustomFormatter.supportD3Formatter(options);
    return chart.scale(options);
};
//# sourceMappingURL=setScaleConfig.js.map