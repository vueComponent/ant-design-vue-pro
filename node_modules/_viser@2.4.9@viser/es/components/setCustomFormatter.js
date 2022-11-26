import * as d3 from 'd3-format';
import * as _ from 'lodash';
export var supportD3Formatter = function (obj) {
    var objFormatter = _.get(obj, 'formatter');
    if (_.isString(objFormatter)) {
        obj.formatter = function (val) {
            return d3.format(objFormatter)(val);
        };
        return obj;
    }
    var _loop_1 = function (item) {
        if (obj.hasOwnProperty(item)) {
            var formatter_1 = _.get(obj[item], 'formatter');
            if (_.isString(formatter_1)) {
                obj[item].formatter = function (val) {
                    return d3.format(formatter_1)(val);
                };
            }
        }
    };
    for (var item in obj) {
        _loop_1(item);
    }
    return obj;
};
//# sourceMappingURL=setCustomFormatter.js.map