import _extends from 'babel-runtime/helpers/extends';
import { initDefaultProps } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import warning from '../../_util/warning';
import BaseMixin from '../../_util/BaseMixin';
import { ITouchProps } from './PropTypes';

export default {
  name: 'TouchFeedback',
  mixins: [BaseMixin],
  props: initDefaultProps(ITouchProps, {
    disabled: false
  }),
  data: function data() {
    return {
      active: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.disabled && _this.active) {
        _this.setState({
          active: false
        });
      }
    });
  },

  methods: {
    triggerEvent: function triggerEvent(type, isActive, ev) {
      // 暂时仅有input-number用到，事件直接到挂载到Touchable上，不需要像antd那样从子组件触发
      this.$emit(type, ev);
      if (isActive !== this.active) {
        this.setState({
          active: isActive
        });
      }
    },
    onTouchStart: function onTouchStart(e) {
      this.triggerEvent('touchstart', true, e);
    },
    onTouchMove: function onTouchMove(e) {
      this.triggerEvent('touchmove', false, e);
    },
    onTouchEnd: function onTouchEnd(e) {
      this.triggerEvent('touchend', false, e);
    },
    onTouchCancel: function onTouchCancel(e) {
      this.triggerEvent('touchcancel', false, e);
    },
    onMouseDown: function onMouseDown(e) {
      // pc simulate mobile
      this.triggerEvent('mousedown', true, e);
    },
    onMouseUp: function onMouseUp(e) {
      this.triggerEvent('mouseup', false, e);
    },
    onMouseLeave: function onMouseLeave(e) {
      this.triggerEvent('mouseleave', false, e);
    }
  },
  render: function render() {
    var _$props = this.$props,
        disabled = _$props.disabled,
        _$props$activeClassNa = _$props.activeClassName,
        activeClassName = _$props$activeClassNa === undefined ? '' : _$props$activeClassNa,
        _$props$activeStyle = _$props.activeStyle,
        activeStyle = _$props$activeStyle === undefined ? {} : _$props$activeStyle;


    var child = this.$slots['default'];
    if (child.length !== 1) {
      warning(false, 'm-feedback组件只能包含一个子元素');
      return null;
    }
    var childProps = {
      on: disabled ? {} : {
        touchstart: this.onTouchStart,
        touchmove: this.onTouchMove,
        touchend: this.onTouchEnd,
        touchcancel: this.onTouchCancel,
        mousedown: this.onMouseDown,
        mouseup: this.onMouseUp,
        mouseleave: this.onMouseLeave
      }
    };

    if (!disabled && this.active) {
      childProps = _extends({}, childProps, {
        style: activeStyle,
        'class': activeClassName
      });
    }

    return cloneElement(child, childProps);
  }
};