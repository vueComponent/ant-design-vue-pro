"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSEvent = setSEvent;
exports.setEvent = setEvent;

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regEventName = /on(.+)(MouseEnter|MouseMove|MouseLeave|Click|DdlClick|MouseDown|MouseUp|TouchStart|TouchMove|TouchEnd)/;

function setSEvent(chart, itemname, keyname, content) {
  if ((0, _isEmpty2.default)(keyname)) {
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

function setEvent(chart, name, item) {
  if ((0, _isEmpty2.default)(item)) {
    return;
  }

  var events = Object.keys(item).filter(function (entry) {
    return /^on/.test(entry);
  });

  if ((0, _isEmpty2.default)(events)) {
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
    } else {
      chart.on(eventLowerCase, function (ev) {
        if (content) {
          content(ev, chart);
        }
      });
    }
  });
}