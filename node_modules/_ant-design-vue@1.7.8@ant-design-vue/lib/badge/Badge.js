'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _ScrollNumber = require('./ScrollNumber');

var _ScrollNumber2 = _interopRequireDefault(_ScrollNumber);

var _colors = require('../_util/colors');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _isNumeric = require('../_util/isNumeric');

var _isNumeric2 = _interopRequireDefault(_isNumeric);

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var BadgeProps = {
  /** Number to show in badge */
  count: _vueTypes2['default'].any,
  showZero: _vueTypes2['default'].bool,
  /** Max count to show */
  overflowCount: _vueTypes2['default'].number,
  /** whether to show red dot without number */
  dot: _vueTypes2['default'].bool,
  prefixCls: _vueTypes2['default'].string,
  scrollNumberPrefixCls: _vueTypes2['default'].string,
  status: _vueTypes2['default'].oneOf(['success', 'processing', 'default', 'error', 'warning']),
  color: _vueTypes2['default'].string,
  text: _vueTypes2['default'].string,
  offset: _vueTypes2['default'].array,
  numberStyle: _vueTypes2['default'].object.def(function () {
    return {};
  }),
  title: _vueTypes2['default'].string
};
function isPresetColor(color) {
  return _colors.PresetColorTypes.indexOf(color) !== -1;
}
exports['default'] = {
  name: 'ABadge',
  props: (0, _propsUtil.initDefaultProps)(BadgeProps, {
    showZero: false,
    dot: false,
    overflowCount: 99
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    getNumberedDispayCount: function getNumberedDispayCount() {
      var overflowCount = this.$props.overflowCount;

      var count = this.badgeCount;
      var displayCount = count > overflowCount ? overflowCount + '+' : count;
      return displayCount;
    },
    getDispayCount: function getDispayCount() {
      var isDot = this.isDot();
      // dot mode don't need count
      if (isDot) {
        return '';
      }
      return this.getNumberedDispayCount();
    },
    getScrollNumberTitle: function getScrollNumberTitle() {
      var title = this.$props.title;

      var count = this.badgeCount;
      if (title) {
        return title;
      }
      return typeof count === 'string' || typeof count === 'number' ? count : undefined;
    },
    getStyleWithOffset: function getStyleWithOffset() {
      var _$props = this.$props,
          offset = _$props.offset,
          numberStyle = _$props.numberStyle;

      return offset ? (0, _extends3['default'])({
        right: -parseInt(offset[0], 10) + 'px',
        marginTop: (0, _isNumeric2['default'])(offset[1]) ? offset[1] + 'px' : offset[1]
      }, numberStyle) : (0, _extends3['default'])({}, numberStyle);
    },
    getBadgeClassName: function getBadgeClassName(prefixCls) {
      var _classNames;

      var children = (0, _propsUtil.filterEmpty)(this.$slots['default']);
      var hasStatus = this.hasStatus();
      return (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-status', hasStatus), (0, _defineProperty3['default'])(_classNames, prefixCls + '-dot-status', hasStatus && this.dot && !this.isZero()), (0, _defineProperty3['default'])(_classNames, prefixCls + '-not-a-wrapper', !children.length), _classNames));
    },
    hasStatus: function hasStatus() {
      var _$props2 = this.$props,
          status = _$props2.status,
          color = _$props2.color;

      return !!status || !!color;
    },
    isZero: function isZero() {
      var numberedDispayCount = this.getNumberedDispayCount();
      return numberedDispayCount === '0' || numberedDispayCount === 0;
    },
    isDot: function isDot() {
      var dot = this.$props.dot;

      var isZero = this.isZero();
      return dot && !isZero || this.hasStatus();
    },
    isHidden: function isHidden() {
      var showZero = this.$props.showZero;

      var displayCount = this.getDispayCount();
      var isZero = this.isZero();
      var isDot = this.isDot();
      var isEmpty = displayCount === null || displayCount === undefined || displayCount === '';
      return (isEmpty || isZero && !showZero) && !isDot;
    },
    renderStatusText: function renderStatusText(prefixCls) {
      var h = this.$createElement;
      var text = this.$props.text;

      var hidden = this.isHidden();
      return hidden || !text ? null : h(
        'span',
        { 'class': prefixCls + '-status-text' },
        [text]
      );
    },
    renderDispayComponent: function renderDispayComponent() {
      var count = this.badgeCount;
      var customNode = count;
      if (!customNode || (typeof customNode === 'undefined' ? 'undefined' : (0, _typeof3['default'])(customNode)) !== 'object') {
        return undefined;
      }
      return (0, _vnode.cloneElement)(customNode, {
        style: this.getStyleWithOffset()
      });
    },
    renderBadgeNumber: function renderBadgeNumber(prefixCls, scrollNumberPrefixCls) {
      var _scrollNumberCls;

      var h = this.$createElement;
      var _$props3 = this.$props,
          status = _$props3.status,
          color = _$props3.color;

      var count = this.badgeCount;
      var displayCount = this.getDispayCount();
      var isDot = this.isDot();
      var hidden = this.isHidden();

      var scrollNumberCls = (_scrollNumberCls = {}, (0, _defineProperty3['default'])(_scrollNumberCls, prefixCls + '-dot', isDot), (0, _defineProperty3['default'])(_scrollNumberCls, prefixCls + '-count', !isDot), (0, _defineProperty3['default'])(_scrollNumberCls, prefixCls + '-multiple-words', !isDot && count && count.toString && count.toString().length > 1), (0, _defineProperty3['default'])(_scrollNumberCls, prefixCls + '-status-' + status, !!status), (0, _defineProperty3['default'])(_scrollNumberCls, prefixCls + '-status-' + color, isPresetColor(color)), _scrollNumberCls);

      var statusStyle = this.getStyleWithOffset();
      if (color && !isPresetColor(color)) {
        statusStyle = statusStyle || {};
        statusStyle.background = color;
      }

      return hidden ? null : h(_ScrollNumber2['default'], {
        attrs: {
          prefixCls: scrollNumberPrefixCls,
          'data-show': !hidden,

          className: scrollNumberCls,
          count: displayCount,
          displayComponent: this.renderDispayComponent() // <Badge status="success" count={<Icon type="xxx" />}></Badge>
          , title: this.getScrollNumberTitle()
        },
        directives: [{
          name: 'show',
          value: !hidden
        }],
        style: statusStyle,
        key: 'scrollNumber'
      });
    }
  },

  render: function render() {
    var _classNames2;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        customizeScrollNumberPrefixCls = this.scrollNumberPrefixCls,
        status = this.status,
        text = this.text,
        color = this.color,
        $slots = this.$slots;


    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('badge', customizePrefixCls);
    var scrollNumberPrefixCls = getPrefixCls('scroll-number', customizeScrollNumberPrefixCls);

    var children = (0, _propsUtil.filterEmpty)($slots['default']);
    var count = (0, _propsUtil.getComponentFromProp)(this, 'count');
    if (Array.isArray(count)) {
      count = count[0];
    }
    this.badgeCount = count;
    var scrollNumber = this.renderBadgeNumber(prefixCls, scrollNumberPrefixCls);
    var statusText = this.renderStatusText(prefixCls);
    var statusCls = (0, _classnames2['default'])((_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, prefixCls + '-status-dot', this.hasStatus()), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-status-' + status, !!status), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-status-' + color, isPresetColor(color)), _classNames2));
    var statusStyle = {};
    if (color && !isPresetColor(color)) {
      statusStyle.background = color;
    }
    // <Badge status="success" />
    if (!children.length && this.hasStatus()) {
      var styleWithOffset = this.getStyleWithOffset();
      var statusTextColor = styleWithOffset && styleWithOffset.color;
      return h(
        'span',
        (0, _babelHelperVueJsxMergeProps2['default'])([{ on: (0, _propsUtil.getListeners)(this) }, {
          'class': this.getBadgeClassName(prefixCls),
          style: styleWithOffset
        }]),
        [h('span', { 'class': statusCls, style: statusStyle }), h(
          'span',
          { style: { color: statusTextColor }, 'class': prefixCls + '-status-text' },
          [text]
        )]
      );
    }

    var transitionProps = (0, _getTransitionProps2['default'])(children.length ? prefixCls + '-zoom' : '');

    return h(
      'span',
      (0, _babelHelperVueJsxMergeProps2['default'])([{ on: (0, _propsUtil.getListeners)(this) }, { 'class': this.getBadgeClassName(prefixCls) }]),
      [children, h(
        'transition',
        transitionProps,
        [scrollNumber]
      ), statusText]
    );
  }
};