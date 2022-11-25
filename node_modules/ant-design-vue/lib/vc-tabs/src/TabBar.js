'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _TabBarRootNode = require('./TabBarRootNode');

var _TabBarRootNode2 = _interopRequireDefault(_TabBarRootNode);

var _TabBarTabsNode = require('./TabBarTabsNode');

var _TabBarTabsNode2 = _interopRequireDefault(_TabBarTabsNode);

var _SaveRef = require('./SaveRef');

var _SaveRef2 = _interopRequireDefault(_SaveRef);

var _propsUtil = require('../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'TabBar',
  inheritAttrs: false,
  render: function render() {
    var h = arguments[0];

    var props = (0, _propsUtil.getAttrs)(this);
    var listeners = (0, _propsUtil.getListeners)(this);
    return h(_SaveRef2['default'], {
      attrs: {
        children: function children(saveRef) {
          return h(
            _TabBarRootNode2['default'],
            (0, _babelHelperVueJsxMergeProps2['default'])([{
              attrs: { saveRef: saveRef }
            }, { props: props, on: listeners }]),
            [h(_TabBarTabsNode2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([{
              attrs: { saveRef: saveRef }
            }, { props: props, on: listeners }]))]
          );
        }
      }
    });
  }
};