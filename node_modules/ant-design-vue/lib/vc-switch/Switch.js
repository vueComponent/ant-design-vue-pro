'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _PropTypes = require('./PropTypes');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// function noop () {
// }
exports['default'] = {
  name: 'VcSwitch',
  mixins: [_BaseMixin2['default']],
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: (0, _extends3['default'])({}, _PropTypes.switchPropTypes, {
    prefixCls: _PropTypes.switchPropTypes.prefixCls.def('rc-switch')
    // onChange: switchPropTypes.onChange.def(noop),
    // onClick: switchPropTypes.onClick.def(noop),
  }),
  data: function data() {
    var checked = false;
    if ((0, _propsUtil.hasProp)(this, 'checked')) {
      checked = !!this.checked;
    } else {
      checked = !!this.defaultChecked;
    }
    return {
      stateChecked: checked
    };
  },

  watch: {
    checked: function checked(val) {
      this.stateChecked = val;
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      var autoFocus = _this.autoFocus,
          disabled = _this.disabled;

      if (autoFocus && !disabled) {
        _this.focus();
      }
    });
  },

  methods: {
    setChecked: function setChecked(checked, e) {
      if (this.disabled) {
        return;
      }
      if (!(0, _propsUtil.hasProp)(this, 'checked')) {
        this.stateChecked = checked;
      }
      this.$emit('change', checked, e);
    },
    handleClick: function handleClick(e) {
      var checked = !this.stateChecked;
      this.setChecked(checked, e);
      this.$emit('click', checked, e);
    },
    handleKeyDown: function handleKeyDown(e) {
      if (e.keyCode === 37) {
        // Left
        this.setChecked(false, e);
      } else if (e.keyCode === 39) {
        // Right
        this.setChecked(true, e);
      }
    },
    handleMouseUp: function handleMouseUp(e) {
      if (this.$refs.refSwitchNode) {
        this.$refs.refSwitchNode.blur();
      }
      this.$emit('mouseup', e);
    },
    focus: function focus() {
      this.$refs.refSwitchNode.focus();
    },
    blur: function blur() {
      this.$refs.refSwitchNode.blur();
    }
  },
  render: function render() {
    var _switchClassName;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        prefixCls = _getOptionProps.prefixCls,
        disabled = _getOptionProps.disabled,
        loadingIcon = _getOptionProps.loadingIcon,
        tabIndex = _getOptionProps.tabIndex,
        restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls', 'disabled', 'loadingIcon', 'tabIndex']);

    var checked = this.stateChecked;
    var switchClassName = (_switchClassName = {}, (0, _defineProperty3['default'])(_switchClassName, prefixCls, true), (0, _defineProperty3['default'])(_switchClassName, prefixCls + '-checked', checked), (0, _defineProperty3['default'])(_switchClassName, prefixCls + '-disabled', disabled), _switchClassName);
    var spanProps = {
      props: (0, _extends3['default'])({}, restProps),
      on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), {
        keydown: this.handleKeyDown,
        click: this.handleClick,
        mouseup: this.handleMouseUp
      }),
      attrs: {
        type: 'button',
        role: 'switch',
        'aria-checked': checked,
        disabled: disabled,
        tabIndex: tabIndex
      },
      'class': switchClassName,
      ref: 'refSwitchNode'
    };
    return h(
      'button',
      spanProps,
      [loadingIcon, h(
        'span',
        { 'class': prefixCls + '-inner' },
        [checked ? (0, _propsUtil.getComponentFromProp)(this, 'checkedChildren') : (0, _propsUtil.getComponentFromProp)(this, 'unCheckedChildren')]
      )]
    );
  }
};