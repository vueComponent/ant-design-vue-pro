'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _utils = require('./utils');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function componentDidUpdate(component, init) {
  var _component$$props = component.$props,
      _component$$props$sty = _component$$props.styles,
      styles = _component$$props$sty === undefined ? {} : _component$$props$sty,
      panels = _component$$props.panels,
      activeKey = _component$$props.activeKey,
      direction = _component$$props.direction;

  var rootNode = component.getRef('root');
  var wrapNode = component.getRef('nav') || rootNode;
  var inkBarNode = component.getRef('inkBar');
  var activeTab = component.getRef('activeTab');
  var inkBarNodeStyle = inkBarNode.style;
  var tabBarPosition = component.$props.tabBarPosition;
  var activeIndex = (0, _utils.getActiveIndex)(panels, activeKey);
  if (init) {
    // prevent mount animation
    inkBarNodeStyle.display = 'none';
  }
  if (activeTab) {
    var tabNode = activeTab;
    var transformSupported = (0, _utils.isTransform3dSupported)(inkBarNodeStyle);

    // Reset current style
    (0, _utils.setTransform)(inkBarNodeStyle, '');
    inkBarNodeStyle.width = '';
    inkBarNodeStyle.height = '';
    inkBarNodeStyle.left = '';
    inkBarNodeStyle.top = '';
    inkBarNodeStyle.bottom = '';
    inkBarNodeStyle.right = '';

    if (tabBarPosition === 'top' || tabBarPosition === 'bottom') {
      var left = (0, _utils.getLeft)(tabNode, wrapNode);
      var width = tabNode.offsetWidth;
      // If tabNode'width width equal to wrapNode'width when tabBarPosition is top or bottom
      // It means no css working, then ink bar should not have width until css is loaded
      // Fix https://github.com/ant-design/ant-design/issues/7564
      if (width === rootNode.offsetWidth) {
        width = 0;
      } else if (styles.inkBar && styles.inkBar.width !== undefined) {
        width = parseFloat(styles.inkBar.width, 10);
        if (width) {
          left += (tabNode.offsetWidth - width) / 2;
        }
      }
      if (direction === 'rtl') {
        left = (0, _utils.getStyle)(tabNode, 'margin-left') - left;
      }
      // use 3d gpu to optimize render
      if (transformSupported) {
        (0, _utils.setTransform)(inkBarNodeStyle, 'translate3d(' + left + 'px,0,0)');
      } else {
        inkBarNodeStyle.left = left + 'px';
      }
      inkBarNodeStyle.width = width + 'px';
    } else {
      var top = (0, _utils.getTop)(tabNode, wrapNode, true);
      var height = tabNode.offsetHeight;
      if (styles.inkBar && styles.inkBar.height !== undefined) {
        height = parseFloat(styles.inkBar.height, 10);
        if (height) {
          top += (tabNode.offsetHeight - height) / 2;
        }
      }
      if (transformSupported) {
        (0, _utils.setTransform)(inkBarNodeStyle, 'translate3d(0,' + top + 'px,0)');
        inkBarNodeStyle.top = '0';
      } else {
        inkBarNodeStyle.top = top + 'px';
      }
      inkBarNodeStyle.height = height + 'px';
    }
  }
  inkBarNodeStyle.display = activeIndex !== -1 ? 'block' : 'none';
}

exports['default'] = {
  name: 'InkTabBarNode',
  mixins: [_BaseMixin2['default']],
  props: {
    inkBarAnimated: {
      type: Boolean,
      'default': true
    },
    direction: _vueTypes2['default'].string,
    prefixCls: String,
    styles: Object,
    tabBarPosition: String,
    saveRef: _vueTypes2['default'].func.def(function () {}),
    getRef: _vueTypes2['default'].func.def(function () {}),
    panels: _vueTypes2['default'].array,
    activeKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number])
  },
  updated: function updated() {
    this.$nextTick(function () {
      componentDidUpdate(this);
    });
  },
  mounted: function mounted() {
    this.$nextTick(function () {
      componentDidUpdate(this, true);
    });
  },
  render: function render() {
    var _classes;

    var h = arguments[0];
    var prefixCls = this.prefixCls,
        _styles = this.styles,
        styles = _styles === undefined ? {} : _styles,
        inkBarAnimated = this.inkBarAnimated;

    var className = prefixCls + '-ink-bar';
    var classes = (_classes = {}, (0, _defineProperty3['default'])(_classes, className, true), (0, _defineProperty3['default'])(_classes, inkBarAnimated ? className + '-animated' : className + '-no-animated', true), _classes);
    return h('div', (0, _babelHelperVueJsxMergeProps2['default'])([{
      style: styles.inkBar,
      'class': classes,
      key: 'inkBar'
    }, {
      directives: [{
        name: 'ant-ref',
        value: this.saveRef('inkBar')
      }]
    }]));
  }
};