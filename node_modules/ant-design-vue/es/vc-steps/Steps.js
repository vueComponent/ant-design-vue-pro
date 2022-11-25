import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import debounce from 'lodash/debounce';
import isFlexSupported from '../_util/isFlexSupported';
import { filterEmpty, getEvents, getPropsData, getListeners } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';

export default {
  name: 'Steps',
  mixins: [BaseMixin],
  props: {
    type: PropTypes.string.def('default'),
    prefixCls: PropTypes.string.def('rc-steps'),
    iconPrefix: PropTypes.string.def('rc'),
    direction: PropTypes.string.def('horizontal'),
    labelPlacement: PropTypes.string.def('horizontal'),
    status: PropTypes.string.def('process'),
    size: PropTypes.string.def(''),
    progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    initial: PropTypes.number.def(0),
    current: PropTypes.number.def(0),
    icons: PropTypes.shape({
      finish: PropTypes.any,
      error: PropTypes.any
    }).loose
  },
  data: function data() {
    this.calcStepOffsetWidth = debounce(this.calcStepOffsetWidth, 150);
    return {
      flexSupported: true,
      lastStepOffsetWidth: 0
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.calcStepOffsetWidth();
      if (!isFlexSupported()) {
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

      if (isFlexSupported()) {
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

    var filteredChildren = filterEmpty(this.$slots['default']);
    var lastIndex = filteredChildren.length - 1;
    var adjustedlabelPlacement = progressDot ? 'vertical' : labelPlacement;
    var classString = (_classString = {}, _defineProperty(_classString, prefixCls, true), _defineProperty(_classString, prefixCls + '-' + direction, true), _defineProperty(_classString, prefixCls + '-' + size, size), _defineProperty(_classString, prefixCls + '-label-' + adjustedlabelPlacement, direction === 'horizontal'), _defineProperty(_classString, prefixCls + '-dot', !!progressDot), _defineProperty(_classString, prefixCls + '-navigation', isNav), _defineProperty(_classString, prefixCls + '-flex-not-supported', !flexSupported), _classString);
    var listeners = getListeners(this);
    var stepsProps = {
      'class': classString,
      ref: 'vcStepsRef',
      on: listeners
    };
    return h(
      'div',
      stepsProps,
      [filteredChildren.map(function (child, index) {
        var childProps = getPropsData(child);
        var stepNumber = initial + index;
        var stepProps = {
          props: _extends({
            stepNumber: '' + (stepNumber + 1),
            stepIndex: stepNumber,
            prefixCls: prefixCls,
            iconPrefix: iconPrefix,
            progressDot: _this4.progressDot,
            icons: icons
          }, childProps),
          on: getEvents(child),
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
        return cloneElement(child, stepProps);
      })]
    );
  }
};