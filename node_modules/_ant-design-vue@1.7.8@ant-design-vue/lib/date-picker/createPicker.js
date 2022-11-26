'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports['default'] = createPicker;

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _MonthCalendar = require('../vc-calendar/src/MonthCalendar');

var _MonthCalendar2 = _interopRequireDefault(_MonthCalendar);

var _Picker = require('../vc-calendar/src/Picker');

var _Picker2 = _interopRequireDefault(_Picker);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _interopDefault = require('../_util/interopDefault');

var _interopDefault2 = _interopRequireDefault(_interopDefault);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export const PickerProps = {
//   value?: moment.Moment;
//   prefixCls: string;
// }
function noop() {}
function createPicker(TheCalendar, props) {
  return {
    props: (0, _propsUtil.initDefaultProps)(props, {
      allowClear: true,
      showToday: true
    }),
    mixins: [_BaseMixin2['default']],
    model: {
      prop: 'value',
      event: 'change'
    },
    inject: {
      configProvider: { 'default': function _default() {
          return _configConsumerProps.ConfigConsumerProps;
        } }
    },
    data: function data() {
      var value = this.value || this.defaultValue;
      if (value && !(0, _interopDefault2['default'])(moment).isMoment(value)) {
        throw new Error('The value/defaultValue of DatePicker or MonthPicker must be ' + 'a moment object');
      }
      return {
        sValue: value,
        showDate: value,
        _open: !!this.open
      };
    },

    watch: {
      open: function open(val) {
        var props = (0, _propsUtil.getOptionProps)(this);
        var state = {};
        state._open = val;
        if ('value' in props && !val && props.value !== this.showDate) {
          state.showDate = props.value;
        }
        this.setState(state);
      },
      value: function value(val) {
        var state = {};
        state.sValue = val;
        if (val !== this.sValue) {
          state.showDate = val;
        }
        this.setState(state);
      },
      _open: function _open(val, oldVal) {
        var _this = this;

        this.$nextTick(function () {
          if (!(0, _propsUtil.hasProp)(_this, 'open') && oldVal && !val) {
            _this.focus();
          }
        });
      }
    },
    methods: {
      clearSelection: function clearSelection(e) {
        e.preventDefault();
        e.stopPropagation();
        this.handleChange(null);
      },
      handleChange: function handleChange(value) {
        if (!(0, _propsUtil.hasProp)(this, 'value')) {
          this.setState({
            sValue: value,
            showDate: value
          });
        }
        this.$emit('change', value, (0, _utils.formatDate)(value, this.format));
      },
      handleCalendarChange: function handleCalendarChange(value) {
        this.setState({ showDate: value });
      },
      handleOpenChange: function handleOpenChange(open) {
        var props = (0, _propsUtil.getOptionProps)(this);
        if (!('open' in props)) {
          this.setState({ _open: open });
        }
        this.$emit('openChange', open);
      },
      focus: function focus() {
        this.$refs.input.focus();
      },
      blur: function blur() {
        this.$refs.input.blur();
      },
      renderFooter: function renderFooter() {
        var h = this.$createElement;
        var $scopedSlots = this.$scopedSlots,
            $slots = this.$slots,
            prefixCls = this._prefixCls;

        var renderExtraFooter = this.renderExtraFooter || $scopedSlots.renderExtraFooter || $slots.renderExtraFooter;
        return renderExtraFooter ? h(
          'div',
          { 'class': prefixCls + '-footer-extra' },
          [typeof renderExtraFooter === 'function' ? renderExtraFooter.apply(undefined, arguments) : renderExtraFooter]
        ) : null;
      },
      onMouseEnter: function onMouseEnter(e) {
        this.$emit('mouseenter', e);
      },
      onMouseLeave: function onMouseLeave(e) {
        this.$emit('mouseleave', e);
      }
    },

    render: function render() {
      var _classNames,
          _this2 = this;

      var h = arguments[0];
      var $scopedSlots = this.$scopedSlots;
      var _$data = this.$data,
          value = _$data.sValue,
          showDate = _$data.showDate,
          open = _$data._open;

      var suffixIcon = (0, _propsUtil.getComponentFromProp)(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      var listeners = (0, _propsUtil.getListeners)(this);
      var _listeners$panelChang = listeners.panelChange,
          panelChange = _listeners$panelChang === undefined ? noop : _listeners$panelChang,
          _listeners$focus = listeners.focus,
          focus = _listeners$focus === undefined ? noop : _listeners$focus,
          _listeners$blur = listeners.blur,
          blur = _listeners$blur === undefined ? noop : _listeners$blur,
          _listeners$ok = listeners.ok,
          ok = _listeners$ok === undefined ? noop : _listeners$ok;

      var props = (0, _propsUtil.getOptionProps)(this);

      var customizePrefixCls = props.prefixCls,
          locale = props.locale,
          localeCode = props.localeCode,
          inputReadOnly = props.inputReadOnly;

      var getPrefixCls = this.configProvider.getPrefixCls;
      var prefixCls = getPrefixCls('calendar', customizePrefixCls);
      this._prefixCls = prefixCls;

      var dateRender = props.dateRender || $scopedSlots.dateRender;
      var monthCellContentRender = props.monthCellContentRender || $scopedSlots.monthCellContentRender;
      var placeholder = 'placeholder' in props ? props.placeholder : locale.lang.placeholder;

      var disabledTime = props.showTime ? props.disabledTime : null;

      var calendarClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-time', props.showTime), (0, _defineProperty3['default'])(_classNames, prefixCls + '-month', _MonthCalendar2['default'] === TheCalendar), _classNames));

      if (value && localeCode) {
        value.locale(localeCode);
      }

      var pickerProps = { props: {}, on: {} };
      var calendarProps = { props: {}, on: {} };
      var pickerStyle = {};
      if (props.showTime) {
        // fix https://github.com/ant-design/ant-design/issues/1902
        calendarProps.on.select = this.handleChange;
        pickerStyle.minWidth = '195px';
      } else {
        pickerProps.on.change = this.handleChange;
      }
      if ('mode' in props) {
        calendarProps.props.mode = props.mode;
      }
      var theCalendarProps = (0, _propsUtil.mergeProps)(calendarProps, {
        props: {
          disabledDate: props.disabledDate,
          disabledTime: disabledTime,
          locale: locale.lang,
          timePicker: props.timePicker,
          defaultValue: props.defaultPickerValue || (0, _interopDefault2['default'])(moment)(),
          dateInputPlaceholder: placeholder,
          prefixCls: prefixCls,
          dateRender: dateRender,
          format: props.format,
          showToday: props.showToday,
          monthCellContentRender: monthCellContentRender,
          renderFooter: this.renderFooter,
          value: showDate,
          inputReadOnly: inputReadOnly
        },
        on: {
          ok: ok,
          panelChange: panelChange,
          change: this.handleCalendarChange
        },
        'class': calendarClassName,
        scopedSlots: $scopedSlots
      });
      var calendar = h(TheCalendar, theCalendarProps);

      var clearIcon = !props.disabled && props.allowClear && value ? h(_icon2['default'], {
        attrs: {
          type: 'close-circle',

          theme: 'filled'
        },
        'class': prefixCls + '-picker-clear',
        on: {
          'click': this.clearSelection
        }
      }) : null;

      var inputIcon = suffixIcon && ((0, _propsUtil.isValidElement)(suffixIcon) ? (0, _vnode.cloneElement)(suffixIcon, {
        'class': prefixCls + '-picker-icon'
      }) : h(
        'span',
        { 'class': prefixCls + '-picker-icon' },
        [suffixIcon]
      )) || h(_icon2['default'], {
        attrs: { type: 'calendar' },
        'class': prefixCls + '-picker-icon' });

      var input = function input(_ref) {
        var inputValue = _ref.value;
        return h('div', [h('input', {
          ref: 'input',
          attrs: { disabled: props.disabled,

            readOnly: true,

            placeholder: placeholder,

            tabIndex: props.tabIndex,
            name: _this2.name
          },
          on: {
            'focus': focus,
            'blur': blur
          },
          domProps: {
            'value': (0, _utils.formatDate)(inputValue, _this2.format)
          },
          'class': props.pickerInputClass }), clearIcon, inputIcon]);
      };
      var vcDatePickerProps = {
        props: (0, _extends3['default'])({}, props, pickerProps.props, {
          calendar: calendar,
          value: value,
          prefixCls: prefixCls + '-picker-container'
        }),
        on: (0, _extends3['default'])({}, (0, _omit2['default'])(listeners, 'change'), pickerProps.on, {
          open: open,
          onOpenChange: this.handleOpenChange
        }),
        style: props.popupStyle,
        scopedSlots: (0, _extends3['default'])({ 'default': input }, $scopedSlots)
      };
      return h(
        'span',
        {
          'class': props.pickerClass,
          style: pickerStyle
          // tabIndex={props.disabled ? -1 : 0}
          // onFocus={focus}
          // onBlur={blur}
          , on: {
            'mouseenter': this.onMouseEnter,
            'mouseleave': this.onMouseLeave
          }
        },
        [h(_Picker2['default'], vcDatePickerProps)]
      );
    }
  };
}