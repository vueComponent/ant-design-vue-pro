'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../_util/props-util');

var _addEventListener = require('../../vc-util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'Handle',
  mixins: [_BaseMixin2['default']],
  props: {
    prefixCls: _vueTypes2['default'].string,
    vertical: _vueTypes2['default'].bool,
    offset: _vueTypes2['default'].number,
    disabled: _vueTypes2['default'].bool,
    min: _vueTypes2['default'].number,
    max: _vueTypes2['default'].number,
    value: _vueTypes2['default'].number,
    tabIndex: _vueTypes2['default'].number,
    className: _vueTypes2['default'].string,
    reverse: _vueTypes2['default'].bool
    // handleFocus: PropTypes.func.def(noop),
    // handleBlur: PropTypes.func.def(noop),
  },
  data: function data() {
    return {
      clickFocused: false
    };
  },
  mounted: function mounted() {
    // mouseup won't trigger if mouse moved out of handle
    // so we listen on document here.
    this.onMouseUpListener = (0, _addEventListener2['default'])(document, 'mouseup', this.handleMouseUp);
  },
  beforeDestroy: function beforeDestroy() {
    if (this.onMouseUpListener) {
      this.onMouseUpListener.remove();
    }
  },

  methods: {
    setClickFocus: function setClickFocus(focused) {
      this.setState({ clickFocused: focused });
    },
    handleMouseUp: function handleMouseUp() {
      if (document.activeElement === this.$refs.handle) {
        this.setClickFocus(true);
      }
    },
    handleBlur: function handleBlur(e) {
      this.setClickFocus(false);
      this.__emit('blur', e);
    },
    handleKeyDown: function handleKeyDown() {
      this.setClickFocus(false);
    },
    clickFocus: function clickFocus() {
      this.setClickFocus(true);
      this.focus();
    },
    focus: function focus() {
      this.$refs.handle.focus();
    },
    blur: function blur() {
      this.$refs.handle.blur();
    },

    // when click can not focus in vue, use mousedown trigger focus
    handleMousedown: function handleMousedown(e) {
      this.focus();
      this.__emit('mousedown', e);
    }
  },
  render: function render() {
    var _ref, _ref2;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        prefixCls = _getOptionProps.prefixCls,
        vertical = _getOptionProps.vertical,
        reverse = _getOptionProps.reverse,
        offset = _getOptionProps.offset,
        disabled = _getOptionProps.disabled,
        min = _getOptionProps.min,
        max = _getOptionProps.max,
        value = _getOptionProps.value,
        tabIndex = _getOptionProps.tabIndex;

    var className = (0, _classnames2['default'])(this.$props.className, (0, _defineProperty3['default'])({}, prefixCls + '-handle-click-focused', this.clickFocused));

    var positionStyle = vertical ? (_ref = {}, (0, _defineProperty3['default'])(_ref, reverse ? 'top' : 'bottom', offset + '%'), (0, _defineProperty3['default'])(_ref, reverse ? 'bottom' : 'top', 'auto'), (0, _defineProperty3['default'])(_ref, 'transform', 'translateY(+50%)'), _ref) : (_ref2 = {}, (0, _defineProperty3['default'])(_ref2, reverse ? 'right' : 'left', offset + '%'), (0, _defineProperty3['default'])(_ref2, reverse ? 'left' : 'right', 'auto'), (0, _defineProperty3['default'])(_ref2, 'transform', 'translateX(' + (reverse ? '+' : '-') + '50%)'), _ref2);

    var ariaProps = {
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': value,
      'aria-disabled': !!disabled
    };
    var _tabIndex = tabIndex || 0;
    if (disabled || tabIndex === null) {
      _tabIndex = null;
    }

    var handleProps = {
      attrs: (0, _extends3['default'])({
        role: 'slider',
        tabIndex: _tabIndex
      }, ariaProps),
      'class': className,
      on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), {
        blur: this.handleBlur,
        keydown: this.handleKeyDown,
        mousedown: this.handleMousedown
      }),
      ref: 'handle',
      style: positionStyle
    };
    return h('div', handleProps);
  }
};