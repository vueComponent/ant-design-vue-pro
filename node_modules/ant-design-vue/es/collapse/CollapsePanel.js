import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import { getOptionProps, getComponentFromProp, getListeners } from '../_util/props-util';
import VcCollapse, { panelProps } from '../vc-collapse';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export default {
  name: 'ACollapsePanel',
  props: _extends({}, panelProps()),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        _showArrow = this.showArrow,
        showArrow = _showArrow === undefined ? true : _showArrow;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('collapse', customizePrefixCls);

    var collapsePanelClassName = _defineProperty({}, prefixCls + '-no-arrow', !showArrow);
    var rcCollapePanelProps = {
      props: _extends({}, getOptionProps(this), {
        prefixCls: prefixCls,
        extra: getComponentFromProp(this, 'extra')
      }),
      'class': collapsePanelClassName,
      on: getListeners(this)
    };
    var header = getComponentFromProp(this, 'header');
    return h(
      VcCollapse.Panel,
      rcCollapePanelProps,
      [this.$slots['default'], header ? h(
        'template',
        { slot: 'header' },
        [header]
      ) : null]
    );
  }
};