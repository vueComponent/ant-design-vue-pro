import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import InkTabBarNode from './InkTabBarNode';
import TabBarTabsNode from './TabBarTabsNode';
import TabBarRootNode from './TabBarRootNode';
import ScrollableTabBarNode from './ScrollableTabBarNode';
import SaveRef from './SaveRef';
import { getListeners } from '../../_util/props-util';

export default {
  name: 'ScrollableInkTabBar',
  inheritAttrs: false,
  props: ['extraContent', 'inkBarAnimated', 'tabBarGutter', 'prefixCls', 'navWrapper', 'tabBarPosition', 'panels', 'activeKey', 'prevIcon', 'nextIcon'],
  render: function render() {
    var h = arguments[0];

    var props = _extends({}, this.$props);
    var listeners = getListeners(this);
    var renderTabBarNode = this.$scopedSlots['default'];

    return h(SaveRef, {
      attrs: {
        children: function children(saveRef, getRef) {
          return h(
            TabBarRootNode,
            _mergeJSXProps([{
              attrs: { saveRef: saveRef }
            }, { props: props, on: listeners }]),
            [h(
              ScrollableTabBarNode,
              _mergeJSXProps([{
                attrs: { saveRef: saveRef, getRef: getRef }
              }, { props: props, on: listeners }]),
              [h(TabBarTabsNode, _mergeJSXProps([{
                attrs: {
                  saveRef: saveRef
                }
              }, { props: _extends({}, props, { renderTabBarNode: renderTabBarNode }), on: listeners }])), h(InkTabBarNode, _mergeJSXProps([{
                attrs: { saveRef: saveRef, getRef: getRef }
              }, { props: props, on: listeners }]))]
            )]
          );
        }
      }
    });
  }
};