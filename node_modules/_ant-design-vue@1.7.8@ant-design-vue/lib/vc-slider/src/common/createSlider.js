'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports['default'] = createSlider;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _addEventListener = require('../../../vc-util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _warning = require('../../../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _propsUtil = require('../../../_util/props-util');

var _Steps = require('./Steps');

var _Steps2 = _interopRequireDefault(_Steps);

var _Marks = require('./Marks');

var _Marks2 = _interopRequireDefault(_Marks);

var _Handle = require('../Handle');

var _Handle2 = _interopRequireDefault(_Handle);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function createSlider(Component) {
  // const displayName = `ComponentEnhancer(${Component.displayName})`
  var propTypes = {
    min: _vueTypes2['default'].number,
    max: _vueTypes2['default'].number,
    step: _vueTypes2['default'].number,
    marks: _vueTypes2['default'].object,
    included: _vueTypes2['default'].bool,
    prefixCls: _vueTypes2['default'].string,
    disabled: _vueTypes2['default'].bool,
    handle: _vueTypes2['default'].func,
    dots: _vueTypes2['default'].bool,
    vertical: _vueTypes2['default'].bool,
    reverse: _vueTypes2['default'].bool,
    minimumTrackStyle: _vueTypes2['default'].object, // just for compatibility, will be deperecate
    maximumTrackStyle: _vueTypes2['default'].object, // just for compatibility, will be deperecate
    handleStyle: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].arrayOf(_vueTypes2['default'].object)]),
    trackStyle: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].arrayOf(_vueTypes2['default'].object)]),
    railStyle: _vueTypes2['default'].object,
    dotStyle: _vueTypes2['default'].object,
    activeDotStyle: _vueTypes2['default'].object,
    autoFocus: _vueTypes2['default'].bool
  };
  return {
    name: 'createSlider',
    mixins: [Component],
    model: {
      prop: 'value',
      event: 'change'
    },
    props: (0, _propsUtil.initDefaultProps)(propTypes, {
      prefixCls: 'rc-slider',
      min: 0,
      max: 100,
      step: 1,
      marks: {},
      included: true,
      disabled: false,
      dots: false,
      vertical: false,
      reverse: false,
      trackStyle: [{}],
      handleStyle: [{}],
      railStyle: {},
      dotStyle: {},
      activeDotStyle: {}
    }),
    data: function data() {
      var step = this.step,
          max = this.max,
          min = this.min;

      var isPointDiffEven = isFinite(max - min) ? (max - min) % step === 0 : true; // eslint-disable-line
      (0, _warning2['default'])(step && Math.floor(step) === step ? isPointDiffEven : true, 'Slider', 'Slider[max] - Slider[min] (%s) should be a multiple of Slider[step] (%s)', max - min, step);
      this.handlesRefs = {};
      return {};
    },
    mounted: function mounted() {
      var _this = this;

      this.$nextTick(function () {
        // Snapshot testing cannot handle refs, so be sure to null-check this.
        _this.document = _this.$refs.sliderRef && _this.$refs.sliderRef.ownerDocument;
        // this.setHandleRefs()
        var autoFocus = _this.autoFocus,
            disabled = _this.disabled;

        if (autoFocus && !disabled) {
          _this.focus();
        }
      });
    },
    beforeDestroy: function beforeDestroy() {
      var _this2 = this;

      this.$nextTick(function () {
        // if (super.componentWillUnmount) super.componentWillUnmount()
        _this2.removeDocumentEvents();
      });
    },

    methods: {
      defaultHandle: function defaultHandle(_ref) {
        var index = _ref.index,
            directives = _ref.directives,
            className = _ref.className,
            style = _ref.style,
            on = _ref.on,
            restProps = (0, _objectWithoutProperties3['default'])(_ref, ['index', 'directives', 'className', 'style', 'on']);
        var h = this.$createElement;

        delete restProps.dragging;
        if (restProps.value === null) {
          return null;
        }
        var handleProps = {
          props: (0, _extends3['default'])({}, restProps),
          'class': className,
          style: style,
          key: index,
          directives: directives,
          on: on
        };
        return h(_Handle2['default'], handleProps);
      },
      onMouseDown: function onMouseDown(e) {
        if (e.button !== 0) {
          return;
        }
        var isVertical = this.vertical;
        var position = utils.getMousePosition(isVertical, e);
        if (!utils.isEventFromHandle(e, this.handlesRefs)) {
          this.dragOffset = 0;
        } else {
          var handlePosition = utils.getHandleCenterPosition(isVertical, e.target);
          this.dragOffset = position - handlePosition;
          position = handlePosition;
        }
        this.removeDocumentEvents();
        this.onStart(position);
        this.addDocumentMouseEvents();
        utils.pauseEvent(e);
      },
      onTouchStart: function onTouchStart(e) {
        if (utils.isNotTouchEvent(e)) return;

        var isVertical = this.vertical;
        var position = utils.getTouchPosition(isVertical, e);
        if (!utils.isEventFromHandle(e, this.handlesRefs)) {
          this.dragOffset = 0;
        } else {
          var handlePosition = utils.getHandleCenterPosition(isVertical, e.target);
          this.dragOffset = position - handlePosition;
          position = handlePosition;
        }
        this.onStart(position);
        this.addDocumentTouchEvents();
        utils.pauseEvent(e);
      },
      onFocus: function onFocus(e) {
        var vertical = this.vertical;

        if (utils.isEventFromHandle(e, this.handlesRefs)) {
          var handlePosition = utils.getHandleCenterPosition(vertical, e.target);
          this.dragOffset = 0;
          this.onStart(handlePosition);
          utils.pauseEvent(e);
          this.$emit('focus', e);
        }
      },
      onBlur: function onBlur(e) {
        this.onEnd();
        this.$emit('blur', e);
      },
      onMouseUp: function onMouseUp() {
        if (this.handlesRefs[this.prevMovedHandleIndex]) {
          this.handlesRefs[this.prevMovedHandleIndex].clickFocus();
        }
      },
      onMouseMove: function onMouseMove(e) {
        if (!this.$refs.sliderRef) {
          this.onEnd();
          return;
        }
        var position = utils.getMousePosition(this.vertical, e);
        this.onMove(e, position - this.dragOffset);
      },
      onTouchMove: function onTouchMove(e) {
        if (utils.isNotTouchEvent(e) || !this.$refs.sliderRef) {
          this.onEnd();
          return;
        }

        var position = utils.getTouchPosition(this.vertical, e);
        this.onMove(e, position - this.dragOffset);
      },
      onKeyDown: function onKeyDown(e) {
        if (this.$refs.sliderRef && utils.isEventFromHandle(e, this.handlesRefs)) {
          this.onKeyboard(e);
        }
      },
      onClickMarkLabel: function onClickMarkLabel(e, value) {
        var _this3 = this;

        e.stopPropagation();
        this.onChange({ sValue: value });
        this.setState({ sValue: value }, function () {
          return _this3.onEnd(true);
        });
      },
      getSliderStart: function getSliderStart() {
        var slider = this.$refs.sliderRef;
        var vertical = this.vertical,
            reverse = this.reverse;

        var rect = slider.getBoundingClientRect();
        if (vertical) {
          return reverse ? rect.bottom : rect.top;
        }
        return window.pageXOffset + (reverse ? rect.right : rect.left);
      },
      getSliderLength: function getSliderLength() {
        var slider = this.$refs.sliderRef;
        if (!slider) {
          return 0;
        }

        var coords = slider.getBoundingClientRect();
        return this.vertical ? coords.height : coords.width;
      },
      addDocumentTouchEvents: function addDocumentTouchEvents() {
        // just work for Chrome iOS Safari and Android Browser
        this.onTouchMoveListener = (0, _addEventListener2['default'])(this.document, 'touchmove', this.onTouchMove);
        this.onTouchUpListener = (0, _addEventListener2['default'])(this.document, 'touchend', this.onEnd);
      },
      addDocumentMouseEvents: function addDocumentMouseEvents() {
        this.onMouseMoveListener = (0, _addEventListener2['default'])(this.document, 'mousemove', this.onMouseMove);
        this.onMouseUpListener = (0, _addEventListener2['default'])(this.document, 'mouseup', this.onEnd);
      },
      removeDocumentEvents: function removeDocumentEvents() {
        /* eslint-disable no-unused-expressions */
        this.onTouchMoveListener && this.onTouchMoveListener.remove();
        this.onTouchUpListener && this.onTouchUpListener.remove();

        this.onMouseMoveListener && this.onMouseMoveListener.remove();
        this.onMouseUpListener && this.onMouseUpListener.remove();
        /* eslint-enable no-unused-expressions */
      },
      focus: function focus() {
        if (!this.disabled) {
          this.handlesRefs[0].focus();
        }
      },
      blur: function blur() {
        var _this4 = this;

        if (!this.disabled) {
          Object.keys(this.handlesRefs).forEach(function (key) {
            if (_this4.handlesRefs[key] && _this4.handlesRefs[key].blur) {
              _this4.handlesRefs[key].blur();
            }
          });
        }
      },
      calcValue: function calcValue(offset) {
        var vertical = this.vertical,
            min = this.min,
            max = this.max;

        var ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
        var value = vertical ? (1 - ratio) * (max - min) + min : ratio * (max - min) + min;
        return value;
      },
      calcValueByPos: function calcValueByPos(position) {
        var sign = this.reverse ? -1 : +1;
        var pixelOffset = sign * (position - this.getSliderStart());
        var nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
        return nextValue;
      },
      calcOffset: function calcOffset(value) {
        var min = this.min,
            max = this.max;

        var ratio = (value - min) / (max - min);
        return ratio * 100;
      },
      saveHandle: function saveHandle(index, handle) {
        this.handlesRefs[index] = handle;
      }
    },
    render: function render(h) {
      var _classNames;

      var prefixCls = this.prefixCls,
          marks = this.marks,
          dots = this.dots,
          step = this.step,
          included = this.included,
          disabled = this.disabled,
          vertical = this.vertical,
          reverse = this.reverse,
          min = this.min,
          max = this.max,
          maximumTrackStyle = this.maximumTrackStyle,
          railStyle = this.railStyle,
          dotStyle = this.dotStyle,
          activeDotStyle = this.activeDotStyle;

      var _renderSlider = this.renderSlider(h),
          tracks = _renderSlider.tracks,
          handles = _renderSlider.handles;

      var sliderClassName = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-with-marks', Object.keys(marks).length), (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_classNames, prefixCls + '-vertical', vertical), _classNames));
      var markProps = {
        props: {
          vertical: vertical,
          marks: marks,
          included: included,
          lowerBound: this.getLowerBound(),
          upperBound: this.getUpperBound(),
          max: max,
          min: min,
          reverse: reverse,
          className: prefixCls + '-mark'
        },
        on: {
          clickLabel: disabled ? noop : this.onClickMarkLabel
        }
      };
      return h(
        'div',
        {
          ref: 'sliderRef',
          attrs: { tabIndex: '-1'
          },
          'class': sliderClassName,
          on: {
            'touchstart': disabled ? noop : this.onTouchStart,
            'mousedown': disabled ? noop : this.onMouseDown,
            'mouseup': disabled ? noop : this.onMouseUp,
            'keydown': disabled ? noop : this.onKeyDown,
            'focus': disabled ? noop : this.onFocus,
            'blur': disabled ? noop : this.onBlur
          }
        },
        [h('div', {
          'class': prefixCls + '-rail',
          style: (0, _extends3['default'])({}, maximumTrackStyle, railStyle)
        }), tracks, h(_Steps2['default'], {
          attrs: {
            prefixCls: prefixCls,
            vertical: vertical,
            reverse: reverse,
            marks: marks,
            dots: dots,
            step: step,
            included: included,
            lowerBound: this.getLowerBound(),
            upperBound: this.getUpperBound(),
            max: max,
            min: min,
            dotStyle: dotStyle,
            activeDotStyle: activeDotStyle
          }
        }), handles, h(_Marks2['default'], markProps), this.$slots['default']]
      );
    }
  };
}