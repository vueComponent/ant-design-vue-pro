'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnchorProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _addEventListener = require('../vc-util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _affix = require('../affix');

var _affix2 = _interopRequireDefault(_affix);

var _scrollTo = require('../_util/scrollTo');

var _scrollTo2 = _interopRequireDefault(_scrollTo);

var _getScroll = require('../_util/getScroll');

var _getScroll2 = _interopRequireDefault(_getScroll);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getDefaultContainer() {
  return window;
}

function getOffsetTop(element, container) {
  if (!element) {
    return 0;
  }

  if (!element.getClientRects().length) {
    return 0;
  }

  var rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument.documentElement;
      return rect.top - container.clientTop;
    }
    return rect.top - container.getBoundingClientRect().top;
  }

  return rect.top;
}

// function easeInOutCubic(t, b, c, d) {
//   const cc = c - b;
//   t /= d / 2;
//   if (t < 1) {
//     return (cc / 2) * t * t * t + b;
//   }
//   return (cc / 2) * ((t -= 2) * t * t + 2) + b;
// }

var sharpMatcherRegx = /#([^#]+)$/;
// function scrollTo(href, offsetTop = 0, getContainer, callback = () => {}) {
//   const container = getContainer();
//   const scrollTop = getScroll(container, true);
//   const sharpLinkMatch = sharpMatcherRegx.exec(href);
//   if (!sharpLinkMatch) {
//     return;
//   }
//   const targetElement = document.getElementById(sharpLinkMatch[1]);
//   if (!targetElement) {
//     return;
//   }
//   const eleOffsetTop = getOffsetTop(targetElement, container);
//   const targetScrollTop = scrollTop + eleOffsetTop - offsetTop;
//   const startTime = Date.now();
//   const frameFunc = () => {
//     const timestamp = Date.now();
//     const time = timestamp - startTime;
//     const nextScrollTop = easeInOutCubic(time, scrollTop, targetScrollTop, 450);
//     if (container === window) {
//       window.scrollTo(window.pageXOffset, nextScrollTop);
//     } else {
//       container.scrollTop = nextScrollTop;
//     }
//     if (time < 450) {
//       raf(frameFunc);
//     } else {
//       callback();
//     }
//   };
//   raf(frameFunc);
// }

var AnchorProps = exports.AnchorProps = {
  prefixCls: _vueTypes2['default'].string,
  offsetTop: _vueTypes2['default'].number,
  bounds: _vueTypes2['default'].number,
  affix: _vueTypes2['default'].bool,
  showInkInFixed: _vueTypes2['default'].bool,
  getContainer: _vueTypes2['default'].func,
  wrapperClass: _vueTypes2['default'].string,
  wrapperStyle: _vueTypes2['default'].object,
  getCurrentAnchor: _vueTypes2['default'].func,
  targetOffset: _vueTypes2['default'].number
};

exports['default'] = {
  name: 'AAnchor',
  mixins: [_BaseMixin2['default']],
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(AnchorProps, {
    affix: true,
    showInkInFixed: false,
    getContainer: getDefaultContainer
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  data: function data() {
    this.links = [];
    this._sPrefixCls = '';
    return {
      activeLink: null
    };
  },
  provide: function provide() {
    var _this = this;

    return {
      antAnchor: {
        registerLink: function registerLink(link) {
          if (!_this.links.includes(link)) {
            _this.links.push(link);
          }
        },
        unregisterLink: function unregisterLink(link) {
          var index = _this.links.indexOf(link);
          if (index !== -1) {
            _this.links.splice(index, 1);
          }
        },
        $data: this.$data,
        scrollTo: this.handleScrollTo
      },
      antAnchorContext: this
    };
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      var getContainer = _this2.getContainer;

      _this2.scrollContainer = getContainer();
      _this2.scrollEvent = (0, _addEventListener2['default'])(_this2.scrollContainer, 'scroll', _this2.handleScroll);
      _this2.handleScroll();
    });
  },
  updated: function updated() {
    var _this3 = this;

    this.$nextTick(function () {
      if (_this3.scrollEvent) {
        var getContainer = _this3.getContainer;

        var currentContainer = getContainer();
        if (_this3.scrollContainer !== currentContainer) {
          _this3.scrollContainer = currentContainer;
          _this3.scrollEvent.remove();
          _this3.scrollEvent = (0, _addEventListener2['default'])(_this3.scrollContainer, 'scroll', _this3.handleScroll);
          _this3.handleScroll();
        }
      }
      _this3.updateInk();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
  },

  methods: {
    getCurrentActiveLink: function getCurrentActiveLink() {
      var offsetTop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
      var getCurrentAnchor = this.getCurrentAnchor;


      if (typeof getCurrentAnchor === 'function') {
        return getCurrentAnchor();
      }
      var activeLink = '';
      if (typeof document === 'undefined') {
        return activeLink;
      }

      var linkSections = [];
      var getContainer = this.getContainer;

      var container = getContainer();
      this.links.forEach(function (link) {
        var sharpLinkMatch = sharpMatcherRegx.exec(link.toString());
        if (!sharpLinkMatch) {
          return;
        }
        var target = document.getElementById(sharpLinkMatch[1]);
        if (target) {
          var top = getOffsetTop(target, container);
          if (top < offsetTop + bounds) {
            linkSections.push({
              link: link,
              top: top
            });
          }
        }
      });

      if (linkSections.length) {
        var maxSection = linkSections.reduce(function (prev, curr) {
          return curr.top > prev.top ? curr : prev;
        });
        return maxSection.link;
      }
      return '';
    },
    handleScrollTo: function handleScrollTo(link) {
      var _this4 = this;

      var offsetTop = this.offsetTop,
          getContainer = this.getContainer,
          targetOffset = this.targetOffset;


      this.setCurrentActiveLink(link);
      var container = getContainer();
      var scrollTop = (0, _getScroll2['default'])(container, true);
      var sharpLinkMatch = sharpMatcherRegx.exec(link);
      if (!sharpLinkMatch) {
        return;
      }
      var targetElement = document.getElementById(sharpLinkMatch[1]);
      if (!targetElement) {
        return;
      }

      var eleOffsetTop = getOffsetTop(targetElement, container);
      var y = scrollTop + eleOffsetTop;
      y -= targetOffset !== undefined ? targetOffset : offsetTop || 0;
      this.animating = true;

      (0, _scrollTo2['default'])(y, {
        callback: function callback() {
          _this4.animating = false;
        },
        getContainer: getContainer
      });
    },
    setCurrentActiveLink: function setCurrentActiveLink(link) {
      var activeLink = this.activeLink;


      if (activeLink !== link) {
        this.setState({
          activeLink: link
        });
        this.$emit('change', link);
      }
    },
    handleScroll: function handleScroll() {
      if (this.animating) {
        return;
      }
      var offsetTop = this.offsetTop,
          bounds = this.bounds,
          targetOffset = this.targetOffset;

      var currentActiveLink = this.getCurrentActiveLink(targetOffset !== undefined ? targetOffset : offsetTop || 0, bounds);
      this.setCurrentActiveLink(currentActiveLink);
    },
    updateInk: function updateInk() {
      if (typeof document === 'undefined') {
        return;
      }
      var _sPrefixCls = this._sPrefixCls;

      var linkNode = this.$el.getElementsByClassName(_sPrefixCls + '-link-title-active')[0];
      if (linkNode) {
        this.$refs.inkNode.style.top = linkNode.offsetTop + linkNode.clientHeight / 2 - 4.5 + 'px';
      }
    }
  },

  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        offsetTop = this.offsetTop,
        affix = this.affix,
        showInkInFixed = this.showInkInFixed,
        activeLink = this.activeLink,
        $slots = this.$slots,
        getContainer = this.getContainer;


    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('anchor', customizePrefixCls);
    this._sPrefixCls = prefixCls;

    var inkClass = (0, _classnames2['default'])(prefixCls + '-ink-ball', {
      visible: activeLink
    });

    var wrapperClass = (0, _classnames2['default'])(this.wrapperClass, prefixCls + '-wrapper');

    var anchorClass = (0, _classnames2['default'])(prefixCls, {
      fixed: !affix && !showInkInFixed
    });

    var wrapperStyle = (0, _extends3['default'])({
      maxHeight: offsetTop ? 'calc(100vh - ' + offsetTop + 'px)' : '100vh'
    }, this.wrapperStyle);

    var anchorContent = h(
      'div',
      { 'class': wrapperClass, style: wrapperStyle },
      [h(
        'div',
        { 'class': anchorClass },
        [h(
          'div',
          { 'class': prefixCls + '-ink' },
          [h('span', { 'class': inkClass, ref: 'inkNode' })]
        ), $slots['default']]
      )]
    );

    return !affix ? anchorContent : h(
      _affix2['default'],
      {
        attrs: { offsetTop: offsetTop, target: getContainer }
      },
      [anchorContent]
    );
  }
};