import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import TabBarRootNode from './TabBarRootNode';
import TabBarTabsNode from './TabBarTabsNode';
import SaveRef from './SaveRef';
import { getAttrs, getListeners } from '../../_util/props-util';

export default {
  name: 'TabBar',
  inheritAttrs: false,
  render: function render() {
    var h = arguments[0];

    var props = getAttrs(this);
    var listeners = getListeners(this);
    return h(SaveRef, {
      attrs: {
        children: function children(saveRef) {
          return h(
            TabBarRootNode,
            _mergeJSXProps([{
              attrs: { saveRef: saveRef }
            }, { props: props, on: listeners }]),
            [h(TabBarTabsNode, _mergeJSXProps([{
              attrs: { saveRef: saveRef }
            }, { props: props, on: listeners }]))]
          );
        }
      }
    });
  }
};