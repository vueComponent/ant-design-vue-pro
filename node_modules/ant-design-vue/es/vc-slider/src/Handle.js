import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import classNames from 'classnames';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, getListeners } from '../../_util/props-util';
import addEventListener from '../../vc-util/Dom/addEventListener';

export default {
  name: 'Handle',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    vertical: PropTypes.bool,
    offset: PropTypes.number,
    disabled: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    tabIndex: PropTypes.number,
    className: PropTypes.string,
    reverse: PropTypes.bool
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
    this.onMouseUpListener = addEventListener(document, 'mouseup', this.handleMouseUp);
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

    var _getOptionProps = getOptionProps(this),
        prefixCls = _getOptionProps.prefixCls,
        vertical = _getOptionProps.vertical,
        reverse = _getOptionProps.reverse,
        offset = _getOptionProps.offset,
        disabled = _getOptionProps.disabled,
        min = _getOptionProps.min,
        max = _getOptionProps.max,
        value = _getOptionProps.value,
        tabIndex = _getOptionProps.tabIndex;

    var className = classNames(this.$props.className, _defineProperty({}, prefixCls + '-handle-click-focused', this.clickFocused));

    var positionStyle = vertical ? (_ref = {}, _defineProperty(_ref, reverse ? 'top' : 'bottom', offset + '%'), _defineProperty(_ref, reverse ? 'bottom' : 'top', 'auto'), _defineProperty(_ref, 'transform', 'translateY(+50%)'), _ref) : (_ref2 = {}, _defineProperty(_ref2, reverse ? 'right' : 'left', offset + '%'), _defineProperty(_ref2, reverse ? 'left' : 'right', 'auto'), _defineProperty(_ref2, 'transform', 'translateX(' + (reverse ? '+' : '-') + '50%)'), _ref2);

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
      attrs: _extends({
        role: 'slider',
        tabIndex: _tabIndex
      }, ariaProps),
      'class': className,
      on: _extends({}, getListeners(this), {
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