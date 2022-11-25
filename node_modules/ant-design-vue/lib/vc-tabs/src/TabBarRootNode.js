'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vnode = require('../../_util/vnode');

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
exports['default'] = {
  name: 'TabBarRootNode',
  mixins: [_BaseMixin2['default']],
  props: {
    saveRef: _vueTypes2['default'].func.def(noop),
    getRef: _vueTypes2['default'].func.def(noop),
    prefixCls: _vueTypes2['default'].string.def(''),
    tabBarPosition: _vueTypes2['default'].string.def('top'),
    extraContent: _vueTypes2['default'].any
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

    var cls = (0, _defineProperty3['default'])({}, prefixCls + '-bar', true);
    var topOrBottom = tabBarPosition === 'top' || tabBarPosition === 'bottom';
    var tabBarExtraContentStyle = topOrBottom ? { float: 'right' } : {};
    var children = this.$slots['default'];
    var newChildren = children;
    if (extraContent) {
      newChildren = [(0, _vnode.cloneElement)(extraContent, {
        key: 'extra',
        style: (0, _extends3['default'])({}, tabBarExtraContentStyle)
      }), (0, _vnode.cloneElement)(children, { key: 'content' })];
      newChildren = topOrBottom ? newChildren : newChildren.reverse();
    }

    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([{
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