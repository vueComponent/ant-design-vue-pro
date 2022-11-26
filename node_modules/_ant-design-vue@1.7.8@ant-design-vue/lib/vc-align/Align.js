'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _domAlign = require('dom-align');

var _addEventListener = require('../vc-util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _util = require('./util');

var _vnode = require('../_util/vnode.js');

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getElement(func) {
  if (typeof func !== 'function' || !func) return null;
  return func();
}

function getPoint(point) {
  if ((typeof point === 'undefined' ? 'undefined' : (0, _typeof3['default'])(point)) !== 'object' || !point) return null;
  return point;
}

exports['default'] = {
  props: {
    childrenProps: _vueTypes2['default'].object,
    align: _vueTypes2['default'].object.isRequired,
    target: _vueTypes2['default'].oneOfType([_vueTypes2['default'].func, _vueTypes2['default'].object]).def(function () {
      return window;
    }),
    monitorBufferTime: _vueTypes2['default'].number.def(50),
    monitorWindowResize: _vueTypes2['default'].bool.def(false),
    disabled: _vueTypes2['default'].bool.def(false)
  },
  data: function data() {
    this.aligned = false;
    return {};
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.prevProps = (0, _extends3['default'])({}, _this.$props);
      var props = _this.$props;
      // if parent ref not attached .... use document.getElementById
      !_this.aligned && _this.forceAlign();
      if (!props.disabled && props.monitorWindowResize) {
        _this.startMonitorWindowResize();
      }
    });
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      var prevProps = _this2.prevProps;
      var props = _this2.$props;
      var reAlign = false;
      if (!props.disabled) {
        var source = _this2.$el;
        var sourceRect = source ? source.getBoundingClientRect() : null;

        if (prevProps.disabled) {
          reAlign = true;
        } else {
          var lastElement = getElement(prevProps.target);
          var currentElement = getElement(props.target);
          var lastPoint = getPoint(prevProps.target);
          var currentPoint = getPoint(props.target);
          if ((0, _util.isWindow)(lastElement) && (0, _util.isWindow)(currentElement)) {
            // Skip if is window
            reAlign = false;
          } else if (lastElement !== currentElement || // Element change
          lastElement && !currentElement && currentPoint || // Change from element to point
          lastPoint && currentPoint && currentElement || // Change from point to element
          currentPoint && !(0, _util.isSamePoint)(lastPoint, currentPoint)) {
            reAlign = true;
          }

          // If source element size changed
          var preRect = _this2.sourceRect || {};
          if (!reAlign && source && (!(0, _util.isSimilarValue)(preRect.width, sourceRect.width) || !(0, _util.isSimilarValue)(preRect.height, sourceRect.height))) {
            reAlign = true;
          }
        }
        _this2.sourceRect = sourceRect;
      }

      if (reAlign) {
        _this2.forceAlign();
      }

      if (props.monitorWindowResize && !props.disabled) {
        _this2.startMonitorWindowResize();
      } else {
        _this2.stopMonitorWindowResize();
      }
      _this2.prevProps = (0, _extends3['default'])({}, _this2.$props, { align: (0, _cloneDeep2['default'])(_this2.$props.align) });
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.stopMonitorWindowResize();
  },

  methods: {
    startMonitorWindowResize: function startMonitorWindowResize() {
      if (!this.resizeHandler) {
        this.bufferMonitor = (0, _util.buffer)(this.forceAlign, this.$props.monitorBufferTime);
        this.resizeHandler = (0, _addEventListener2['default'])(window, 'resize', this.bufferMonitor);
      }
    },
    stopMonitorWindowResize: function stopMonitorWindowResize() {
      if (this.resizeHandler) {
        this.bufferMonitor.clear();
        this.resizeHandler.remove();
        this.resizeHandler = null;
      }
    },
    forceAlign: function forceAlign() {
      var _$props = this.$props,
          disabled = _$props.disabled,
          target = _$props.target,
          align = _$props.align;

      if (!disabled && target) {
        var source = this.$el;
        var listeners = (0, _propsUtil.getListeners)(this);
        var result = void 0;
        var element = getElement(target);
        var point = getPoint(target);

        // IE lose focus after element realign
        // We should record activeElement and restore later
        var activeElement = document.activeElement;

        if (element) {
          result = (0, _domAlign.alignElement)(source, element, align);
        } else if (point) {
          result = (0, _domAlign.alignPoint)(source, point, align);
        }
        (0, _util.restoreFocus)(activeElement, source);
        this.aligned = true;
        listeners.align && listeners.align(source, result);
      }
    }
  },

  render: function render() {
    var childrenProps = this.$props.childrenProps;

    var child = (0, _propsUtil.getSlot)(this)[0];
    if (child && childrenProps) {
      return (0, _vnode.cloneElement)(child, { props: childrenProps });
    }
    return child;
  }
};