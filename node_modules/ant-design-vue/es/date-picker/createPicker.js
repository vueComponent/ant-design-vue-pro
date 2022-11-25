import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import * as moment from 'moment';
import omit from 'lodash/omit';
import MonthCalendar from '../vc-calendar/src/MonthCalendar';
import VcDatePicker from '../vc-calendar/src/Picker';
import classNames from 'classnames';
import Icon from '../icon';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import interopDefault from '../_util/interopDefault';
import BaseMixin from '../_util/BaseMixin';
import { hasProp, getOptionProps, initDefaultProps, mergeProps, getComponentFromProp, isValidElement, getListeners } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { formatDate } from './utils';

// export const PickerProps = {
//   value?: moment.Moment;
//   prefixCls: string;
// }
function noop() {}
export default function createPicker(TheCalendar, props) {
  return {
    props: initDefaultProps(props, {
      allowClear: true,
      showToday: true
    }),
    mixins: [BaseMixin],
    model: {
      prop: 'value',
      event: 'change'
    },
    inject: {
      configProvider: { 'default': function _default() {
          return ConfigConsumerProps;
        } }
    },
    data: function data() {
      var value = this.value || this.defaultValue;
      if (value && !interopDefault(moment).isMoment(value)) {
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
        var props = getOptionProps(this);
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
          if (!hasProp(_this, 'open') && oldVal && !val) {
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
        if (!hasProp(this, 'value')) {
          this.setState({
            sValue: value,
            showDate: value
          });
        }
        this.$emit('change', value, formatDate(value, this.format));
      },
      handleCalendarChange: function handleCalendarChange(value) {
        this.setState({ showDate: value });
      },
      handleOpenChange: function handleOpenChange(open) {
        var props = getOptionProps(this);
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

      var suffixIcon = getComponentFromProp(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      var listeners = getListeners(this);
      var _listeners$panelChang = listeners.panelChange,
          panelChange = _listeners$panelChang === undefined ? noop : _listeners$panelChang,
          _listeners$focus = listeners.focus,
          focus = _listeners$focus === undefined ? noop : _listeners$focus,
          _listeners$blur = listeners.blur,
          blur = _listeners$blur === undefined ? noop : _listeners$blur,
          _listeners$ok = listeners.ok,
          ok = _listeners$ok === undefined ? noop : _listeners$ok;

      var props = getOptionProps(this);

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

      var calendarClassName = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-time', props.showTime), _defineProperty(_classNames, prefixCls + '-month', MonthCalendar === TheCalendar), _classNames));

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
      var theCalendarProps = mergeProps(calendarProps, {
        props: {
          disabledDate: props.disabledDate,
          disabledTime: disabledTime,
          locale: locale.lang,
          timePicker: props.timePicker,
          defaultValue: props.defaultPickerValue || interopDefault(moment)(),
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

      var clearIcon = !props.disabled && props.allowClear && value ? h(Icon, {
        attrs: {
          type: 'close-circle',

          theme: 'filled'
        },
        'class': prefixCls + '-picker-clear',
        on: {
          'click': this.clearSelection
        }
      }) : null;

      var inputIcon = suffixIcon && (isValidElement(suffixIcon) ? cloneElement(suffixIcon, {
        'class': prefixCls + '-picker-icon'
      }) : h(
        'span',
        { 'class': prefixCls + '-picker-icon' },
        [suffixIcon]
      )) || h(Icon, {
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
            'value': formatDate(inputValue, _this2.format)
          },
          'class': props.pickerInputClass }), clearIcon, inputIcon]);
      };
      var vcDatePickerProps = {
        props: _extends({}, props, pickerProps.props, {
          calendar: calendar,
          value: value,
          prefixCls: prefixCls + '-picker-container'
        }),
        on: _extends({}, omit(listeners, 'change'), pickerProps.on, {
          open: open,
          onOpenChange: this.handleOpenChange
        }),
        style: props.popupStyle,
        scopedSlots: _extends({ 'default': input }, $scopedSlots)
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
        [h(VcDatePicker, vcDatePickerProps)]
      );
    }
  };
}