'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SliderProps = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _Slider = require('../vc-slider/src/Slider');

var _Slider2 = _interopRequireDefault(_Slider);

var _Range = require('../vc-slider/src/Range');

var _Range2 = _interopRequireDefault(_Range);

var _Handle = require('../vc-slider/src/Handle');

var _Handle2 = _interopRequireDefault(_Handle);

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _abstractTooltipProps = require('../tooltip/abstractTooltipProps');

var _abstractTooltipProps2 = _interopRequireDefault(_abstractTooltipProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export interface SliderMarks {
//   [key]: React.ReactNode | {
//     style: React.CSSProperties,
//     label: React.ReactNode,
//   };
// }
// const SliderMarks = PropTypes.shape({
//   style: PropTypes.object,
//   label: PropTypes.any,
// }).loose
var tooltipProps = (0, _abstractTooltipProps2['default'])();
var SliderProps = exports.SliderProps = function SliderProps() {
  return {
    prefixCls: _vueTypes2['default'].string,
    tooltipPrefixCls: _vueTypes2['default'].string,
    range: _vueTypes2['default'].bool,
    reverse: _vueTypes2['default'].bool,
    min: _vueTypes2['default'].number,
    max: _vueTypes2['default'].number,
    step: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].any]),
    marks: _vueTypes2['default'].object,
    dots: _vueTypes2['default'].bool,
    value: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].arrayOf(_vueTypes2['default'].number)]),
    defaultValue: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].arrayOf(_vueTypes2['default'].number)]),
    included: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool,
    vertical: _vueTypes2['default'].bool,
    tipFormatter: _vueTypes2['default'].oneOfType([_vueTypes2['default'].func, _vueTypes2['default'].object]),
    tooltipVisible: _vueTypes2['default'].bool,
    tooltipPlacement: tooltipProps.placement,
    getTooltipPopupContainer: _vueTypes2['default'].func
  };
};

var Slider = {
  name: 'ASlider',
  model: {
    prop: 'value',
    event: 'change'
  },
  mixins: [_BaseMixin2['default']],
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  props: (0, _extends4['default'])({}, SliderProps(), {
    tipFormatter: _vueTypes2['default'].oneOfType([_vueTypes2['default'].func, _vueTypes2['default'].object]).def(function (value) {
      return value.toString();
    })
  }),
  data: function data() {
    return {
      visibles: {}
    };
  },

  methods: {
    toggleTooltipVisible: function toggleTooltipVisible(index, visible) {
      this.setState(function (_ref) {
        var visibles = _ref.visibles;
        return {
          visibles: (0, _extends4['default'])({}, visibles, (0, _defineProperty3['default'])({}, index, visible))
        };
      });
    },
    handleWithTooltip: function handleWithTooltip(tooltipPrefixCls, prefixCls, _ref2) {
      var _this = this;

      var value = _ref2.value,
          dragging = _ref2.dragging,
          index = _ref2.index,
          directives = _ref2.directives,
          on = _ref2.on,
          restProps = (0, _objectWithoutProperties3['default'])(_ref2, ['value', 'dragging', 'index', 'directives', 'on']);
      var h = this.$createElement;
      var _$props = this.$props,
          tipFormatter = _$props.tipFormatter,
          tooltipVisible = _$props.tooltipVisible,
          tooltipPlacement = _$props.tooltipPlacement,
          getTooltipPopupContainer = _$props.getTooltipPopupContainer;
      var visibles = this.visibles;

      var isTipFormatter = tipFormatter ? visibles[index] || dragging : false;
      var visible = tooltipVisible || tooltipVisible === undefined && isTipFormatter;
      var tooltipProps = {
        props: {
          prefixCls: tooltipPrefixCls,
          title: tipFormatter ? tipFormatter(value) : '',
          visible: visible,
          placement: tooltipPlacement || 'top',
          transitionName: 'zoom-down',
          overlayClassName: prefixCls + '-tooltip',
          getPopupContainer: getTooltipPopupContainer || function () {
            return document.body;
          }
        },
        key: index
      };
      var handleProps = {
        props: (0, _extends4['default'])({
          value: value
        }, restProps),
        directives: directives,
        on: (0, _extends4['default'])({}, on, {
          mouseenter: function mouseenter() {
            return _this.toggleTooltipVisible(index, true);
          },
          mouseleave: function mouseleave() {
            return _this.toggleTooltipVisible(index, false);
          }
        })
      };
      return h(
        _tooltip2['default'],
        tooltipProps,
        [h(_Handle2['default'], handleProps)]
      );
    },
    focus: function focus() {
      this.$refs.sliderRef.focus();
    },
    blur: function blur() {
      this.$refs.sliderRef.blur();
    }
  },
  render: function render() {
    var _this2 = this;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        range = _getOptionProps.range,
        customizePrefixCls = _getOptionProps.prefixCls,
        customizeTooltipPrefixCls = _getOptionProps.tooltipPrefixCls,
        restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['range', 'prefixCls', 'tooltipPrefixCls']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('slider', customizePrefixCls);
    var tooltipPrefixCls = getPrefixCls('tooltip', customizeTooltipPrefixCls);
    var listeners = (0, _propsUtil.getListeners)(this);
    if (range) {
      var vcRangeProps = {
        props: (0, _extends4['default'])({}, restProps, {
          prefixCls: prefixCls,
          tooltipPrefixCls: tooltipPrefixCls,
          handle: function handle(info) {
            return _this2.handleWithTooltip(tooltipPrefixCls, prefixCls, info);
          }
        }),
        ref: 'sliderRef',
        on: listeners
      };
      return h(_Range2['default'], vcRangeProps);
    }
    var vcSliderProps = {
      props: (0, _extends4['default'])({}, restProps, {
        prefixCls: prefixCls,
        tooltipPrefixCls: tooltipPrefixCls,
        handle: function handle(info) {
          return _this2.handleWithTooltip(tooltipPrefixCls, prefixCls, info);
        }
      }),
      ref: 'sliderRef',
      on: listeners
    };
    return h(_Slider2['default'], vcSliderProps);
  }
};

/* istanbul ignore next */
Slider.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Slider.name, Slider);
};

exports['default'] = Slider;