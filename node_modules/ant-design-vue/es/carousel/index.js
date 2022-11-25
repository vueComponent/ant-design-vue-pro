import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import debounce from 'lodash/debounce';
import hasProp, { initDefaultProps, getComponentFromProp, filterEmpty, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';
import warning from '../_util/warning';
import classNames from 'classnames';

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

export var CarouselEffect = PropTypes.oneOf(['scrollx', 'fade']);
// Carousel
export var CarouselProps = {
  effect: CarouselEffect,
  dots: PropTypes.bool,
  vertical: PropTypes.bool,
  autoplay: PropTypes.bool,
  easing: PropTypes.string,
  beforeChange: PropTypes.func,
  afterChange: PropTypes.func,
  // style: PropTypes.React.CSSProperties,
  prefixCls: PropTypes.string,
  accessibility: PropTypes.bool,
  nextArrow: PropTypes.any,
  prevArrow: PropTypes.any,
  pauseOnHover: PropTypes.bool,
  // className: PropTypes.string,
  adaptiveHeight: PropTypes.bool,
  arrows: PropTypes.bool,
  autoplaySpeed: PropTypes.number,
  centerMode: PropTypes.bool,
  centerPadding: PropTypes.string,
  cssEase: PropTypes.string,
  dotsClass: PropTypes.string,
  draggable: PropTypes.bool,
  fade: PropTypes.bool,
  focusOnSelect: PropTypes.bool,
  infinite: PropTypes.bool,
  initialSlide: PropTypes.number,
  lazyLoad: PropTypes.bool,
  rtl: PropTypes.bool,
  slide: PropTypes.string,
  slidesToShow: PropTypes.number,
  slidesToScroll: PropTypes.number,
  speed: PropTypes.number,
  swipe: PropTypes.bool,
  swipeToSlide: PropTypes.bool,
  touchMove: PropTypes.bool,
  touchThreshold: PropTypes.number,
  variableWidth: PropTypes.bool,
  useCSS: PropTypes.bool,
  slickGoTo: PropTypes.number,
  responsive: PropTypes.array,
  dotPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

var Carousel = {
  name: 'ACarousel',
  props: initDefaultProps(CarouselProps, {
    dots: true,
    arrows: false,
    draggable: false
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },

  beforeMount: function beforeMount() {
    this.onWindowResized = debounce(this.onWindowResized, 500, {
      leading: false
    });
  },
  mounted: function mounted() {
    if (hasProp(this, 'vertical')) {
      warning(!this.vertical, 'Carousel', '`vertical` is deprecated, please use `dotPosition` instead.');
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
      if (hasProp(this, 'vertical')) {
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

    var props = _extends({}, this.$props);
    var $slots = this.$slots;


    if (props.effect === 'fade') {
      props.fade = true;
    }

    var getPrefixCls = this.configProvider.getPrefixCls;
    var className = getPrefixCls('carousel', props.prefixCls);
    var dotsClass = 'slick-dots';
    var dotPosition = this.getDotPosition();
    props.vertical = dotPosition === 'left' || dotPosition === 'right';
    props.dotsClass = classNames('' + dotsClass, dotsClass + '-' + (dotPosition || 'bottom'), _defineProperty({}, '' + props.dotsClass, !!props.dotsClass));
    if (props.vertical) {
      className = className + ' ' + className + '-vertical';
    }
    var SlickCarouselProps = {
      props: _extends({}, props, {
        nextArrow: getComponentFromProp(this, 'nextArrow'),
        prevArrow: getComponentFromProp(this, 'prevArrow')
      }),
      on: getListeners(this),
      scopedSlots: this.$scopedSlots
    };
    var children = filterEmpty($slots['default']);
    return h(
      'div',
      { 'class': className },
      [h(
        SlickCarousel,
        _mergeJSXProps([{ ref: 'slick' }, SlickCarouselProps]),
        [children]
      )]
    );
  }
};

/* istanbul ignore next */
Carousel.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Carousel.name, Carousel);
};

export default Carousel;