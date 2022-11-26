import * as _ from 'lodash';
var regEventName = /on(.+)(MouseEnter|MouseMove|MouseLeave|Click|DdlClick|MouseDown|MouseUp|TouchStart|TouchMove|TouchEnd)/;
export function setSEvent(chart, itemname, keyname, content) {
    if (_.isEmpty(keyname)) {
        return;
    }
    var parseEventItem = regEventName.exec(keyname);
    if (!parseEventItem || parseEventItem.length <= 2) {
        return;
    }
    var lowerEventItem = parseEventItem[1].toLowerCase();
    var lowerEventName = parseEventItem[2].toLowerCase();
    var eventItem = itemname + "-" + lowerEventItem;
    chart.on(eventItem + ":" + lowerEventName, function (ev) {
        if (content) {
            content(ev, chart);
        }
    });
}
export function setEvent(chart, name, item) {
    if (_.isEmpty(item)) {
        return;
    }
    var events = Object.keys(item).filter(function (entry) { return /^on/.test(entry); });
    if (_.isEmpty(events)) {
        return;
    }
    events.forEach(function (entry) {
        var eventName = entry.slice(2, entry.length);
        var eventLowerCase = eventName.toLowerCase();
        var content = item[entry];
        if (item.gemo && eventLowerCase.indexOf('label') >= 0) {
            var eventType = eventLowerCase.replace('label', '');
            chart.on("label:" + eventType, function (ev) {
                if (content) {
                    content(ev, chart);
                }
            });
            return;
        }
        if (name) {
            chart.on(name + ":" + eventLowerCase, function (ev) {
                if (content) {
                    content(ev, chart);
                }
            });
        }
        else {
            chart.on(eventLowerCase, function (ev) {
                if (content) {
                    content(ev, chart);
                }
            });
        }
    });
}
//# sourceMappingURL=EventUtils.js.map