import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../../_util/vue-types';
import { getComponentFromProp } from '../../_util/props-util';
import Sentinel from './Sentinel';

export default {
  name: 'TabPane',
  props: {
    active: PropTypes.bool,
    destroyInactiveTabPane: PropTypes.bool,
    forceRender: PropTypes.bool,
    placeholder: PropTypes.any,
    rootPrefixCls: PropTypes.string,
    tab: PropTypes.any,
    closable: PropTypes.bool,
    disabled: PropTypes.bool
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
    var placeholder = getComponentFromProp(this, 'placeholder');
    this._isActived = this._isActived || active;
    var prefixCls = rootPrefixCls + '-tabpane';
    var cls = (_cls = {}, _defineProperty(_cls, prefixCls, 1), _defineProperty(_cls, prefixCls + '-inactive', !active), _defineProperty(_cls, prefixCls + '-active', active), _cls);
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
      panelSentinelStart = h(Sentinel, {
        attrs: { setRef: setPanelSentinelStart, prevElement: sentinelStart }
      });
      panelSentinelEnd = h(Sentinel, {
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