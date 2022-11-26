'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'PanelContent',
  props: {
    prefixCls: _vueTypes2['default'].string,
    isActive: _vueTypes2['default'].bool,
    destroyInactivePanel: _vueTypes2['default'].bool,
    forceRender: _vueTypes2['default'].bool,
    role: _vueTypes2['default'].any
  },
  data: function data() {
    return {
      _isActive: undefined
    };
  },
  render: function render() {
    var _contentCls;

    var h = arguments[0];

    this._isActive = this.forceRender || this._isActive || this.isActive;
    if (!this._isActive) {
      return null;
    }
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        isActive = _$props.isActive,
        destroyInactivePanel = _$props.destroyInactivePanel,
        forceRender = _$props.forceRender,
        role = _$props.role;
    var $slots = this.$slots;

    var contentCls = (_contentCls = {}, (0, _defineProperty3['default'])(_contentCls, prefixCls + '-content', true), (0, _defineProperty3['default'])(_contentCls, prefixCls + '-content-active', isActive), _contentCls);
    var child = !forceRender && !isActive && destroyInactivePanel ? null : h(
      'div',
      { 'class': prefixCls + '-content-box' },
      [$slots['default']]
    );
    return h(
      'div',
      { 'class': contentCls, attrs: { role: role }
      },
      [child]
    );
  }
};