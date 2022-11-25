'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _vcResizeObserver = require('../vc-resize-observer');

var _vcResizeObserver2 = _interopRequireDefault(_vcResizeObserver);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _throttleByAnimationFrame = require('../_util/throttleByAnimationFrame');

var _throttleByAnimationFrame2 = _interopRequireDefault(_throttleByAnimationFrame);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}

// Affix
var AffixProps = {
  /**
   * 距离窗口顶部达到指定偏移量后触发
   */
  offsetTop: _vueTypes2['default'].number,
  offset: _vueTypes2['default'].number,
  /** 距离窗口底部达到指定偏移量后触发 */
  offsetBottom: _vueTypes2['default'].number,
  /** 固定状态改变时触发的回调函数 */
  // onChange?: (affixed?: boolean) => void;
  /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
  target: _vueTypes2['default'].func.def(getDefaultTarget),
  prefixCls: _vueTypes2['default'].string
};
var AffixStatus = {
  None: 'none',
  Prepare: 'Prepare'
};
var Affix = {
  name: 'AAffix',
  props: AffixProps,
  mixins: [_BaseMixin2['default']],
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  data: function data() {
    return {
      affixStyle: undefined,
      placeholderStyle: undefined,
      status: AffixStatus.None,
      lastAffix: false,
      prevTarget: null
    };
  },
  beforeMount: function beforeMount() {
    this.updatePosition = (0, _throttleByAnimationFrame2['default'])(this.updatePosition);
    this.lazyUpdatePosition = (0, _throttleByAnimationFrame2['default'])(this.lazyUpdatePosition);
  },
  mounted: function mounted() {
    var _this = this;

    var target = this.target;

    if (target) {
      // [Legacy] Wait for parent component ref has its value.
      // We should use target as directly element instead of function which makes element check hard.
      this.timeout = setTimeout(function () {
        (0, _utils.addObserveTarget)(target(), _this);
        // Mock Event object.
        _this.updatePosition();
      });
    }
  },
  updated: function updated() {
    this.measure();
  },

  watch: {
    target: function target(val) {
      var newTarget = null;
      if (val) {
        newTarget = val() || null;
      }
      if (this.prevTarget !== newTarget) {
        (0, _utils.removeObserveTarget)(this);
        if (newTarget) {
          (0, _utils.addObserveTarget)(newTarget, this);
          // Mock Event object.
          this.updatePosition();
        }
        this.prevTarget = newTarget;
      }
    },
    offsetTop: function offsetTop() {
      this.updatePosition();
    },
    offsetBottom: function offsetBottom() {
      this.updatePosition();
    }
  },
  beforeDestroy: function beforeDestroy() {
    clearTimeout(this.timeout);
    (0, _utils.removeObserveTarget)(this);
    this.updatePosition.cancel();
    // https://github.com/ant-design/ant-design/issues/22683
    this.lazyUpdatePosition.cancel();
  },

  methods: {
    getOffsetTop: function getOffsetTop() {
      var offset = this.offset,
          offsetBottom = this.offsetBottom;
      var offsetTop = this.offsetTop;

      if (typeof offsetTop === 'undefined') {
        offsetTop = offset;
        (0, _warning2['default'])(typeof offset === 'undefined', 'Affix', '`offset` is deprecated. Please use `offsetTop` instead.');
      }

      if (offsetBottom === undefined && offsetTop === undefined) {
        offsetTop = 0;
      }
      return offsetTop;
    },
    getOffsetBottom: function getOffsetBottom() {
      return this.offsetBottom;
    },

    // =================== Measure ===================
    measure: function measure() {
      var status = this.status,
          lastAffix = this.lastAffix;
      var target = this.target;

      if (status !== AffixStatus.Prepare || !this.$refs.fixedNode || !this.$refs.placeholderNode || !target) {
        return;
      }

      var offsetTop = this.getOffsetTop();
      var offsetBottom = this.getOffsetBottom();

      var targetNode = target();
      if (!targetNode) {
        return;
      }

      var newState = {
        status: AffixStatus.None
      };
      var targetRect = (0, _utils.getTargetRect)(targetNode);
      var placeholderReact = (0, _utils.getTargetRect)(this.$refs.placeholderNode);
      var fixedTop = (0, _utils.getFixedTop)(placeholderReact, targetRect, offsetTop);
      var fixedBottom = (0, _utils.getFixedBottom)(placeholderReact, targetRect, offsetBottom);
      if (fixedTop !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          top: fixedTop,
          width: placeholderReact.width + 'px',
          height: placeholderReact.height + 'px'
        };
        newState.placeholderStyle = {
          width: placeholderReact.width + 'px',
          height: placeholderReact.height + 'px'
        };
      } else if (fixedBottom !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          bottom: fixedBottom,
          width: placeholderReact.width + 'px',
          height: placeholderReact.height + 'px'
        };
        newState.placeholderStyle = {
          width: placeholderReact.width + 'px',
          height: placeholderReact.height + 'px'
        };
      }

      newState.lastAffix = !!newState.affixStyle;
      if (lastAffix !== newState.lastAffix) {
        this.$emit('change', newState.lastAffix);
      }

      this.setState(newState);
    },


    // @ts-ignore TS6133
    prepareMeasure: function prepareMeasure() {
      this.setState({
        status: AffixStatus.Prepare,
        affixStyle: undefined,
        placeholderStyle: undefined
      });
      this.$forceUpdate();

      // Test if `updatePosition` called
      if (process.env.NODE_ENV === 'test') {
        this.$emit('testUpdatePosition');
      }
    },
    updatePosition: function updatePosition() {
      this.prepareMeasure();
    },
    lazyUpdatePosition: function lazyUpdatePosition() {
      var target = this.target;
      var affixStyle = this.affixStyle;

      // Check position change before measure to make Safari smooth

      if (target && affixStyle) {
        var offsetTop = this.getOffsetTop();
        var offsetBottom = this.getOffsetBottom();

        var targetNode = target();
        if (targetNode && this.$refs.placeholderNode) {
          var targetRect = (0, _utils.getTargetRect)(targetNode);
          var placeholderReact = (0, _utils.getTargetRect)(this.$refs.placeholderNode);
          var fixedTop = (0, _utils.getFixedTop)(placeholderReact, targetRect, offsetTop);
          var fixedBottom = (0, _utils.getFixedBottom)(placeholderReact, targetRect, offsetBottom);

          if (fixedTop !== undefined && affixStyle.top === fixedTop || fixedBottom !== undefined && affixStyle.bottom === fixedBottom) {
            return;
          }
        }
      }
      // Directly call prepare measure since it's already throttled.
      this.prepareMeasure();
    }
  },

  render: function render() {
    var _this2 = this;

    var h = arguments[0];
    var prefixCls = this.prefixCls,
        affixStyle = this.affixStyle,
        placeholderStyle = this.placeholderStyle,
        $slots = this.$slots,
        $props = this.$props;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var className = (0, _classnames2['default'])((0, _defineProperty3['default'])({}, getPrefixCls('affix', prefixCls), affixStyle));

    var props = {
      attrs: (0, _omit2['default'])($props, ['prefixCls', 'offsetTop', 'offsetBottom', 'target'])
    };
    return h(
      _vcResizeObserver2['default'],
      {
        on: {
          'resize': function resize() {
            _this2.updatePosition();
          }
        }
      },
      [h(
        'div',
        (0, _babelHelperVueJsxMergeProps2['default'])([props, { style: placeholderStyle, ref: 'placeholderNode' }]),
        [h(
          'div',
          { 'class': className, ref: 'fixedNode', style: affixStyle },
          [$slots['default']]
        )]
      )]
    );
  }
};

/* istanbul ignore next */
Affix.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Affix.name, Affix);
};

exports['default'] = Affix;