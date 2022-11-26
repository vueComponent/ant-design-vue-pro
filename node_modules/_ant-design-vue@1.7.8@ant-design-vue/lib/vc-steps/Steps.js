'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _isFlexSupported = require('../_util/isFlexSupported');

var _isFlexSupported2 = _interopRequireDefault(_isFlexSupported);

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'Steps',
  mixins: [_BaseMixin2['default']],
  props: {
    type: _vueTypes2['default'].string.def('default'),
    prefixCls: _vueTypes2['default'].string.def('rc-steps'),
    iconPrefix: _vueTypes2['default'].string.def('rc'),
    direction: _vueTypes2['default'].string.def('horizontal'),
    labelPlacement: _vueTypes2['default'].string.def('horizontal'),
    status: _vueTypes2['default'].string.def('process'),
    size: _vueTypes2['default'].string.def(''),
    progressDot: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].func]),
    initial: _vueTypes2['default'].number.def(0),
    current: _vueTypes2['default'].number.def(0),
    icons: _vueTypes2['default'].shape({
      finish: _vueTypes2['default'].any,
      error: _vueTypes2['default'].any
    }).loose
  },
  data: function data() {
    this.calcStepOffsetWidth = (0, _debounce2['default'])(this.calcStepOffsetWidth, 150);
    return {
      flexSupported: true,
      lastStepOffsetWidth: 0
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.calcStepOffsetWidth();
      if (!(0, _isFlexSupported2['default'])()) {
        _this.setState({
          flexSupported: false
        });
      }
    });
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.calcStepOffsetWidth();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.calcTimeout) {
      clearTimeout(this.calcTimeout);
    }
    if (this.calcStepOffsetWidth && this.calcStepOffsetWidth.cancel) {
      this.calcStepOffsetWidth.cancel();
    }
  },

  methods: {
    onStepClick: function onStepClick(next) {
      var current = this.$props.current;

      if (current !== next) {
        this.$emit('change', next);
      }
    },
    calcStepOffsetWidth: function calcStepOffsetWidth() {
      var _this3 = this;

      if ((0, _isFlexSupported2['default'])()) {
        return;
      }
      var lastStepOffsetWidth = this.$data.lastStepOffsetWidth;
      // Just for IE9

      var domNode = this.$refs.vcStepsRef;
      if (domNode.children.length > 0) {
        if (this.calcTimeout) {
          clearTimeout(this.calcTimeout);
        }
        this.calcTimeout = setTimeout(function () {
          // +1 for fit edge bug of digit width, like 35.4px
          var offsetWidth = (domNode.lastChild.offsetWidth || 0) + 1;
          // Reduce shake bug
          if (lastStepOffsetWidth === offsetWidth || Math.abs(lastStepOffsetWidth - offsetWidth) <= 3) {
            return;
          }
          _this3.setState({ lastStepOffsetWidth: offsetWidth });
        });
      }
    }
  },
  render: function render() {
    var _classString,
        _this4 = this;

    var h = arguments[0];
    var prefixCls = this.prefixCls,
        direction = this.direction,
        type = this.type,
        labelPlacement = this.labelPlacement,
        iconPrefix = this.iconPrefix,
        status = this.status,
        size = this.size,
        current = this.current,
        $scopedSlots = this.$scopedSlots,
        initial = this.initial,
        icons = this.icons;

    var isNav = type === 'navigation';
    var progressDot = this.progressDot;
    if (progressDot === undefined) {
      progressDot = $scopedSlots.progressDot;
    }
    var lastStepOffsetWidth = this.lastStepOffsetWidth,
        flexSupported = this.flexSupported;

    var filteredChildren = (0, _propsUtil.filterEmpty)(this.$slots['default']);
    var lastIndex = filteredChildren.length - 1;
    var adjustedlabelPlacement = progressDot ? 'vertical' : labelPlacement;
    var classString = (_classString = {}, (0, _defineProperty3['default'])(_classString, prefixCls, true), (0, _defineProperty3['default'])(_classString, prefixCls + '-' + direction, true), (0, _defineProperty3['default'])(_classString, prefixCls + '-' + size, size), (0, _defineProperty3['default'])(_classString, prefixCls + '-label-' + adjustedlabelPlacement, direction === 'horizontal'), (0, _defineProperty3['default'])(_classString, prefixCls + '-dot', !!progressDot), (0, _defineProperty3['default'])(_classString, prefixCls + '-navigation', isNav), (0, _defineProperty3['default'])(_classString, prefixCls + '-flex-not-supported', !flexSupported), _classString);
    var listeners = (0, _propsUtil.getListeners)(this);
    var stepsProps = {
      'class': classString,
      ref: 'vcStepsRef',
      on: listeners
    };
    return h(
      'div',
      stepsProps,
      [filteredChildren.map(function (child, index) {
        var childProps = (0, _propsUtil.getPropsData)(child);
        var stepNumber = initial + index;
        var stepProps = {
          props: (0, _extends3['default'])({
            stepNumber: '' + (stepNumber + 1),
            stepIndex: stepNumber,
            prefixCls: prefixCls,
            iconPrefix: iconPrefix,
            progressDot: _this4.progressDot,
            icons: icons
          }, childProps),
          on: (0, _propsUtil.getEvents)(child),
          scopedSlots: $scopedSlots
        };
        if (listeners.change) {
          stepProps.on.stepClick = _this4.onStepClick;
        }
        if (!flexSupported && direction !== 'vertical') {
          if (isNav) {
            stepProps.props.itemWidth = 100 / (lastIndex + 1) + '%';
            stepProps.props.adjustMarginRight = 0;
          } else if (index !== lastIndex) {
            stepProps.props.itemWidth = 100 / lastIndex + '%';
            stepProps.props.adjustMarginRight = -Math.round(lastStepOffsetWidth / lastIndex + 1) + 'px';
          }
        }
        // fix tail color
        if (status === 'error' && index === current - 1) {
          stepProps['class'] = prefixCls + '-next-error';
        }
        if (!childProps.status) {
          if (stepNumber === current) {
            stepProps.props.status = status;
          } else if (stepNumber < current) {
            stepProps.props.status = 'finish';
          } else {
            stepProps.props.status = 'wait';
          }
        }
        stepProps.props.active = stepNumber === current;
        return (0, _vnode.cloneElement)(child, stepProps);
      })]
    );
  }
};