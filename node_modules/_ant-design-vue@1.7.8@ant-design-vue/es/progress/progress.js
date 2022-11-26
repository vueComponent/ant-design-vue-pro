import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { getOptionProps, initDefaultProps, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Icon from '../icon';
import Line from './line';
import Circle from './circle';
import { validProgress } from './utils';

var ProgressStatuses = ['normal', 'exception', 'active', 'success'];
export var ProgressType = PropTypes.oneOf(['line', 'circle', 'dashboard']);
export var ProgressSize = PropTypes.oneOf(['default', 'small']);

export var ProgressProps = {
  prefixCls: PropTypes.string,
  type: ProgressType,
  percent: PropTypes.number,
  successPercent: PropTypes.number,
  format: PropTypes.func,
  status: PropTypes.oneOf(ProgressStatuses),
  showInfo: PropTypes.bool,
  strokeWidth: PropTypes.number,
  strokeLinecap: PropTypes.oneOf(['butt', 'round', 'square']),
  strokeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  trailColor: PropTypes.string,
  width: PropTypes.number,
  gapDegree: PropTypes.number,
  gapPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  size: ProgressSize
};

export default {
  name: 'AProgress',
  props: initDefaultProps(ProgressProps, {
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
        return ConfigConsumerProps;
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
        text = textFormatter(validProgress(percent), validProgress(successPercent));
      } else if (progressStatus === 'exception') {
        text = h(Icon, {
          attrs: { type: 'close' + iconType, theme: type === 'line' ? 'filled' : 'outlined' }
        });
      } else if (progressStatus === 'success') {
        text = h(Icon, {
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

    var props = getOptionProps(this);
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
        props: _extends({}, props, {
          prefixCls: prefixCls
        })
      };
      progress = h(
        Line,
        lineProps,
        [progressInfo]
      );
    } else if (type === 'circle' || type === 'dashboard') {
      var circleProps = {
        props: _extends({}, props, {
          prefixCls: prefixCls,
          progressStatus: progressStatus
        })
      };
      progress = h(
        Circle,
        circleProps,
        [progressInfo]
      );
    }

    var classString = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-' + (type === 'dashboard' && 'circle' || type), true), _defineProperty(_classNames, prefixCls + '-status-' + progressStatus, true), _defineProperty(_classNames, prefixCls + '-show-info', showInfo), _defineProperty(_classNames, prefixCls + '-' + size, size), _classNames));

    var progressProps = {
      on: getListeners(this),
      'class': classString
    };
    return h(
      'div',
      progressProps,
      [progress]
    );
  }
};