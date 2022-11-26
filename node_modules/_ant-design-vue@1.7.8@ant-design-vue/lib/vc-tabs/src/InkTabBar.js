'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _InkTabBarNode = require('./InkTabBarNode');

var _InkTabBarNode2 = _interopRequireDefault(_InkTabBarNode);

var _TabBarTabsNode = require('./TabBarTabsNode');

var _TabBarTabsNode2 = _interopRequireDefault(_TabBarTabsNode);

var _TabBarRootNode = require('./TabBarRootNode');

var _TabBarRootNode2 = _interopRequireDefault(_TabBarRootNode);

var _SaveRef = require('./SaveRef');

var _SaveRef2 = _interopRequireDefault(_SaveRef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

exports['default'] = {
  name: 'InkTabBar',
  functional: true,
  render: function render(h, context) {
    var props = context.props,
        _context$listeners = context.listeners,
        listeners = _context$listeners === undefined ? {} : _context$listeners;

    return h(_SaveRef2['default'], {
      attrs: {
        children: function children(saveRef, getRef) {
          return h(
            _TabBarRootNode2['default'],
            (0, _babelHelperVueJsxMergeProps2['default'])([{
              attrs: { saveRef: saveRef }
            }, props]),
            [h(_TabBarTabsNode2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([{
              on: {
                'tabClick': listeners.tabClick || noop
              },
              attrs: {
                saveRef: saveRef
              }
            }, { props: props }])), h(_InkTabBarNode2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([{
              attrs: { saveRef: saveRef, getRef: getRef }
            }, { props: props }]))]
          );
        }
      }
    });
  }
};