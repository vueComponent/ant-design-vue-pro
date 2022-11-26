'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../_util/props-util');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
exports['default'] = {
  name: 'TabBarTabsNode',
  mixins: [_BaseMixin2['default']],
  props: {
    activeKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    panels: _vueTypes2['default'].any.def([]),
    prefixCls: _vueTypes2['default'].string.def(''),
    tabBarGutter: _vueTypes2['default'].any.def(null),
    onTabClick: _vueTypes2['default'].func,
    saveRef: _vueTypes2['default'].func.def(noop),
    getRef: _vueTypes2['default'].func.def(noop),
    renderTabBarNode: _vueTypes2['default'].func,
    tabBarPosition: _vueTypes2['default'].string,
    direction: _vueTypes2['default'].string
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];
    var _$props = this.$props,
        children = _$props.panels,
        activeKey = _$props.activeKey,
        prefixCls = _$props.prefixCls,
        tabBarGutter = _$props.tabBarGutter,
        saveRef = _$props.saveRef,
        tabBarPosition = _$props.tabBarPosition,
        direction = _$props.direction;

    var rst = [];
    var renderTabBarNode = this.renderTabBarNode || this.$scopedSlots.renderTabBarNode;
    children.forEach(function (child, index) {
      if (!child) {
        return;
      }
      var props = (0, _propsUtil.getOptionProps)(child);
      var key = child.key;
      var cls = activeKey === key ? prefixCls + '-tab-active' : '';
      cls += ' ' + prefixCls + '-tab';
      var events = { on: {} };
      var disabled = props.disabled || props.disabled === '';
      if (disabled) {
        cls += ' ' + prefixCls + '-tab-disabled';
      } else {
        events.on.click = function () {
          _this.__emit('tabClick', key);
        };
      }
      var directives = [];
      if (activeKey === key) {
        directives.push({
          name: 'ant-ref',
          value: saveRef('activeTab')
        });
      }
      var tab = (0, _propsUtil.getComponentFromProp)(child, 'tab');
      var gutter = tabBarGutter && index === children.length - 1 ? 0 : tabBarGutter;
      gutter = typeof gutter === 'number' ? gutter + 'px' : gutter;
      var marginProperty = direction === 'rtl' ? 'marginLeft' : 'marginRight';
      var style = (0, _defineProperty3['default'])({}, (0, _utils.isVertical)(tabBarPosition) ? 'marginBottom' : marginProperty, gutter);
      (0, _warning2['default'])(tab !== undefined, 'There must be `tab` property or slot on children of Tabs.');
      var node = h(
        'div',
        (0, _babelHelperVueJsxMergeProps2['default'])([{
          attrs: {
            role: 'tab',
            'aria-disabled': disabled ? 'true' : 'false',
            'aria-selected': activeKey === key ? 'true' : 'false'
          }
        }, events, {
          'class': cls,
          key: key,
          style: style
        }, { directives: directives }]),
        [tab]
      );
      if (renderTabBarNode) {
        node = renderTabBarNode(node);
      }

      rst.push(node);
    });

    return h(
      'div',
      {
        directives: [{
          name: 'ant-ref',
          value: this.saveRef('navTabsContainer')
        }]
      },
      [rst]
    );
  }
};