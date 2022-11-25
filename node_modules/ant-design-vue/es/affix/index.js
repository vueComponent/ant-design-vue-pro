import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import omit from 'omit.js';
import ResizeObserver from '../vc-resize-observer';
import BaseMixin from '../_util/BaseMixin';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';
import warning from '../_util/warning';
import { addObserveTarget, removeObserveTarget, getTargetRect, getFixedTop, getFixedBottom } from './utils';

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}

// Affix
var AffixProps = {
  /**
   * 距离窗口顶部达到指定偏移量后触发
   */
  offsetTop: PropTypes.number,
  offset: PropTypes.number,
  /** 距离窗口底部达到指定偏移量后触发 */
  offsetBottom: PropTypes.number,
  /** 固定状态改变时触发的回调函数 */
  // onChange?: (affixed?: boolean) => void;
  /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
  target: PropTypes.func.def(getDefaultTarget),
  prefixCls: PropTypes.string
};
var AffixStatus = {
  None: 'none',
  Prepare: 'Prepare'
};
var Affix = {
  name: 'AAffix',
  props: AffixProps,
  mixins: [BaseMixin],
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
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
    this.updatePosition = throttleByAnimationFrame(this.updatePosition);
    this.lazyUpdatePosition = throttleByAnimationFrame(this.lazyUpdatePosition);
  },
  mounted: function mounted() {
    var _this = this;

    var target = this.target;

    if (target) {
      // [Legacy] Wait for parent component ref has its value.
      // We should use target as directly element instead of function which makes element check hard.
      this.timeout = setTimeout(function () {
        addObserveTarget(target(), _this);
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
        removeObserveTarget(this);
        if (newTarget) {
          addObserveTarget(newTarget, this);
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
    removeObserveTarget(this);
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
        warning(typeof offset === 'undefined', 'Affix', '`offset` is deprecated. Please use `offsetTop` instead.');
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
      var targetRect = getTargetRect(targetNode);
      var placeholderReact = getTargetRect(this.$refs.placeholderNode);
      var fixedTop = getFixedTop(placeholderReact, targetRect, offsetTop);
      var fixedBottom = getFixedBottom(placeholderReact, targetRect, offsetBottom);
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
          var targetRect = getTargetRect(targetNode);
          var placeholderReact = getTargetRect(this.$refs.placeholderNode);
          var fixedTop = getFixedTop(placeholderReact, targetRect, offsetTop);
          var fixedBottom = getFixedBottom(placeholderReact, targetRect, offsetBottom);

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
    var className = classNames(_defineProperty({}, getPrefixCls('affix', prefixCls), affixStyle));

    var props = {
      attrs: omit($props, ['prefixCls', 'offsetTop', 'offsetBottom', 'target'])
    };
    return h(
      ResizeObserver,
      {
        on: {
          'resize': function resize() {
            _this2.updatePosition();
          }
        }
      },
      [h(
        'div',
        _mergeJSXProps([props, { style: placeholderStyle, ref: 'placeholderNode' }]),
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
  Vue.use(Base);
  Vue.component(Affix.name, Affix);
};

export default Affix;