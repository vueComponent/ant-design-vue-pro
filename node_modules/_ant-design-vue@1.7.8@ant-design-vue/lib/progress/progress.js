'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressProps = exports.ProgressSize = exports.ProgressType = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _line = require('./line');

var _line2 = _interopRequireDefault(_line);

var _circle = require('./circle');

var _circle2 = _interopRequireDefault(_circle);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ProgressStatuses = ['normal', 'exception', 'active', 'success'];
var ProgressType = exports.ProgressType = _vueTypes2['default'].oneOf(['line', 'circle', 'dashboard']);
var ProgressSize = exports.ProgressSize = _vueTypes2['default'].oneOf(['default', 'small']);

var ProgressProps = exports.ProgressProps = {
  prefixCls: _vueTypes2['default'].string,
  type: ProgressType,
  percent: _vueTypes2['default'].number,
  successPercent: _vueTypes2['default'].number,
  format: _vueTypes2['default'].func,
  status: _vueTypes2['default'].oneOf(ProgressStatuses),
  showInfo: _vueTypes2['default'].bool,
  strokeWidth: _vueTypes2['default'].number,
  strokeLinecap: _vueTypes2['default'].oneOf(['butt', 'round', 'square']),
  strokeColor: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object]),
  trailColor: _vueTypes2['default'].string,
  width: _vueTypes2['default'].number,
  gapDegree: _vueTypes2['default'].number,
  gapPosition: _vueTypes2['default'].oneOf(['top', 'bottom', 'left', 'right']),
  size: ProgressSize
};

exports['default'] = {
  name: 'AProgress',
  props: (0, _propsUtil.initDefaultProps)(ProgressProps, {
    type: 'line',
    percent: 0,
    showInfo: true,
    trailColor: '#f3f3f3',
    size: 'default',
    gapDegree: 0,
    strokeLinecap: 'round'
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    getPercentNumber: function getPercentNumber() {
      var _$props = this.$props,
          successPercent = _$props.successPercent,
          _$props$percent = _$props.percent,
          percent = _$props$percent === undefined ? 0 : _$props$percent;

      return parseInt(successPercent !== undefined ? successPercent.toString() : percent.toString(), 10);
    },
    getProgressStatus: function getProgressStatus() {
      var status = this.$props.status;

      if (ProgressStatuses.indexOf(status) < 0 && this.getPercentNumber() >= 100) {
        return 'success';
      }
      return status || 'normal';
    },
    renderProcessInfo: function renderProcessInfo(prefixCls, progressStatus) {
      var h = this.$createElement;
      var _$props2 = this.$props,
          showInfo = _$props2.showInfo,
          format = _$props2.format,
          type = _$props2.type,
          percent = _$props2.percent,
          successPercent = _$props2.successPercent;

      if (!showInfo) return null;

      var text = void 0;
      var textFormatter = format || this.$scopedSlots.format || function (percentNumber) {
        return percentNumber + '%';
      };
      var iconType = type === 'circle' || type === 'dashboard' ? '' : '-circle';
      if (format || this.$scopedSlots.format || progressStatus !== 'exception' && progressStatus !== 'success') {
        text = textFormatter((0, _utils.validProgress)(percent), (0, _utils.validProgress)(successPercent));
      } else if (progressStatus === 'exception') {
        text = h(_icon2['default'], {
          attrs: { type: 'close' + iconType, theme: type === 'line' ? 'filled' : 'outlined' }
        });
      } else if (progressStatus === 'success') {
        text = h(_icon2['default'], {
          attrs: { type: 'check' + iconType, theme: type === 'line' ? 'filled' : 'outlined' }
        });
      }
      return h(
        'span',
        { 'class': prefixCls + '-text', attrs: { title: typeof text === 'string' ? text : undefined }
        },
        [text]
      );
    }
  },
  render: function render() {
    var _classNames;

    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var customizePrefixCls = props.prefixCls,
        size = props.size,
        type = props.type,
        showInfo = props.showInfo;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('progress', customizePrefixCls);
    var progressStatus = this.getProgressStatus();
    var progressInfo = this.renderProcessInfo(prefixCls, progressStatus);

    var progress = void 0;

    // Render progress shape
    if (type === 'line') {
      var lineProps = {
        props: (0, _extends3['default'])({}, props, {
          prefixCls: prefixCls
        })
      };
      progress = h(
        _line2['default'],
        lineProps,
        [progressInfo]
      );
    } else if (type === 'circle' || type === 'dashboard') {
      var circleProps = {
        props: (0, _extends3['default'])({}, props, {
          prefixCls: prefixCls,
          progressStatus: progressStatus
        })
      };
      progress = h(
        _circle2['default'],
        circleProps,
        [progressInfo]
      );
    }

    var classString = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-' + (type === 'dashboard' && 'circle' || type), true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-status-' + progressStatus, true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-show-info', showInfo), (0, _defineProperty3['default'])(_classNames, prefixCls + '-' + size, size), _classNames));

    var progressProps = {
      on: (0, _propsUtil.getListeners)(this),
      'class': classString
    };
    return h(
      'div',
      progressProps,
      [progress]
    );
  }
};