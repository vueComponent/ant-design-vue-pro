'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _InkTabBarNode = require('./InkTabBarNode');

var _InkTabBarNode2 = _interopRequireDefault(_InkTabBarNode);

var _TabBarTabsNode = require('./TabBarTabsNode');

var _TabBarTabsNode2 = _interopRequireDefault(_TabBarTabsNode);

var _TabBarRootNode = require('./TabBarRootNode');

var _TabBarRootNode2 = _interopRequireDefault(_TabBarRootNode);

var _ScrollableTabBarNode = require('./ScrollableTabBarNode');

var _ScrollableTabBarNode2 = _interopRequireDefault(_ScrollableTabBarNode);

var _SaveRef = require('./SaveRef');

var _SaveRef2 = _interopRequireDefault(_SaveRef);

var _propsUtil = require('../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ScrollableInkTabBar',
  inheritAttrs: false,
  props: ['extraContent', 'inkBarAnimated', 'tabBarGutter', 'prefixCls', 'navWrapper', 'tabBarPosition', 'panels', 'activeKey', 'prevIcon', 'nextIcon'],
  render: function render() {
    var h = arguments[0];

    var props = (0, _extends3['default'])({}, this.$props);
    var listeners = (0, _propsUtil.getListeners)(this);
    var renderTabBarNode = this.$scopedSlots['default'];

    return h(_SaveRef2['default'], {
      attrs: {
        children: function children(saveRef, getRef) {
          return h(
            _TabBarRootNode2['default'],
            (0, _babelHelperVueJsxMergeProps2['default'])([{
              attrs: { saveRef: saveRef }
            }, { props: props, on: listeners }]),
            [h(
              _ScrollableTabBarNode2['default'],
              (0, _babelHelperVueJsxMergeProps2['default'])([{
                attrs: { saveRef: saveRef, getRef: getRef }
              }, { props: props, on: listeners }]),
              [h(_TabBarTabsNode2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([{
                attrs: {
                  saveRef: saveRef
                }
              }, { props: (0, _extends3['default'])({}, props, { renderTabBarNode: renderTabBarNode }), on: listeners }])), h(_InkTabBarNode2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([{
                attrs: { saveRef: saveRef, getRef: getRef }
              }, { props: props, on: listeners }]))]
            )]
          );
        }
      }
    });
  }
};