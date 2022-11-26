'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeLineItemProps = exports.TimelineProps = undefined;

var _Timeline = require('./Timeline');

Object.defineProperty(exports, 'TimelineProps', {
  enumerable: true,
  get: function get() {
    return _Timeline.TimelineProps;
  }
});

var _TimelineItem = require('./TimelineItem');

Object.defineProperty(exports, 'TimeLineItemProps', {
  enumerable: true,
  get: function get() {
    return _TimelineItem.TimeLineItemProps;
  }
});

var _Timeline2 = _interopRequireDefault(_Timeline);

var _TimelineItem2 = _interopRequireDefault(_TimelineItem);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Timeline2['default'].Item = _TimelineItem2['default'];

/* istanbul ignore next */
_Timeline2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Timeline2['default'].name, _Timeline2['default']);
  Vue.component(_TimelineItem2['default'].name, _TimelineItem2['default']);
};

exports['default'] = _Timeline2['default'];