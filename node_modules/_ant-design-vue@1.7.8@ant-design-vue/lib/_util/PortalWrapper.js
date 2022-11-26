'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _vueTypes = require('./vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _switchScrollingEffect2 = require('./switchScrollingEffect');

var _switchScrollingEffect3 = _interopRequireDefault(_switchScrollingEffect2);

var _setStyle = require('./setStyle');

var _setStyle2 = _interopRequireDefault(_setStyle);

var _Portal = require('./Portal');

var _Portal2 = _interopRequireDefault(_Portal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var openCount = 0;
var windowIsUndefined = !(typeof window !== 'undefined' && window.document && window.document.createElement);
// https://github.com/ant-design/ant-design/issues/19340
// https://github.com/ant-design/ant-design/issues/19332
var cacheOverflow = {};

exports['default'] = {
  name: 'PortalWrapper',
  props: {
    wrapperClassName: _vueTypes2['default'].string,
    forceRender: _vueTypes2['default'].bool,
    getContainer: _vueTypes2['default'].any,
    children: _vueTypes2['default'].func,
    visible: _vueTypes2['default'].bool
  },
  data: function data() {
    var visible = this.$props.visible;

    openCount = visible ? openCount + 1 : openCount;
    return {};
  },
  updated: function updated() {
    this.setWrapperClassName();
  },

  watch: {
    visible: function visible(val) {
      openCount = val ? openCount + 1 : openCount - 1;
    },
    getContainer: function getContainer(_getContainer, prevGetContainer) {
      var getContainerIsFunc = typeof _getContainer === 'function' && typeof prevGetContainer === 'function';
      if (getContainerIsFunc ? _getContainer.toString() !== prevGetContainer.toString() : _getContainer !== prevGetContainer) {
        this.removeCurrentContainer(false);
      }
    }
  },
  beforeDestroy: function beforeDestroy() {
    var visible = this.$props.visible;
    // 离开时不会 render， 导到离开时数值不变，改用 func 。。

    openCount = visible && openCount ? openCount - 1 : openCount;
    this.removeCurrentContainer(visible);
  },

  methods: {
    getParent: function getParent() {
      var getContainer = this.$props.getContainer;

      if (getContainer) {
        if (typeof getContainer === 'string') {
          return document.querySelectorAll(getContainer)[0];
        }
        if (typeof getContainer === 'function') {
          return getContainer();
        }
        if ((typeof getContainer === 'undefined' ? 'undefined' : (0, _typeof3['default'])(getContainer)) === 'object' && getContainer instanceof window.HTMLElement) {
          return getContainer;
        }
      }
      return document.body;
    },
    getDomContainer: function getDomContainer() {
      if (windowIsUndefined) {
        return null;
      }
      if (!this.container) {
        this.container = document.createElement('div');
        var parent = this.getParent();
        if (parent) {
          parent.appendChild(this.container);
        }
      }
      this.setWrapperClassName();
      return this.container;
    },
    setWrapperClassName: function setWrapperClassName() {
      var wrapperClassName = this.$props.wrapperClassName;

      if (this.container && wrapperClassName && wrapperClassName !== this.container.className) {
        this.container.className = wrapperClassName;
      }
    },
    savePortal: function savePortal(c) {
      // Warning: don't rename _component
      // https://github.com/react-component/util/pull/65#discussion_r352407916
      this._component = c;
    },
    removeCurrentContainer: function removeCurrentContainer() {
      this.container = null;
      this._component = null;
    },


    /**
     * Enhance ./switchScrollingEffect
     * 1. Simulate document body scroll bar with
     * 2. Record body has overflow style and recover when all of PortalWrapper invisible
     * 3. Disable body scroll when PortalWrapper has open
     *
     * @memberof PortalWrapper
     */
    switchScrollingEffect: function switchScrollingEffect() {
      if (openCount === 1 && !Object.keys(cacheOverflow).length) {
        (0, _switchScrollingEffect3['default'])();
        // Must be set after switchScrollingEffect
        cacheOverflow = (0, _setStyle2['default'])({
          overflow: 'hidden',
          overflowX: 'hidden',
          overflowY: 'hidden'
        });
      } else if (!openCount) {
        (0, _setStyle2['default'])(cacheOverflow);
        cacheOverflow = {};
        (0, _switchScrollingEffect3['default'])(true);
      }
    }
  },

  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        children = _$props.children,
        forceRender = _$props.forceRender,
        visible = _$props.visible;

    var portal = null;
    var childProps = {
      getOpenCount: function getOpenCount() {
        return openCount;
      },
      getContainer: this.getDomContainer,
      switchScrollingEffect: this.switchScrollingEffect
    };
    if (forceRender || visible || this._component) {
      portal = h(_Portal2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([{
        attrs: {
          getContainer: this.getDomContainer,
          children: children(childProps)
        }
      }, {
        directives: [{
          name: 'ant-ref',
          value: this.savePortal
        }]
      }]));
    }
    return portal;
  }
};