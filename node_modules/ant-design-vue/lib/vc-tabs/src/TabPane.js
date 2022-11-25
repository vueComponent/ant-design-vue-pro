'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../../_util/props-util');

var _Sentinel = require('./Sentinel');

var _Sentinel2 = _interopRequireDefault(_Sentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'TabPane',
  props: {
    active: _vueTypes2['default'].bool,
    destroyInactiveTabPane: _vueTypes2['default'].bool,
    forceRender: _vueTypes2['default'].bool,
    placeholder: _vueTypes2['default'].any,
    rootPrefixCls: _vueTypes2['default'].string,
    tab: _vueTypes2['default'].any,
    closable: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool
  },
  inject: {
    sentinelContext: { 'default': function _default() {
        return {};
      } }
  },
  render: function render() {
    var _cls;

    var h = arguments[0];
    var _$props = this.$props,
        destroyInactiveTabPane = _$props.destroyInactiveTabPane,
        active = _$props.active,
        forceRender = _$props.forceRender,
        rootPrefixCls = _$props.rootPrefixCls;

    var children = this.$slots['default'];
    var placeholder = (0, _propsUtil.getComponentFromProp)(this, 'placeholder');
    this._isActived = this._isActived || active;
    var prefixCls = rootPrefixCls + '-tabpane';
    var cls = (_cls = {}, (0, _defineProperty3['default'])(_cls, prefixCls, 1), (0, _defineProperty3['default'])(_cls, prefixCls + '-inactive', !active), (0, _defineProperty3['default'])(_cls, prefixCls + '-active', active), _cls);
    var isRender = destroyInactiveTabPane ? active : this._isActived;
    var shouldRender = isRender || forceRender;
    var _sentinelContext = this.sentinelContext,
        sentinelStart = _sentinelContext.sentinelStart,
        sentinelEnd = _sentinelContext.sentinelEnd,
        setPanelSentinelStart = _sentinelContext.setPanelSentinelStart,
        setPanelSentinelEnd = _sentinelContext.setPanelSentinelEnd;

    var panelSentinelStart = void 0;
    var panelSentinelEnd = void 0;
    if (active && shouldRender) {
      panelSentinelStart = h(_Sentinel2['default'], {
        attrs: { setRef: setPanelSentinelStart, prevElement: sentinelStart }
      });
      panelSentinelEnd = h(_Sentinel2['default'], {
        attrs: { setRef: setPanelSentinelEnd, nextElement: sentinelEnd }
      });
    }
    return h(
      'div',
      { 'class': cls, attrs: { role: 'tabpanel', 'aria-hidden': active ? 'false' : 'true' }
      },
      [panelSentinelStart, shouldRender ? children : placeholder, panelSentinelEnd]
    );
  }
};