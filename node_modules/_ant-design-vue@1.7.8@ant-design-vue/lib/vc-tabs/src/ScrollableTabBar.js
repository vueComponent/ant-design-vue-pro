'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _ScrollableTabBarNode = require('./ScrollableTabBarNode');

var _ScrollableTabBarNode2 = _interopRequireDefault(_ScrollableTabBarNode);

var _TabBarRootNode = require('./TabBarRootNode');

var _TabBarRootNode2 = _interopRequireDefault(_TabBarRootNode);

var _TabBarTabsNode = require('./TabBarTabsNode');

var _TabBarTabsNode2 = _interopRequireDefault(_TabBarTabsNode);

var _SaveRef = require('./SaveRef');

var _SaveRef2 = _interopRequireDefault(_SaveRef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ScrollableTabBar',
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
            }, { props: props, on: listeners }]),
            [h(
              _ScrollableTabBarNode2['default'],
              (0, _babelHelperVueJsxMergeProps2['default'])([{
                attrs: { saveRef: saveRef, getRef: getRef }
              }, { props: props, on: listeners }]),
              [h(_TabBarTabsNode2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([{
                attrs: { saveRef: saveRef }
              }, { props: props, on: listeners }]))]
            )]
          );
        }
      }
    });
  }
};