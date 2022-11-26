'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _addEventListener = require('../vc-util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _getScroll = require('../_util/getScroll');

var _getScroll2 = _interopRequireDefault(_getScroll);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _propsUtil = require('../_util/props-util');

var _scrollTo = require('../_util/scrollTo');

var _scrollTo2 = _interopRequireDefault(_scrollTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getDefaultTarget() {
  return window;
}

var BackTopProps = {
  visibilityHeight: _vueTypes2['default'].number,
  // onClick?: React.MouseEventHandler<any>;
  target: _vueTypes2['default'].func,
  prefixCls: _vueTypes2['default'].string
  // visible: PropTypes.bool, // Only for test. Don't use it.
};

var BackTop = {
  name: 'ABackTop',
  mixins: [_BaseMixin2['default']],
  props: (0, _extends3['default'])({}, BackTopProps, {
    visibilityHeight: _vueTypes2['default'].number.def(400)
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
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
      _this.scrollEvent = (0, _addEventListener2['default'])(getTarget(), 'scroll', _this.handleScroll);
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

      (0, _scrollTo2['default'])(0, {
        getContainer: target
      });
      this.$emit('click', e);
    },
    handleScroll: function handleScroll() {
      var visibilityHeight = this.visibilityHeight,
          _target2 = this.target,
          target = _target2 === undefined ? getDefaultTarget : _target2;

      var scrollTop = (0, _getScroll2['default'])(target(), true);
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
      on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), {
        click: this.scrollToTop
      }),
      'class': prefixCls
    };

    var backTopBtn = this.visible ? h(
      'div',
      divProps,
      [$slots['default'] || defaultElement]
    ) : null;
    var transitionProps = (0, _getTransitionProps2['default'])('fade');
    return h(
      'transition',
      transitionProps,
      [backTopBtn]
    );
  }
};

/* istanbul ignore next */
BackTop.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(BackTop.name, BackTop);
};

exports['default'] = BackTop;