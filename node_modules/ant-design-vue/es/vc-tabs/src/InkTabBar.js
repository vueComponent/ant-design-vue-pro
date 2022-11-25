import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import InkTabBarNode from './InkTabBarNode';
import TabBarTabsNode from './TabBarTabsNode';
import TabBarRootNode from './TabBarRootNode';
import SaveRef from './SaveRef';
function noop() {}

export default {
  name: 'InkTabBar',
  functional: true,
  render: function render(h, context) {
    var props = context.props,
        _context$listeners = context.listeners,
        listeners = _context$listeners === undefined ? {} : _context$listeners;

    return h(SaveRef, {
      attrs: {
        children: function children(saveRef, getRef) {
          return h(
            TabBarRootNode,
            _mergeJSXProps([{
              attrs: { saveRef: saveRef }
            }, props]),
            [h(TabBarTabsNode, _mergeJSXProps([{
              on: {
                'tabClick': listeners.tabClick || noop
              },
              attrs: {
                saveRef: saveRef
              }
            }, { props: props }])), h(InkTabBarNode, _mergeJSXProps([{
              attrs: { saveRef: saveRef, getRef: getRef }
            }, { props: props }]))]
          );
        }
      }
    });
  }
};