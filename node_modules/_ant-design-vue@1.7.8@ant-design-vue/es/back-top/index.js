import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import addEventListener from '../vc-util/Dom/addEventListener';
import getScroll from '../_util/getScroll';
import BaseMixin from '../_util/BaseMixin';
import getTransitionProps from '../_util/getTransitionProps';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';
import { getListeners } from '../_util/props-util';
import scrollTo from '../_util/scrollTo';

function getDefaultTarget() {
  return window;
}

var BackTopProps = {
  visibilityHeight: PropTypes.number,
  // onClick?: React.MouseEventHandler<any>;
  target: PropTypes.func,
  prefixCls: PropTypes.string
  // visible: PropTypes.bool, // Only for test. Don't use it.
};

var BackTop = {
  name: 'ABackTop',
  mixins: [BaseMixin],
  props: _extends({}, BackTopProps, {
    visibilityHeight: PropTypes.number.def(400)
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    this.scrollEvent = null;
    return {
      visible: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      var getTarget = _this.target || getDefaultTarget;
      _this.scrollEvent = addEventListener(getTarget(), 'scroll', _this.handleScroll);
      _this.handleScroll();
    });
  },
  activated: function activated() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.handleScroll();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
  },

  methods: {
    getCurrentScrollTop: function getCurrentScrollTop() {
      var getTarget = this.target || getDefaultTarget;
      var targetNode = getTarget();
      if (targetNode === window) {
        return window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
      }
      return targetNode.scrollTop;
    },
    scrollToTop: function scrollToTop(e) {
      var _target = this.target,
          target = _target === undefined ? getDefaultTarget : _target;

      scrollTo(0, {
        getContainer: target
      });
      this.$emit('click', e);
    },
    handleScroll: function handleScroll() {
      var visibilityHeight = this.visibilityHeight,
          _target2 = this.target,
          target = _target2 === undefined ? getDefaultTarget : _target2;

      var scrollTop = getScroll(target(), true);
      this.setState({
        visible: scrollTop > visibilityHeight
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        $slots = this.$slots;


    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('back-top', customizePrefixCls);

    var defaultElement = h(
      'div',
      { 'class': prefixCls + '-content' },
      [h('div', { 'class': prefixCls + '-icon' })]
    );
    var divProps = {
      on: _extends({}, getListeners(this), {
        click: this.scrollToTop
      }),
      'class': prefixCls
    };

    var backTopBtn = this.visible ? h(
      'div',
      divProps,
      [$slots['default'] || defaultElement]
    ) : null;
    var transitionProps = getTransitionProps('fade');
    return h(
      'transition',
      transitionProps,
      [backTopBtn]
    );
  }
};

/* istanbul ignore next */
BackTop.install = function (Vue) {
  Vue.use(Base);
  Vue.component(BackTop.name, BackTop);
};

export default BackTop;