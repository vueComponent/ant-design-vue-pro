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
var QUICK_TYPE = [
    {
        type: 'pie',
        series: {
            gemo: 'interval',
            adjust: 'stack'
        },
        coord: {
            type: 'theta'
        }
    },
    {
        type: 'sector',
        series: {
            gemo: 'interval'
        },
        coord: {
            type: 'polar'
        }
    },
    {
        type: 'line',
        series: {
            gemo: 'line'
        }
    },
    {
        type: 'smoothLine',
        series: {
            gemo: 'line',
            shape: 'smooth'
        }
    },
    {
        type: 'dashLine',
        series: {
            gemo: 'line',
            shape: 'dash'
        }
    },
    {
        type: 'stackLine',
        series: {
            gemo: 'line',
            adjust: 'stack'
        }
    },
    {
        type: 'area',
        series: {
            gemo: 'area'
        }
    },
    {
        type: 'stackArea',
        series: {
            gemo: 'area',
            adjust: 'stack'
        }
    },
    {
        type: 'smoothArea',
        series: {
            gemo: 'area',
            shape: 'smooth'
        }
    },
    {
        type: 'interval',
        series: {
            gemo: 'interval'
        }
    },
    {
        type: 'stackInterval',
        series: {
            gemo: 'interval',
            adjust: 'stack'
        }
    },
    {
        type: 'dodgeInterval',
        series: {
            gemo: 'interval',
            shape: 'interval',
            adjust: 'dodge'
        }
    },
    {
        type: 'bar',
        series: {
            gemo: 'interval'
        }
    },
    {
        type: 'stackBar',
        series: {
            gemo: 'interval',
            shape: 'interval',
            adjust: 'stack'
        }
    },
    {
        type: 'dodgeBar',
        series: {
            gemo: 'interval',
            shape: 'interval',
            adjust: 'dodge'
        }
    },
    {
        type: 'point',
        series: {
            gemo: 'point',
            shape: 'hollowCircle'
        }
    },
    {
        type: 'funnel',
        series: {
            gemo: 'interval',
            adjust: 'symmetric',
            shape: 'funnel'
        }
    },
    {
        type: 'pyramid',
        series: {
            gemo: 'interval',
            adjust: 'symmetric',
            shape: 'pyramid'
        }
    },
    {
        type: 'schema',
        series: {
            gemo: 'schema',
            shape: 'box'
        }
    },
    {
        type: 'box',
        series: {
            gemo: 'schema',
            shape: 'box'
        }
    },
    {
        type: 'candle',
        series: {
            gemo: 'schema',
            shape: 'candle'
        }
    },
    {
        type: 'polygon',
        series: {
            gemo: 'polygon'
        }
    },
    {
        type: 'contour',
        series: {
            gemo: 'contour'
        }
    },
    {
        type: 'heatmap',
        series: {
            gemo: 'heatmap'
        }
    },
    {
        type: 'edge',
        series: {
            gemo: 'edge'
        }
    },
    {
        type: 'sankey',
        series: {
            gemo: 'edge',
            shape: 'sankey'
        }
    },
    {
        type: 'errorBar',
        series: {
            gemo: 'schema',
            shape: 'errorbar'
        }
    },
    {
        type: 'jitterPoint',
        series: {
            gemo: 'point',
            adjust: 'jitter'
        }
    },
    {
        type: 'path',
        series: {
            gemo: 'path'
        }
    },
    {
        type: 'venn',
        series: {
            gemo: 'venn'
        }
    },
];
export var process = function (series, coord) {
    var quickType = {};
    for (var _i = 0, QUICK_TYPE_1 = QUICK_TYPE; _i < QUICK_TYPE_1.length; _i++) {
        var item = QUICK_TYPE_1[_i];
        quickType[item.type] = item;
    }
    for (var i = 0; i < series.length; i++) {
        var currType = quickType[series[i].quickType];
        if (currType) {
            series[i] = __assign({}, currType.series, series[i]);
            if (coord && coord.type && _.get(currType, 'coord.type') &&
                _.get(currType, 'coord.type') !== coord.type) {
                throw new Error('quickType and coord had conflicted.');
            }
        }
    }
    return series;
};
//# sourceMappingURL=setQuickType.js.map