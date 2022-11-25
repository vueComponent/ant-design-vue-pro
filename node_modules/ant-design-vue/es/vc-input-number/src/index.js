import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _extends from 'babel-runtime/helpers/extends';
// based on rc-input-number 4.5.5
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { initDefaultProps, hasProp, getOptionProps, getListeners } from '../../_util/props-util';
import classNames from 'classnames';
import KeyCode from '../../_util/KeyCode';
import InputHandler from './InputHandler';

function noop() {}

function preventDefault(e) {
  e.preventDefault();
}

function defaultParser(input) {
  return input.replace(/[^\w\.-]+/g, '');
}

/**
 * When click and hold on a button - the speed of auto changin the value.
 */
var SPEED = 200;

/**
 * When click and hold on a button - the delay before auto changin the value.
 */
var DELAY = 600;

/**
 * Max Safe Integer -- on IE this is not available, so manually set the number in that case.
 * The reason this is used, instead of Infinity is because numbers above the MSI are unstable
 */
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

var isValidProps = function isValidProps(value) {
  return value !== undefined && value !== null;
};

var isEqual = function isEqual(oldValue, newValue) {
  return newValue === oldValue || typeof newValue === 'number' && typeof oldValue === 'number' && isNaN(newValue) && isNaN(oldValue);
};

var inputNumberProps = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  focusOnUpDown: PropTypes.bool,
  autoFocus: PropTypes.bool,
  // onChange: PropTypes.func,
  // onKeyDown: PropTypes.func,
  // onKeyUp: PropTypes.func,
  prefixCls: PropTypes.string,
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  // onFocus: PropTypes.func,
  // onBlur: PropTypes.func,
  readonly: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  upHandler: PropTypes.any,
  downHandler: PropTypes.any,
  useTouch: PropTypes.bool,
  formatter: PropTypes.func,
  parser: PropTypes.func,
  // onMouseEnter: PropTypes.func,
  // onMouseLeave: PropTypes.func,
  // onMouseOver: PropTypes.func,
  // onMouseOut: PropTypes.func,
  precision: PropTypes.number,
  required: PropTypes.bool,
  pattern: PropTypes.string,
  decimalSeparator: PropTypes.string,
  autoComplete: PropTypes.string,
  title: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string
};

export default {
  name: 'VCInputNumber',
  mixins: [BaseMixin],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: initDefaultProps(inputNumberProps, {
    focusOnUpDown: true,
    useTouch: false,
    prefixCls: 'rc-input-number',
    min: -MAX_SAFE_INTEGER,
    step: 1,
    parser: defaultParser,
    required: false,
    autoComplete: 'off'
  }),
  data: function data() {
    var props = getOptionProps(this);
    this.prevProps = _extends({}, props);
    var value = void 0;
    if ('value' in props) {
      value = this.value;
    } else {
      value = this.defaultValue;
    }
    var validValue = this.getValidValue(this.toNumber(value));
    return {
      inputValue: this.toPrecisionAsStep(validValue),
      sValue: validValue,
      focused: this.autoFocus
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.autoFocus && !_this.disabled) {
        _this.focus();
      }
      _this.updatedFunc();
    });
  },
  updated: function updated() {
    var _this2 = this;

    var _$props = this.$props,
        value = _$props.value,
        max = _$props.max,
        min = _$props.min;
    var focused = this.$data.focused;
    var prevProps = this.prevProps;

    var props = getOptionProps(this);
    // Don't trigger in componentDidMount
    if (prevProps) {
      if (!isEqual(prevProps.value, value) || !isEqual(prevProps.max, max) || !isEqual(prevProps.min, min)) {
        var validValue = focused ? value : this.getValidValue(value);
        var nextInputValue = void 0;
        if (this.pressingUpOrDown) {
          nextInputValue = validValue;
        } else if (this.inputting) {
          nextInputValue = this.rawInput;
        } else {
          nextInputValue = this.toPrecisionAsStep(validValue);
        }
        this.setState({
          // eslint-disable-line
          sValue: validValue,
          inputValue: nextInputValue
        });
      }

      // Trigger onChange when max or min change
      // https://github.com/ant-design/ant-design/issues/11574
      var nextValue = 'value' in props ? value : this.sValue;
      // ref: null < 20 === true
      // https://github.com/ant-design/ant-design/issues/14277
      if ('max' in props && prevProps.max !== max && typeof nextValue === 'number' && nextValue > max) {
        this.$emit('change', max);
      }
      if ('min' in props && prevProps.min !== min && typeof nextValue === 'number' && nextValue < min) {
        this.$emit('change', min);
      }
    }
    this.prevProps = _extends({}, props);
    this.$nextTick(function () {
      _this2.updatedFunc();
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.stop();
  },

  methods: {
    updatedFunc: function updatedFunc() {
      var inputElem = this.$refs.inputRef;
      // Restore cursor
      try {
        // Firefox set the input cursor after it get focused.
        // This caused that if an input didn't init with the selection,
        // set will cause cursor not correct when first focus.
        // Safari will focus input if set selection. We need skip this.
        if (this.cursorStart !== undefined && this.focused) {
          // In most cases, the string after cursor is stable.
          // We can move the cursor before it

          if (
          // If not match full str, try to match part of str
          !this.partRestoreByAfter(this.cursorAfter) && this.sValue !== this.value) {
            // If not match any of then, let's just keep the position
            // TODO: Logic should not reach here, need check if happens
            var pos = this.cursorStart + 1;

            // If not have last string, just position to the end
            if (!this.cursorAfter) {
              pos = inputElem.value.length;
            } else if (this.lastKeyCode === KeyCode.BACKSPACE) {
              pos = this.cursorStart - 1;
            } else if (this.lastKeyCode === KeyCode.DELETE) {
              pos = this.cursorStart;
            }
            this.fixCaret(pos, pos);
          } else if (this.currentValue === inputElem.value) {
            // Handle some special key code
            switch (this.lastKeyCode) {
              case KeyCode.BACKSPACE:
                this.fixCaret(this.cursorStart - 1, this.cursorStart - 1);
                break;
              case KeyCode.DELETE:
                this.fixCaret(this.cursorStart + 1, this.cursorStart + 1);
                break;
              default:
              // Do nothing
            }
          }
        }
      } catch (e) {}
      // Do nothing

      // Reset last key
      this.lastKeyCode = null;

      // pressingUpOrDown is true means that someone just click up or down button
      if (!this.pressingUpOrDown) {
        return;
      }
      if (this.focusOnUpDown && this.focused) {
        if (document.activeElement !== inputElem) {
          this.focus();
        }
      }

      this.pressingUpOrDown = false;
    },
    onKeyDown: function onKeyDown(e) {
      if (e.keyCode === KeyCode.UP) {
        var ratio = this.getRatio(e);
        this.up(e, ratio);
        this.stop();
      } else if (e.keyCode === KeyCode.DOWN) {
        var _ratio = this.getRatio(e);
        this.down(e, _ratio);
        this.stop();
      } else if (e.keyCode === KeyCode.ENTER) {
        this.$emit('pressEnter', e);
      }
      // Trigger user key down
      this.recordCursorPosition();
      this.lastKeyCode = e.keyCode;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this.$emit.apply(this, ['keydown', e].concat(_toConsumableArray(args)));
    },
    onKeyUp: function onKeyUp(e) {
      this.stop();

      this.recordCursorPosition();

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      this.$emit.apply(this, ['keyup', e].concat(_toConsumableArray(args)));
    },
    onTrigger: function onTrigger(e) {
      if (e.target.composing) return false;
      this.onChange(e);
    },
    onChange: function onChange(e) {
      if (this.focused) {
        this.inputting = true;
      }
      this.rawInput = this.parser(this.getValueFromEvent(e));
      this.setState({ inputValue: this.rawInput });
      this.$emit('change', this.toNumber(this.rawInput)); // valid number or invalid string
    },
    onFocus: function onFocus() {
      this.setState({
        focused: true
      });

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      this.$emit.apply(this, ['focus'].concat(_toConsumableArray(args)));
    },
    onBlur: function onBlur() {
      this.inputting = false;
      this.setState({
        focused: false
      });
      var value = this.getCurrentValidValue(this.inputValue);
      var newValue = this.setValue(value);
      if (this.$listeners.blur) {
        var originValue = this.$refs.inputRef.value;
        var inputValue = this.getInputDisplayValue({ focused: false, sValue: newValue });
        this.$refs.inputRef.value = inputValue;

        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        this.$emit.apply(this, ['blur'].concat(_toConsumableArray(args)));
        this.$refs.inputRef.value = originValue;
      }
    },
    getCurrentValidValue: function getCurrentValidValue(value) {
      var val = value;
      if (val === '') {
        val = '';
      } else if (!this.isNotCompleteNumber(parseFloat(val, 10))) {
        val = this.getValidValue(val);
      } else {
        val = this.sValue;
      }
      return this.toNumber(val);
    },
    getRatio: function getRatio(e) {
      var ratio = 1;
      if (e.metaKey || e.ctrlKey) {
        ratio = 0.1;
      } else if (e.shiftKey) {
        ratio = 10;
      }
      return ratio;
    },
    getValueFromEvent: function getValueFromEvent(e) {
      // optimize for chinese input expierence
      // https://github.com/ant-design/ant-design/issues/8196
      var value = e.target.value.trim().replace(/。/g, '.');

      if (isValidProps(this.decimalSeparator)) {
        value = value.replace(this.decimalSeparator, '.');
      }

      return value;
    },
    getValidValue: function getValidValue(value) {
      var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.min;
      var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.max;

      var val = parseFloat(value, 10);
      // https://github.com/ant-design/ant-design/issues/7358
      if (isNaN(val)) {
        return value;
      }
      if (val < min) {
        val = min;
      }
      if (val > max) {
        val = max;
      }
      return val;
    },
    setValue: function setValue(v, callback) {
      // trigger onChange
      var precision = this.$props.precision;

      var newValue = this.isNotCompleteNumber(parseFloat(v, 10)) ? null : parseFloat(v, 10);
      var _$data = this.$data,
          _$data$sValue = _$data.sValue,
          value = _$data$sValue === undefined ? null : _$data$sValue,
          _$data$inputValue = _$data.inputValue,
          inputValue = _$data$inputValue === undefined ? null : _$data$inputValue;
      // https://github.com/ant-design/ant-design/issues/7363
      // https://github.com/ant-design/ant-design/issues/16622

      var newValueInString = typeof newValue === 'number' ? newValue.toFixed(precision) : '' + newValue;
      var changed = newValue !== value || newValueInString !== '' + inputValue;
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: newValue,
          inputValue: this.toPrecisionAsStep(v)
        }, callback);
      } else {
        // always set input value same as value
        this.setState({
          inputValue: this.toPrecisionAsStep(this.sValue)
        }, callback);
      }
      if (changed) {
        this.$emit('change', newValue);
      }
      return newValue;
    },
    getPrecision: function getPrecision(value) {
      if (isValidProps(this.precision)) {
        return this.precision;
      }
      var valueString = value.toString();
      if (valueString.indexOf('e-') >= 0) {
        return parseInt(valueString.slice(valueString.indexOf('e-') + 2), 10);
      }
      var precision = 0;
      if (valueString.indexOf('.') >= 0) {
        precision = valueString.length - valueString.indexOf('.') - 1;
      }
      return precision;
    },

    // step={1.0} value={1.51}
    // press +
    // then value should be 2.51, rather than 2.5
    // if this.$props.precision is undefined
    // https://github.com/react-component/input-number/issues/39
    getMaxPrecision: function getMaxPrecision(currentValue) {
      var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (isValidProps(this.precision)) {
        return this.precision;
      }
      var step = this.step;

      var ratioPrecision = this.getPrecision(ratio);
      var stepPrecision = this.getPrecision(step);
      var currentValuePrecision = this.getPrecision(currentValue);
      if (!currentValue) {
        return ratioPrecision + stepPrecision;
      }
      return Math.max(currentValuePrecision, ratioPrecision + stepPrecision);
    },
    getPrecisionFactor: function getPrecisionFactor(currentValue) {
      var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var precision = this.getMaxPrecision(currentValue, ratio);
      return Math.pow(10, precision);
    },
    getInputDisplayValue: function getInputDisplayValue(state) {
      var _ref = state || this.$data,
          focused = _ref.focused,
          inputValue = _ref.inputValue,
          sValue = _ref.sValue;

      var inputDisplayValue = void 0;
      if (focused) {
        inputDisplayValue = inputValue;
      } else {
        inputDisplayValue = this.toPrecisionAsStep(sValue);
      }

      if (inputDisplayValue === undefined || inputDisplayValue === null) {
        inputDisplayValue = '';
      }

      var inputDisplayValueFormat = this.formatWrapper(inputDisplayValue);
      if (isValidProps(this.$props.decimalSeparator)) {
        inputDisplayValueFormat = inputDisplayValueFormat.toString().replace('.', this.$props.decimalSeparator);
      }

      return inputDisplayValueFormat;
    },
    recordCursorPosition: function recordCursorPosition() {
      // Record position
      try {
        var inputElem = this.$refs.inputRef;
        this.cursorStart = inputElem.selectionStart;
        this.cursorEnd = inputElem.selectionEnd;
        this.currentValue = inputElem.value;
        this.cursorBefore = inputElem.value.substring(0, this.cursorStart);
        this.cursorAfter = inputElem.value.substring(this.cursorEnd);
      } catch (e) {
        // Fix error in Chrome:
        // Failed to read the 'selectionStart' property from 'HTMLInputElement'
        // http://stackoverflow.com/q/21177489/3040605
      }
    },
    fixCaret: function fixCaret(start, end) {
      if (start === undefined || end === undefined || !this.$refs.inputRef || !this.$refs.inputRef.value) {
        return;
      }

      try {
        var inputElem = this.$refs.inputRef;
        var currentStart = inputElem.selectionStart;
        var currentEnd = inputElem.selectionEnd;

        if (start !== currentStart || end !== currentEnd) {
          inputElem.setSelectionRange(start, end);
        }
      } catch (e) {
        // Fix error in Chrome:
        // Failed to read the 'selectionStart' property from 'HTMLInputElement'
        // http://stackoverflow.com/q/21177489/3040605
      }
    },
    restoreByAfter: function restoreByAfter(str) {
      if (str === undefined) return false;

      var fullStr = this.$refs.inputRef.value;
      var index = fullStr.lastIndexOf(str);

      if (index === -1) return false;

      var prevCursorPos = this.cursorBefore.length;
      if (this.lastKeyCode === KeyCode.DELETE && this.cursorBefore.charAt(prevCursorPos - 1) === str[0]) {
        this.fixCaret(prevCursorPos, prevCursorPos);
        return true;
      }
      if (index + str.length === fullStr.length) {
        this.fixCaret(index, index);

        return true;
      }
      return false;
    },
    partRestoreByAfter: function partRestoreByAfter(str) {
      var _this3 = this;

      if (str === undefined) return false;

      // For loop from full str to the str with last char to map. e.g. 123
      // -> 123
      // -> 23
      // -> 3
      return Array.prototype.some.call(str, function (_, start) {
        var partStr = str.substring(start);

        return _this3.restoreByAfter(partStr);
      });
    },
    focus: function focus() {
      this.$refs.inputRef.focus();
      this.recordCursorPosition();
    },
    blur: function blur() {
      this.$refs.inputRef.blur();
    },
    formatWrapper: function formatWrapper(num) {
      // http://2ality.com/2012/03/signedzero.html
      // https://github.com/ant-design/ant-design/issues/9439
      if (this.formatter) {
        return this.formatter(num);
      }
      return num;
    },
    toPrecisionAsStep: function toPrecisionAsStep(num) {
      if (this.isNotCompleteNumber(num) || num === '') {
        return num;
      }
      var precision = Math.abs(this.getMaxPrecision(num));
      if (!isNaN(precision)) {
        return Number(num).toFixed(precision);
      }
      return num.toString();
    },

    // '1.' '1x' 'xx' '' => are not complete numbers
    isNotCompleteNumber: function isNotCompleteNumber(num) {
      return isNaN(num) || num === '' || num === null || num && num.toString().indexOf('.') === num.toString().length - 1;
    },
    toNumber: function toNumber(num) {
      var _$props2 = this.$props,
          precision = _$props2.precision,
          autoFocus = _$props2.autoFocus;
      var _focused = this.focused,
          focused = _focused === undefined ? autoFocus : _focused;
      // num.length > 16 => This is to prevent input of large numbers

      var numberIsTooLarge = num && num.length > 16 && focused;
      if (this.isNotCompleteNumber(num) || numberIsTooLarge) {
        return num;
      }
      if (isValidProps(precision)) {
        return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
      }
      return Number(num);
    },
    upStep: function upStep(val, rat) {
      var step = this.step;

      var precisionFactor = this.getPrecisionFactor(val, rat);
      var precision = Math.abs(this.getMaxPrecision(val, rat));
      var result = ((precisionFactor * val + precisionFactor * step * rat) / precisionFactor).toFixed(precision);
      return this.toNumber(result);
    },
    downStep: function downStep(val, rat) {
      var step = this.step;

      var precisionFactor = this.getPrecisionFactor(val, rat);
      var precision = Math.abs(this.getMaxPrecision(val, rat));
      var result = ((precisionFactor * val - precisionFactor * step * rat) / precisionFactor).toFixed(precision);
      return this.toNumber(result);
    },
    stepFn: function stepFn(type, e) {
      var _this4 = this;

      var ratio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var recursive = arguments[3];

      this.stop();
      if (e) {
        // e.persist()
        e.preventDefault();
      }
      if (this.disabled) {
        return;
      }
      var max = this.max,
          min = this.min;

      var value = this.getCurrentValidValue(this.inputValue) || 0;
      if (this.isNotCompleteNumber(value)) {
        return;
      }
      var val = this[type + 'Step'](value, ratio);
      var outOfRange = val > max || val < min;
      if (val > max) {
        val = max;
      } else if (val < min) {
        val = min;
      }
      this.setValue(val);
      this.setState({
        focused: true
      });
      if (outOfRange) {
        return;
      }
      this.autoStepTimer = setTimeout(function () {
        _this4[type](e, ratio, true);
      }, recursive ? SPEED : DELAY);
    },
    stop: function stop() {
      if (this.autoStepTimer) {
        clearTimeout(this.autoStepTimer);
      }
    },
    down: function down(e, ratio, recursive) {
      this.pressingUpOrDown = true;
      this.stepFn('down', e, ratio, recursive);
    },
    up: function up(e, ratio, recursive) {
      this.pressingUpOrDown = true;
      this.stepFn('up', e, ratio, recursive);
    },
    handleInputClick: function handleInputClick() {
      this.$emit('click');
    },
    onCompositionstart: function onCompositionstart(e) {
      e.target.composing = true;
    },
    onCompositionend: function onCompositionend(e) {
      this.onChange(e);
      e.target.composing = false;
    }
  },
  render: function render() {
    var _classNames;

    var h = arguments[0];
    var _$props3 = this.$props,
        prefixCls = _$props3.prefixCls,
        disabled = _$props3.disabled,
        readonly = _$props3.readonly,
        useTouch = _$props3.useTouch,
        autoComplete = _$props3.autoComplete,
        upHandler = _$props3.upHandler,
        downHandler = _$props3.downHandler;

    var classes = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls, true), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _defineProperty(_classNames, prefixCls + '-focused', this.focused), _classNames));
    var upDisabledClass = '';
    var downDisabledClass = '';
    var sValue = this.sValue;

    if (sValue || sValue === 0) {
      if (!isNaN(sValue)) {
        var val = Number(sValue);
        if (val >= this.max) {
          upDisabledClass = prefixCls + '-handler-up-disabled';
        }
        if (val <= this.min) {
          downDisabledClass = prefixCls + '-handler-down-disabled';
        }
      } else {
        upDisabledClass = prefixCls + '-handler-up-disabled';
        downDisabledClass = prefixCls + '-handler-down-disabled';
      }
    }

    var editable = !this.readonly && !this.disabled;

    // focus state, show input value
    // unfocus state, show valid value
    var inputDisplayValue = this.getInputDisplayValue();

    var upEvents = void 0;
    var downEvents = void 0;
    if (useTouch) {
      upEvents = {
        touchstart: editable && !upDisabledClass ? this.up : noop,
        touchend: this.stop
      };
      downEvents = {
        touchstart: editable && !downDisabledClass ? this.down : noop,
        touchend: this.stop
      };
    } else {
      upEvents = {
        mousedown: editable && !upDisabledClass ? this.up : noop,
        mouseup: this.stop,
        mouseleave: this.stop
      };
      downEvents = {
        mousedown: editable && !downDisabledClass ? this.down : noop,
        mouseup: this.stop,
        mouseleave: this.stop
      };
    }
    var isUpDisabled = !!upDisabledClass || disabled || readonly;
    var isDownDisabled = !!downDisabledClass || disabled || readonly;

    var _getListeners = getListeners(this),
        _getListeners$mouseen = _getListeners.mouseenter,
        mouseenter = _getListeners$mouseen === undefined ? noop : _getListeners$mouseen,
        _getListeners$mousele = _getListeners.mouseleave,
        mouseleave = _getListeners$mousele === undefined ? noop : _getListeners$mousele,
        _getListeners$mouseov = _getListeners.mouseover,
        mouseover = _getListeners$mouseov === undefined ? noop : _getListeners$mouseov,
        _getListeners$mouseou = _getListeners.mouseout,
        mouseout = _getListeners$mouseou === undefined ? noop : _getListeners$mouseou;

    var contentProps = {
      on: { mouseenter: mouseenter, mouseleave: mouseleave, mouseover: mouseover, mouseout: mouseout },
      'class': classes,
      attrs: { title: this.$props.title }
    };
    var upHandlerProps = {
      props: {
        disabled: isUpDisabled,
        prefixCls: prefixCls
      },
      attrs: {
        unselectable: 'unselectable',
        role: 'button',
        'aria-label': 'Increase Value',
        'aria-disabled': !!isUpDisabled
      },
      'class': prefixCls + '-handler ' + prefixCls + '-handler-up ' + upDisabledClass,
      on: upEvents,
      ref: 'up'
    };
    var downHandlerProps = {
      props: {
        disabled: isDownDisabled,
        prefixCls: prefixCls
      },
      attrs: {
        unselectable: 'unselectable',
        role: 'button',
        'aria-label': 'Decrease Value',
        'aria-disabled': !!isDownDisabled
      },
      'class': prefixCls + '-handler ' + prefixCls + '-handler-down ' + downDisabledClass,
      on: downEvents,
      ref: 'down'
    };
    // ref for test
    return h(
      'div',
      contentProps,
      [h(
        'div',
        { 'class': prefixCls + '-handler-wrap' },
        [h(
          InputHandler,
          upHandlerProps,
          [upHandler || h('span', {
            attrs: {
              unselectable: 'unselectable'
            },
            'class': prefixCls + '-handler-up-inner',
            on: {
              'click': preventDefault
            }
          })]
        ), h(
          InputHandler,
          downHandlerProps,
          [downHandler || h('span', {
            attrs: {
              unselectable: 'unselectable'
            },
            'class': prefixCls + '-handler-down-inner',
            on: {
              'click': preventDefault
            }
          })]
        )]
      ), h(
        'div',
        { 'class': prefixCls + '-input-wrap' },
        [h('input', {
          attrs: {
            role: 'spinbutton',
            'aria-valuemin': this.min,
            'aria-valuemax': this.max,
            'aria-valuenow': sValue,
            required: this.required,
            type: this.type,
            placeholder: this.placeholder,

            tabIndex: this.tabIndex,
            autoComplete: autoComplete,

            readonly: this.readonly,
            disabled: this.disabled,
            max: this.max,
            min: this.min,
            step: this.step,
            name: this.name,
            title: this.title,
            id: this.id,

            pattern: this.pattern
          },
          on: {
            'click': this.handleInputClick,
            'focus': this.onFocus,
            'blur': this.onBlur,
            'keydown': editable ? this.onKeyDown : noop,
            'keyup': editable ? this.onKeyUp : noop,
            'input': this.onTrigger,
            'compositionstart': this.onCompositionstart,
            'compositionend': this.onCompositionend
          },

          'class': prefixCls + '-input',
          ref: 'inputRef',
          domProps: {
            'value': inputDisplayValue
          }
        })]
      )]
    );
  }
};