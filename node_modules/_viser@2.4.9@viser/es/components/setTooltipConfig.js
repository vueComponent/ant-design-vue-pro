import * as _ from 'lodash';
import * as EventUtils from '../utils/EventUtils';
export var process = function (chart, config, isUpdate) {
    if (isUpdate === void 0) { isUpdate = false; }
    var cTooltip = _.cloneDeep(config.tooltip);
    if (_.isNil(cTooltip) || cTooltip === false || cTooltip.show === false) {
        return chart.tooltip(false);
    }
    for (var item in cTooltip) {
        if (cTooltip.hasOwnProperty(item)) {
            if (item === 'g2Tooltip') {
                cTooltip['g2-tooltip'] = cTooltip[item];
                cTooltip = _.omit(cTooltip, 'g2Tooltip');
            }
            if (item === 'g2TooltipTitle') {
                cTooltip['g2-tooltip-title'] = cTooltip[item];
                cTooltip = _.omit(cTooltip, 'g2TooltipTitle');
            }
            if (item === 'g2TooltipList') {
                cTooltip['g2-tooltip-list'] = cTooltip[item];
                cTooltip = _.omit(cTooltip, 'g2TooltipList');
            }
            if (item === 'g2TooltipListItem') {
                cTooltip['g2-tooltip-list-item'] = cTooltip[item];
                cTooltip = _.omit(cTooltip, 'g2TooltipListItem');
            }
            if (item === 'g2TooltipMaker') {
                cTooltip['g2-tooltip-maker'] = cTooltip[item];
                cTooltip = _.omit(cTooltip, 'g2TooltipMaker');
            }
        }
    }
    if (!isUpdate) {
        EventUtils.setEvent(chart, 'tooltip', cTooltip);
    }
    return chart.tooltip(cTooltip);
};
export var setDefaultPoint = function (chart, config) {
    var cTooltip = _.cloneDeep(config.tooltip);
    if (!_.isNil(cTooltip) && cTooltip !== false && cTooltip.show !== false
        && cTooltip.defaultPoint) {
        var defaultPoint = cTooltip.defaultPoint;
        var xyPoint = chart.getXY(defaultPoint);
        if (!!xyPoint) {
            chart.showTooltip(xyPoint);
        }
    }
};
//# sourceMappingURL=setTooltipConfig.js.map