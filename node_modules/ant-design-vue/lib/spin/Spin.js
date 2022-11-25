'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpinProps = exports.SpinSize = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.setDefaultIndicator = setDefaultIndicator;

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var SpinSize = exports.SpinSize = _vueTypes2['default'].oneOf(['small', 'default', 'large']);

var SpinProps = exports.SpinProps = function SpinProps() {
  return {
    prefixCls: _vueTypes2['default'].string,
    spinning: _vueTypes2['default'].bool,
    size: SpinSize,
    wrapperClassName: _vueTypes2['default'].string,
    tip: _vueTypes2['default'].string,
    delay: _vueTypes2['default'].number,
    indicator: _vueTypes2['default'].any
  };
};

// Render indicator
var defaultIndicator = void 0;

function shouldDelay(spinning, delay) {
  return !!spinning && !!delay && !isNaN(Number(delay));
}

function setDefaultIndicator(Content) {
  defaultIndicator = typeof Content.indicator === 'function' ? Content.indicator : function (h) {
    return h(Content.indicator);
  };
}

exports['default'] = {
  name: 'ASpin',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(SpinProps(), {
    size: 'default',
    spinning: true,
    wrapperClassName: ''
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  data: function data() {
    var spinning = this.spinning,
        delay = this.delay;

    var shouldBeDelayed = shouldDelay(spinning, delay);
    this.originalUpdateSpinning = this.updateSpinning;
    this.debouncifyUpdateSpinning(this.$props);
    return {
      sSpinning: spinning && !shouldBeDelayed
    };
  },
  mounted: function mounted() {
    this.updateSpinning();
  },
  updated: function updated() {
    var _this = this;

    this.$nextTick(function () {
      _this.debouncifyUpdateSpinning();
      _this.updateSpinning();
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.cancelExistingSpin();
  },

  methods: {
    debouncifyUpdateSpinning: function debouncifyUpdateSpinning(props) {
      var _ref = props || this.$props,
          delay = _ref.delay;

      if (delay) {
        this.cancelExistingSpin();
        this.updateSpinning = (0, _debounce2['default'])(this.originalUpdateSpinning, delay);
      }
    },
    updateSpinning: function updateSpinning() {
      var spinning = this.spinning,
          sSpinning = this.sSpinning;

      if (sSpinning !== spinning) {
        this.setState({ sSpinning: spinning });
      }
    },
    cancelExistingSpin: function cancelExistingSpin() {
      var updateSpinning = this.updateSpinning;

      if (updateSpinning && updateSpinning.cancel) {
        updateSpinning.cancel();
      }
    },
    getChildren: function getChildren() {
      if (this.$slots && this.$slots['default']) {
        return (0, _propsUtil.filterEmpty)(this.$slots['default']);
      }
      return null;
    },
    renderIndicator: function renderIndicator(h, prefixCls) {
      // const h = this.$createElement
      var dotClassName = prefixCls + '-dot';
      var indicator = (0, _propsUtil.getComponentFromProp)(this, 'indicator');
      // should not be render default indicator when indicator value is null
      if (indicator === null) {
        return null;
      }
      if (Array.isArray(indicator)) {
        indicator = (0, _propsUtil.filterEmpty)(indicator);
        indicator = indicator.length === 1 ? indicator[0] : indicator;
      }
      if ((0, _propsUtil.isValidElement)(indicator)) {
        return (0, _vnode.cloneElement)(indicator, { 'class': dotClassName });
      }

      if (defaultIndicator && (0, _propsUtil.isValidElement)(defaultIndicator(h))) {
        return (0, _vnode.cloneElement)(defaultIndicator(h), { 'class': dotClassName });
      }

      return h(
        'span',
        { 'class': dotClassName + ' ' + prefixCls + '-dot-spin' },
        [h('i', { 'class': prefixCls + '-dot-item' }), h('i', { 'class': prefixCls + '-dot-item' }), h('i', { 'class': prefixCls + '-dot-item' }), h('i', { 'class': prefixCls + '-dot-item' })]
      );
    }
  },
  render: function render(h) {
    var _spinClassName;

    var _$props = this.$props,
        size = _$props.size,
        customizePrefixCls = _$props.prefixCls,
        tip = _$props.tip,
        wrapperClassName = _$props.wrapperClassName,
        restProps = (0, _objectWithoutProperties3['default'])(_$props, ['size', 'prefixCls', 'tip', 'wrapperClassName']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('spin', customizePrefixCls);

    var sSpinning = this.sSpinning;

    var spinClassName = (_spinClassName = {}, (0, _defineProperty3['default'])(_spinClassName, prefixCls, true), (0, _defineProperty3['default'])(_spinClassName, prefixCls + '-sm', size === 'small'), (0, _defineProperty3['default'])(_spinClassName, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_spinClassName, prefixCls + '-spinning', sSpinning), (0, _defineProperty3['default'])(_spinClassName, prefixCls + '-show-text', !!tip), _spinClassName);

    var spinElement = h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([restProps, { 'class': spinClassName }]),
      [this.renderIndicator(h, prefixCls), tip ? h(
        'div',
        { 'class': prefixCls + '-text' },
        [tip]
      ) : null]
    );
    var children = this.getChildren();
    if (children) {
      var _containerClassName;

      var containerClassName = (_containerClassName = {}, (0, _defineProperty3['default'])(_containerClassName, prefixCls + '-container', true), (0, _defineProperty3['default'])(_containerClassName, prefixCls + '-blur', sSpinning), _containerClassName);

      return h(
        'div',
        (0, _babelHelperVueJsxMergeProps2['default'])([{ on: (0, _propsUtil.getListeners)(this) }, {
          'class': [prefixCls + '-nested-loading', wrapperClassName]
        }]),
        [sSpinning && h(
          'div',
          { key: 'loading' },
          [spinElement]
        ), h(
          'div',
          { 'class': containerClassName, key: 'container' },
          [children]
        )]
      );
    }
    return spinElement;
  }
};