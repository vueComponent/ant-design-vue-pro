import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import classNames from 'classnames';
import PropTypes from '../../../_util/vue-types';
import addEventListener from '../../../vc-util/Dom/addEventListener';
import warning from '../../../_util/warning';
import { initDefaultProps } from '../../../_util/props-util';
import Steps from './Steps';
import Marks from './Marks';
import Handle from '../Handle';
import * as utils from '../utils';

function noop() {}

export default function createSlider(Component) {
  // const displayName = `ComponentEnhancer(${Component.displayName})`
  var propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    marks: PropTypes.object,
    included: PropTypes.bool,
    prefixCls: PropTypes.string,
    disabled: PropTypes.bool,
    handle: PropTypes.func,
    dots: PropTypes.bool,
    vertical: PropTypes.bool,
    reverse: PropTypes.bool,
    minimumTrackStyle: PropTypes.object, // just for compatibility, will be deperecate
    maximumTrackStyle: PropTypes.object, // just for compatibility, will be deperecate
    handleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    trackStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    railStyle: PropTypes.object,
    dotStyle: PropTypes.object,
    activeDotStyle: PropTypes.object,
    autoFocus: PropTypes.bool
  };
  return {
    name: 'createSlider',
    mixins: [Component],
    model: {
      prop: 'value',
      event: 'change'
    },
    props: initDefaultProps(propTypes, {
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
      warning(step && Math.floor(step) === step ? isPointDiffEven : true, 'Slider', 'Slider[max] - Slider[min] (%s) should be a multiple of Slider[step] (%s)', max - min, step);
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
            restProps = _objectWithoutProperties(_ref, ['index', 'directives', 'className', 'style', 'on']);

        var h = this.$createElement;

        delete restProps.dragging;
        if (restProps.value === null) {
          return null;
        }
        var handleProps = {
          props: _extends({}, restProps),
          'class': className,
          style: style,
          key: index,
          directives: directives,
          on: on
        };
        return h(Handle, handleProps);
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
        this.onTouchMoveListener = addEventListener(this.document, 'touchmove', this.onTouchMove);
        this.onTouchUpListener = addEventListener(this.document, 'touchend', this.onEnd);
      },
      addDocumentMouseEvents: function addDocumentMouseEvents() {
        this.onMouseMoveListener = addEventListener(this.document, 'mousemove', this.onMouseMove);
        this.onMouseUpListener = addEventListener(this.document, 'mouseup', this.onEnd);
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

      var sliderClassName = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-with-marks', Object.keys(marks).length), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _defineProperty(_classNames, prefixCls + '-vertical', vertical), _classNames));
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
          style: _extends({}, maximumTrackStyle, railStyle)
        }), tracks, h(Steps, {
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
        }), handles, h(Marks, markProps), this.$slots['default']]
      );
    }
  };
}