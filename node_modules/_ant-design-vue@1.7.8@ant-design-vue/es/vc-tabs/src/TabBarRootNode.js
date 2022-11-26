import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import { cloneElement } from '../../_util/vnode';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
function noop() {}
export default {
  name: 'TabBarRootNode',
  mixins: [BaseMixin],
  props: {
    saveRef: PropTypes.func.def(noop),
    getRef: PropTypes.func.def(noop),
    prefixCls: PropTypes.string.def(''),
    tabBarPosition: PropTypes.string.def('top'),
    extraContent: PropTypes.any
  },
  methods: {
    onKeyDown: function onKeyDown(e) {
      this.__emit('keydown', e);
    }
  },
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        onKeyDown = this.onKeyDown,
        tabBarPosition = this.tabBarPosition,
        extraContent = this.extraContent;

    var cls = _defineProperty({}, prefixCls + '-bar', true);
    var topOrBottom = tabBarPosition === 'top' || tabBarPosition === 'bottom';
    var tabBarExtraContentStyle = topOrBottom ? { float: 'right' } : {};
    var children = this.$slots['default'];
    var newChildren = children;
    if (extraContent) {
      newChildren = [cloneElement(extraContent, {
        key: 'extra',
        style: _extends({}, tabBarExtraContentStyle)
      }), cloneElement(children, { key: 'content' })];
      newChildren = topOrBottom ? newChildren : newChildren.reverse();
    }

    return h(
      'div',
      _mergeJSXProps([{
        attrs: {
          role: 'tablist',

          tabIndex: '0'
        },
        'class': cls, on: {
          'keydown': onKeyDown
        }
      }, {
        directives: [{
          name: 'ant-ref',
          value: this.saveRef('root')
        }]
      }]),
      [newChildren]
    );
  }
};