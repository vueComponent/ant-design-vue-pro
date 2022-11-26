'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CarouselProps = exports.CarouselEffect = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _propsUtil = require('../_util/props-util');

var _propsUtil2 = _interopRequireDefault(_propsUtil);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
if (typeof window !== 'undefined') {
  var matchMediaPolyfill = function matchMediaPolyfill(mediaQuery) {
    return {
      media: mediaQuery,
      matches: false,
      addListener: function addListener() {},
      removeListener: function removeListener() {}
    };
  };
  // ref: https://github.com/ant-design/ant-design/issues/18774
  if (!window.matchMedia) window.matchMedia = matchMediaPolyfill;
}
// Use require over import (will be lifted up)
// make sure matchMedia polyfill run before require('vc-slick')
// Fix https://github.com/ant-design/ant-design/issues/6560
// Fix https://github.com/ant-design/ant-design/issues/3308
var SlickCarousel = require('../vc-slick/src')['default'];

var CarouselEffect = exports.CarouselEffect = _vueTypes2['default'].oneOf(['scrollx', 'fade']);
// Carousel
var CarouselProps = exports.CarouselProps = {
  effect: CarouselEffect,
  dots: _vueTypes2['default'].bool,
  vertical: _vueTypes2['default'].bool,
  autoplay: _vueTypes2['default'].bool,
  easing: _vueTypes2['default'].string,
  beforeChange: _vueTypes2['default'].func,
  afterChange: _vueTypes2['default'].func,
  // style: PropTypes.React.CSSProperties,
  prefixCls: _vueTypes2['default'].string,
  accessibility: _vueTypes2['default'].bool,
  nextArrow: _vueTypes2['default'].any,
  prevArrow: _vueTypes2['default'].any,
  pauseOnHover: _vueTypes2['default'].bool,
  // className: PropTypes.string,
  adaptiveHeight: _vueTypes2['default'].bool,
  arrows: _vueTypes2['default'].bool,
  autoplaySpeed: _vueTypes2['default'].number,
  centerMode: _vueTypes2['default'].bool,
  centerPadding: _vueTypes2['default'].string,
  cssEase: _vueTypes2['default'].string,
  dotsClass: _vueTypes2['default'].string,
  draggable: _vueTypes2['default'].bool,
  fade: _vueTypes2['default'].bool,
  focusOnSelect: _vueTypes2['default'].bool,
  infinite: _vueTypes2['default'].bool,
  initialSlide: _vueTypes2['default'].number,
  lazyLoad: _vueTypes2['default'].bool,
  rtl: _vueTypes2['default'].bool,
  slide: _vueTypes2['default'].string,
  slidesToShow: _vueTypes2['default'].number,
  slidesToScroll: _vueTypes2['default'].number,
  speed: _vueTypes2['default'].number,
  swipe: _vueTypes2['default'].bool,
  swipeToSlide: _vueTypes2['default'].bool,
  touchMove: _vueTypes2['default'].bool,
  touchThreshold: _vueTypes2['default'].number,
  variableWidth: _vueTypes2['default'].bool,
  useCSS: _vueTypes2['default'].bool,
  slickGoTo: _vueTypes2['default'].number,
  responsive: _vueTypes2['default'].array,
  dotPosition: _vueTypes2['default'].oneOf(['top', 'bottom', 'left', 'right'])
};

var Carousel = {
  name: 'ACarousel',
  props: (0, _propsUtil.initDefaultProps)(CarouselProps, {
    dots: true,
    arrows: false,
    draggable: false
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },

  beforeMount: function beforeMount() {
    this.onWindowResized = (0, _debounce2['default'])(this.onWindowResized, 500, {
      leading: false
    });
  },
  mounted: function mounted() {
    if ((0, _propsUtil2['default'])(this, 'vertical')) {
      (0, _warning2['default'])(!this.vertical, 'Carousel', '`vertical` is deprecated, please use `dotPosition` instead.');
    }
    var autoplay = this.autoplay;

    if (autoplay) {
      window.addEventListener('resize', this.onWindowResized);
    }
    // https://github.com/ant-design/ant-design/issues/7191
    this.innerSlider = this.$refs.slick && this.$refs.slick.innerSlider;
  },
  beforeDestroy: function beforeDestroy() {
    var autoplay = this.autoplay;

    if (autoplay) {
      window.removeEventListener('resize', this.onWindowResized);
      this.onWindowResized.cancel();
    }
  },

  methods: {
    getDotPosition: function getDotPosition() {
      if (this.dotPosition) {
        return this.dotPosition;
      }
      if ((0, _propsUtil2['default'])(this, 'vertical')) {
        return this.vertical ? 'right' : 'bottom';
      }
      return 'bottom';
    },
    onWindowResized: function onWindowResized() {
      // Fix https://github.com/ant-design/ant-design/issues/2550
      var autoplay = this.autoplay;

      if (autoplay && this.$refs.slick && this.$refs.slick.innerSlider && this.$refs.slick.innerSlider.autoPlay) {
        this.$refs.slick.innerSlider.autoPlay();
      }
    },
    next: function next() {
      this.$refs.slick.slickNext();
    },
    prev: function prev() {
      this.$refs.slick.slickPrev();
    },
    goTo: function goTo(slide) {
      var dontAnimate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      this.$refs.slick.slickGoTo(slide, dontAnimate);
    }
  },

  render: function render() {
    var h = arguments[0];

    var props = (0, _extends3['default'])({}, this.$props);
    var $slots = this.$slots;


    if (props.effect === 'fade') {
      props.fade = true;
    }

    var getPrefixCls = this.configProvider.getPrefixCls;
    var className = getPrefixCls('carousel', props.prefixCls);
    var dotsClass = 'slick-dots';
    var dotPosition = this.getDotPosition();
    props.vertical = dotPosition === 'left' || dotPosition === 'right';
    props.dotsClass = (0, _classnames2['default'])('' + dotsClass, dotsClass + '-' + (dotPosition || 'bottom'), (0, _defineProperty3['default'])({}, '' + props.dotsClass, !!props.dotsClass));
    if (props.vertical) {
      className = className + ' ' + className + '-vertical';
    }
    var SlickCarouselProps = {
      props: (0, _extends3['default'])({}, props, {
        nextArrow: (0, _propsUtil.getComponentFromProp)(this, 'nextArrow'),
        prevArrow: (0, _propsUtil.getComponentFromProp)(this, 'prevArrow')
      }),
      on: (0, _propsUtil.getListeners)(this),
      scopedSlots: this.$scopedSlots
    };
    var children = (0, _propsUtil.filterEmpty)($slots['default']);
    return h(
      'div',
      { 'class': className },
      [h(
        SlickCarousel,
        (0, _babelHelperVueJsxMergeProps2['default'])([{ ref: 'slick' }, SlickCarouselProps]),
        [children]
      )]
    );
  }
};

/* istanbul ignore next */
Carousel.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Carousel.name, Carousel);
};

exports['default'] = Carousel;