'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

var _vcTrigger = require('../vc-trigger');

var _vcTrigger2 = _interopRequireDefault(_vcTrigger);

var _Panel = require('./Panel');

var _Panel2 = _interopRequireDefault(_Panel);

var _placements = require('./placements');

var _placements2 = _interopRequireDefault(_placements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

exports['default'] = {
  name: 'VcTimePicker',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)({
    prefixCls: _vueTypes2['default'].string,
    clearText: _vueTypes2['default'].string,
    value: _vueTypes2['default'].any,
    defaultOpenValue: {
      type: Object,
      'default': function _default() {
        return (0, _moment2['default'])();
      }
    },
    inputReadOnly: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool,
    allowEmpty: _vueTypes2['default'].bool,
    defaultValue: _vueTypes2['default'].any,
    open: _vueTypes2['default'].bool,
    defaultOpen: _vueTypes2['default'].bool,
    align: _vueTypes2['default'].object,
    placement: _vueTypes2['default'].any,
    transitionName: _vueTypes2['default'].string,
    getPopupContainer: _vueTypes2['default'].func,
    placeholder: _vueTypes2['default'].string,
    format: _vueTypes2['default'].string,
    showHour: _vueTypes2['default'].bool,
    showMinute: _vueTypes2['default'].bool,
    showSecond: _vueTypes2['default'].bool,
    popupClassName: _vueTypes2['default'].string,
    popupStyle: _vueTypes2['default'].object,
    disabledHours: _vueTypes2['default'].func,
    disabledMinutes: _vueTypes2['default'].func,
    disabledSeconds: _vueTypes2['default'].func,
    hideDisabledOptions: _vueTypes2['default'].bool,
    // onChange: PropTypes.func,
    // onAmPmChange: PropTypes.func,
    // onOpen: PropTypes.func,
    // onClose: PropTypes.func,
    // onFocus: PropTypes.func,
    // onBlur: PropTypes.func,
    name: _vueTypes2['default'].string,
    autoComplete: _vueTypes2['default'].string,
    use12Hours: _vueTypes2['default'].bool,
    hourStep: _vueTypes2['default'].number,
    minuteStep: _vueTypes2['default'].number,
    secondStep: _vueTypes2['default'].number,
    focusOnOpen: _vueTypes2['default'].bool,
    // onKeyDown: PropTypes.func,
    autoFocus: _vueTypes2['default'].bool,
    id: _vueTypes2['default'].string,
    inputIcon: _vueTypes2['default'].any,
    clearIcon: _vueTypes2['default'].any,
    addon: _vueTypes2['default'].func
  }, {
    clearText: 'clear',
    prefixCls: 'rc-time-picker',
    defaultOpen: false,
    inputReadOnly: false,
    popupClassName: '',
    popupStyle: {},
    align: {},
    allowEmpty: true,
    showHour: true,
    showMinute: true,
    showSecond: true,
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop,
    hideDisabledOptions: false,
    placement: 'bottomLeft',
    use12Hours: false,
    focusOnOpen: false
  }),
  data: function data() {
    var defaultOpen = this.defaultOpen,
        defaultValue = this.defaultValue,
        _open = this.open,
        open = _open === undefined ? defaultOpen : _open,
        _value = this.value,
        value = _value === undefined ? defaultValue : _value;

    return {
      sOpen: open,
      sValue: value
    };
  },


  watch: {
    value: function value(val) {
      this.setState({
        sValue: val
      });
    },
    open: function open(val) {
      if (val !== undefined) {
        this.setState({
          sOpen: val
        });
      }
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.autoFocus) {
        _this.focus();
      }
    });
  },

  methods: {
    onPanelChange: function onPanelChange(value) {
      this.setValue(value);
    },
    onAmPmChange: function onAmPmChange(ampm) {
      this.__emit('amPmChange', ampm);
    },
    onClear: function onClear(event) {
      event.stopPropagation();
      this.setValue(null);
      this.setOpen(false);
    },
    onVisibleChange: function onVisibleChange(open) {
      this.setOpen(open);
    },
    onEsc: function onEsc() {
      this.setOpen(false);
      this.focus();
    },
    onKeyDown: function onKeyDown(e) {
      if (e.keyCode === 40) {
        this.setOpen(true);
      }
    },
    onKeyDown2: function onKeyDown2(e) {
      this.__emit('keydown', e);
    },
    setValue: function setValue(value) {
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.setState({
          sValue: value
        });
      }
      this.__emit('change', value);
    },
    getFormat: function getFormat() {
      var format = this.format,
          showHour = this.showHour,
          showMinute = this.showMinute,
          showSecond = this.showSecond,
          use12Hours = this.use12Hours;

      if (format) {
        return format;
      }

      if (use12Hours) {
        var fmtString = [showHour ? 'h' : '', showMinute ? 'mm' : '', showSecond ? 'ss' : ''].filter(function (item) {
          return !!item;
        }).join(':');

        return fmtString.concat(' a');
      }

      return [showHour ? 'HH' : '', showMinute ? 'mm' : '', showSecond ? 'ss' : ''].filter(function (item) {
        return !!item;
      }).join(':');
    },
    getPanelElement: function getPanelElement() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          placeholder = this.placeholder,
          disabledHours = this.disabledHours,
          addon = this.addon,
          disabledMinutes = this.disabledMinutes,
          disabledSeconds = this.disabledSeconds,
          hideDisabledOptions = this.hideDisabledOptions,
          inputReadOnly = this.inputReadOnly,
          showHour = this.showHour,
          showMinute = this.showMinute,
          showSecond = this.showSecond,
          defaultOpenValue = this.defaultOpenValue,
          clearText = this.clearText,
          use12Hours = this.use12Hours,
          focusOnOpen = this.focusOnOpen,
          onKeyDown2 = this.onKeyDown2,
          hourStep = this.hourStep,
          minuteStep = this.minuteStep,
          secondStep = this.secondStep,
          sValue = this.sValue;

      var clearIcon = (0, _propsUtil.getComponentFromProp)(this, 'clearIcon');
      return h(_Panel2['default'], {
        attrs: {
          clearText: clearText,
          prefixCls: prefixCls + '-panel',

          value: sValue,
          inputReadOnly: inputReadOnly,

          defaultOpenValue: defaultOpenValue,
          showHour: showHour,
          showMinute: showMinute,
          showSecond: showSecond,

          format: this.getFormat(),
          placeholder: placeholder,
          disabledHours: disabledHours,
          disabledMinutes: disabledMinutes,
          disabledSeconds: disabledSeconds,
          hideDisabledOptions: hideDisabledOptions,
          use12Hours: use12Hours,
          hourStep: hourStep,
          minuteStep: minuteStep,
          secondStep: secondStep,
          focusOnOpen: focusOnOpen,

          clearIcon: clearIcon,
          addon: addon
        },
        ref: 'panel', on: {
          'change': this.onPanelChange,
          'amPmChange': this.onAmPmChange,
          'esc': this.onEsc,
          'keydown': onKeyDown2
        }
      });
    },
    getPopupClassName: function getPopupClassName() {
      var showHour = this.showHour,
          showMinute = this.showMinute,
          showSecond = this.showSecond,
          use12Hours = this.use12Hours,
          prefixCls = this.prefixCls,
          popupClassName = this.popupClassName;


      var selectColumnCount = 0;
      if (showHour) {
        selectColumnCount += 1;
      }
      if (showMinute) {
        selectColumnCount += 1;
      }
      if (showSecond) {
        selectColumnCount += 1;
      }
      if (use12Hours) {
        selectColumnCount += 1;
      }
      // Keep it for old compatibility
      return (0, _classnames2['default'])(popupClassName, (0, _defineProperty3['default'])({}, prefixCls + '-panel-narrow', (!showHour || !showMinute || !showSecond) && !use12Hours), prefixCls + '-panel-column-' + selectColumnCount);
    },
    setOpen: function setOpen(open) {
      if (this.sOpen !== open) {
        if (!(0, _propsUtil.hasProp)(this, 'open')) {
          this.setState({ sOpen: open });
        }
        if (open) {
          this.__emit('open', { open: open });
        } else {
          this.__emit('close', { open: open });
        }
      }
    },
    focus: function focus() {
      this.$refs.picker.focus();
    },
    blur: function blur() {
      this.$refs.picker.blur();
    },
    onFocus: function onFocus(e) {
      this.__emit('focus', e);
    },
    onBlur: function onBlur(e) {
      this.__emit('blur', e);
    },
    renderClearButton: function renderClearButton() {
      var _this2 = this;

      var h = this.$createElement;
      var sValue = this.sValue;
      var _$props = this.$props,
          prefixCls = _$props.prefixCls,
          allowEmpty = _$props.allowEmpty,
          clearText = _$props.clearText,
          disabled = _$props.disabled;

      if (!allowEmpty || !sValue || disabled) {
        return null;
      }
      var clearIcon = (0, _propsUtil.getComponentFromProp)(this, 'clearIcon');
      if ((0, _propsUtil.isValidElement)(clearIcon)) {
        var _ref = (0, _propsUtil.getEvents)(clearIcon) || {},
            _click = _ref.click;

        return (0, _vnode.cloneElement)(clearIcon, {
          on: {
            click: function click() {
              if (_click) _click.apply(undefined, arguments);
              _this2.onClear.apply(_this2, arguments);
            }
          }
        });
      }

      return h(
        'a',
        {
          attrs: {
            role: 'button',

            title: clearText,

            tabIndex: 0
          },
          'class': prefixCls + '-clear', on: {
            'click': this.onClear
          }
        },
        [clearIcon || h('i', { 'class': prefixCls + '-clear-icon' })]
      );
    }
  },

  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        placeholder = this.placeholder,
        placement = this.placement,
        align = this.align,
        id = this.id,
        disabled = this.disabled,
        transitionName = this.transitionName,
        getPopupContainer = this.getPopupContainer,
        name = this.name,
        autoComplete = this.autoComplete,
        autoFocus = this.autoFocus,
        sOpen = this.sOpen,
        sValue = this.sValue,
        onFocus = this.onFocus,
        onBlur = this.onBlur,
        popupStyle = this.popupStyle;

    var popupClassName = this.getPopupClassName();
    var inputIcon = (0, _propsUtil.getComponentFromProp)(this, 'inputIcon');
    return h(
      _vcTrigger2['default'],
      {
        attrs: {
          prefixCls: prefixCls + '-panel',
          popupClassName: popupClassName,
          popupStyle: popupStyle,
          popupAlign: align,
          builtinPlacements: _placements2['default'],
          popupPlacement: placement,
          action: disabled ? [] : ['click'],
          destroyPopupOnHide: true,
          getPopupContainer: getPopupContainer,
          popupTransitionName: transitionName,
          popupVisible: sOpen
        },
        on: {
          'popupVisibleChange': this.onVisibleChange
        }
      },
      [h(
        'template',
        { slot: 'popup' },
        [this.getPanelElement()]
      ), h(
        'span',
        { 'class': '' + prefixCls },
        [h('input', {
          'class': prefixCls + '-input',
          ref: 'picker',
          attrs: { type: 'text',
            placeholder: placeholder,
            name: name,

            disabled: disabled,

            autoComplete: autoComplete,

            autoFocus: autoFocus,
            readOnly: true,
            id: id
          },
          on: {
            'keydown': this.onKeyDown,
            'focus': onFocus,
            'blur': onBlur
          },
          domProps: {
            'value': sValue && sValue.format(this.getFormat()) || ''
          }
        }), inputIcon || h('span', { 'class': prefixCls + '-icon' }), this.renderClearButton()]
      )]
    );
  }
};