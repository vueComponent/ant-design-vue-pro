import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import ScrollableTabBarNode from './ScrollableTabBarNode';
import TabBarRootNode from './TabBarRootNode';
import TabBarTabsNode from './TabBarTabsNode';
import SaveRef from './SaveRef';

export default {
  name: 'ScrollableTabBar',
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
            }, { props: props, on: listeners }]),
            [h(
              ScrollableTabBarNode,
              _mergeJSXProps([{
                attrs: { saveRef: saveRef, getRef: getRef }
              }, { props: props, on: listeners }]),
              [h(TabBarTabsNode, _mergeJSXProps([{
                attrs: { saveRef: saveRef }
              }, { props: props, on: listeners }]))]
            )]
          );
        }
      }
    });
  }
};