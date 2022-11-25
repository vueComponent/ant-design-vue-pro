'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _resizeObserverPolyfill = require('resize-observer-polyfill');

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

var _SubMenu = require('./SubMenu');

var _SubMenu2 = _interopRequireDefault(_SubMenu);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _util = require('./util');

var _vnode = require('../_util/vnode');

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var MENUITEM_OVERFLOWED_CLASSNAME = 'menuitem-overflowed';
var FLOAT_PRECISION_ADJUST = 0.5;

// Fix ssr
if (canUseDOM) {
  require('mutationobserver-shim');
}

var DOMWrap = {
  name: 'DOMWrap',
  mixins: [_BaseMixin2['default']],
  data: function data() {
    this.resizeObserver = null;
    this.mutationObserver = null;

    // original scroll size of the list
    this.originalTotalWidth = 0;

    // copy of overflowed items
    this.overflowedItems = [];

    // cache item of the original items (so we can track the size and order)
    this.menuItemSizes = [];
    return {
      lastVisibleIndex: undefined
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.setChildrenWidthAndResize();
      if (_this.level === 1 && _this.mode === 'horizontal') {
        var menuUl = _this.$el;
        if (!menuUl) {
          return;
        }
        _this.resizeObserver = new _resizeObserverPolyfill2['default'](function (entries) {
          entries.forEach(_this.setChildrenWidthAndResize);
        });

        [].slice.call(menuUl.children).concat(menuUl).forEach(function (el) {
          _this.resizeObserver.observe(el);
        });

        if (typeof MutationObserver !== 'undefined') {
          _this.mutationObserver = new MutationObserver(function () {
            _this.resizeObserver.disconnect();
            [].slice.call(menuUl.children).concat(menuUl).forEach(function (el) {
              _this.resizeObserver.observe(el);
            });
            _this.setChildrenWidthAndResize();
          });
          _this.mutationObserver.observe(menuUl, {
            attributes: false,
            childList: true,
            subTree: false
          });
        }
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  },

  methods: {
    // get all valid menuItem nodes
    getMenuItemNodes: function getMenuItemNodes() {
      var prefixCls = this.$props.prefixCls;

      var ul = this.$el;
      if (!ul) {
        return [];
      }

      // filter out all overflowed indicator placeholder
      return [].slice.call(ul.children).filter(function (node) {
        return node.className.split(' ').indexOf(prefixCls + '-overflowed-submenu') < 0;
      });
    },
    getOverflowedSubMenuItem: function getOverflowedSubMenuItem(keyPrefix, overflowedItems, renderPlaceholder) {
      var h = this.$createElement;
      var _$props = this.$props,
          overflowedIndicator = _$props.overflowedIndicator,
          level = _$props.level,
          mode = _$props.mode,
          prefixCls = _$props.prefixCls,
          theme = _$props.theme;

      if (level !== 1 || mode !== 'horizontal') {
        return null;
      }
      // put all the overflowed item inside a submenu
      // with a title of overflow indicator ('...')
      var copy = this.$slots['default'][0];

      var _getPropsData = (0, _propsUtil.getPropsData)(copy),
          title = _getPropsData.title,
          rest = (0, _objectWithoutProperties3['default'])(_getPropsData, ['title']); // eslint-disable-line no-unused-vars


      var events = (0, _propsUtil.getEvents)(copy);
      var style = {};
      var key = keyPrefix + '-overflowed-indicator';
      var eventKey = keyPrefix + '-overflowed-indicator';

      if (overflowedItems.length === 0 && renderPlaceholder !== true) {
        style = {
          display: 'none'
        };
      } else if (renderPlaceholder) {
        style = {
          visibility: 'hidden',
          // prevent from taking normal dom space
          position: 'absolute'
        };
        key = key + '-placeholder';
        eventKey = eventKey + '-placeholder';
      }

      var popupClassName = theme ? prefixCls + '-' + theme : '';
      var props = {};
      var on = {};
      _util.menuAllProps.props.forEach(function (k) {
        if (rest[k] !== undefined) {
          props[k] = rest[k];
        }
      });
      _util.menuAllProps.on.forEach(function (k) {
        if (events[k] !== undefined) {
          on[k] = events[k];
        }
      });
      var subMenuProps = {
        props: (0, _extends3['default'])({
          title: overflowedIndicator,
          popupClassName: popupClassName
        }, props, {
          eventKey: eventKey,
          disabled: false
        }),
        'class': prefixCls + '-overflowed-submenu',
        key: key,
        style: style,
        on: on
      };

      return h(
        _SubMenu2['default'],
        subMenuProps,
        [overflowedItems]
      );
    },


    // memorize rendered menuSize
    setChildrenWidthAndResize: function setChildrenWidthAndResize() {
      if (this.mode !== 'horizontal') {
        return;
      }
      var ul = this.$el;

      if (!ul) {
        return;
      }

      var ulChildrenNodes = ul.children;

      if (!ulChildrenNodes || ulChildrenNodes.length === 0) {
        return;
      }

      var lastOverflowedIndicatorPlaceholder = ul.children[ulChildrenNodes.length - 1];

      // need last overflowed indicator for calculating length;
      (0, _util.setStyle)(lastOverflowedIndicatorPlaceholder, 'display', 'inline-block');

      var menuItemNodes = this.getMenuItemNodes();

      // reset display attribute for all hidden elements caused by overflow to calculate updated width
      // and then reset to original state after width calculation

      var overflowedItems = menuItemNodes.filter(function (c) {
        return c.className.split(' ').indexOf(MENUITEM_OVERFLOWED_CLASSNAME) >= 0;
      });

      overflowedItems.forEach(function (c) {
        (0, _util.setStyle)(c, 'display', 'inline-block');
      });

      this.menuItemSizes = menuItemNodes.map(function (c) {
        return (0, _util.getWidth)(c);
      });

      overflowedItems.forEach(function (c) {
        (0, _util.setStyle)(c, 'display', 'none');
      });
      this.overflowedIndicatorWidth = (0, _util.getWidth)(ul.children[ul.children.length - 1]);
      this.originalTotalWidth = this.menuItemSizes.reduce(function (acc, cur) {
        return acc + cur;
      }, 0);
      this.handleResize();
      // prevent the overflowed indicator from taking space;
      (0, _util.setStyle)(lastOverflowedIndicatorPlaceholder, 'display', 'none');
    },
    handleResize: function handleResize() {
      var _this2 = this;

      if (this.mode !== 'horizontal') {
        return;
      }

      var ul = this.$el;
      if (!ul) {
        return;
      }
      var width = (0, _util.getWidth)(ul);

      this.overflowedItems = [];
      var currentSumWidth = 0;

      // index for last visible child in horizontal mode
      var lastVisibleIndex = void 0;

      // float number comparison could be problematic
      // e.g. 0.1 + 0.2 > 0.3 =====> true
      // thus using FLOAT_PRECISION_ADJUST as buffer to help the situation
      if (this.originalTotalWidth > width + FLOAT_PRECISION_ADJUST) {
        lastVisibleIndex = -1;

        this.menuItemSizes.forEach(function (liWidth) {
          currentSumWidth += liWidth;
          if (currentSumWidth + _this2.overflowedIndicatorWidth <= width) {
            lastVisibleIndex += 1;
          }
        });
      }

      this.setState({ lastVisibleIndex: lastVisibleIndex });
    },
    renderChildren: function renderChildren(children) {
      var _this3 = this;

      // need to take care of overflowed items in horizontal mode
      var lastVisibleIndex = this.$data.lastVisibleIndex;

      var className = (0, _propsUtil.getClass)(this);
      return (children || []).reduce(function (acc, childNode, index) {
        var item = childNode;
        var eventKey = (0, _propsUtil.getPropsData)(childNode).eventKey;
        if (_this3.mode === 'horizontal') {
          var overflowed = _this3.getOverflowedSubMenuItem(eventKey, []);
          if (lastVisibleIndex !== undefined && className[_this3.prefixCls + '-root'] !== -1) {
            if (index > lastVisibleIndex) {
              item = (0, _vnode.cloneElement)(childNode,
              // 这里修改 eventKey 是为了防止隐藏状态下还会触发 openkeys 事件
              {
                style: { display: 'none' },
                props: { eventKey: eventKey + '-hidden' },
                'class': MENUITEM_OVERFLOWED_CLASSNAME
              });
            }
            if (index === lastVisibleIndex + 1) {
              _this3.overflowedItems = children.slice(lastVisibleIndex + 1).map(function (c) {
                return (0, _vnode.cloneElement)(c,
                // children[index].key will become '.$key' in clone by default,
                // we have to overwrite with the correct key explicitly
                {
                  key: (0, _propsUtil.getPropsData)(c).eventKey,
                  props: { mode: 'vertical-left' }
                });
              });

              overflowed = _this3.getOverflowedSubMenuItem(eventKey, _this3.overflowedItems);
            }
          }

          var ret = [].concat((0, _toConsumableArray3['default'])(acc), [overflowed, item]);

          if (index === children.length - 1) {
            // need a placeholder for calculating overflowed indicator width
            ret.push(_this3.getOverflowedSubMenuItem(eventKey, [], true));
          }
          return ret;
        }
        return [].concat((0, _toConsumableArray3['default'])(acc), [item]);
      }, []);
    }
  },

  render: function render() {
    var h = arguments[0];

    var Tag = this.$props.tag;
    var tagProps = {
      on: (0, _propsUtil.getListeners)(this)
    };
    return h(
      Tag,
      tagProps,
      [this.renderChildren(this.$slots['default'])]
    );
  }
};

DOMWrap.props = {
  mode: _vueTypes2['default'].oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
  prefixCls: _vueTypes2['default'].string,
  level: _vueTypes2['default'].number,
  theme: _vueTypes2['default'].string,
  overflowedIndicator: _vueTypes2['default'].node,
  visible: _vueTypes2['default'].bool,
  hiddenClassName: _vueTypes2['default'].string,
  tag: _vueTypes2['default'].string.def('div')
};

exports['default'] = DOMWrap;